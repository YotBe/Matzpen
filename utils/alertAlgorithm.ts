import type { AlertReason, AlertResult, DailyLog } from '@/lib/types';

const SLEEP_THRESHOLD = 4.5;
const SLEEP_RED_WITH_MEDS_THRESHOLD = 4;
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

function escalate(
  current: AlertResult['level'],
  next: AlertResult['level'],
): AlertResult['level'] {
  const rank = { STABLE: 0, YELLOW_ALERT: 1, RED_ALERT: 2 } as const;
  return rank[next] > rank[current] ? next : current;
}

export function computeAlertLevel(logs: DailyLog[]): AlertResult {
  if (!logs || logs.length === 0) {
    return { level: 'STABLE', reasons: [] };
  }

  const sorted = newestFirst(logs);
  const reasons: AlertReason[] = [];

  const yellowStreak = consecutiveFromNewest(
    sorted,
    (l) =>
      Number.isFinite(l.sleepHours) &&
      l.sleepHours < SLEEP_THRESHOLD &&
      l.psychomotorSpeed >= PSYCHO_THRESHOLD,
  );
  const impulseStreak = consecutiveFromNewest(sorted, (l) => l.impulsivityEvent === true);
  // Medication non-adherence: explicit "no" or "refused" (unknown/undefined doesn't count).
  const medMissStreak = consecutiveFromNewest(
    sorted,
    (l) => l.medicationTaken === 'no' || l.medicationTaken === 'refused',
  );

  let level: AlertResult['level'] = 'STABLE';

  if (yellowStreak >= 2) {
    level = escalate(level, 'YELLOW_ALERT');
    reasons.push({
      key: 'alert.reason.sleepActivity',
      vars: { days: yellowStreak, hours: SLEEP_THRESHOLD },
    });
  }

  if (yellowStreak >= YELLOW_DAYS_FOR_RED) {
    level = escalate(level, 'RED_ALERT');
    reasons.push({ key: 'alert.reason.yellowCrossed', vars: { days: yellowStreak } });
  }

  if (impulseStreak >= 2) {
    level = escalate(level, 'RED_ALERT');
    reasons.push({ key: 'alert.reason.impulsivityStreak', vars: { days: impulseStreak } });
  }

  // Medication adherence: 2+ consecutive missed days → YELLOW on its own; if any
  // of those days also had sleep < 4h, escalate to RED.
  if (medMissStreak >= 2) {
    level = escalate(level, 'YELLOW_ALERT');
    reasons.push({ key: 'alert.reason.medsMissed', vars: { days: medMissStreak } });

    const missedDaysWithLowSleep = sorted
      .slice(0, medMissStreak)
      .some(
        (l) =>
          Number.isFinite(l.sleepHours) &&
          l.sleepHours < SLEEP_RED_WITH_MEDS_THRESHOLD,
      );
    if (missedDaysWithLowSleep) {
      level = escalate(level, 'RED_ALERT');
      reasons.push({
        key: 'alert.reason.medsMissedLowSleep',
        vars: { hours: SLEEP_RED_WITH_MEDS_THRESHOLD },
      });
    }
  }

  return { level, reasons };
}
