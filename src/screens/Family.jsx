import { Icons } from '../Icons.jsx';
import { Avatar, TabBar } from '../components/Shared.jsx';

const MEMBERS = [
  {
    name: 'יעל',
    role: 'מנהלת ראשית',
    relation: 'אחות',
    online: true,
    color: '#c4663d',
    initials: 'י',
    actions: [
      { t: 'תיעוד שינה — 4.5ש׳', when: 'לפני 12 דק׳' },
      { t: 'הגשת תרופות', when: 'אתמול 21:00' },
    ],
  },
  {
    name: 'אמא — רחל',
    role: 'מטפלת ראשית',
    relation: 'אם',
    online: true,
    color: '#8b7e6e',
    initials: 'ר',
    actions: [
      { t: 'ביקור בבית — שעתיים', when: 'היום 09:10' },
      { t: 'תיעוד התנהגות', when: 'אתמול 23:40' },
    ],
  },
  {
    name: 'אבא — דוד',
    role: 'מטפל',
    relation: 'אב',
    online: false,
    color: '#6f8a6c',
    initials: 'ד',
    actions: [{ t: 'התקשרות עם פסיכיאטר', when: 'אתמול 16:00' }],
  },
  {
    name: 'נועה',
    role: 'צפייה בלבד',
    relation: 'אחות צעירה',
    online: false,
    color: '#c69230',
    initials: 'נ',
    actions: [],
  },
  {
    name: 'ד״ר כהן',
    role: 'מטפל מקצועי',
    relation: 'פסיכיאטר',
    online: false,
    color: '#5a4f42',
    initials: 'כ',
    actions: [{ t: 'עדכון תרופות', when: 'לפני 3 ימים' }],
  },
];

export function Family({ onTabChange }) {
  const { ChevronL, Plus } = Icons;

  return (
    <div className="mz-screen">
      <div style={{ padding: '60px 16px 12px' }}>
        <div className="mz-h1">המעגל של דורון</div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>
          5 חברים · 2 פעילים עכשיו
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
          {[
            { n: 12, l: 'תיעודים השבוע', tone: 'var(--clay)' },
            { n: 4, l: 'ביקורים', tone: 'var(--sage)' },
            { n: 7, l: 'מטלות פתוחות', tone: 'var(--amber)' },
          ].map((s, i) => (
            <div key={i} className="mz-tile" style={{ textAlign: 'center', padding: 12 }}>
              <div className="mz-num" style={{ fontSize: 24, color: s.tone }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mz-section-title">חברי המעגל</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MEMBERS.map((m, i) => (
            <div key={i} className="mz-card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar name={m.initials} color={m.color} size={44} />
                  {m.online && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        insetInlineEnd: -2,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        background: 'var(--sage)',
                        border: '2.5px solid #fff',
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{m.name}</div>
                    <span
                      className="mz-pill"
                      style={{
                        background: m.role.includes('מקצועי') ? 'var(--clay-bg)' : 'var(--bg-2)',
                        color: m.role.includes('מקצועי') ? 'var(--clay)' : 'var(--ink-2)',
                        fontSize: 11,
                      }}
                    >
                      {m.role}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{m.relation}</div>
                </div>
                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--ink-3)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <ChevronL size={18} />
                </button>
              </div>
              {m.actions.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
                  {m.actions.map((a, j) => (
                    <div
                      key={j}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        padding: '4px 0',
                      }}
                    >
                      <span style={{ color: 'var(--ink-2)' }}>{a.t}</span>
                      <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>{a.when}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="mz-btn ghost full" style={{ marginTop: 14, height: 56 }}>
          <Plus size={18} /> הזמן חבר חדש למעגל
        </button>

        <div style={{ height: 16 }} />
      </div>
      <TabBar active="family" onChange={onTabChange} />
    </div>
  );
}
