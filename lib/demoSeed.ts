import type { DailyLog } from '@/lib/types';
import { MOCK_PATIENT_ID } from '@/lib/constants';

// Coherent 14-day demo dataset used when PREVIEW_MODE_ENABLED is true.
// Tells one narrative arc: stable week, mounting sleep deficit, missed
// medication, a clear yellow signal, an impulsive day, then beginnings
// of recovery. Built so a 5-minute investor demo can scrub through the
// trend chart and see the algorithm's logic in action.
//
// All timestamps are anchored to `now` so the chart always shows
// "the last 14 days" regardless of when the demo is run.

const DAY = 24 * 60 * 60 * 1000;
const now = () => Date.now();

interface DemoEntry {
  daysAgo: number;
  sleep: number;
  affect: DailyLog['affectiveState'];
  psycho: number;
  impulse: boolean;
  meds: DailyLog['medicationTaken'];
  signs?: string[];
  note?: string;
}

const DEMO_WARNING_SIGN_IDS = ['ws-1', 'ws-2', 'ws-3'];

const STORY: DemoEntry[] = [
  // Recovery phase (newest first)
  { daysAgo: 0, sleep: 6.5, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes', note: 'יום שקט. אכל ארוחה משפחתית.' },
  { daysAgo: 1, sleep: 5.5, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  { daysAgo: 2, sleep: 5.0, affect: 'irritability', psycho: 4, impulse: false, meds: 'yes', signs: ['ws-1'] },
  // Crisis peak
  { daysAgo: 3, sleep: 3.5, affect: 'euphoria', psycho: 5, impulse: true, meds: 'no', signs: ['ws-1', 'ws-2', 'ws-3'], note: 'יזם שיחות לקנייה של דירה. שיחנו עם פסיכיאטר.' },
  { daysAgo: 4, sleep: 3.0, affect: 'euphoria', psycho: 5, impulse: true, meds: 'no', signs: ['ws-1', 'ws-3'] },
  { daysAgo: 5, sleep: 4.0, affect: 'irritability', psycho: 4, impulse: false, meds: 'refused', signs: ['ws-1'] },
  { daysAgo: 6, sleep: 4.5, affect: 'irritability', psycho: 4, impulse: false, meds: 'yes', signs: ['ws-2'] },
  // Mounting deficit
  { daysAgo: 7, sleep: 5.0, affect: 'irritability', psycho: 4, impulse: false, meds: 'yes', signs: ['ws-2'] },
  { daysAgo: 8, sleep: 5.5, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  // Stable baseline
  { daysAgo: 9, sleep: 6.5, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  { daysAgo: 10, sleep: 7, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  { daysAgo: 11, sleep: 7, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  { daysAgo: 12, sleep: 6.5, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
  { daysAgo: 13, sleep: 7, affect: 'euthymia', psycho: 3, impulse: false, meds: 'yes' },
];

export const DEMO_LOGS: DailyLog[] = STORY.map((e, i) => ({
  patientId: MOCK_PATIENT_ID,
  loggedBy: i % 2 === 0 ? 'mock-mom' : 'mock-sister',
  loggedByName: i % 2 === 0 ? 'אמא' : 'אחות',
  sleepHours: e.sleep,
  affectiveState: e.affect,
  psychomotorSpeed: e.psycho,
  impulsivityEvent: e.impulse,
  medicationTaken: e.meds,
  notes: e.note,
  warningSignsHit: e.signs,
  createdAt: now() - e.daysAgo * DAY,
}));

// The personal warning signs that the multi-select in DEMO_LOGS references.
// When PREVIEW_MODE_ENABLED, the dashboard's record state can be populated
// with these so the daily-log form shows the family's actual prodrome list.
export const DEMO_WARNING_SIGNS = [
  { id: DEMO_WARNING_SIGN_IDS[0], label: 'מפסיק לענות לטלפון' },
  { id: DEMO_WARNING_SIGN_IDS[1], label: 'קונה דברים גדולים בלילה' },
  { id: DEMO_WARNING_SIGN_IDS[2], label: 'מדבר מהר על רעיונות עסקיים חדשים' },
];
