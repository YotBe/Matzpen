'use client';

import { useMemo } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import type { AffectiveState, DailyLog } from '@/lib/types';

interface Props {
  logs: DailyLog[];
  days?: number;
}

// SVG sparkline of sleep hours over the last N days with mood color dots
// and red triangles on days where medication was explicitly skipped. The
// goal is a chart a psychiatrist can read in ~10 seconds during an
// appointment — not pretty analytics, just the trajectory.
export function TrendChart({ logs, days = 14 }: Props) {
  const { t, locale } = useT();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  // Bucket the logs by day key. Pick the latest log per day so multiple
  // entries on the same day don't double-count.
  const points = useMemo(() => {
    const byDay = new Map<number, DailyLog>();
    for (const log of logs) {
      const d = new Date(log.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime();
      const existing = byDay.get(key);
      if (!existing || existing.createdAt < log.createdAt) byDay.set(key, log);
    }
    const out: { dayOffset: number; log: DailyLog | null; dayKey: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dayKey = today - i * 24 * 60 * 60 * 1000;
      out.push({ dayOffset: days - 1 - i, log: byDay.get(dayKey) ?? null, dayKey });
    }
    return out;
  }, [logs, days, today]);

  const hasAny = points.some((p) => p.log != null);

  if (!hasAny) {
    return (
      <div className="mz-card p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
          {t('trend.kicker')}
        </div>
        <p className="text-sm text-ink-mute mt-2">{t('trend.empty')}</p>
      </div>
    );
  }

  // Chart geometry. Tailored for ~320px width on mobile, scales via SVG.
  const width = 320;
  const height = 96;
  const padX = 8;
  const padY = 16;
  const sleepMax = 10; // hours
  const xFor = (i: number) =>
    padX + (i * (width - padX * 2)) / Math.max(1, days - 1);
  const yFor = (h: number) => {
    const clamped = Math.max(0, Math.min(sleepMax, h));
    return height - padY - (clamped / sleepMax) * (height - padY * 2);
  };

  // Build the polyline only across known points; broken segments at gaps
  // are intentional — a gap means "no log", not "0 hours of sleep".
  const segments: string[] = [];
  let current: string | null = null;
  for (const p of points) {
    if (p.log && Number.isFinite(p.log.sleepHours)) {
      const x = xFor(p.dayOffset);
      const y = yFor(p.log.sleepHours);
      current = current ? `${current} L${x},${y}` : `M${x},${y}`;
    } else if (current) {
      segments.push(current);
      current = null;
    }
  }
  if (current) segments.push(current);

  return (
    <div className="mz-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
            {t('trend.kicker')}
          </div>
          <h2 className="text-base font-bold mt-0.5">
            {t('trend.title', { days })}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-ink-mute">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-clay" /> {t('trend.legend.sleep')}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-crimson" /> {t('trend.legend.missed')}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 w-full h-24"
        role="img"
        aria-label={t('trend.title', { days })}
      >
        {/* Horizontal reference line at 4.5h (the yellow-alert sleep threshold). */}
        <line
          x1={padX}
          x2={width - padX}
          y1={yFor(4.5)}
          y2={yFor(4.5)}
          stroke="#d4b78a"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
        {/* Sleep line. */}
        {segments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#c4663d" strokeWidth="2" strokeLinejoin="round" />
        ))}
        {/* Mood dots + missed-med markers. */}
        {points.map((p) => {
          if (!p.log) return null;
          const x = xFor(p.dayOffset);
          if (!Number.isFinite(p.log.sleepHours)) return null;
          const y = yFor(p.log.sleepHours);
          const moodColor = affectColor(p.log.affectiveState);
          const missed =
            p.log.medicationTaken === 'no' || p.log.medicationTaken === 'refused';
          return (
            <g key={p.dayKey}>
              <circle cx={x} cy={y} r={3.5} fill={moodColor} />
              {missed && (
                <rect
                  x={x - 3}
                  y={height - 6}
                  width={6}
                  height={6}
                  fill="#a13a3a"
                  transform={`rotate(45 ${x} ${height - 3})`}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex justify-between text-[10px] text-ink-mute mt-1 px-2">
        <span>{formatDayLabel(points[0].dayKey, locale)}</span>
        <span>{t('trend.today')}</span>
      </div>
    </div>
  );
}

function affectColor(s: AffectiveState): string {
  switch (s) {
    case 'euthymia':
      return '#4f7a5b'; // sage
    case 'depression':
      return '#3a5a8a';
    case 'euphoria':
      return '#c4663d'; // clay
    case 'irritability':
      return '#a13a3a';
    default:
      return '#7a7a7a';
  }
}

function formatDayLabel(ts: number, locale: string): string {
  return new Date(ts).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
    day: 'numeric',
    month: 'numeric',
  });
}
