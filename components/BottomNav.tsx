'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import {
  AlertIcon,
  BookIcon,
  GavelIcon,
  HomeIcon,
  HospitalIcon,
  MoreIcon,
  NoteIcon,
  ScrollIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/icons';
import type { SVGProps } from 'react';

type IconCmp = (p: SVGProps<SVGSVGElement> & { size?: number }) => JSX.Element;

export function BottomNav() {
  const pathname = usePathname() ?? '/';
  const { t } = useT();
  const [moreOpen, setMoreOpen] = useState(false);

  const primary: { href: string; label: string; Icon: IconCmp }[] = [
    { href: '/', label: t('nav.dailyShort'), Icon: HomeIcon },
    { href: '/emergency', label: t('nav.emergencyShort'), Icon: AlertIcon },
    { href: '/golden-record', label: t('nav.goldenRecordShort'), Icon: NoteIcon },
    { href: '/bureaucracy', label: t('nav.bureaucracyShort'), Icon: ScrollIcon },
  ];

  const more: { href: string; label: string; Icon: IconCmp }[] = [
    { href: '/war-room', label: t('nav.warRoom'), Icon: ShieldIcon },
    { href: '/lockdown', label: t('nav.lockdown'), Icon: AlertIcon },
    { href: '/playbook', label: t('nav.playbook'), Icon: BookIcon },
    { href: '/vault', label: t('nav.vault'), Icon: NoteIcon },
    { href: '/legal-shield', label: t('nav.legal'), Icon: GavelIcon },
    { href: '/hospitalization', label: t('nav.hospitalization'), Icon: HospitalIcon },
    { href: '/case-studies', label: t('nav.cases'), Icon: BookIcon },
    { href: '/self-care', label: t('nav.selfCare'), Icon: SparklesIcon },
    { href: '/assistant', label: t('nav.assistant'), Icon: SparklesIcon },
  ];

  const moreActive = more.some((m) => pathname === m.href || pathname.startsWith(m.href));

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sand-50/95 backdrop-blur border-t border-ink/5 mz-no-print">
        <ul className="flex items-stretch justify-between px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {primary.map((tab) => {
            const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl ${
                    active ? 'text-clay' : 'text-ink-mute'
                  }`}
                >
                  <tab.Icon size={22} />
                  <span className="text-[11px] font-medium">{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={`flex w-full flex-col items-center gap-0.5 py-1.5 rounded-xl ${
                moreActive ? 'text-clay' : 'text-ink-mute'
              }`}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
            >
              <MoreIcon size={22} />
              <span className="text-[11px] font-medium">{t('nav.moreShort')}</span>
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-ink/40 mz-no-print"
          onClick={() => setMoreOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-x-0 bottom-0 bg-sand-50 rounded-t-card shadow-card pb-[max(1.5rem,env(safe-area-inset-bottom))] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-12 h-1 bg-ink/10 rounded-full mb-3" />
            <h2 className="text-sm font-bold text-ink-soft text-center mb-3">
              {t('nav.moreSheetTitle')}
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {more.map((m) => {
                const active = pathname === m.href || pathname.startsWith(m.href);
                return (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 mz-card p-3 ${
                        active ? 'ring-1 ring-clay/40' : ''
                      }`}
                    >
                      <span
                        className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                          active ? 'bg-clay/15 text-clay' : 'bg-sand-100 text-ink-soft'
                        }`}
                      >
                        <m.Icon size={18} />
                      </span>
                      <span className="text-sm font-semibold leading-tight">{m.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="mt-4 w-full text-sm text-ink-mute py-2"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
