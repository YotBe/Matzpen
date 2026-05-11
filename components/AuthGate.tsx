'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';

const PUBLIC_PATHS = ['/login'];

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname ?? '');

  useEffect(() => {
    if (!configured) return;
    if (loading) return;
    if (!user && !isPublic) router.replace('/login');
    if (user && pathname === '/login') router.replace('/');
  }, [user, loading, configured, isPublic, pathname, router]);

  // When Supabase isn't configured we let everything through in "preview" mode.
  if (!configured) return <>{children}</>;

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
