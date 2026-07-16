'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { PREVIEW_MODE_ENABLED } from '@/lib/constants';
import { isPublicPath, safeInternalPath } from '@/lib/publicPaths';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    if (!configured) return;
    if (loading) return;
    if (!user && !isPublic) {
      // Carry the destination through login so deep links (e.g. an envelope
      // invite opened by a signed-out caregiver) survive the round-trip.
      const next =
        pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${next}`);
    }
    if (user && pathname === '/login') {
      const next = safeInternalPath(
        new URLSearchParams(window.location.search).get('next'),
      );
      router.replace(next ?? '/');
    }
  }, [user, loading, configured, isPublic, pathname, router]);

  // Preview mode is OFF by default. An unconfigured deploy used to show a
  // pre-populated "demo patient" — a caregiver could screenshot fabricated
  // logs and think they were real. Now we hard-block the app until either
  // Supabase is configured OR the operator explicitly opts into the demo via
  // NEXT_PUBLIC_ENABLE_PREVIEW_MODE=true.
  if (!configured) {
    if (PREVIEW_MODE_ENABLED) return <>{children}</>;
    return <NotConfiguredScreen t={t} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-ink-mute">
        {t('common.loading')}
      </div>
    );
  }

  if (!user && !isPublic) return null;
  return <>{children}</>;
}

function NotConfiguredScreen({ t }: { t: (k: string) => string }) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="mz-card max-w-md p-6 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-clay">
          {t('configBanner.kicker')}
        </div>
        <h1 className="text-2xl font-extrabold mt-2">{t('configBanner.title')}</h1>
        <p className="text-sm text-ink-soft mt-3 leading-relaxed">
          {t('configBanner.body')}
        </p>
      </div>
    </div>
  );
}
