'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { computeAlertLevel } from '@/utils/alertAlgorithm';
import { AlertIcon, ChevronEnd, ShieldIcon } from '@/components/icons';
import type { DailyLog } from '@/lib/types';

interface Props {
  logs: DailyLog[];
}

export function AlertBanner({ logs }: Props) {
  const result = useMemo(() => computeAlertLevel(logs), [logs]);

  if (result.level === 'STABLE') {
    return (
      <div className="rounded-2xl bg-sage-bg/70 text-sage border border-sage/20 px-4 py-3 flex items-start gap-3">
        <ShieldIcon size={20} className="mt-0.5 text-sage" />
        <div>
          <div className="font-semibold text-sm">המצב יציב</div>
          <div className="text-xs text-ink-soft mt-0.5">
            המדדים בטווח הנורמלי. המשיכו במעקב יומי.
          </div>
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
            התראה צהובה · חלון הזדמנויות פתוח
          </div>
          <div className="font-semibold text-base mt-1 leading-snug">
            שים לב: זוהתה ירידה משמעותית בשעות השינה ועלייה בקצב הפעילות. מומלץ ליצור קשר עם הרופא המטפל בקהילה להתאמת טיפול.
          </div>
          {result.reasons.length > 0 && (
            <ul className="mt-2 text-xs space-y-0.5 list-disc ps-5">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
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
            התראה אדומה · הסלמה במדדים
          </div>
          <div className="font-semibold text-base mt-1 leading-snug">
            נראה שישנה הסלמה במדדים. אנא שקול מעבר למודול חירום או פנייה מיידית לעזרה מקצועית.
          </div>
          {result.reasons.length > 0 && (
            <ul className="mt-2 text-xs space-y-0.5 list-disc ps-5">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Link
        href="/emergency"
        className="mt-3 inline-flex w-full justify-between items-center gap-2 bg-white text-crimson-deep font-bold rounded-xl px-4 py-3"
      >
        <span>פתח את מודול החירום</span>
        <ChevronEnd size={20} />
      </Link>
    </div>
  );
}
