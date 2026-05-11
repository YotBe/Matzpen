import { Icons } from '../Icons.jsx';
import { TabBar } from '../components/Shared.jsx';

export function Trends({ profile, onClose, onTabChange }) {
  const { ChevronR } = Icons;
  const avgSleep = (profile.days.reduce((a, d) => a + d.sleep, 0) / profile.days.length).toFixed(1);
  const avgMood = (profile.days.reduce((a, d) => a + d.mood, 0) / profile.days.length).toFixed(1);
  const moodLabel =
    avgMood < 2.5 ? 'נמוך' : avgMood < 3.5 ? 'תקין' : avgMood < 5 ? 'מרומם' : 'מרומם → מאני';
  const sleepTone =
    avgSleep < 4 ? 'var(--crimson)' : avgSleep < 6 ? 'var(--amber)' : 'var(--sage)';
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
          onClick={onClose}
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
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>
          נתונים — {profile.name}
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        <div className="mz-h1" style={{ marginBottom: 4 }}>7 הימים האחרונים</div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 18 }}>
          ממוצע · מגמה · אזעקות
        </div>

        <div className="mz-card" style={{ padding: 16, marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>שעות שינה</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="mz-num" style={{ fontSize: 32, color: sleepTone }}>{avgSleep}</span>
                <span style={{ color: 'var(--ink-3)' }}>ש׳ ממוצע</span>
              </div>
            </div>
            {profile.statusKind !== 'calm' && (
              <span
                className="mz-pill"
                style={{ background: 'var(--crimson-bg)', color: 'var(--crimson-deep)' }}
              >
                ↓ 38%
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, direction: 'ltr' }}>
            {profile.days.map((d, i) => {
              const h = (d.sleep / 9) * 100;
              const tone =
                d.sleep < 4 ? 'var(--crimson)' : d.sleep < 6 ? 'var(--amber)' : 'var(--sage)';
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${h}%`,
                        background: tone,
                        borderRadius: '6px 6px 2px 2px',
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 600 }}>{d.d}</div>
                  <div className="mz-num" style={{ fontSize: 11, fontWeight: 700 }}>
                    {d.sleep}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mz-card" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>מצב רוח (1 דכאון – 6 מאניה)</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
            <span className="mz-num" style={{ fontSize: 32, color: 'var(--clay)' }}>{avgMood}</span>
            <span style={{ color: 'var(--ink-3)' }}>{moodLabel}</span>
          </div>
          <div style={{ display: 'flex', height: 28, borderRadius: 14, overflow: 'hidden', direction: 'ltr' }}>
            {profile.days.map((d, i) => {
              const colors = ['#5a4f42', '#8b7e6e', '#6f8a6c', '#c69230', '#c4663d', '#b03a2e'];
              const idx = Math.max(0, Math.min(colors.length - 1, d.mood - 1));
              return <div key={i} style={{ flex: 1, background: colors[idx] }} />;
            })}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 6,
              fontSize: 10,
              color: 'var(--ink-3)',
              fontWeight: 600,
              direction: 'ltr',
            }}
          >
            {profile.days.map((d, i) => (
              <span key={i}>{d.d}</span>
            ))}
          </div>
        </div>

        <div className="mz-card" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>היענות לתרופות</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, direction: 'ltr' }}>
            {profile.days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: 40,
                    borderRadius: 10,
                    background: d.meds ? 'var(--sage)' : 'var(--crimson-bg)',
                    color: d.meds ? '#fff' : 'var(--crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  {d.meds ? '✓' : '✕'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 600, marginTop: 4 }}>
                  {d.d}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar active="home" onChange={onTabChange} />
    </div>
  );
}
