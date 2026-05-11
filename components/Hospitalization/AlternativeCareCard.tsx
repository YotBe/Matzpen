'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import {
  googleMapsLink,
  wazeLink,
} from '@/lib/hospitalization/hospitals';
import type { AltCareOption, Funding } from '@/lib/hospitalization/alternativeCare';

export function AlternativeCareCard({ o }: { o: AltCareOption }) {
  const { t } = useT();

  return (
    <article className="mz-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
            {t(`altCare.kind.${o.kind}`)}
          </div>
          <h3 className="text-lg font-extrabold leading-snug mt-0.5">{o.name}</h3>
          <div className="text-xs text-ink-mute mt-0.5">
            {o.city} · {t(`region.${o.region}`)}
            {typeof o.capacity === 'number' && (
              <> · {t('altCare.capacity', { n: o.capacity })}</>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {o.funding.map((f: Funding) => (
            <span key={f} className="mz-pill">
              {t(`altCare.funding.${f}`)}
            </span>
          ))}
        </div>
      </div>

      {o.approxDailyCostIls && (
        <div className="text-sm text-ink-soft mt-3">
          {t('altCare.dailyCost')}: ₪{o.approxDailyCostIls[0]}–{o.approxDailyCostIls[1]}
        </div>
      )}

      <div className="mt-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-crimson">
          {t('altCare.notAccepted')}
        </div>
        <ul className="text-sm text-ink-soft mt-1 list-disc ps-5 space-y-0.5">
          {o.exclusions.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      {o.notes && (
        <p className="text-sm text-ink-soft mt-3 leading-relaxed">{o.notes}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {o.phone && (
          <a href={`tel:${o.phone}`} className="mz-btn mz-btn-clay h-10 px-4 text-sm">
            {o.phone}
          </a>
        )}
        <a
          href={wazeLink(o.mapsQuery)}
          target="_blank"
          rel="noreferrer noopener"
          className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
        >
          {t('hosp.openWaze')}
        </a>
        <a
          href={googleMapsLink(o.mapsQuery)}
          target="_blank"
          rel="noreferrer noopener"
          className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
        >
          {t('hosp.openMaps')}
        </a>
        {o.website && (
          <a
            href={o.website}
            target="_blank"
            rel="noreferrer noopener"
            className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
          >
            {t('hosp.website')}
          </a>
        )}
      </div>
    </article>
  );
}
