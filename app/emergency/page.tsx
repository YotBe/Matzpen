'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertIcon, PhoneIcon, ShieldIcon, CheckIcon } from '@/components/icons';

type Step =
  | 'q-violence'
  | 'route-police'
  | 'q-evacuation'
  | 'route-ambulance'
  | 'route-psychiatrist';

const POLICE_SCRIPT =
  'שלום, בן משפחתי נמצא בפסיכוזה אקוטית ויש סכנת אלימות. על פי נוהל אדם עם מוגבלות נפשית, אני מבקש שהצוות יגיע ללא סירנות ויצויד בטייזר בלבד ולא בנשק חם.';

const AMBULANCE_SCRIPT =
  'אני מבקש לשלוח פראמדיק או צוות התערבות במשבר לבריאות הנפש לצורך הערכה ופינוי.';

const PSYCH_CHECKLIST = [
  {
    key: 'doctor-letter',
    label: 'השגת מכתב מרופא בקהילה (משפחה / פסיכיאטר מטפל / רופא משפחה).',
    hint: 'מכתב הממליץ על בדיקה כפויה עקב סירוב המטופל להגיע למרפאה.',
  },
  {
    key: 'family-letter',
    label: 'כתיבת מכתב משפחתי מפורט וכרונולוגי.',
    hint: 'תיאור התנהגות פסיכוטית, אמירות אובדניות / איומים, חוסר שינה.',
  },
  {
    key: 'welfare',
    label: 'התקשרות למוקד הרווחה העירוני 106 לערב עו״ס.',
    hint: 'עו״ס שמבקש את הצו מצמצם דחיות של "סכסוך משפחתי".',
  },
  {
    key: 'district',
    label: 'איתור לשכת הפסיכיאטר המחוזי הרלוונטית ושיגור הבקשה.',
    hint: 'תוקף הוראת בדיקה כפויה — 10 ימים. דרשו זירוז ביצוע.',
  },
  {
    key: 'verify',
    label: 'אימות קליטת הפנייה תוך שעה — שיחת טלפון ללשכה.',
    hint: 'ללא אישור קליטה, הבקשה לא מטופלת.',
  },
] as const;

function YesNo({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <button
        onClick={onNo}
        className="bg-white rounded-2xl py-6 text-xl font-bold text-ink hover:bg-sand-100 transition-colors border-2 border-transparent"
      >
        לא
      </button>
      <button
        onClick={onYes}
        className="bg-crimson-deep text-white rounded-2xl py-6 text-xl font-bold hover:bg-crimson transition-colors"
      >
        כן
      </button>
    </div>
  );
}

function ScriptCard({ text, label }: { text: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border-s-4 border-white p-4 mt-3">
      <div className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</div>
      <p className="text-base leading-relaxed mt-2">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

function DialButton({ number, label }: { number: string; label: string }) {
  return (
    <a
      href={`tel:${number.replace(/[^\d]/g, '')}`}
      className="flex items-center gap-3 bg-white text-crimson-deep rounded-2xl px-5 py-4 shadow-card hover:bg-sand-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-crimson-deep text-white flex items-center justify-center">
        <PhoneIcon size={22} />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold opacity-70">{label}</div>
        <div className="text-2xl font-extrabold tabular-nums tracking-tight">{number}</div>
      </div>
    </a>
  );
}

export default function EmergencyPage() {
  const [step, setStep] = useState<Step>('q-violence');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const reset = () => {
    setStep('q-violence');
    setChecked({});
  };

  return (
    <div className="min-h-[calc(100dvh-6rem)] bg-gradient-to-b from-[#1a0e0c] via-[#2a1410] to-[#3a1812] text-white">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
              מצב חירום
            </div>
            <h1 className="text-3xl font-extrabold mt-1">עץ קבלת החלטות</h1>
          </div>
          {step !== 'q-violence' && (
            <button
              onClick={reset}
              className="text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              חזרה לתחילה
            </button>
          )}
        </header>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-6 flex items-start gap-3">
          <ShieldIcon size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm opacity-90 leading-relaxed">
            נשמו עמוק. עץ ההחלטה יעזור לזהות את הגוף הנכון לפנייה. אין צורך למלא הכל — בחרו את התרחיש הקרוב למצב כעת.
          </p>
        </div>

        {step === 'q-violence' && (
          <section>
            <h2 className="text-2xl font-bold leading-tight">
              האם יש כרגע סכנה מיידית, אלימות פעילה או נשק?
            </h2>
            <p className="text-sm opacity-75 mt-2">
              אלימות פיזית, איומים בנשק, או סכנה לעצמכם או למתמודד עכשיו.
            </p>
            <YesNo
              onYes={() => setStep('route-police')}
              onNo={() => setStep('q-evacuation')}
            />
          </section>
        )}

        {step === 'route-police' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                המסלול המומלץ
              </div>
              <h2 className="text-3xl font-extrabold mt-1">משטרת ישראל</h2>
              <p className="opacity-80 mt-2 leading-relaxed">
                המשטרה מוסמכת להגיע במצבי אלימות. בקשו במפורש "נוהל אדם עם מוגבלות נפשית" — מנוע הסלמה.
              </p>
            </div>
            <DialButton number="100" label="חיוג מהיר — חירום" />
            <ScriptCard label="הקראה למוקדן" text={POLICE_SCRIPT} />
            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed">
              <strong className="block mb-1">לפני הגעת הצוות</strong>
              <ul className="list-disc ps-5 space-y-1 opacity-90">
                <li>הרחיקו ילדים וקרובים פגיעים מהאזור.</li>
                <li>אל תתעמתו עם המתמודד; צאו מהחדר אם צריך.</li>
                <li>ציינו במפורש: משבר פסיכיאטרי, לא פלילי.</li>
                <li>בקשו ליווי לאמבולנס לאחר ייצוב המצב.</li>
              </ul>
            </div>
          </section>
        )}

        {step === 'q-evacuation' && (
          <section>
            <h2 className="text-2xl font-bold leading-tight">
              האם נדרש פינוי דחוף למיון פסיכיאטרי?
            </h2>
            <p className="text-sm opacity-75 mt-2">
              מצב מסכן חיים שאינו אלים: אובדנות, ניתוק מהמציאות, סכנה רפואית.
            </p>
            <YesNo
              onYes={() => setStep('route-ambulance')}
              onNo={() => setStep('route-psychiatrist')}
            />
          </section>
        )}

        {step === 'route-ambulance' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                המסלול המומלץ
              </div>
              <h2 className="text-3xl font-extrabold mt-1">מד״א — פינוי רפואי</h2>
              <p className="opacity-80 mt-2 leading-relaxed">
                בקשו פראמדיק או צוות התערבות במשבר לבריאות הנפש (פיילוט מד״א ת״א).
              </p>
            </div>
            <DialButton number="101" label="מד״א — חירום רפואי" />
            <ScriptCard label="הקראה למוקדן" text={AMBULANCE_SCRIPT} />
            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed">
              <strong className="block mb-1">חשוב לדעת</strong>
              <p className="opacity-90">
                פינוי שאינו מסתיים באשפוז גורר לעיתים חיוב כספי. אם הצוות מאשפז, הקופה מכסה את העלות.
              </p>
            </div>
          </section>
        )}

        {step === 'route-psychiatrist' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                המסלול המומלץ
              </div>
              <h2 className="text-3xl font-extrabold mt-1">פסיכיאטר מחוזי</h2>
              <p className="opacity-80 mt-2 leading-relaxed">
                כשהמתמודד פסיכוטי ומסרב טיפול אך אינו אלים — מסלול הוראת בדיקה כפויה (סעיף 6/7 לחוק).
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-widest opacity-70 font-semibold mb-3">
                צ׳קליסט שלבי הפעולה
              </div>
              <ul className="space-y-3">
                {PSYCH_CHECKLIST.map((item, idx) => {
                  const on = checked[item.key] ?? false;
                  return (
                    <li key={item.key}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setChecked((p) => ({ ...p, [item.key]: !p[item.key] }))
                          }
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            on
                              ? 'bg-white border-white text-crimson-deep'
                              : 'bg-transparent border-white/40 text-transparent'
                          }`}
                        >
                          <CheckIcon size={18} strokeWidth={3} />
                        </button>
                        <div className="flex-1">
                          <div className="font-semibold text-base leading-snug">
                            {idx + 1}. {item.label}
                          </div>
                          <div className="text-xs opacity-70 mt-0.5">{item.hint}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed flex gap-3">
              <AlertIcon size={18} className="mt-0.5 shrink-0" />
              <span className="opacity-90">
                אם המצב מחמיר במהלך הטיפול — חזרו לתחילת עץ ההחלטה ובחרו במסלול 100 / 101.
              </span>
            </div>
          </section>
        )}

        <Link
          href="/"
          className="mt-10 inline-block text-sm opacity-70 hover:opacity-100"
        >
          ← חזרה למסך המעקב
        </Link>
      </div>
    </div>
  );
}
