'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { computeAlertLevel } from '@/utils/alertAlgorithm';
import { AlertIcon, ChevronEnd, ShieldIcon } from '@/components/icons';
import { useT } from '@/lib/i18n/LocaleProvider';
import { track } from '@/lib/analytics';
import type { DailyLog } from '@/lib/types';

interface Props {
  logs: DailyLog[];
}

export function AlertBanner({ logs }: Props) {
  const result = useMemo(() => computeAlertLevel(logs), [logs]);
  const { t } = useT();

  useEffect(() => {
    if (result.level === 'YELLOW_ALERT') track('alert_banner_yellow_shown');
    else if (result.level === 'RED_ALERT') track('alert_banner_red_shown');
  }, [result.level]);

  if (result.level === 'STABLE') {
    return (
      <div className="rounded-2xl bg-sage-bg/70 text-sage border border-sage/20 px-4 py-3 flex items-start gap-3">
        <ShieldIcon size={20} className="mt-0.5 text-sage" />
        <div>
          <div className="font-semibold text-sm">{t('alert.stableTitle')}</div>
          <div className="text-xs text-ink-soft mt-0.5">{t('alert.stableBody')}</div>
        </div>
      </div>
    );
  }

  if (result.level === 'YELLOW_ALERT') {
    return (
      <div className="rounded-2xl bg-amber_-bg text-amber_-ink border border-amber_/30 px-4 py-4 flex items-start gap-3">
        <AlertIcon size={22} className="mt-0.5 text-amber_-ink shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide opacity-80">
            {t('alert.yellowKicker')}
          </div>
          <div className="font-semibold text-base mt-1 leading-snug">
            {t('alert.yellowBody')}
          </div>
          {result.reasons.length > 0 && (
            <ul className="mt-2 text-xs space-y-0.5 list-disc ps-5">
              {result.reasons.map((r, i) => (
                <li key={i}>{t(r.key, r.vars)}</li>
              ))}
            </ul>
          )}
          <NonClinicalDisclosure />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-crimson-bg text-crimson-deep border border-crimson/30 px-4 py-4">
      <div className="flex items-start gap-3">
        <AlertIcon size={22} className="mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide opacity-80">
            {t('alert.redKicker')}
          </div>
          <div className="font-semibold text-base mt-1 leading-snug">
            {t('alert.redBody')}
          </div>
          {result.reasons.length > 0 && (
            <ul className="mt-2 text-xs space-y-0.5 list-disc ps-5">
              {result.reasons.map((r, i) => (
                <li key={i}>{t(r.key, r.vars)}</li>
              ))}
            </ul>
          )}
          <NonClinicalDisclosure />
        </div>
      </div>
      <Link
        href="/emergency"
        className="mt-3 inline-flex w-full justify-between items-center gap-2 bg-white text-crimson-deep font-bold rounded-xl px-4 py-3"
      >
        <span>{t('alert.openEmergency')}</span>
        <ChevronEnd size={20} />
      </Link>
    </div>
  );
}

function NonClinicalDisclosure() {
  const { t } = useT();
  return (
    <details className="mt-3 text-[11px] leading-relaxed opacity-80">
      <summary className="cursor-pointer font-semibold underline underline-offset-2">
        {t('alert.howCalculated')}
      </summary>
      <p className="mt-1.5">{t('alert.nonClinicalNote')}</p>
    </details>
  );
}
