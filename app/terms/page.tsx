'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import { CONTACT_EMAIL } from '@/lib/constants';

// Pre-launch Terms of Service stub. The wording below is the *engineering
// team's* honest description of what Matzpen is and isn't. It is NOT a
// substitute for a legal review — see docs/legal-review-brief.md. The
// reviewer will tighten or replace this page; the consent flow at sign-up
// already links here so users have read something before they agree.

export default function TermsPage() {
  const { t } = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">{t('terms.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('terms.title')}
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">{t('terms.intro')}</p>
      </header>

      <Section title={t('terms.notMedical.title')} body={t('terms.notMedical.body')} />
      <Section title={t('terms.notLegal.title')} body={t('terms.notLegal.body')} />
      <Section title={t('terms.emergency.title')} body={t('terms.emergency.body')} />
      <Section title={t('terms.ai.title')} body={t('terms.ai.body')} />
      <Section title={t('terms.dataYouEnter.title')} body={t('terms.dataYouEnter.body')} />
      <Section title={t('terms.directories.title')} body={t('terms.directories.body')} />
      <Section title={t('terms.warranty.title')} body={t('terms.warranty.body')} />
      <Section title={t('terms.changes.title')} body={t('terms.changes.body')} />

      <div className="mz-card p-5 md:p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-mute">
          {t('terms.contactTitle')}
        </div>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('terms.contactBody')}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-3 inline-block font-semibold text-clay"
          dir="ltr"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('terms.draftDisclaimer')}
      </aside>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-base text-ink-soft mt-2 leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </section>
  );
}
