'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PATIENT_ID } from '@/lib/constants';
import {
  getChecklist,
  setChecklistItem,
} from '@/services/firestoreService';
import type { BureaucracyChecklist, BureaucracySection } from '@/lib/types';
import { CheckIcon, ChevronEnd, ChevronStart } from '@/components/icons';

interface Item {
  key: string;
  label: string;
  hint?: string;
}

interface SectionDef {
  id: BureaucracySection;
  title: string;
  badge: string;
  intro: string;
  toneClass: string;
  items: Item[];
  note?: string;
}

const SECTIONS: SectionDef[] = [
  {
    id: 'national_insurance',
    title: 'ביטוח לאומי — נכות כללית נפשית',
    badge: 'טופס 7801',
    intro:
      'תהליך 9–12 חודשים. ההצלחה תלויה במלאי מסמכים מלא לפני זימון הוועדה הרפואית.',
    toneClass: 'border-clay/40 bg-clay-bg/40',
    items: [
      {
        key: 'psychiatric-annex',
        label: 'חוות דעת פסיכיאטרית (נספח רפואי)',
        hint: 'מפרט אבחנה לפי סעיף 33/34 ופגיעה תפקודית. חובה — חתום ע״י פסיכיאטר מומחה.',
      },
      {
        key: 'discharge-summaries',
        label: 'סיכומי אשפוז ודוחות מיון',
        hint: 'מוכיחים אירועי קצה ומשבריות לאורך השנים.',
      },
      {
        key: 'confidentiality-waiver',
        label: 'טופס ויתור סודיות חתום',
        hint: 'בלעדיו התביעה לא תיפתח.',
      },
      {
        key: 'income-docs',
        label: 'מסמכי הכנסה (15 חודשי תלושים / שומות מס)',
        hint: 'הוכחת פגיעה בכושר השתכרות.',
      },
      {
        key: 'comorbidity-docs',
        label: 'אישורים על ליקויים גופניים נוספים',
        hint: 'מצטרפים לחישוב הנכות המשוקללת — קריטי לחציית סף 40%.',
      },
      {
        key: 'submit-online',
        label: 'הגשת הבקשה באתר ביטוח לאומי',
        hint: 'ההגשה המקוונת מקצרת זמני קליטה.',
      },
    ],
  },
  {
    id: 'rehab_basket',
    title: 'סל שיקום — משרד הבריאות',
    badge: '40% נכות ומעלה',
    intro:
      'אדם שנקבעה לו נכות נפשית של 40%+ ובמעקב פסיכיאטרי סדיר זכאי לסל שיקום: דיור, תעסוקה, סומך, תמיכת משפחה.',
    toneClass: 'border-sage/40 bg-sage-bg/40',
    note: 'ניתן להגשה רק לאחר קבלת 40% נכות ומעלה.',
    items: [
      {
        key: 'rehab-coordinator',
        label: 'פנייה לרכזת השיקום המחוזית',
        hint: 'דרך עו״ס בקופה / בית חולים / מסגרת קהילתית.',
      },
      {
        key: 'rehab-form',
        label: 'מילוי טופס בקשה + ויתור סודיות',
        hint: 'בצירוף מכתב הזכאות מביטוח לאומי.',
      },
      {
        key: 'rehab-committee',
        label: 'הופעה בפני ועדת שיקום עם מלווה',
        hint: 'הביאו עמכם בן/בת משפחה לתיאור התפקוד היומיומי.',
      },
      {
        key: 'rehab-choice',
        label: 'בחירת מסגרת (דיור / תעסוקה / חונכות)',
        hint: 'מומלץ לבקר בכל אופציה לפני ההחלטה.',
      },
    ],
  },
  {
    id: 'legal',
    title: 'היערכות משפטית',
    badge: 'תכנון מקדים',
    intro:
      'הכלים המשפטיים שמגינים על המתמודד ועל המשפחה — קריטי להפעיל אותם בתקופות יציבות, לא במשבר.',
    toneClass: 'border-muted_blue/40 bg-muted_blue-bg/40',
    items: [
      {
        key: 'epoa-discussed',
        label: 'שיחה משפחתית על ייפוי כוח מתמשך',
        hint: 'תכנון מקדים בתקופת הפוגה — לפני שנדרשת התערבות.',
      },
      {
        key: 'epoa-signed',
        label: 'הושלם ייפוי כוח מתמשך',
        hint: 'נחתם מול עו״ד מורשה ונרשם אצל האפוטרופוס הכללי.',
      },
      {
        key: 'lawyer-contact',
        label: 'איש קשר משפטי לשעת חירום',
        hint: 'עו״ד המכיר את חוק הטיפול בחולי נפש (תשנ״א-1991).',
      },
    ],
  },
];

export default function BureaucracyPage() {
  const { configured } = useAuth();
  const [openId, setOpenId] = useState<BureaucracySection>('national_insurance');
  const [state, setState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (configured) {
        try {
          const docs = await getChecklist(MOCK_PATIENT_ID);
          if (!cancelled) {
            const m: Record<string, boolean> = {};
            for (const d of docs) m[`${d.section}.${d.itemKey}`] = d.done;
            setState(m);
          }
        } catch {
          /* leave empty */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  const toggle = useCallback(
    async (section: BureaucracySection, itemKey: string) => {
      const k = `${section}.${itemKey}`;
      const next = !state[k];
      setState((s) => ({ ...s, [k]: next }));
      if (configured) {
        try {
          await setChecklistItem(MOCK_PATIENT_ID, section, itemKey, next);
        } catch {
          // revert on error
          setState((s) => ({ ...s, [k]: !next }));
        }
      }
    },
    [configured, state],
  );

  const sectionsWithProgress = useMemo(
    () =>
      SECTIONS.map((s) => {
        const total = s.items.length;
        const done = s.items.filter((i) => state[`${s.id}.${i.key}`]).length;
        return { ...s, total, done };
      }),
    [state],
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        טוען…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">מעקב ארוך טווח</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          זכויות ובירוקרטיה
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">
          המסלולים שלכם מול המוסדות, עם ציוני דרך וצ׳קליסטים — שמיעת קליק שומרת התקדמות.
        </p>
      </header>

      <LegalEducationCard />

      <div className="space-y-3">
        {sectionsWithProgress.map((sec) => {
          const open = openId === sec.id;
          return (
            <section
              key={sec.id}
              className={`mz-card overflow-hidden border ${sec.toneClass} border-transparent`}
            >
              <button
                onClick={() => setOpenId(open ? ('' as BureaucracySection) : sec.id)}
                aria-expanded={open}
                className="w-full text-start p-5 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mz-pill bg-white/70">{sec.badge}</span>
                    <h2 className="text-lg font-bold truncate">{sec.title}</h2>
                  </div>
                  <p className="text-sm text-ink-soft mt-1 leading-relaxed">{sec.intro}</p>
                  <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
                    <div
                      className="h-full bg-ink/70"
                      style={{ width: `${(sec.done / sec.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-ink-mute mt-1.5 font-semibold">
                    {sec.done} מתוך {sec.total} שלבים
                  </div>
                </div>
                <span className="text-ink-mute shrink-0">
                  {open ? <ChevronStart size={20} /> : <ChevronEnd size={20} />}
                </span>
              </button>

              {open && (
                <div className="px-5 pb-5">
                  {sec.note && (
                    <div className="mb-4 text-xs font-semibold bg-white/80 rounded-xl px-3 py-2 text-ink-soft">
                      {sec.note}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {sec.items.map((item) => {
                      const k = `${sec.id}.${item.key}`;
                      const on = state[k] ?? false;
                      return (
                        <li key={item.key}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(sec.id, item.key)}
                            className="w-full text-start flex items-start gap-3 p-3 rounded-2xl bg-white hover:bg-sand-50 transition-colors"
                          >
                            <span
                              className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                                on
                                  ? 'bg-sage border-sage text-white'
                                  : 'border-ink-mute/30 text-transparent bg-white'
                              }`}
                            >
                              <CheckIcon size={14} strokeWidth={3} />
                            </span>
                            <span className="flex-1">
                              <span
                                className={`font-semibold text-base ${
                                  on ? 'line-through text-ink-mute' : 'text-ink'
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.hint && (
                                <span className="block text-xs text-ink-mute mt-0.5 leading-relaxed">
                                  {item.hint}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {!configured && (
        <p className="text-xs text-ink-mute text-center">
          מצב תצוגה: ההתקדמות נשמרת רק לאחר חיבור Firebase.
        </p>
      )}
    </div>
  );
}

function LegalEducationCard() {
  return (
    <div className="mz-card p-5 md:p-6 grid md:grid-cols-2 gap-4 border-s-4 border-muted_blue">
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-muted_blue mb-1">
          פרואקטיבי
        </div>
        <h3 className="text-lg font-bold">ייפוי כוח מתמשך</h3>
        <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
          נחתם כאשר המתמודד צלול וכשיר. הוא בוחר מראש מי יקבל החלטות עבורו ובאילו תחומים. ללא פיקוח שוטף ודוחות שגרתיים — שמירה על ריבונותו וכבודו.
        </p>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-crimson-deep mb-1">
          ריאקטיבי
        </div>
        <h3 className="text-lg font-bold">אפוטרופסות</h3>
        <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
          הליך כפוי דרך בית משפט לאחר אובדן כשרות. נטילת עצמאות מהמתמודד, פיקוח של האפוטרופוס הכללי ודוחות תקופתיים. נדרש כשלא הוכן ייפוי כוח מראש.
        </p>
      </div>
    </div>
  );
}
