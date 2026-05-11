import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const SYSTEM_PROMPT = `אתה עוזר רפואי שמחלץ מידע ממסמכים רפואיים בעברית (סיכומי אשפוז, מכתבי רופא, סיכומי ביקור).
החזר אך ורק אובייקט JSON תקין במבנה המדויק הבא, ללא טקסט נוסף, ללא הסברים וללא עטיפת \`\`\`:
{
  "diagnosis": "אבחנה עיקרית כפי שמופיעה במסמך, כולל אבחנות משניות אם קיימות",
  "medications": "רשימת תרופות, שורה לכל תרופה בפורמט: שם · מינון · תזמון",
  "allergies": "אלרגיות ידועות ותופעות לוואי חריגות; כתוב 'ללא ידוע' אם המסמך לא מזכיר זאת"
}
כללים:
- שמור על השפה כפי שהיא במסמך (בדרך כלל עברית, שמות תרופות באנגלית).
- אל תמציא מידע שאינו מופיע במסמך. אם שדה ריק, החזר מחרוזת ריקה.
- מינונים ושמות תרופות - העתק במדויק.`;

const ExtractedSchema = z.object({
  diagnosis: z.string(),
  medications: z.string(),
  allergies: z.string(),
});

export async function POST(req: Request) {
  const googleApiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_GENERATIVE_AI_API_KEY חסר. הגדר את המפתח ב־.env.local.' },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'לא צורף קובץ' }, { status: 400 });
  }

  const mime = (file.type || '').toLowerCase();
  if (!ALLOWED.has(mime)) {
    return NextResponse.json(
      { error: 'סוג קובץ לא נתמך. העלה PDF או תמונה.' },
      { status: 415 },
    );
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'הקובץ ריק או גדול מ־15MB.' },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const google = createGoogleGenerativeAI({ apiKey: googleApiKey });

  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: ExtractedSchema,
      system: SYSTEM_PROMPT,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'חלץ את המידע מהמסמך הרפואי הבא והחזר JSON בלבד.',
            },
            { type: 'file', data: bytes, mediaType: mime },
          ],
        },
      ],
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error('[extract-medical] error:', err);
    const message =
      err instanceof Error ? err.message : 'שגיאה לא ידועה בשירות החילוץ';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
