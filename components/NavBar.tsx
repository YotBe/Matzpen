'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { SignOutIcon } from '@/components/icons';
import { LanguageToggle } from '@/components/LanguageToggle';

export function NavBar() {
  const pathname = usePathname() ?? '/';
  const { user, signOut, configured } = useAuth();
  const { t } = useT();

  const links = [
    { href: '/', label: t('nav.daily'), helper: t('nav.dailyHelper') },
    { href: '/emergency', label: t('nav.emergency'), helper: t('nav.emergencyHelper') },
    { href: '/golden-record', label: t('nav.goldenRecord'), helper: t('nav.goldenRecordHelper') },
    { href: '/bureaucracy', label: t('nav.bureaucracy'), helper: t('nav.bureaucracyHelper') },
  ] as const;

  return (
    <header className="sticky top-0 z-30 hidden md:block bg-sand-50/85 backdrop-blur border-b border-ink/5">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-ink">
          <span aria-hidden className="text-clay">◐</span>
          מצפן
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  title={l.helper}
                  className={`group flex flex-col items-start leading-tight px-3 py-1.5 rounded-xl transition-colors ${
                    active
                      ? 'bg-white text-clay shadow-soft'
                      : 'text-ink-soft hover:text-ink hover:bg-white/60'
                  }`}
                >
                  <span className="text-sm font-semibold">{l.label}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      active ? 'text-clay/70' : 'text-ink-mute'
                    }`}
                  >
                    {l.helper}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3 text-sm">
          <LanguageToggle />
          {configured && user ? (
            <>
              <span className="text-ink-mute hidden lg:inline">{user.email}</span>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sand-100 text-ink-soft hover:text-ink"
              >
                <SignOutIcon size={16} /> {t('nav.signOut')}
              </button>
            </>
          ) : configured ? (
            <Link href="/login" className="text-clay font-semibold">
              {t('nav.signIn')}
            </Link>
          ) : (
            <span className="text-ink-mute">{t('common.previewMode')}</span>
          )}
        </div>
      </nav>
    </header>
  );
}
