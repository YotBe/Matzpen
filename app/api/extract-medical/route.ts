import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

type Extracted = {
  diagnosis: string;
  medications: string;
  allergies: string;
};

function emptyResult(): Extracted {
  return { diagnosis: '', medications: '', allergies: '' };
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY חסר. הגדר את המפתח ב־.env.local.' },
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
  const base64 = bytes.toString('base64');
  const dataUrl = `data:${mime};base64,${base64}`;
  const isPdf = mime === 'application/pdf';

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_output_tokens: 1500,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'חלץ את המידע מהמסמך הרפואי הבא והחזר JSON בלבד.',
            },
            isPdf
              ? {
                  type: 'input_file',
                  filename: file.name || 'document.pdf',
                  file_data: dataUrl,
                }
              : {
                  type: 'input_image',
                  image_url: dataUrl,
                  detail: 'high',
                },
          ],
        },
      ],
      text: { format: { type: 'json_object' } },
    });

    const raw = response.output_text?.trim();
    if (!raw) {
      return NextResponse.json(
        { error: 'המודל לא החזיר תוכן.', ...emptyResult() },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: 'תשובת המודל אינה JSON תקין.', ...emptyResult() },
        { status: 502 },
      );
    }

    const obj = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<
      string,
      unknown
    >;
    const result: Extracted = {
      diagnosis: typeof obj.diagnosis === 'string' ? obj.diagnosis : '',
      medications:
        typeof obj.medications === 'string'
          ? obj.medications
          : Array.isArray(obj.medications)
            ? obj.medications.filter((x) => typeof x === 'string').join('\n')
            : '',
      allergies: typeof obj.allergies === 'string' ? obj.allergies : '',
    };

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'שגיאה לא ידועה בשירות החילוץ';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
