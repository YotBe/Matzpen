'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { getGoldenRecord } from '@/services/supabaseService';
import { isRegion, type Region } from '@/lib/regions';
import {
  hospitalsForRegion,
  PSYCH_HOSPITALS,
  type PsychHospital,
} from '@/lib/hospitalization/hospitals';
import {
  ALT_CARE_OPTIONS,
  altCareForRegion,
  type AltCareKind,
} from '@/lib/hospitalization/alternativeCare';
import { HospitalCard } from '@/components/Hospitalization/HospitalCard';
import { AlternativeCareCard } from '@/components/Hospitalization/AlternativeCareCard';

type Tab = 'hospitals' | 'alternative';

const ALT_KIND_FILTERS: { value: AltCareKind | 'all'; key: string }[] = [
  { value: 'all', key: 'hosp.altFilter.all' },
  { value: 'balancing_home', key: 'hosp.altFilter.balancing' },
  { value: 'day_hospital', key: 'hosp.altFilter.day' },
];

export default function HospitalizationPage() {
  const { t } = useT();
  const { configured } = useAuth();
  const patientId = usePatientId();
  const [tab, setTab] = useState<Tab>('hospitals');
  const [savedRegion, setSavedRegion] = useState<Region | null>(null);
  const [pickedRegion, setPickedRegion] = useState<Region | null>(null);
  const [altKind, setAltKind] = useState<AltCareKind | 'all'>('all');

  const activeRegion = pickedRegion ?? savedRegion;

  useEffect(() => {
    if (!configured || !patientId) return;
    let cancelled = false;
    getGoldenRecord(patientId)
      .then((r) => {
        if (cancelled) return;
        if (r?.region && isRegion(r.region)) setSavedRegion(r.region);
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      cancelled = true;
    };
  }, [configured, patientId]);

  const { near, other } = useMemo(
    () => hospitalsForRegion(activeRegion ?? undefined),
    [activeRegion],
  );

  const altList = useMemo(
    () => altCareForRegion(activeRegion ?? undefined, altKind === 'all' ? undefined : altKind),
    [activeRegion, altKind],
  );

  const allRegions: Region[] = [
    'north',
    'haifa',
    'sharon',
    'center',
    'telaviv',
    'jerusalem',
    'shfela',
    'south',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('hosp.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{t('hosp.title')}</h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('hosp.intro')}</p>
      </header>

      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
          {t('hosp.regionPicker')}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {allRegions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setPickedRegion(r)}
              className={`mz-pill ${
                activeRegion === r ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''
              }`}
            >
              {t(`region.${r}`)}
            </button>
          ))}
          {activeRegion && (
            <button
              type="button"
              onClick={() => setPickedRegion(null)}
              className="text-xs text-ink-mute underline self-center"
            >
              {t('hosp.clearRegion')}
            </button>
          )}
        </div>
        {!savedRegion && (
          <p className="text-xs text-ink-mute mt-3 leading-relaxed">
            {t('hosp.regionHint')}{' '}
            <Link href="/golden-record" className="text-clay font-semibold underline">
              {t('hosp.regionHintCta')}
            </Link>
          </p>
        )}
      </div>

      <div role="tablist" className="flex gap-2 border-b border-sand-100">
        <TabBtn label={t('hosp.tab.hospitals')} active={tab === 'hospitals'} onClick={() => setTab('hospitals')} />
        <TabBtn label={t('hosp.tab.alternative')} active={tab === 'alternative'} onClick={() => setTab('alternative')} />
      </div>

      {tab === 'hospitals' ? (
        <HospitalsTab
          near={near}
          other={other}
          hasActiveRegion={Boolean(activeRegion)}
        />
      ) : (
        <AlternativeTab
          options={altList}
          altKind={altKind}
          onAltKindChange={setAltKind}
          activeRegionLabel={activeRegion ? t(`region.${activeRegion}`) : null}
        />
      )}

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('hosp.disclaimer')}
      </aside>
    </div>
  );
}

function TabBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={onClick}
      className={`relative -mb-px px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
        active ? 'border-clay text-clay' : 'border-transparent text-ink-soft hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

function HospitalsTab({
  near,
  other,
  hasActiveRegion,
}: {
  near: PsychHospital[];
  other: PsychHospital[];
  hasActiveRegion: boolean;
}) {
  const { t } = useT();
  return (
    <div className="space-y-7">
      {hasActiveRegion && near.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">{t('hosp.nearbyHeading')}</h2>
          <ul className="space-y-3">
            {near.map((h) => (
              <li key={h.id}>
                <HospitalCard h={h} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2 className="text-lg font-bold mb-3">
          {hasActiveRegion ? t('hosp.otherHeading') : t('hosp.allHeading')}
        </h2>
        <ul className="space-y-3">
          {(hasActiveRegion ? other : PSYCH_HOSPITALS).map((h) => (
            <li key={h.id}>
              <HospitalCard h={h} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AlternativeTab({
  options,
  altKind,
  onAltKindChange,
  activeRegionLabel,
}: {
  options: typeof ALT_CARE_OPTIONS;
  altKind: AltCareKind | 'all';
  onAltKindChange: (k: AltCareKind | 'all') => void;
  activeRegionLabel: string | null;
}) {
  const { t } = useT();
  const aiPrompt = activeRegionLabel
    ? t('hosp.altAIPromptRegion', { region: activeRegionLabel })
    : t('hosp.altAIPromptGeneric');

  return (
    <div className="space-y-5">
      <section className="mz-card p-4 md:p-5 bg-clay/5 border border-clay/20">
        <h2 className="font-bold">{t('hosp.altAI.title')}</h2>
        <p className="text-sm text-ink-soft mt-1 leading-relaxed">
          {t('hosp.altAI.body')}
        </p>
        <Link
          href={`/assistant?prompt=${encodeURIComponent(aiPrompt)}`}
          className="mz-btn mz-btn-clay mt-3 h-11 text-sm"
        >
          {t('hosp.altAI.cta')}
        </Link>
      </section>

      <div className="flex flex-wrap gap-2">
        {ALT_KIND_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onAltKindChange(f.value)}
            className={`mz-pill ${
              altKind === f.value ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''
            }`}
          >
            {t(f.key)}
          </button>
        ))}
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-ink-mute py-6 text-center">{t('hosp.altEmpty')}</p>
      ) : (
        <ul className="space-y-3">
          {options.map((o) => (
            <li key={o.id}>
              <AlternativeCareCard o={o} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
