import { useEffect, useState } from 'react';
import { PROFILES } from './data.js';
import { Dashboard } from './screens/Dashboard.jsx';
import { QuickLog } from './screens/QuickLog.jsx';
import { Crisis } from './screens/Crisis.jsx';
import { Rights } from './screens/Rights.jsx';
import { Family } from './screens/Family.jsx';
import { Warning } from './screens/Warning.jsx';
import { Trends } from './screens/Trends.jsx';
import { Onboarding } from './screens/Onboarding.jsx';

const ONBOARDING_KEY = 'matzpen.onboarded';
const PROFILE_KEY = 'matzpen.profile';

export function App() {
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [profileKey, setProfileKey] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_KEY) || 'warning';
    } catch {
      return 'warning';
    }
  });
  const [view, setView] = useState('home');
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, profileKey);
    } catch {}
  }, [profileKey]);

  const profile = PROFILES[profileKey] || PROFILES.warning;

  const handleTab = (id) => {
    if (id === 'log') {
      setShowLog(true);
      return;
    }
    setView(id);
  };

  const completeOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {}
    setOnboarded(true);
  };

  let body;
  if (!onboarded) {
    body = <Onboarding onDone={completeOnboarding} />;
  } else if (view === 'home') {
    body = (
      <Dashboard
        profile={profile}
        onOpenLog={() => setShowLog(true)}
        onOpenCrisis={() => setView('crisis')}
        onOpenWarning={() => setView('warning')}
        onOpenTrends={() => setView('trends')}
        onTabChange={handleTab}
      />
    );
  } else if (view === 'crisis') {
    body = <Crisis onClose={() => setView('home')} onTabChange={handleTab} />;
  } else if (view === 'rights') {
    body = <Rights onTabChange={handleTab} />;
  } else if (view === 'family') {
    body = <Family onTabChange={handleTab} />;
  } else if (view === 'warning') {
    body = (
      <Warning
        onClose={() => setView('home')}
        onCrisis={() => setView('crisis')}
        onTabChange={handleTab}
      />
    );
  } else if (view === 'trends') {
    body = <Trends profile={profile} onClose={() => setView('home')} onTabChange={handleTab} />;
  }

  return (
    <div className="mz-app-shell">
      {onboarded && (
        <ProfileSwitcher current={profileKey} onChange={setProfileKey} />
      )}
      <div className="mz-frame">
        <div style={{ position: 'relative', height: '100%', display: 'flex', flex: 1 }}>
          {body}
          {showLog && (
            <QuickLog
              profile={profile}
              onClose={() => setShowLog(false)}
              onSubmit={() => setShowLog(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSwitcher({ current, onChange }) {
  const options = [
    { v: 'calm', label: '😌 רגוע' },
    { v: 'warning', label: '⚠ אזהרה' },
    { v: 'crisis', label: '🚨 משבר' },
  ];
  return (
    <div className="mz-profile-switcher" dir="rtl">
      {options.map((o) => (
        <button
          key={o.v}
          className={current === o.v ? 'active' : ''}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
