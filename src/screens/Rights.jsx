import { useState } from 'react';
import { Icons } from '../Icons.jsx';
import { TabBar } from '../components/Shared.jsx';

const TRACKS = {
  disability: {
    title: 'תביעת נכות נפשית',
    sub: 'ביטוח לאומי · מסלול 9-12 חודשים',
    progress: 0.42,
    duration: '9–12 חודשים',
    icon: '🏛',
    tone: '#c4663d',
    steps: [
      { t: 'הוצאת תיק רפואי מהקופה', done: true, hint: 'בקשו "סיכום פסיכיאטרי"', sub: 'הושלם · 14 ימים' },
      { t: 'מילוי טופס BL/7801', done: true, hint: 'דרך אתר ביטוח לאומי או סניף', sub: 'נשלח לפני 21 ימים' },
      {
        t: 'זימון לוועדה רפואית',
        done: false,
        current: true,
        hint: 'הזימון יגיע בדואר תוך 30-60 ימים',
        sub: 'ממתין · הופעל ב־12.04',
      },
      { t: 'הופעה בפני הוועדה', done: false, hint: 'הביאו בן/בת משפחה לעדות', sub: '' },
      { t: 'קבלת החלטה', done: false, hint: 'תוך 60 ימים מהוועדה', sub: '' },
      { t: 'ערעור (אם נדרש)', done: false, hint: '60 ימים מההחלטה', sub: '' },
    ],
  },
  rehab: {
    title: 'סל שיקום',
    sub: 'משרד הבריאות · דיור, תעסוקה, ליווי',
    progress: 0.16,
    duration: '3–6 חודשים',
    icon: '🛟',
    tone: '#6f8a6c',
    steps: [
      { t: 'הגשת בקשה לוועדת סל שיקום', done: true, sub: 'הושלם' },
      {
        t: 'הכנת תיק רפואי ופסיכוסוציאלי',
        done: false,
        current: true,
        hint: 'חוות דעת פסיכיאטר + עו״ס',
        sub: 'בתהליך',
      },
      { t: 'ראיון אישי בוועדה', done: false, sub: '' },
      { t: 'בחירת ספק שירות (דיור/תעסוקה)', done: false, sub: '' },
      { t: 'התחלת שירות', done: false, sub: '' },
    ],
  },
  forced: {
    title: 'אשפוז כפוי',
    sub: 'חוק הטיפול בחולי נפש · הליך דחוף',
    progress: 0,
    duration: 'מיידי',
    icon: '⚖',
    tone: '#b03a2e',
    steps: [
      {
        t: 'פנייה לפסיכיאטר המחוזי',
        done: false,
        current: true,
        hint: 'כתבו את הסימנים — שינה, התנהגות, סכנה',
        sub: '',
      },
      { t: 'קבלת טופס 9 (הוראת בדיקה)', done: false, hint: 'תקף ל־10 ימים', sub: '' },
      { t: 'הובלה לבית חולים בליווי', done: false, hint: 'משטרה + אמבולנס', sub: '' },
      { t: 'בדיקה ראשונית במיון פסיכיאטרי', done: false, sub: '' },
      { t: 'הוראת אשפוז כפוי — עד 7 ימים', done: false, hint: 'הארכה דרך ועדה פסיכיאטרית', sub: '' },
      { t: 'זכות ערעור — בית משפט', done: false, hint: '48 שעות מההחלטה', sub: '' },
    ],
  },
};

export function Rights({ onTabChange }) {
  const { ChevronL, ChevronR, Check, Info, Clock, Note } = Icons;
  const [active, setActive] = useState(null);

  if (active) {
    const tr = TRACKS[active];
    const completed = tr.steps.filter((s) => s.done).length;
    return (
      <div className="mz-screen">
        <div
          style={{
            padding: '58px 16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => setActive(null)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--bg-2)',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronR size={20} />
          </button>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>בירוקרטיה</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
          <div
            style={{
              background: tr.tone,
              color: '#fff',
              borderRadius: 24,
              padding: 20,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>{tr.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15 }}>{tr.title}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{tr.sub}</div>

            <div
              style={{
                marginTop: 18,
                height: 8,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  insetBlock: 0,
                  insetInlineStart: 0,
                  width: `${tr.progress * 100}%`,
                  background: '#fff',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
                fontSize: 12,
                opacity: 0.85,
              }}
            >
              <span>
                {completed} מתוך {tr.steps.length} שלבים
              </span>
              <span>זמן משוער: {tr.duration}</span>
            </div>
          </div>

          <div className="mz-section-title">השלבים</div>
          <div className="mz-card" style={{ padding: 4 }}>
            {tr.steps.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 14px',
                  display: 'flex',
                  gap: 12,
                  borderBottom: i < tr.steps.length - 1 ? '1px solid var(--hairline)' : 'none',
                  opacity: s.done ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: s.done ? 'var(--sage)' : s.current ? tr.tone : 'var(--bg-2)',
                    color: s.done || s.current ? '#fff' : 'var(--ink-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {s.done ? <Check size={16} sw={3} /> : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      textDecoration: s.done ? 'line-through' : 'none',
                    }}
                  >
                    {s.t}
                  </div>
                  {s.hint && (
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{s.hint}</div>
                  )}
                  {s.sub && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        color: s.current ? tr.tone : 'var(--ink-3)',
                      }}
                    >
                      {s.current && <Clock size={11} sw={2.4} />}
                      {s.sub}
                    </div>
                  )}
                </div>
                {!s.done && (
                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--ink-3)',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      padding: 4,
                    }}
                  >
                    <ChevronL size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mz-section-title" style={{ marginTop: 22 }}>מסמכים שימושיים</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'טופס BL/7801 — בקשה לקצבת נכות',
              'מכתב סיכום פסיכיאטרי — תבנית',
              'רשימת מסמכים נדרשים לוועדה',
              'זכויות בני משפחה — מדריך מקוצר',
            ].map((d, i) => (
              <button
                key={i}
                className="mz-tile"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--bg-2)',
                    color: 'var(--ink-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Note size={18} />
                </div>
                <span style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{d}</span>
                <ChevronL size={16} stroke="var(--ink-3)" />
              </button>
            ))}
          </div>
          <div style={{ height: 16 }} />
        </div>
        <TabBar active="rights" onChange={onTabChange} />
      </div>
    );
  }

  return (
    <div className="mz-screen">
      <div style={{ padding: '60px 16px 12px' }}>
        <div className="mz-h1">זכויות וניירת</div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>
          המסלולים שלנו · התקדמות עדכנית
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        {Object.entries(TRACKS).map(([key, tr]) => {
          const done = tr.steps.filter((s) => s.done).length;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                width: '100%',
                textAlign: 'right',
                background: '#fff',
                border: 'none',
                borderRadius: 22,
                padding: 16,
                marginBottom: 10,
                cursor: 'pointer',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                fontFamily: 'inherit',
                boxShadow:
                  '0 1px 0 rgba(43,36,28,0.04), 0 6px 20px -10px rgba(43,36,28,0.10)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: tr.tone,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {tr.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{tr.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{tr.sub}</div>
                <div
                  style={{
                    marginTop: 10,
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--bg-2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      insetBlock: 0,
                      insetInlineStart: 0,
                      width: `${tr.progress * 100}%`,
                      background: tr.tone,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    fontSize: 11,
                    color: 'var(--ink-3)',
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {done}/{tr.steps.length} שלבים
                  </span>
                  <span>{tr.duration}</span>
                </div>
              </div>
              <ChevronL size={18} stroke="var(--ink-3)" />
            </button>
          );
        })}

        <button
          style={{
            width: '100%',
            background: 'var(--bg-2)',
            color: 'var(--ink-2)',
            border: '1.5px dashed rgba(43,36,28,0.18)',
            borderRadius: 22,
            padding: 18,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 4,
          }}
        >
          + הוסף מסלול חדש
        </button>

        <div
          style={{
            marginTop: 18,
            padding: 14,
            background: 'var(--bg-2)',
            borderRadius: 14,
            fontSize: 12,
            color: 'var(--ink-2)',
            display: 'flex',
            gap: 10,
          }}
        >
          <Info size={16} stroke="var(--ink-2)" />
          <span>
            המידע כללי בלבד. לא מהווה ייעוץ משפטי. למקרים מורכבים — פנו לעו״ד או לעמותת רעות.
          </span>
        </div>
      </div>
      <TabBar active="rights" onChange={onTabChange} />
    </div>
  );
}
