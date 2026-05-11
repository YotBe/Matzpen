'use client';

import { useMemo } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { computeAlertLevel } from '@/utils/alertAlgorithm';
import type { DailyLog } from '@/lib/types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function classifyDay(log: DailyLog): 'stable' | 'risk' {
  // Single-day risk flag (mirrors the rules used by the alert algorithm, but
  // standalone so each day gets its own classification).
  const lowSleep = log.sleepHours < 4.5;
  const hot = log.psychomotorSpeed >= 4;
  if ((lowSleep && hot) || log.impulsivityEvent) return 'risk';
  if (log.affectiveState === 'euphoria' || log.affectiveState === 'depression') return 'risk';
  return 'stable';
}

interface Props {
  logs: DailyLog[];
}

export function WeeklySummary({ logs }: Props) {
  const { t } = useT();

  const { dotsOldestFirst, stableCount, total, trend } = useMemo(() => {
    const cutoff = Date.now() - WEEK_MS;
    const week = logs.filter((l) => l.createdAt >= cutoff);
    const sortedNewestFirst = [...week].sort((a, b) => b.createdAt - a.createdAt);
    const dotsOldestFirst = [...sortedNewestFirst].reverse();
    const stableCount = sortedNewestFirst.filter((l) => classifyDay(l) === 'stable').length;
    const total = sortedNewestFirst.length;

    // Trend: compare risk-share in the most recent half vs the older half.
    let trend: 'stable' | 'rising' | 'falling' = 'stable';
    if (total >= 4) {
      const half = Math.floor(total / 2);
      const recent = sortedNewestFirst.slice(0, half);
      const older = sortedNewestFirst.slice(-half);
      const riskShare = (arr: DailyLog[]) =>
        arr.filter((l) => classifyDay(l) === 'risk').length / Math.max(arr.length, 1);
      const diff = riskShare(recent) - riskShare(older);
      if (diff >= 0.25) trend = 'rising';
      else if (diff <= -0.25) trend = 'falling';
    } else {
      // Not enough data; let the live alert level be the tie-breaker.
      const live = computeAlertLevel(logs).level;
      if (live === 'RED_ALERT' || live === 'YELLOW_ALERT') trend = 'rising';
    }

    return { dotsOldestFirst, stableCount, total, trend };
  }, [logs]);

  if (total === 0) {
    return (
      <div className="mz-card p-4 md:p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-mute">
          {t('dashboard.weekTitle')}
        </div>
        <p className="text-sm text-ink-mute mt-2">{t('dashboard.weekNone')}</p>
      </div>
    );
  }

  const trendTag =
    trend === 'rising'
      ? t('dashboard.weekRisingTag')
      : trend === 'falling'
      ? t('dashboard.weekFallingTag')
      : t('dashboard.weekStableTag');

  const trendToneClass =
    trend === 'rising'
      ? 'text-crimson-deep'
      : trend === 'falling'
      ? 'text-sage'
      : 'text-ink-soft';

  return (
    <div className="mz-card p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-mute">
          {t('dashboard.weekTitle')}
        </div>
        <div className={`text-xs font-semibold ${trendToneClass}`}>
          {t('dashboard.weekTrend', { trend: trendTag })}
        </div>
      </div>
      <p className="text-sm text-ink mt-2 leading-relaxed">
        {t('dashboard.weekStable', { stable: stableCount, total })}
      </p>
      <div className="mt-3 flex items-center gap-1.5" aria-hidden>
        {dotsOldestFirst.map((log, i) => {
          const cls = classifyDay(log);
          return (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                cls === 'stable' ? 'bg-sage/70' : 'bg-crimson/60'
              }`}
              title={new Date(log.createdAt).toLocaleDateString()}
            />
          );
        })}
      </div>
    </div>
  );
}
