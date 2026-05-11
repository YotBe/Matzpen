import { Icons } from '../Icons.jsx';

export function TabBar({ active = 'home', onChange = () => {}, crisisHighlight = false }) {
  const { Home, Plus, Alert, Scroll, Users } = Icons;
  const tabs = [
    { id: 'home', label: 'בית', Icon: Home },
    { id: 'log', label: 'תיעוד', Icon: Plus },
    { id: 'crisis', label: 'משבר', Icon: Alert, highlight: crisisHighlight },
    { id: 'rights', label: 'זכויות', Icon: Scroll },
    { id: 'family', label: 'משפחה', Icon: Users },
  ];
  return (
    <div className="mz-tabbar">
      {tabs.map((t) => {
        const isActive = active === t.id;
        const isCrisisTab = t.id === 'crisis';
        return (
          <button
            key={t.id}
            className={`mz-tab${isActive ? ' active' : ''}`}
            onClick={() => onChange(t.id)}
            style={isCrisisTab && t.highlight ? { color: 'var(--crimson)' } : undefined}
          >
            <t.Icon size={22} sw={isActive ? 2.2 : 1.8} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StatusBanner({ profile }) {
  const { Heart, Alert, Shield } = Icons;
  const cls =
    profile.statusKind === 'calm'
      ? 'banner-calm'
      : profile.statusKind === 'warn'
      ? 'banner-warn'
      : 'banner-crisis';
  const Ico =
    profile.statusKind === 'calm' ? Heart : profile.statusKind === 'warn' ? Alert : Shield;
  return (
    <div
      className={cls}
      style={{
        borderRadius: 20,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <div style={{ marginTop: 2 }}>
        <Ico size={22} sw={2} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.status}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{profile.statusBlurb}</div>
      </div>
    </div>
  );
}

export function SleepSpark({ days, height = 56, danger = false }) {
  const w = 240;
  const h = height;
  const max = 9;
  const min = 0;
  const stepX = w / (days.length - 1);
  const pts = days.map((d, i) => {
    const x = w - i * stepX;
    const y = h - ((d.sleep - min) / (max - min)) * (h - 8) - 4;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = `${path} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const color = danger ? 'var(--crimson)' : 'var(--clay)';
  const gid = `spark-${danger ? 'd' : 'c'}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={danger ? '#b03a2e' : '#c4663d'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={danger ? '#b03a2e' : '#c4663d'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i === 0 ? 3.5 : 2}
          fill={i === 0 ? color : '#fff'}
          stroke={color}
          strokeWidth="1.5"
        />
      ))}
      <line
        x1="0"
        x2={w}
        y1={h - (4 / max) * (h - 8) - 4}
        y2={h - (4 / max) * (h - 8) - 4}
        stroke="rgba(176,58,46,0.35)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

export function Avatar({ name, color, size = 36 }) {
  const letter = name?.[0] || '·';
  return (
    <div
      className="mz-avatar"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {letter}
    </div>
  );
}
