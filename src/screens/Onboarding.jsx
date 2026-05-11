import { useState } from 'react';
import { Icons } from '../Icons.jsx';

const SLIDES = [
  {
    title: 'המצפן שלכם בסערה',
    sub: 'אפליקציה למשפחות וצוות תומך של אדם עם הפרעה דו־קוטבית.\nלא לחולה — אלא למי שלצידו.',
    icon: '🧭',
    bg: '#c4663d',
  },
  {
    title: 'תיעוד יומי קצר',
    sub: 'שינה, מצב רוח, תרופות, התנהגות.\n10 שניות. ויודעים מתי משהו לא כשורה.',
    icon: '✦',
    bg: '#6f8a6c',
  },
  {
    title: 'מסך משבר ברור',
    sub: 'כשהדברים מתלהטים, אנחנו נדריך — צעד אחר צעד.\nמתי לחייג למי, ומה לומר.',
    icon: '🛡',
    bg: '#b03a2e',
  },
  {
    title: 'כל המשפחה בסנכרון',
    sub: 'מי הגיש תרופות, מי ביקר, מי דאג להזנה.\nכי אף אחד לא צריך לעשות את זה לבד.',
    icon: '◐',
    bg: '#5a4f42',
  },
];

export function Onboarding({ onDone }) {
  const { ChevronL } = Icons;
  const [step, setStep] = useState(0);
  const s = SLIDES[step];

  return (
    <div className="mz-screen" style={{ background: s.bg, color: '#fff', transition: 'background .4s' }}>
      <div style={{ padding: '60px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= step ? '#fff' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 30,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
              marginBottom: 28,
            }}
          >
            {s.icon}
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            {s.title}
          </div>
          <div
            style={{
              fontSize: 17,
              marginTop: 14,
              lineHeight: 1.45,
              opacity: 0.9,
              whiteSpace: 'pre-line',
            }}
          >
            {s.sub}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onDone}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 16,
            }}
          >
            דלג
          </button>
          <button
            onClick={() => (step < SLIDES.length - 1 ? setStep(step + 1) : onDone?.())}
            style={{
              flex: 2,
              height: 60,
              borderRadius: 18,
              border: 'none',
              background: '#fff',
              color: s.bg,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {step < SLIDES.length - 1 ? 'המשך' : 'בואו נתחיל'}
            <ChevronL size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
