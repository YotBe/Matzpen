import type { AlertResult, DailyLog } from '@/lib/types';

const SLEEP_THRESHOLD = 4.5;
const PSYCHO_THRESHOLD = 4;
const YELLOW_DAYS_FOR_RED = 5;

// Sort logs newest-first and slice the most recent `n` entries chronologically.
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
  const reasons: string[] = [];

  // Two-consecutive-day combo of low sleep + high psychomotor speed -> YELLOW.
  const yellowStreak = consecutiveFromNewest(
    sorted,
    (l) => l.sleepHours < SLEEP_THRESHOLD && l.psychomotorSpeed >= PSYCHO_THRESHOLD,
  );

  // Standalone impulsivity streak -> RED on its own at >= 2 days.
  const impulseStreak = consecutiveFromNewest(sorted, (l) => l.impulsivityEvent === true);

  let level: AlertResult['level'] = 'STABLE';

  if (yellowStreak >= 2) {
    level = 'YELLOW_ALERT';
    reasons.push(
      `${yellowStreak} ימים רצופים של שינה מתחת ל-${SLEEP_THRESHOLD} שעות וקצב פעילות גבוה`,
    );
  }

  if (yellowStreak >= YELLOW_DAYS_FOR_RED) {
    level = 'RED_ALERT';
    reasons.push(`התראה צהובה נמשכת ${yellowStreak} ימים — חציית סף ל-RED`);
  }

  if (impulseStreak >= 2) {
    level = 'RED_ALERT';
    reasons.push(`${impulseStreak} ימים רצופים של דיווח על אירוע אימפולסיבי חריג`);
  }

  return { level, reasons };
}
