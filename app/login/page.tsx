'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { configured, signInEmail, signUpEmail, signInGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signin') await signInEmail(email, password);
      else await signUpEmail(email, password);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError(null);
    try {
      await signInGoogle();
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="mz-card w-full max-w-md p-7 md:p-9">
        <header className="text-center mb-7">
          <div className="text-3xl mb-2" aria-hidden>
            ◐
          </div>
          <h1 className="text-2xl font-extrabold">ברוכים הבאים למצפן</h1>
          <p className="text-sm text-ink-mute mt-1">
            {mode === 'signin' ? 'התחברו לחשבון משפחתי קיים' : 'יצירת חשבון משפחתי חדש'}
          </p>
        </header>

        {!configured && (
          <div className="rounded-xl bg-amber_-bg text-amber_-ink text-sm p-3 mb-5">
            Firebase לא מוגדר. ההתחברות תיכשל עד שיוזנו משתני סביבה ב־
            <code className="font-mono">.env.local</code>.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mz-field-label" htmlFor="email">
              דוא״ל
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mz-input mt-2"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mz-field-label" htmlFor="password">
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mz-input mt-2"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="mz-btn mz-btn-clay w-full">
            {busy ? 'מתחבר…' : mode === 'signin' ? 'כניסה' : 'יצירת חשבון'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-x-0 top-1/2 h-px bg-sand-100" />
          <div className="relative text-center text-xs text-ink-mute">
            <span className="bg-white px-3">או</span>
          </div>
        </div>

        <button onClick={google} disabled={busy} className="mz-btn mz-btn-ghost w-full">
          כניסה עם Google
        </button>

        <p className="text-center text-sm text-ink-mute mt-6">
          {mode === 'signin' ? 'אין חשבון?' : 'יש כבר חשבון?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-clay font-semibold"
          >
            {mode === 'signin' ? 'הירשמו כאן' : 'התחברו'}
          </button>
        </p>
      </div>
    </div>
  );
}
