'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { ChevronEnd, SignOutIcon } from '@/components/icons';
import { LanguageToggle } from '@/components/LanguageToggle';

export function NavBar() {
  const pathname = usePathname() ?? '/';
  const { user, signOut, configured } = useAuth();
  const { t } = useT();
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLLIElement>(null);

  const links = [
    { href: '/', label: t('nav.daily'), helper: t('nav.dailyHelper') },
    { href: '/emergency', label: t('nav.emergency'), helper: t('nav.emergencyHelper') },
    { href: '/golden-record', label: t('nav.goldenRecord'), helper: t('nav.goldenRecordHelper') },
    { href: '/bureaucracy', label: t('nav.bureaucracy'), helper: t('nav.bureaucracyHelper') },
    { href: '/assistant', label: t('nav.assistant'), helper: t('nav.assistantHelper') },
  ] as const;

  const tools = [
    { href: '/legal-shield', label: t('nav.legal'), helper: t('nav.legalHelper') },
    { href: '/hospitalization', label: t('nav.hospitalization'), helper: t('nav.hospitalizationHelper') },
    { href: '/case-studies', label: t('nav.cases'), helper: t('nav.casesHelper') },
  ];

  const inTools = tools.some((tl) => pathname === tl.href || pathname.startsWith(tl.href));

  // Close the tools dropdown on outside click or escape.
  useEffect(() => {
    if (!toolsOpen) return;
    function handlePointer(e: MouseEvent) {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setToolsOpen(false);
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [toolsOpen]);

  // Close the dropdown when navigation happens.
  useEffect(() => {
    setToolsOpen(false);
  }, [pathname]);

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
          <li className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              aria-haspopup="menu"
              className={`group flex flex-col items-start leading-tight px-3 py-1.5 rounded-xl transition-colors ${
                inTools
                  ? 'bg-white text-clay shadow-soft'
                  : 'text-ink-soft hover:text-ink hover:bg-white/60'
              }`}
            >
              <span className="text-sm font-semibold flex items-center gap-1">
                {t('nav.tools')}
                <ChevronEnd
                  size={14}
                  className={`transition-transform ${toolsOpen ? 'rotate-90' : ''}`}
                />
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  inTools ? 'text-clay/70' : 'text-ink-mute'
                }`}
              >
                {t('nav.toolsHelper')}
              </span>
            </button>
            {toolsOpen && (
              <ul
                role="menu"
                className="absolute end-0 mt-2 w-72 bg-white rounded-card shadow-card border border-sand-100 p-1.5 z-40"
              >
                {tools.map((tl) => {
                  const active = pathname === tl.href || pathname.startsWith(tl.href);
                  return (
                    <li key={tl.href}>
                      <Link
                        href={tl.href}
                        role="menuitem"
                        className={`block px-3 py-2 rounded-xl ${
                          active ? 'bg-clay/10 text-clay' : 'hover:bg-sand-50'
                        }`}
                      >
                        <div className="text-sm font-semibold">{tl.label}</div>
                        <div className="text-xs text-ink-mute mt-0.5 leading-snug">
                          {tl.helper}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
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
