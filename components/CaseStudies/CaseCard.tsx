'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import type { CaseStudy } from '@/lib/caseStudies/cases';

export function CaseCard({ c }: { c: CaseStudy }) {
  const { t } = useT();
  return (
    <article className="mz-card p-5 md:p-6">
      <header className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="mz-pill bg-clay/15 text-clay-deep">
            {t(`cases.diagnosis.${c.diagnosis}`)}
          </span>
          <span className="mz-pill">{t(`cases.age.${c.ageBand}`)}</span>
          {c.triggers.map((tr) => (
            <span key={tr} className="mz-pill">
              {t(`cases.trigger.${tr}`)}
            </span>
          ))}
        </div>
        <span className="text-xs text-ink-mute">
          {t('cases.durationLabel')}: <strong>{c.durationLabel}</strong>
        </span>
      </header>

      <Section title={t('cases.situation')}>
        <p className="text-base leading-relaxed">{c.situation}</p>
      </Section>

      <Section title={t('cases.action')}>
        <ol className="list-decimal ps-6 space-y-1.5 text-base leading-relaxed">
          {c.actionTaken.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      <div className="mt-4 rounded-2xl bg-sage-bg/70 border border-sage/20 p-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-sage">
          {t('cases.takeaway')}
        </div>
        <p className="text-base mt-1 leading-relaxed">{c.keyTakeaway}</p>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </section>
  );
}
