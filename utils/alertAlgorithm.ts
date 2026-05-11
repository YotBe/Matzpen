import type { AlertReason, AlertResult, DailyLog } from '@/lib/types';

const SLEEP_THRESHOLD = 4.5;
const PSYCHO_THRESHOLD = 4;
const YELLOW_DAYS_FOR_RED = 5;

function newestFirst(logs: DailyLog[]): DailyLog[] {
  return [...logs].sort((a, b) => b.createdAt - a.createdAt);
}

function consecutiveFromNewest<T>(arr: T[], pred: (x: T) => boolean): number {
  let n = 0;
  for (const item of arr) {
    if (pred(item)) n += 1;
    else break;
  }
  return n;
}

export function computeAlertLevel(logs: DailyLog[]): AlertResult {
  if (!logs || logs.length === 0) {
    return { level: 'STABLE', reasons: [] };
  }

  const sorted = newestFirst(logs);
  const reasons: AlertReason[] = [];

  const yellowStreak = consecutiveFromNewest(
    sorted,
    (l) => l.sleepHours < SLEEP_THRESHOLD && l.psychomotorSpeed >= PSYCHO_THRESHOLD,
  );
  const impulseStreak = consecutiveFromNewest(sorted, (l) => l.impulsivityEvent === true);

  let level: AlertResult['level'] = 'STABLE';

  if (yellowStreak >= 2) {
    level = 'YELLOW_ALERT';
    reasons.push({
      key: 'alert.reason.sleepActivity',
      vars: { days: yellowStreak, hours: SLEEP_THRESHOLD },
    });
  }

  if (yellowStreak >= YELLOW_DAYS_FOR_RED) {
    level = 'RED_ALERT';
    reasons.push({ key: 'alert.reason.yellowCrossed', vars: { days: yellowStreak } });
  }

  if (impulseStreak >= 2) {
    level = 'RED_ALERT';
    reasons.push({ key: 'alert.reason.impulsivityStreak', vars: { days: impulseStreak } });
  }

  return { level, reasons };
}
