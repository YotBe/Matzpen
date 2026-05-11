'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/i18n/LocaleProvider';
import {
  AlertIcon,
  HomeIcon,
  NoteIcon,
  ScrollIcon,
} from '@/components/icons';

export function BottomNav() {
  const pathname = usePathname() ?? '/';
  const { t } = useT();

  const tabs = [
    { href: '/', label: t('nav.dailyShort'), Icon: HomeIcon },
    { href: '/emergency', label: t('nav.emergencyShort'), Icon: AlertIcon },
    { href: '/golden-record', label: t('nav.goldenRecordShort'), Icon: NoteIcon },
    { href: '/bureaucracy', label: t('nav.bureaucracyShort'), Icon: ScrollIcon },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sand-50/95 backdrop-blur border-t border-ink/5 mz-no-print">
      <ul className="flex items-stretch justify-between px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
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
      </ul>
    </nav>
  );
}
