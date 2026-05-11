'use client';

import { useT } from '@/lib/i18n/LocaleProvider';

const CONTACT_EMAIL = 'feedback@matzpen.app';

export default function PrivacyPage() {
  const { t } = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">{t('privacy.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('privacy.title')}
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">{t('privacy.intro')}</p>
      </header>

      <Section title={t('privacy.where.title')} body={t('privacy.where.body')} />
      <Section title={t('privacy.who.title')} body={t('privacy.who.body')} />
      <Section title={t('privacy.delete.title')} body={t('privacy.delete.body')} />

      <div className="mz-card p-5 md:p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-mute">
          {t('privacy.contactTitle')}
        </div>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">{t('privacy.contactBody')}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-3 inline-block font-semibold text-clay"
          dir="ltr"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mz-card p-5 md:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-ink-soft mt-2 leading-relaxed">{body}</p>
    </section>
  );
}
