import { useState } from 'react';
import { Icons } from '../Icons.jsx';

export function QuickLog({ profile, onClose, onSubmit }) {
  const { X, Mic, Check } = Icons;
  const [step, setStep] = useState(0);
  const [sleep, setSleep] = useState(7);
  const [mood, setMood] = useState(3);
  const [meds, setMeds] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { v: 1, label: 'מדוכא', tone: '#5a4f42' },
    { v: 2, label: 'נמוך', tone: '#8b7e6e' },
    { v: 3, label: 'תקין', tone: '#6f8a6c' },
    { v: 4, label: 'מרומם', tone: '#c69230' },
    { v: 5, label: 'אופוריה', tone: '#c4663d' },
    { v: 6, label: 'מאני', tone: '#b03a2e' },
  ];

  const steps = ['שינה', 'מצב רוח', 'תרופות', 'הערה'];

  const submit = (newMeds) => {
    setMeds(newMeds);
    setStep(3);
  };

  const finish = () => {
    setStep(4);
    setTimeout(() => onSubmit?.({ sleep, mood, meds, note }), 1100);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'rgba(43,36,28,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          width: '100%',
          minHeight: '78%',
          borderRadius: '32px 32px 0 0',
          padding: '8px 16px 32px',
          animation: 'mzSlideUp .26s cubic-bezier(.2,.7,.3,1)',
          direction: 'rtl',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: 36,
            height: 5,
            borderRadius: 3,
            background: 'var(--hairline)',
            margin: '6px auto 12px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>
              תיעוד יומי · {profile.name}
            </div>
            <div className="mz-h2" style={{ marginTop: 2 }}>
              {step < 4 ? steps[step] : 'הושלם'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: 'var(--bg-2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {step < 4 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i <= step ? 'var(--clay)' : 'var(--bg-2)',
                  transition: 'background .2s',
                }}
              />
            ))}
          </div>
        )}

        <div style={{ flex: 1 }}>
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  className="mz-num"
                  style={{
                    fontSize: 88,
                    color: sleep < 4 ? 'var(--crimson)' : sleep < 6 ? 'var(--amber)' : 'var(--ink)',
                    transition: 'color .2s',
                  }}
                >
                  {sleep}
                </span>
                <span style={{ fontSize: 18, color: 'var(--ink-3)' }}>שעות</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', marginBottom: 18 }}>
                {sleep < 4
                  ? '⚠ סיכון גבוה — שינה קצרה מאוד'
                  : sleep < 6
                  ? 'ערנות מומלצת — מתחת לנורמה'
                  : 'בטווח התקין'}
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                style={{ width: '100%', height: 12, accentColor: 'var(--clay)', direction: 'ltr' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--ink-3)',
                  marginTop: 8,
                  direction: 'ltr',
                }}
              >
                <span>0</span>
                <span>3</span>
                <span>6</span>
                <span>9</span>
                <span>12</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
                {[3, 5, 7, 8, 'לא ישן'].map((p, i) => {
                  const numeric = p === 'לא ישן' ? 0 : p;
                  const selected = sleep === numeric;
                  return (
                    <button
                      key={i}
                      className="mz-chip"
                      onClick={() => setSleep(numeric)}
                      style={{
                        background: selected ? '#fff' : 'var(--bg-2)',
                        borderColor: selected ? 'var(--clay)' : 'transparent',
                        color: selected ? 'var(--clay)' : 'var(--ink)',
                      }}
                    >
                      {typeof p === 'number' ? `${p}ש׳` : p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 18, textAlign: 'center' }}>
                בחר/י מילה שמתארת את {profile.name} עכשיו
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {moods.map((m) => (
                  <button
                    key={m.v}
                    onClick={() => setMood(m.v)}
                    style={{
                      background: mood === m.v ? '#fff' : 'var(--bg-2)',
                      border: mood === m.v ? `2px solid ${m.tone}` : '2px solid transparent',
                      borderRadius: 18,
                      padding: '16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      textAlign: 'right',
                      gap: 6,
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: m.tone }} />
                    <div style={{ fontWeight: 600, fontSize: 16, color: mood === m.v ? m.tone : 'var(--ink)' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{m.v} / 6</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 18, textAlign: 'center' }}>
                האם {profile.name} נטל/ה תרופות הבוקר?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => submit('all')}
                  className="mz-btn sage full big"
                  style={{ justifyContent: 'flex-start', padding: '0 22px', gap: 12 }}
                >
                  <Check size={22} /> כן, נטל/ה את הכל
                </button>
                <button
                  onClick={() => submit('partial')}
                  className="mz-btn ghost full big"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '0 22px',
                    gap: 12,
                    background: 'var(--amber-bg)',
                    color: '#6b4a0d',
                  }}
                >
                  <span style={{ width: 22, textAlign: 'center', fontSize: 20, fontWeight: 800 }}>½</span>
                  חלקית — חסר משהו
                </button>
                <button
                  onClick={() => submit('none')}
                  className="mz-btn full big"
                  style={{
                    background: 'var(--crimson-bg)',
                    color: 'var(--crimson-deep)',
                    justifyContent: 'flex-start',
                    padding: '0 22px',
                    gap: 12,
                  }}
                >
                  <X size={22} /> לא, לא נטל/ה
                </button>
                <button
                  onClick={() => submit('unknown')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink-3)',
                    padding: 12,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  לא יודע/ת
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 14, textAlign: 'center' }}>
                משהו שכדאי לשתף את שאר המשפחה?{' '}
                <span style={{ opacity: 0.6 }}>(אופציונלי)</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="לדוגמה: התקשר 3 פעמים בלילה, נשמע ער מאוד"
                style={{
                  width: '100%',
                  minHeight: 110,
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid var(--hairline)',
                  background: '#fff',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  color: 'var(--ink)',
                  resize: 'none',
                  boxSizing: 'border-box',
                  direction: 'rtl',
                }}
              />
              <button
                style={{
                  marginTop: 10,
                  background: 'var(--bg-2)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '12px 16px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  color: 'var(--ink-2)',
                  cursor: 'pointer',
                }}
              >
                <Mic size={18} /> או הקלטה קולית
              </button>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: 'var(--sage-bg)',
                  color: 'var(--sage)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  animation: 'mzPop .3s cubic-bezier(.2,.9,.3,1.2)',
                }}
              >
                <Check size={40} sw={3} />
              </div>
              <div className="mz-h2">נשמר ✓</div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
                המידע מסונכרן עם שאר המשפחה
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <button
            className="mz-btn clay full big"
            style={{ marginTop: 16 }}
            onClick={() => setStep(step + 1)}
          >
            המשך
          </button>
        )}
        {step === 3 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="mz-btn ghost" style={{ flex: 1, height: 56 }} onClick={finish}>
              דלג
            </button>
            <button className="mz-btn clay" style={{ flex: 2, height: 56 }} onClick={finish}>
              סיים תיעוד
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
