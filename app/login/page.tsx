'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { safeInternalPath } from '@/lib/publicPaths';

// Where to land after a successful sign-in. Read from window.location at
// call time (not useSearchParams) so this page stays statically prerendered.
function nextPath(): string {
  return (
    safeInternalPath(new URLSearchParams(window.location.search).get('next')) ?? '/'
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { configured, signInEmail, signUpEmail, signInGoogle } = useAuth();
  const { t } = useT();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requiresConsent = mode === 'signup';

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (requiresConsent && !consent) {
      setError(t('login.consentRequired'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signin') await signInEmail(email, password);
      else await signUpEmail(email, password);
      router.replace(nextPath());
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.unknownError'));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    if (requiresConsent && !consent) {
      setError(t('login.consentRequired'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInGoogle(nextPath());
      router.replace(nextPath());
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.unknownError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>
      <div className="mz-card w-full max-w-md p-7 md:p-9">
        <header className="text-center mb-7">
          <div className="text-3xl mb-2" aria-hidden>
            ◐
          </div>
          <h1 className="text-2xl font-extrabold">{t('login.welcome')}</h1>
          <p className="text-sm text-ink-mute mt-1">
            {mode === 'signin' ? t('login.subSignIn') : t('login.subSignUp')}
          </p>
        </header>

        {!configured && (
          <div className="rounded-xl bg-amber_-bg text-amber_-ink text-sm p-3 mb-5">
            {t('login.notConfigured')}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="mz-field-label" htmlFor="email">
              {t('login.email')}
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
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>
          <div>
            <label className="mz-field-label" htmlFor="password">
              {t('login.password')}
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
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {requiresConsent && (
            <label className="flex items-start gap-2 text-sm text-ink-soft leading-relaxed">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 shrink-0"
                aria-describedby="consent-detail"
              />
              <span id="consent-detail">
                {t('login.consentLabel')}{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline text-clay font-semibold"
                >
                  {t('login.consentTermsLink')}
                </Link>
              </span>
            </label>
          )}

          {error && (
            <div
              id="login-error"
              role="alert"
              aria-live="polite"
              className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || (requiresConsent && !consent)}
            className="mz-btn mz-btn-clay w-full"
          >
            {busy ? t('login.busy') : mode === 'signin' ? t('login.signIn') : t('login.signUp')}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-x-0 top-1/2 h-px bg-sand-100" />
          <div className="relative text-center text-xs text-ink-mute">
            <span className="bg-white px-3">{t('login.or')}</span>
          </div>
        </div>

        <button onClick={google} disabled={busy} className="mz-btn mz-btn-ghost w-full">
          {t('login.google')}
        </button>

        <p className="text-center text-sm text-ink-mute mt-6">
          {mode === 'signin' ? t('login.noAccount') : t('login.haveAccount')}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-clay font-semibold"
          >
            {mode === 'signin' ? t('login.toSignUp') : t('login.toSignIn')}
          </button>
        </p>
      </div>
    </div>
  );
}
