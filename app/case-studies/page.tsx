'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { CASE_STUDIES, filterCases } from '@/lib/caseStudies/cases';
import { CaseCard } from '@/components/CaseStudies/CaseCard';
import { Filters, type CaseFilters } from '@/components/CaseStudies/Filters';

export default function CaseStudiesPage() {
  const { t } = useT();
  const [filters, setFilters] = useState<CaseFilters>({
    diagnosis: '',
    ageBand: '',
    trigger: '',
  });

  const cases = useMemo(() => filterCases(CASE_STUDIES, filters), [filters]);
  const hasFilters = filters.diagnosis || filters.ageBand || filters.trigger;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('cases.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{t('cases.title')}</h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('cases.intro')}</p>
      </header>

      <Filters value={filters} onChange={setFilters} />

      <div className="text-xs text-ink-mute">
        {t('cases.count', { n: cases.length })}
        {hasFilters && (
          <>
            {' · '}
            <button
              type="button"
              onClick={() => setFilters({ diagnosis: '', ageBand: '', trigger: '' })}
              className="underline text-ink-soft"
            >
              {t('cases.clearFilters')}
            </button>
          </>
        )}
      </div>

      {cases.length === 0 ? (
        <p className="text-sm text-ink-mute py-10 text-center">{t('cases.empty')}</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((c) => (
            <li key={c.id}>
              <CaseCard c={c} />
            </li>
          ))}
        </ul>
      )}

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('cases.disclaimer')}
      </aside>
    </div>
  );
}
