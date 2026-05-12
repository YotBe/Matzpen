'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/LocaleProvider';
import { CONTACT_EMAIL } from '@/lib/constants';

// Lightweight footer with privacy + feedback links. Hidden on /login (the Shell
// already hides chrome there) and never shown when printing the triage record.
export function Footer() {
  const { t } = useT();
  return (
    <footer className="mz-no-print border-t border-ink/5 bg-sand-50/60 mt-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-mute">
        <div>© Matzpen</div>
        <nav className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-ink">
            {t('nav.privacy')}
          </Link>
          <Link href="/terms" className="hover:text-ink">
            {t('nav.terms')}
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Matzpen%20feedback`}
            className="hover:text-ink"
          >
            {t('nav.feedback')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
