import { Icons } from '../Icons.jsx';
import { Avatar, SleepSpark, StatusBanner, TabBar } from '../components/Shared.jsx';

export function Dashboard({ profile, onOpenLog, onOpenCrisis, onOpenWarning, onOpenTrends, onTabChange }) {
  const { Plus, Moon, Pill, ChevronL, Alert, TrendDown, TrendUp } = Icons;
  const last = profile.days[profile.days.length - 1];
  const prev = profile.days[profile.days.length - 2];
  const sleepDelta = last.sleep - prev.sleep;
  const isWarn = profile.statusKind !== 'calm';
  const isCrisis = profile.statusKind === 'crisis';

  return (
    <div className="mz-screen">
      <div style={{ flex: 1, overflow: 'auto', padding: '60px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 2 }}>בוקר טוב, יעל</div>
            <div className="mz-h1">המצפן של {profile.name}</div>
          </div>
          <Avatar name={profile.name} color={profile.avatar} size={44} />
        </div>

        <StatusBanner profile={profile} />

        {isCrisis && (
          <button
            onClick={onOpenCrisis}
            className="mz-btn crimson big full"
            style={{ marginTop: 14, justifyContent: 'space-between', padding: '0 22px' }}
          >
            <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Alert size={22} />
              <span>פתח מסך משבר — הנחיות מיידיות</span>
            </span>
            <ChevronL size={20} />
          </button>
        )}

        {isWarn && !isCrisis && (
          <button
            onClick={onOpenWarning}
            style={{
              marginTop: 14,
              width: '100%',
              textAlign: 'right',
              background: '#fff',
              border: '1.5px solid var(--amber)',
              borderRadius: 18,
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              fontFamily: 'inherit',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'var(--amber-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--amber)',
              }}
            >
              <Alert size={22} sw={2.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>התראה מוקדמת זוהתה</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>הקש לפירוט והמלצות פעולה</div>
            </div>
            <ChevronL size={18} stroke="var(--ink-3)" />
          </button>
        )}

        <button onClick={onOpenLog} className="mz-btn clay big full" style={{ marginTop: 14, gap: 10 }}>
          <Plus size={22} sw={2.4} />
          <span>תיעוד מהיר</span>
          <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, marginInlineStart: 8 }}>
            · 10 שניות
          </span>
        </button>

        <div className="mz-section-title" style={{ marginTop: 22 }}>היום</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="mz-tile">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Moon size={18} stroke="var(--ink-3)" />
              <span
                style={{
                  fontSize: 11,
                  color: sleepDelta < 0 ? 'var(--crimson)' : 'var(--sage)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                }}
              >
                {sleepDelta < 0 ? <TrendDown size={12} sw={2.4} /> : <TrendUp size={12} sw={2.4} />}
                {sleepDelta > 0 ? '+' : ''}
                {sleepDelta.toFixed(1)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                className="mz-num"
                style={{
                  fontSize: 28,
                  color: last.sleep < 4 ? 'var(--crimson)' : 'var(--ink)',
                }}
              >
                {last.sleep}
              </span>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>שעות</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>שינה לילה אחרון</div>
          </div>

          <div className="mz-tile">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Pill size={18} stroke="var(--ink-3)" />
              {profile.todayMeds.taken === profile.todayMeds.total ? (
                <span className="mz-pill" style={{ background: 'var(--sage-bg)', color: '#2f4a2b' }}>
                  הושלם
                </span>
              ) : (
                <span
                  className="mz-pill"
                  style={{ background: 'var(--crimson-bg)', color: 'var(--crimson-deep)' }}
                >
                  חסר
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="mz-num" style={{ fontSize: 28 }}>
                {profile.todayMeds.taken}
              </span>
              <span style={{ fontSize: 17, color: 'var(--ink-3)' }}>/ {profile.todayMeds.total}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
              {profile.todayMeds.by ? `הוגש ע״י ${profile.todayMeds.by}` : 'טרם הוגש היום'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenTrends}
          className="mz-tile"
          style={{
            marginTop: 10,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'right',
            fontFamily: 'inherit',
            width: '100%',
            display: 'block',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div className="mz-h3">מגמת שינה — 7 ימים</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {isWarn ? 'ירידה משמעותית · קו אדום: 4ש׳' : 'יציב · קו אדום: 4ש׳'}
              </div>
            </div>
            <ChevronL size={18} stroke="var(--ink-3)" />
          </div>
          <SleepSpark days={profile.days} danger={isCrisis} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, padding: '0 4px', direction: 'ltr' }}>
            {[...profile.days].reverse().map((d, i) => (
              <span key={i} style={{ fontSize: 10, color: 'var(--ink-3)', minWidth: 14, textAlign: 'center' }}>
                {d.d}
              </span>
            ))}
          </div>
        </button>

        {profile.behaviors.length > 0 && (
          <>
            <div className="mz-section-title" style={{ marginTop: 22 }}>תצפיות אחרונות</div>
            <div className="mz-card" style={{ padding: 4 }}>
              {profile.behaviors.slice(0, 3).map((b, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderBottom:
                      i < Math.min(2, profile.behaviors.length - 1)
                        ? '1px solid var(--hairline)'
                        : 'none',
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  <div
                    className="dot crimson"
                    style={{
                      marginTop: 7,
                      flexShrink: 0,
                      background: isCrisis ? 'var(--crimson)' : 'var(--amber)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{b.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{b.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mz-section-title" style={{ marginTop: 22 }}>פעילות משפחתית</div>
        <div className="mz-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Avatar name={profile.lastVisit.by} color="#8b7e6e" size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>
                <b>{profile.lastVisit.by}</b> ביקר אצל {profile.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{profile.lastVisit.when}</div>
            </div>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <ChevronL size={18} stroke="var(--ink-3)" />
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
      <TabBar active="home" onChange={onTabChange} crisisHighlight={isCrisis} />
    </div>
  );
}
