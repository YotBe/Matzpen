'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/LocaleProvider';

interface Props {
  // ISO date string from GoldenRecord.nextRefillDate.
  nextRefillDate: string | null | undefined;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Surfaces on the dashboard when the saved refill date is within 3 days,
// today, or already overdue. Stays silent the rest of the time.
export function RefillBanner({ nextRefillDate }: Props) {
  const { t, locale } = useT();
  if (!nextRefillDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${nextRefillDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const daysLeft = Math.round((target.getTime() - today.getTime()) / DAY_MS);
  if (daysLeft > 3) return null;

  const overdue = daysLeft < 0;
  const due = daysLeft === 0;
  const dateLabel = target.toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US');

  const tone = overdue
    ? 'bg-crimson-bg border-crimson/30 text-crimson-deep'
    : due
      ? 'bg-amber_-bg border-amber_/30 text-amber_-ink'
      : 'bg-sand-100 border-sand-100 text-ink-soft';

  const body = overdue
    ? t('refill.overdue', { date: dateLabel, n: Math.abs(daysLeft) })
    : due
      ? t('refill.dueToday', { date: dateLabel })
      : t('refill.upcoming', { date: dateLabel, n: daysLeft });

  return (
    <aside className={`rounded-2xl border ${tone} px-4 py-3`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide opacity-80">
            {t('refill.kicker')}
          </div>
          <p className="text-sm mt-1 leading-relaxed">{body}</p>
        </div>
        <Link
          href="/golden-record"
          className="text-xs font-semibold underline whitespace-nowrap"
        >
          {t('refill.updateCta')}
        </Link>
      </div>
    </aside>
  );
}
