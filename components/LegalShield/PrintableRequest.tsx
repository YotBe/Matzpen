'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import type { IncidentDetails, LegalTemplate } from '@/lib/legalShield/templates';

export function PrintableRequest({
  template,
  details,
}: {
  template: LegalTemplate;
  details: IncidentDetails;
}) {
  const { locale, t } = useT();
  const isHe = locale === 'he';
  const today = new Date().toLocaleDateString(isHe ? 'he-IL' : 'en-US');

  return (
    <article
      className="mz-card p-6 md:p-10 print-page max-w-3xl mx-auto"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <header className="border-b border-sand-100 pb-4 mb-5">
        <div className="text-[11px] uppercase tracking-widest text-ink-mute font-semibold">
          {isHe ? template.courtHe : template.courtEn}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
          {isHe ? template.titleHe : template.titleEn}
        </h1>
        <div className="text-xs text-ink-mute mt-2">
          {t('legal.printable.dateLabel')}: {today}
        </div>
      </header>

      {template.sections.map((s, i) => (
        <section key={i} className="mb-5 break-inside-avoid">
          <h2 className="text-sm font-bold text-ink-soft uppercase tracking-wide mb-2">
            {isHe ? s.headingHe : s.headingEn}
          </h2>
          <p className="text-base whitespace-pre-line leading-relaxed">
            {isHe ? s.bodyHe(details) : s.bodyEn(details)}
          </p>
        </section>
      ))}

      <footer className="mt-8 pt-5 border-t border-sand-100 text-xs leading-relaxed">
        <div className="mb-4">
          <div className="font-semibold mb-1">{t('legal.printable.signatureLabel')}</div>
          <div>{details.applicantName}</div>
          <div className="text-ink-mute">
            {t('legal.printable.idLabel')}: {details.applicantId}
          </div>
          <div className="text-ink-mute">
            {t('legal.printable.dateLabel')}: {today}
          </div>
          <div className="mt-6 border-t border-dashed border-ink-mute/40 pt-2 max-w-xs">
            {t('legal.printable.signatureLine')}
          </div>
        </div>

        <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-3 leading-relaxed border border-amber_/30">
          {t('legal.printable.disclaimer')}
        </aside>
      </footer>
    </article>
  );
}
