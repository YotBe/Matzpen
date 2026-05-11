'use client';

import { useT } from '@/lib/i18n/LocaleProvider';
import {
  googleMapsLink,
  wazeLink,
  type PsychHospital,
} from '@/lib/hospitalization/hospitals';

export function HospitalCard({ h }: { h: PsychHospital }) {
  const { t } = useT();
  return (
    <article className="mz-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold leading-snug">{h.name}</h3>
          <div className="text-xs text-ink-mute mt-0.5">
            {h.city} · {t(`region.${h.region}`)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {h.hasPsychER ? (
            <span className="mz-pill bg-sage/15 text-sage">{t('hosp.tag.psychER')}</span>
          ) : (
            <span className="mz-pill bg-amber_-bg text-amber_-ink">
              {t('hosp.tag.noPsychER')}
            </span>
          )}
          {h.acceptsMinors && (
            <span className="mz-pill">{t('hosp.tag.minors')}</span>
          )}
          {h.acceptsCivilCommitment && (
            <span className="mz-pill">{t('hosp.tag.commitment')}</span>
          )}
        </div>
      </div>

      {h.notes && (
        <p className="text-sm text-ink-soft mt-3 leading-relaxed">{h.notes}</p>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a href={`tel:${h.phone}`} className="mz-btn mz-btn-clay h-11 text-sm">
          {t('hosp.callSwitchboard')} · {h.phone}
        </a>
        {h.erPhone && (
          <a href={`tel:${h.erPhone}`} className="mz-btn mz-btn-crimson h-11 text-sm">
            {t('hosp.callER')} · {h.erPhone}
          </a>
        )}
        <a
          href={wazeLink(h.mapsQuery)}
          target="_blank"
          rel="noreferrer noopener"
          className="mz-btn mz-btn-ghost h-11 text-sm"
        >
          {t('hosp.openWaze')}
        </a>
        <a
          href={googleMapsLink(h.mapsQuery)}
          target="_blank"
          rel="noreferrer noopener"
          className="mz-btn mz-btn-ghost h-11 text-sm"
        >
          {t('hosp.openMaps')}
        </a>
      </div>

      {h.website && (
        <a
          href={h.website}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-clay font-semibold mt-3 inline-block"
        >
          {t('hosp.website')} ↗
        </a>
      )}
    </article>
  );
}
