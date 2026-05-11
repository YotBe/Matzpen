import type { AlertReason, AlertResult, DailyLog } from '@/lib/types';

// IMPORTANT: these thresholds are NOT clinical guidelines.
//
// They are observational heuristics derived from caregiver-reported patterns
// commonly associated with mood-episode prodromes in bipolar I (sustained
// short sleep + accelerated psychomotor activity; medication non-adherence
// preceding relapse). They have not been validated against any psychiatric
// study, do not account for individual baselines (chronic insomniacs,
// shift workers, post-partum), and are intended only as a nudge to call the
// treating clinician — never as a diagnostic or triage signal.
//
// Any change to these numbers should be reviewed by a clinician and the
// rationale recorded here. They are also surfaced in the UI (see the
// "How is this calculated?" panel in AlertBanner) so caregivers can judge
// the alert against their patient's normal baseline.
export const ALERT_THRESHOLDS = {
  sleepHours: 4.5,
  sleepHoursWithMissedMeds: 4,
  psychomotorActivity: 4,
  yellowDaysForRed: 5,
  consecutiveImpulsivityDaysForRed: 2,
  consecutiveMissedMedDaysForYellow: 2,
} as const;

const SLEEP_THRESHOLD = ALERT_THRESHOLDS.sleepHours;
const SLEEP_RED_WITH_MEDS_THRESHOLD = ALERT_THRESHOLDS.sleepHoursWithMissedMeds;
const PSYCHO_THRESHOLD = ALERT_THRESHOLDS.psychomotorActivity;
const YELLOW_DAYS_FOR_RED = ALERT_THRESHOLDS.yellowDaysForRed;

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
