import { Icons } from '../Icons.jsx';
import { TabBar } from '../components/Shared.jsx';

export function Warning({ onClose, onTabChange, onCrisis }) {
  const { Alert, ChevronR, Moon, Pill, TrendDown, Phone, ChevronL } = Icons;
  return (
    <div className="mz-screen" style={{ background: 'var(--bg)' }}>
      <div
        style={{
          padding: '58px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronR size={20} />
        </button>
        <span className="mz-pill" style={{ background: 'var(--amber-bg)', color: '#6b4a0d' }}>
          התראה מוקדמת
        </span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #f3e3b8 0%, #f6e3d4 100%)',
            borderRadius: 24,
            padding: 22,
            marginBottom: 14,
          }}
        >
          <Alert size={32} stroke="#6b4a0d" sw={2} />
          <div className="mz-h1" style={{ marginTop: 10, color: '#3d2a07' }}>
            ירידה בשינה — מחייב תשומת לב
          </div>
          <div style={{ fontSize: 14, color: '#6b4a0d', marginTop: 6, lineHeight: 1.45 }}>
            דורון ישן ממוצע 4.7 שעות ב־3 הלילות האחרונים — ירידה של 38% משבוע שעבר. בשילוב עם תצפיות חדשות, זהו סימן מוקדם לאפיזודה.
          </div>
        </div>

        <div className="mz-section-title">מה זוהה</div>
        <div className="mz-card" style={{ padding: 4, marginBottom: 18 }}>
          {[
            { Ic: Moon, t: 'שינה ממוצעת 4.7ש׳ · 3 לילות', sub: 'יורד מתחת ל־5ש׳ — סימן מובהק' },
            { Ic: TrendDown, t: 'מצב רוח מרומם · 2 רישומים', sub: 'אצל אמא ויעל בשעות אחה״צ' },
            { Ic: Pill, t: 'תרופת בוקר חסרה היום', sub: 'לא דווח על נטילה — תזכורת נשלחה' },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 14px',
                borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--amber-bg)',
                  color: '#6b4a0d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <r.Ic size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mz-section-title">מה כדאי לעשות עכשיו</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              t: 'התקשר/י לפסיכיאטר המעקב',
              sub: 'ד״ר כהן · עדכון על הירידה בשינה',
              icon: <Phone size={18} />,
            },
            {
              t: 'תאם/י עם המשפחה לוח ביקורים',
              sub: 'נוכחות יום־יומית מצמצמת אסקלציה',
              icon: '👥',
            },
            {
              t: 'עקבו במיוחד אחר התרופות',
              sub: 'הגדירו תזכורת אחר הצהריים',
              icon: <Pill size={18} />,
            },
          ].map((r, i) => (
            <button
              key={i}
              className="mz-card"
              style={{
                padding: 14,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'right',
                fontFamily: 'inherit',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--clay-bg)',
                  color: 'var(--clay)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 20,
                }}
              >
                {r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.sub}</div>
              </div>
              <ChevronL size={18} stroke="var(--ink-3)" />
            </button>
          ))}
        </div>

        <button onClick={onCrisis} className="mz-btn crimson big full" style={{ marginTop: 18 }}>
          המצב מחמיר — פתח מסך משבר
        </button>

        <div style={{ height: 16 }} />
      </div>
      <TabBar active="home" onChange={onTabChange} crisisHighlight />
    </div>
  );
}
