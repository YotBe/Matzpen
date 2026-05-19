'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import type {
  AgeBand,
  CaseDiagnosis,
  Trigger,
} from '@/lib/caseStudies/cases';

export interface CaseFilters {
  diagnosis: CaseDiagnosis | '';
  ageBand: AgeBand | '';
  trigger: Trigger | '';
}

const DIAGNOSES: CaseDiagnosis[] = [
  'bipolar_mania',
  'bipolar_depression',
  'psychotic_break',
  'postpartum_psychosis',
  'major_depression',
  'suicidality_crisis',
  'eating_disorder',
];

const AGE_BANDS: AgeBand[] = ['adolescent', 'young_adult', 'adult', 'older_adult'];

const TRIGGERS: Trigger[] = [
  'med_noncompliance',
  'sleep_disruption',
  'substance_use',
  'major_life_event',
  'postpartum',
  'unknown',
];

export function Filters({
  value,
  onChange,
}: {
  value: CaseFilters;
  onChange: (next: CaseFilters) => void;
}) {
  const { t } = useT();
  return (
    <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute mb-3">
        {t('cases.filters')}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs text-ink-soft font-semibold">{t('cases.diagnosis')}</span>
          <select
            value={value.diagnosis}
            onChange={(e) =>
              onChange({ ...value, diagnosis: e.target.value as CaseDiagnosis | '' })
            }
            className="mz-input mt-1.5 appearance-none"
          >
            <option value="">{t('cases.allDiagnoses')}</option>
            {DIAGNOSES.map((d) => (
              <option key={d} value={d}>
                {t(`cases.diagnosis.${d}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-ink-soft font-semibold">{t('cases.age')}</span>
          <select
            value={value.ageBand}
            onChange={(e) => onChange({ ...value, ageBand: e.target.value as AgeBand | '' })}
            className="mz-input mt-1.5 appearance-none"
          >
            <option value="">{t('cases.allAges')}</option>
            {AGE_BANDS.map((a) => (
              <option key={a} value={a}>
                {t(`cases.age.${a}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-ink-soft font-semibold">{t('cases.trigger')}</span>
          <select
            value={value.trigger}
            onChange={(e) => onChange({ ...value, trigger: e.target.value as Trigger | '' })}
            className="mz-input mt-1.5 appearance-none"
          >
            <option value="">{t('cases.allTriggers')}</option>
            {TRIGGERS.map((tr) => (
              <option key={tr} value={tr}>
                {t(`cases.trigger.${tr}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
