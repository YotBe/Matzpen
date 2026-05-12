'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { LAWYERS, type Lawyer, type LawyerSpecialty } from '@/lib/legalShield/lawyers';
import { REGIONS, type Region } from '@/lib/regions';

const SPECIALTIES: LawyerSpecialty[] = [
  'guardianship',
  'involuntary',
  'criminal_mental_health',
  'national_insurance',
  'rehab_basket',
  'financial_protection',
];

export function LawyerDirectory({ defaultRegion }: { defaultRegion?: string }) {
  const { t } = useT();
  const [region, setRegion] = useState<Region | ''>(
    (defaultRegion as Region | undefined) ?? '',
  );
  const [specialty, setSpecialty] = useState<LawyerSpecialty | ''>('');
  const [proBonoOnly, setProBonoOnly] = useState(false);

  const filtered = useMemo<Lawyer[]>(() => {
    return LAWYERS.filter((l) => {
      if (region && l.region !== region) return false;
      if (specialty && !l.specialty.includes(specialty)) return false;
      if (proBonoOnly && !l.proBono) return false;
      return true;
    });
  }, [region, specialty, proBonoOnly]);

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute mb-3">
          {t('legal.lawyers.filters')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-xs text-ink-soft font-semibold">{t('legal.lawyers.region')}</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | '')}
              className="mz-input mt-1.5 appearance-none"
            >
              <option value="">{t('legal.lawyers.allRegions')}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t(`region.${r}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-ink-soft font-semibold">
              {t('legal.lawyers.specialty')}
            </span>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as LawyerSpecialty | '')}
              className="mz-input mt-1.5 appearance-none"
            >
              <option value="">{t('legal.lawyers.allSpecialties')}</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {t(`legal.lawyers.specialty.${s}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={proBonoOnly}
              onChange={(e) => setProBonoOnly(e.target.checked)}
            />
            {t('legal.lawyers.proBonoOnly')}
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-mute text-center py-8">{t('legal.lawyers.empty')}</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((l) => (
            <li key={l.id} className="mz-card p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold">{l.name}</h3>
                  <div className="text-xs text-ink-mute mt-0.5">
                    {t(`region.${l.region}`)} · {l.languages.map((lng) => lng.toUpperCase()).join(' / ')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.proBono && (
                    <span className="mz-pill bg-sage/15 text-sage">
                      {t('legal.lawyers.proBonoTag')}
                    </span>
                  )}
                  {l.consultationFeeIls && (
                    <span className="mz-pill">
                      ₪{l.consultationFeeIls[0]}–{l.consultationFeeIls[1]} ·{' '}
                      {t('legal.lawyers.feeUnit')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {l.specialty.map((s) => (
                  <span key={s} className="mz-pill">
                    {t(`legal.lawyers.specialty.${s}`)}
                  </span>
                ))}
              </div>

              {l.notes && (
                <p className="text-sm text-ink-soft mt-3 leading-relaxed">{l.notes}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {l.phone && (
                  <a href={`tel:${l.phone}`} className="mz-btn mz-btn-ghost h-9 px-3 text-sm">
                    {l.phone}
                  </a>
                )}
                {l.email && (
                  <a href={`mailto:${l.email}`} className="mz-btn mz-btn-ghost h-9 px-3 text-sm">
                    {l.email}
                  </a>
                )}
                {l.website && (
                  <a
                    href={l.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mz-btn mz-btn-ghost h-9 px-3 text-sm"
                  >
                    {t('legal.lawyers.website')}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-ink-mute leading-relaxed">{t('legal.lawyers.disclaimer')}</p>
    </div>
  );
}
