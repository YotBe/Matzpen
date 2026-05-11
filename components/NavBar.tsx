'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SignOutIcon } from '@/components/icons';

const LINKS = [
  { href: '/', label: 'מעקב יומי' },
  { href: '/emergency', label: 'מצב חירום' },
  { href: '/golden-record', label: 'תיק למיון' },
  { href: '/bureaucracy', label: 'זכויות ובירוקרטיה' },
] as const;

export function NavBar() {
  const pathname = usePathname() ?? '/';
  const { user, signOut, configured } = useAuth();

  return (
    <header className="sticky top-0 z-30 hidden md:block bg-sand-50/85 backdrop-blur border-b border-ink/5">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-ink">
          <span aria-hidden className="text-clay">◐</span>
          מצפן
        </Link>
        <ul className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-white text-clay shadow-soft'
                      : 'text-ink-soft hover:text-ink hover:bg-white/60'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3 text-sm">
          {configured && user ? (
            <>
              <span className="text-ink-mute hidden lg:inline">{user.email}</span>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sand-100 text-ink-soft hover:text-ink"
              >
                <SignOutIcon size={16} /> יציאה
              </button>
            </>
          ) : configured ? (
            <Link href="/login" className="text-clay font-semibold">
              כניסה
            </Link>
          ) : (
            <span className="text-ink-mute">תצוגה</span>
          )}
        </div>
      </nav>
    </header>
  );
}
