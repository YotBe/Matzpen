import { useState } from 'react';
import { Icons } from '../Icons.jsx';
import { TabBar } from '../components/Shared.jsx';

const PATHS = {
  ambulance: {
    title: 'התקשרו לאמבולנס',
    subtitle: 'מצב חירום רפואי — נדרשת התערבות מיידית',
    tone: '#7e1f17',
    phone: { label: 'מד״א — חירום', num: '101' },
    script:
      'אמרו: "אני מתקשר/ת בגלל קרוב משפחה במצב פסיכוטי. הוא לא ישן 48 שעות, התנהגות לא רציונלית. אני זקוק/ה לעזרה רפואית דחופה."',
    steps: [
      'התקשרו ל־101',
      'ציינו: מצב פסיכוטי / מאני, ללא שינה',
      'מסרו כתובת מדויקת ופרטי המטופל',
      'אל תנסו לעצור — חכו לצוות',
      'הכינו תרופות נוכחיות וקוד מטופל',
    ],
  },
  police: {
    title: 'התקשרו למשטרה',
    subtitle: 'במצב של סכנה פיזית או אלימות — קוראים למשטרה לפני אמבולנס',
    tone: '#7e1f17',
    phone: { label: 'משטרה — חירום', num: '100' },
    script:
      'אמרו: "קרוב משפחה שלי במשבר פסיכיאטרי ומתנהג בצורה אלימה. אני זקוק/ה לליווי משטרתי כדי להזעיק עזרה רפואית."',
    steps: [
      'הרחיקו ילדים וקרובים פגיעים',
      'אל תתעמתו — צאו מהחדר אם צריך',
      'התקשרו ל־100, בקשו ליווי לאמבולנס',
      'ציינו: משבר פסיכיאטרי, לא פלילי',
      'לאחר השוטרים — מגיע צוות רפואי',
    ],
  },
  psychiatrist: {
    title: 'פנו לפסיכיאטר המחוזי',
    subtitle: 'נדרשת הערכה דחופה והוראת אשפוז כפוי במידת הצורך',
    tone: '#c4663d',
    phone: { label: 'פסיכיאטר מחוזי — תורנות', num: '1-700-700-560' },
    script:
      'אמרו: "אני מבקש/ת התערבות של הפסיכיאטר המחוזי. בן/בת משפחה נמצא/ת במשבר ומסרב/ת לקבל טיפול."',
    steps: [
      'התקשרו לפסיכיאטר המחוזי בשעות הפעילות',
      'תעדו את 48 השעות האחרונות (במצפן)',
      'הסבירו: סירוב לטיפול + סיכון',
      'בקשו טופס 9 (הוראת בדיקה כפויה)',
      'אם דחוף — אמבולנס בליווי משטרה',
    ],
  },
  hotline: {
    title: 'דברו עם מומחה',
    subtitle: 'המצב טרם הגיע לחירום — אך כדאי להתייעץ עכשיו',
    tone: '#c69230',
    phone: { label: 'ער״ן — עזרה ראשונה נפשית', num: '1201' },
    script:
      'הסבירו את המצב: סימני אזהרה מוקדמים, ושאלו על צעדים מומלצים ב־24 השעות הקרובות.',
    steps: [
      'התקשרו לער״ן או למוקד 1201',
      'תארו את הסימנים האחרונים',
      'בקשו המלצה לפעולה ב־24ש׳',
      'תעדו את ההמלצה במצפן',
      'תאמו עם שאר המשפחה',
    ],
  },
};

function Q({ title, sub, onYes, onNo, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 14 }}>{sub}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onYes}
          style={{
            flex: 1,
            height: 64,
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            background: value === true ? '#fff' : 'rgba(255,255,255,0.10)',
            color: value === true ? '#b03a2e' : '#fff',
            fontFamily: 'inherit',
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          כן
        </button>
        <button
          onClick={onNo}
          style={{
            flex: 1,
            height: 64,
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            background: value === false ? '#fff' : 'rgba(255,255,255,0.10)',
            color: value === false ? '#2b241c' : '#fff',
            fontFamily: 'inherit',
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          לא
        </button>
      </div>
    </div>
  );
}

function PhoneCard({ label, num, urgent }) {
  const { Phone, ChevronL } = Icons;
  return (
    <a
      href={`tel:${num.replace(/[^\d]/g, '')}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textDecoration: 'none',
        background: urgent ? '#fff' : 'rgba(255,255,255,0.10)',
        color: urgent ? '#7e1f17' : '#fff',
        borderRadius: 18,
        padding: '16px 18px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: urgent ? '#7e1f17' : 'rgba(255,255,255,0.15)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Phone size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="mz-num">
          {num}
        </div>
      </div>
      <ChevronL size={20} />
    </a>
  );
}

export function Crisis({ onClose, onTabChange }) {
  const { X, ChevronL, ChevronR, Shield, Clock } = Icons;
  const [path, setPath] = useState('triage');
  const [violent, setViolent] = useState(null);
  const [noSleep, setNoSleep] = useState(null);
  const [reachable, setReachable] = useState(null);

  const recommend = () => {
    if (violent) return 'police';
    if (noSleep && reachable === false) return 'ambulance';
    if (noSleep) return 'psychiatrist';
    return 'hotline';
  };

  const current = PATHS[path];

  return (
    <div className="mz-screen crisis-bg" style={{ color: '#fff' }}>
      <div
        style={{
          padding: '58px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {path !== 'triage' && (
            <button
              onClick={() => setPath('triage')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: 'none',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronR size={20} />
            </button>
          )}
          <div>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, letterSpacing: '.1em' }}>
              מצב חירום
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>מסך משבר</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        {path === 'triage' && (
          <>
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 18,
                padding: 16,
                marginBottom: 18,
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                <Shield size={18} />
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  נשום/י עמוק. הכל יהיה בסדר. בואו נמיין יחד.
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <Q
                title="האם יש סכנה פיזית מיידית?"
                sub="אלימות, איומים, נשק, או סכנה לעצמך"
                value={violent}
                onYes={() => setViolent(true)}
                onNo={() => setViolent(false)}
              />

              {violent !== null && (
                <Q
                  title="האם הוא/היא ער/ה 24 שעות או יותר?"
                  sub="חוסר שינה ממושך — סימן קריטי למאניה"
                  value={noSleep}
                  onYes={() => setNoSleep(true)}
                  onNo={() => setNoSleep(false)}
                />
              )}

              {violent !== null && noSleep !== null && (
                <Q
                  title="האם הוא/היא משתף/ת פעולה לדבר איתכם?"
                  sub="האם ניתן להגיע לדיאלוג בסיסי"
                  value={reachable}
                  onYes={() => setReachable(true)}
                  onNo={() => setReachable(false)}
                />
              )}
            </div>

            {violent !== null && noSleep !== null && reachable !== null && (
              <button
                onClick={() => setPath(recommend())}
                style={{
                  width: '100%',
                  padding: '20px 18px',
                  borderRadius: 20,
                  background: '#fff',
                  color: '#7e1f17',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 18,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
                }}
              >
                <span>הצג המלצה</span>
                <ChevronL size={22} />
              </button>
            )}

            <div
              style={{
                marginTop: 24,
                fontSize: 12,
                opacity: 0.5,
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              חיוג מהיר
            </div>
            <PhoneCard label="מד״א — אמבולנס" num="101" />
            <PhoneCard label="משטרה" num="100" />
            <PhoneCard label="ער״ן — עזרה נפשית" num="1201" />
          </>
        )}

        {path !== 'triage' && (
          <>
            <div style={{ marginBottom: 4, fontSize: 13, opacity: 0.6, fontWeight: 600 }}>
              ההמלצה שלנו עבורך
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, marginBottom: 6 }}>
              {current.title}
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 18 }}>{current.subtitle}</div>

            <PhoneCard label={current.phone.label} num={current.phone.num} urgent />

            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 16,
                marginTop: 6,
                borderInlineStart: '3px solid #fff',
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 600, marginBottom: 6 }}>
                מה לומר במוקד
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.45 }}>&ldquo;{current.script}&rdquo;</div>
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 12,
                opacity: 0.6,
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              צעדים — בסדר הזה
            </div>
            {current.steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 0',
                  borderBottom:
                    i < current.steps.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 15, lineHeight: 1.45, paddingTop: 4 }}>{s}</div>
              </div>
            ))}

            <div
              style={{
                marginTop: 22,
                padding: 14,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                gap: 10,
                fontSize: 13,
                opacity: 0.85,
              }}
            >
              <Clock size={18} sw={2} />
              <span>הכל מתועד אוטומטית. אם המצב משתנה, חזרו לתחילת המיון.</span>
            </div>
          </>
        )}
      </div>

      <TabBar active="crisis" onChange={onTabChange} crisisHighlight />
    </div>
  );
}
