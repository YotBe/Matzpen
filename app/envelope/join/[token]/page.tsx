'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { redeemEnvelopeInvite } from '@/services/warRoomService';
import { track } from '@/lib/analytics';

type State =
  | { kind: 'loading' }
  | { kind: 'needs_login' }
  | { kind: 'redeeming' }
  | { kind: 'ok' }
  | { kind: 'error'; message: string };

export default function EnvelopeJoinPage({ params }: { params: { token: string } }) {
  const { t } = useT();
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!configured) {
      setState({ kind: 'error', message: t('warRoom.envelope.join.notConfigured') });
      return;
    }
    if (loading) return;
    if (!user) {
      setState({ kind: 'needs_login' });
      return;
    }
    if (attemptedRef.current) return;
    attemptedRef.current = true;
    setState({ kind: 'redeeming' });
    redeemEnvelopeInvite(params.token)
      .then(() => {
        track('envelope_invite_redeemed');
        setState({ kind: 'ok' });
        setTimeout(() => router.replace('/war-room'), 1200);
      })
      .catch((err) => {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Failed',
        });
      });
  }, [configured, loading, user, params.token, router, t]);

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-12 text-center space-y-4">
      <h1 className="text-2xl font-extrabold">{t('warRoom.envelope.join.title')}</h1>

      {state.kind === 'loading' && (
        <p className="text-ink-mute">{t('common.loading')}</p>
      )}

      {state.kind === 'needs_login' && (
        <div className="mz-card p-6 space-y-3">
          <p className="text-sm text-ink-soft leading-relaxed">
            {t('warRoom.envelope.join.needsLogin')}
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/envelope/join/${params.token}`)}`}
            className="mz-btn mz-btn-clay w-full"
          >
            {t('login.signIn')}
          </Link>
        </div>
      )}

      {state.kind === 'redeeming' && (
        <p className="text-ink-mute">{t('warRoom.envelope.join.redeeming')}</p>
      )}

      {state.kind === 'ok' && (
        <div className="mz-card p-6">
          <p className="text-base font-semibold">{t('warRoom.envelope.join.ok')}</p>
          <p className="text-sm text-ink-mute mt-1">
            {t('warRoom.envelope.join.redirecting')}
          </p>
        </div>
      )}

      {state.kind === 'error' && (
        <div className="mz-card p-6">
          <p className="text-base font-semibold text-crimson-deep">
            {t('warRoom.envelope.join.errorTitle')}
          </p>
          <p className="text-sm text-ink-mute mt-1">{state.message}</p>
          <Link href="/" className="mz-btn mz-btn-ghost mt-4">
            {t('warRoom.envelope.join.backHome')}
          </Link>
        </div>
      )}
    </div>
  );
}
