'use client';

import { useT } from '@/lib/i18n/LocaleProvider';

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useT();
  const next = locale === 'he' ? 'en' : 'he';
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={locale === 'he' ? 'Switch to English' : 'החלף לעברית'}
      title={locale === 'he' ? 'Switch to English' : 'החלף לעברית'}
      className={
        className ??
        'inline-flex items-center px-2.5 py-1.5 rounded-lg bg-sand-100 text-ink-soft text-xs font-bold hover:bg-sand-100/80 transition-colors'
      }
    >
      {t('common.langName')}
    </button>
  );
}
