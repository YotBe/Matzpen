import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import {
  getAuthorizedDb,
  saveChatMessage,
  type AuthorizedDb,
} from '@/lib/chatServer';

// Allow-list of paths the AI can navigate the user to. Keeps the tool from
// being abused to point at arbitrary external URLs and keeps the contract
// stable as the app grows.
const ALLOWED_PAGES = [
  '/',
  '/emergency',
  '/golden-record',
  '/bureaucracy',
  '/assistant',
] as const;

const tools = {
  openPage: tool({
    description:
      "Navigate the user to a specific page in the Matzpen app. Use ONLY when the user explicitly asks to be taken there (e.g. 'open the emergency page', 'show me the bureaucracy checklist'). Never call this as part of explaining something — describe instead. Available paths: '/' (dashboard / daily check-in), '/emergency' (the emergency decision tree with police / ambulance / district-psychiatrist scripts), '/golden-record' (the printable medical record for the triage team), '/bureaucracy' (the rights & forms checklist), '/assistant' (the full chat page).",
    inputSchema: z.object({
      path: z.enum(ALLOWED_PAGES),
      reason: z
        .string()
        .min(1)
        .max(80)
        .describe(
          'One short Hebrew phrase explaining why — surfaced to the user.',
        ),
    }),
  }),
};

// Hard questions get Gemini 2.5 Pro (slower, ~10× cost, much better reasoning).
// Everything else stays on Flash. Triggers:
//   • length > 180 chars (longer prompts = more nuance to weigh)
//   • Hebrew/English keywords for legal / medical / ethical questions
const PRO_KEYWORDS =
  /חוק|סעיף|ועדה|תקנה|נוהל|ערעור|זכאות|אפוטרופ|יפוי כוח|אשפוז כפוי|פסיכיאטר מחוזי|מינון|מ["״]?ג|ליתיום|אנטיפסיכוט|תופעות לוואי|אינטראקצי|התווית נגד|דילמה|האם מותר|מה הנכון|מי אחראי|\blaw\b|\bstatute\b|\bsection\b|\bregulation\b|\beligibility\b|\bappeal\b|\bguardianship\b|\binvoluntary\b|\bdose\b|\bdosage\b|\bmg\b|\bcontraindication\b|\binteraction\b|\bside\s?effect\b|\bantipsychotic\b|\blithium\b|\bethical\b|\bdilemma\b/i;

function selectModel(latestUserText: string): 'gemini-2.5-pro' | 'gemini-2.5-flash' {
  if (!latestUserText) return 'gemini-2.5-flash';
  if (latestUserText.length > 180) return 'gemini-2.5-pro';
  if (PRO_KEYWORDS.test(latestUserText)) return 'gemini-2.5-pro';
  return 'gemini-2.5-flash';
}

function latestUserTextOf(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'user') continue;
    const parts = Array.isArray(m.parts) ? m.parts : [];
    return parts
      .map((p) => (p.type === 'text' && typeof p.text === 'string' ? p.text : ''))
      .join(' ')
      .trim();
  }
  return '';
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SYSTEM_PROMPT = `אתה "מצפן AI" — עוזר מומחה, סבלני וחומל למשפחות של מתמודדים פסיכיאטריים בישראל.

תפקידך:
• להסביר באופן ברור ונגיש את התהליכים הרפואיים והבירוקרטיים שעומדים בפני המשפחה.
• להציע צעדים מעשיים ולא להישאר ברמת הסיסמאות.
• לשמור על טון רגוע, אנושי וללא שיפוטיות. המשפחות לרוב בלחץ אדיר — דבר אליהן בעדינות.
• ענה תמיד בעברית, אלא אם המשתמש כתב באנגלית.

ידע מקצועי שעליך להחזיק:

1) חוק טיפול בחולי נפש, התשנ"א-1991:
   • אשפוז כפוי דחוף — הוראת בדיקה / הוראת אשפוז מטעם הפסיכיאטר המחוזי (סעיפים 6-9).
   • התנאים: מסוכנות מיידית לעצמו או לאחרים על רקע מחלה פסיכיאטרית פעילה.
   • הפסיכיאטר המחוזי במחוז המגורים הוא הסמכות. מספר טלפון של לשכת הבריאות המחוזית.
   • הוועדה הפסיכיאטרית מבקרת אשפוזים כפויים בתוך 5 ימים ושוב כל 3 חודשים.
   • ההבדל בין הוראת בדיקה (עד 7 ימים) לבין הוראת אשפוז (עד 7 ימים, מתחדש דרך הוועדה).
   • זכויות המאושפז: ייצוג בוועדה, ערעור בבית משפט מחוזי.

2) ביטוח לאומי — נכות כללית:
   • טופס 7801 (בקשה לקצבת נכות כללית) — מי זכאי, איך ממלאים, אילו מסמכים רפואיים מצרפים.
   • צריך סיכומי אשפוז, מכתבי פסיכיאטר מטפל, אבחנה מפורטת לפי ICD/DSM.
   • ועדה רפואית קובעת אחוזי נכות נפשית (סעיפים 33-34 בתקנות).
   • זכות לערעור על החלטת ועדה רפואית.

3) סל שיקום (חוק שיקום נכי נפש בקהילה, התש"ס-2000):
   • זכאות מ-40% נכות נפשית ומעלה מביטוח לאומי.
   • פנייה לוועדת סל שיקום במשרד הבריאות במחוז.
   • שירותים: דיור מוגן, תעסוקה נתמכת, מועדון חברתי, ליווי אישי (סלי תעסוקה ופנאי).

4) קופות החולים והמרפאות לבריאות הנפש:
   • הזכות לבחור פסיכיאטר במרפאה ציבורית או דרך התחייבות.
   • שירותי בריאות הנפש עברו לאחריות קופות החולים (הרפורמה משנת 2015).

5) משאבים בשעת משבר:
   • 1201 — ער"ן (עזרה ראשונה נפשית).
   • 1800-120-140 — נט"ל (סיוע לנפגעי טראומה).
   • מוקדי קופות החולים, חדרי מיון פסיכיאטריים בבתי החולים הסמוכים.

חוקים מחייבים:

כלל 1 — אתה לא רופא. לעולם אל תרשום תרופות, אל תמליץ על שינוי מינון, ואל תאבחן. תמיד הפנה את המשתמש להתייעצות עם הפסיכיאטר המטפל לגבי כל שאלה תרופתית או אבחנתית.

כלל 2 — נוהל מצוקה: אם המשתמש מזכיר נשק, אלימות פעילה, איום מיידי, או כוונת אובדנות — עצור מיד את הניתוח הרגיל והגב בהודעת התראה גבוהה. ההודעה חייבת להכיל:
• "זוהי שיחת חירום. אם יש סכנה מיידית — חייגו 100 (משטרה) או 101 (מד״א)."
• הפניה לחלק החירום באפליקציה (/emergency).
• מספרים נוספים: 1201 (ער"ן), חדר מיון פסיכיאטרי קרוב.
לאחר ההתראה, אפשר להמשיך לעזור אך ורק לאחר שווידאת שלא נשקפת סכנה מיידית.

כלל 3 — אל תמציא חוקים, סעיפים, או מספרי טפסים. אם אתה לא בטוח לגבי פרט ספציפי, אמור זאת בכנות והפנה למקור רשמי (כל-זכות, אתר ביטוח לאומי, משרד הבריאות).

כלל 4 — שמור על הפרטיות. אל תבקש שמות מלאים, ת"ז, או פרטים מזהים. עזור על בסיס המידע שהמשתמש בחר לשתף.

סגנון:
• תשובות ממוקדות, רצוי עד 4-6 משפטים. אם נחוץ פירוט, ארגן בנקודות קצרות.
• השתמש בטקסט בלבד, ללא Markdown מורכב (כותרות, טבלאות). רשימה מנוקדת קצרה — מותר.
• בסוף כל תשובה משמעותית, הוסף משפט קצר של עידוד או הזמנה להמשיך לשאול.
• אם זמינים פרטי המתמודד (שם והקשר של המשתמש), השתמש בהם בטבעיות — פנה למשתמש לפי הקשר ("האח שלך", "בנך"), והזכיר את המתמודד בשמו הפרטי כשמתאים. אל תחשוף את הנתונים האחרים (אבחנה, תרופות, יומן מעקב) ישירות אלא אם המשתמש שואל עליהם — השתמש בהם רק כדי להתאים את הייעוץ.

כלי ניווט:
יש לך כלי בשם openPage שמאפשר לעבור בשם המשתמש למסך מסוים באפליקציה. השתמש בו אך ורק כשהמשתמש מבקש זאת בפירוש ("פתחי את עץ ההחלטה לחירום", "קח אותי לתיק הרפואי"). לעולם אל תפעיל את הכלי כחלק מהסבר רגיל — במצב כזה תאר את הצעד בלבד.
המסכים הזמינים:
• "/" — לוח המחוונים והדיווח היומי.
• "/emergency" — עץ החלטה לחירום עם תסריטים לחיוג 100/101 ולהוראת בדיקה.
• "/golden-record" — תיק רפואי להדפסה למוקדן.
• "/bureaucracy" — צ'קליסט זכויות וסל שיקום.
• "/assistant" — עמוד הצ'אט המלא (לעיתים רחוקות נחוץ).
אחרי הפעלת הכלי, המשך בתשובה קצרה בלבד — הניווט עצמו כבר הסביר מה קרה.`;

const AFFECTIVE_LABELS: Record<string, string> = {
  depression: 'דיכאון',
  euthymia: 'תקין/אוטימיה',
  euphoria: 'אופוריה/מניה',
  irritability: 'עצבנות',
};

const MEDICATION_LABELS: Record<string, string> = {
  yes: 'כן',
  no: 'לא',
  refused: 'סירב',
  unknown: 'לא ידוע',
};

const SECTION_LABELS: Record<string, string> = {
  first_hospitalization: 'אשפוז ראשון',
  discharge_followup: 'מעקב לאחר שחרור',
  deterioration: 'הידרדרות',
  disability_claim: 'תביעת נכות',
  advance_planning: 'תכנון מקדים',
  national_insurance: 'ביטוח לאומי',
  rehab_basket: 'סל שיקום',
  legal: 'משפטי',
};

async function buildPatientContext(auth: AuthorizedDb): Promise<string> {
  const { db, patientId } = auth;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [logsRes, goldenRes, checklistRes] = await Promise.all([
    db
      .from('daily_logs')
      .select(
        'date, sleep_hours, affective_state, psychomotor_speed, impulsivity_event, medication_taken, note',
      )
      .eq('patient_id', patientId)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: false })
      .limit(7),
    db
      .from('golden_records')
      .select(
        'patient_name, relationship, diagnosis, comorbidities, medications, allergies, risk_vectors',
      )
      .eq('patient_id', patientId)
      .maybeSingle(),
    db.from('checklist_items').select('section, item_key, done').eq('patient_id', patientId),
  ]);

  const parts: string[] = [];

  const golden = goldenRes.data;
  if (golden) {
    const lines: string[] = ['=== רשומה רפואית ==='];
    if (golden.patient_name) lines.push(`שם המתמודד: ${golden.patient_name}`);
    if (golden.relationship)
      lines.push(`הקשר של המשתמש: ${golden.relationship}`);
    if (golden.diagnosis) lines.push(`אבחנה: ${golden.diagnosis}`);
    if (golden.comorbidities) lines.push(`תחלואה נלווית: ${golden.comorbidities}`);
    if (golden.medications?.length) {
      const meds = Array.isArray(golden.medications)
        ? golden.medications.join(', ')
        : golden.medications;
      lines.push(`תרופות: ${meds}`);
    }
    if (golden.allergies) lines.push(`אלרגיות: ${golden.allergies}`);
    if (golden.risk_vectors) lines.push(`גורמי סיכון: ${golden.risk_vectors}`);
    if (lines.length > 1) parts.push(lines.join('\n'));
  }

  const logs = logsRes.data ?? [];
  if (logs.length > 0) {
    const lines: string[] = ['=== יומן מעקב (7 ימים אחרונים) ==='];
    for (const log of logs) {
      const affect = AFFECTIVE_LABELS[log.affective_state as string] ?? log.affective_state;
      const med = MEDICATION_LABELS[log.medication_taken as string] ?? '—';
      const impulse = log.impulsivity_event ? 'כן' : 'לא';
      const notePart = log.note ? `, הערה: ${log.note}` : '';
      lines.push(
        `${log.date}: מצב רגשי=${affect}, שינה=${log.sleep_hours}ש׳, מהירות פסיכומוטורית=${log.psychomotor_speed}/10, אירוע פגיעה=${impulse}, תרופות=${med}${notePart}`,
      );
    }
    parts.push(lines.join('\n'));
  } else {
    parts.push(
      '=== יומן מעקב ===\nאין רשומות ב-7 הימים האחרונים. כדאי לעודד את המשפחה להתחיל לתעד.',
    );
  }

  const checklist = checklistRes.data ?? [];
  if (checklist.length > 0) {
    const sectionMap = new Map<string, { done: number; total: number }>();
    for (const item of checklist) {
      const entry = sectionMap.get(item.section) ?? { done: 0, total: 0 };
      entry.total++;
      if (item.done) entry.done++;
      sectionMap.set(item.section, entry);
    }
    const lines: string[] = ['=== סטטוס בירוקרטי ==='];
    for (const [section, counts] of sectionMap) {
      const label = SECTION_LABELS[section] ?? section;
      lines.push(`${label}: ${counts.done}/${counts.total} משימות הושלמו`);
    }
    parts.push(lines.join('\n'));
  }

  if (parts.length === 0) return '';

  return (
    `\n\n--- נתוני המטופל (הקשר אישי — השתמש למתן ייעוץ מותאם, אל תחשוף נתונים אלה ישירות) ---\n` +
    parts.join('\n\n') +
    `\n---`
  );
}

export async function POST(req: Request) {
  const googleApiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    return new Response(
      JSON.stringify({
        error: 'GOOGLE_GENERATIVE_AI_API_KEY חסר. הגדר את המפתח ב־.env.local.',
      }),
      { status: 503, headers: { 'content-type': 'application/json' } },
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = (await req.json()) as { messages?: UIMessage[] };
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Only accept user/assistant turns from the client. A malicious caller could
  // otherwise inject a fake `system` role to override our prompt, or a `tool`
  // role to fake tool results. The real system prompt is set via streamText's
  // `system` option below.
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = rawMessages.filter(
    (m): m is UIMessage => m?.role === 'user' || m?.role === 'assistant',
  );

  const token = req.headers.get('x-supabase-token');
  const auth = await getAuthorizedDb(token).catch((err) => {
    console.error('[chat] getAuthorizedDb failed:', err);
    return null;
  });

  let patientContext = '';
  if (auth) {
    try {
      patientContext = await buildPatientContext(auth);
    } catch (err) {
      console.error('[chat] buildPatientContext failed:', err);
    }
  }

  const latestUserText = latestUserTextOf(messages);
  if (auth && latestUserText) {
    // Fire-and-forget — the chat shouldn't stall on a write.
    void saveChatMessage(auth, 'user', latestUserText);
  }

  const google = createGoogleGenerativeAI({ apiKey: googleApiKey });

  const modelId = selectModel(latestUserText);
  console.log('[chat] routing to', modelId);

  try {
    const result = streamText({
      model: google(modelId),
      system: SYSTEM_PROMPT + patientContext,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
      tools,
      onFinish: ({ text }) => {
        if (auth && text) {
          void saveChatMessage(auth, 'assistant', text, modelId);
        }
      },
      onError: ({ error }) => {
        console.error('[chat] streamText error:', error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('[chat] stream response error:', error);
        if (error == null) return 'unknown error';
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });
  } catch (err) {
    console.error('[chat] fatal error:', err);
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
