'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertIcon,
  HomeIcon,
  NoteIcon,
  ScrollIcon,
} from '@/components/icons';

const TABS = [
  { href: '/', label: 'מעקב', Icon: HomeIcon },
  { href: '/emergency', label: 'חירום', Icon: AlertIcon },
  { href: '/golden-record', label: 'תיק', Icon: NoteIcon },
  { href: '/bureaucracy', label: 'זכויות', Icon: ScrollIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sand-50/95 backdrop-blur border-t border-ink/5 mz-no-print">
      <ul className="flex items-stretch justify-between px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {TABS.map((t) => {
          const active = pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href));
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl ${
                  active ? 'text-clay' : 'text-ink-mute'
                }`}
              >
                <t.Icon size={22} />
                <span className="text-[11px] font-medium">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
