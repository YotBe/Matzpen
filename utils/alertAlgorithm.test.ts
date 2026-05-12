import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ALERT_THRESHOLDS, computeAlertLevel } from './alertAlgorithm';
import type { DailyLog } from '../lib/types';

const DAY = 24 * 60 * 60 * 1000;
let counter = 0;
function log(overrides: Partial<DailyLog> = {}): DailyLog {
  counter += 1;
  return {
    patientId: 'p',
    loggedBy: 'tester',
    sleepHours: 7,
    affectiveState: 'euthymia',
    psychomotorSpeed: 3,
    impulsivityEvent: false,
    medicationTaken: 'yes',
    createdAt: Date.UTC(2026, 0, 1) - counter * DAY,
    ...overrides,
  };
}

describe('computeAlertLevel', () => {
  it('returns STABLE when there are no logs', () => {
    const r = computeAlertLevel([]);
    assert.equal(r.level, 'STABLE');
    assert.deepEqual(r.reasons, []);
  });

  it('returns STABLE for normal logs', () => {
    const r = computeAlertLevel([log(), log(), log()]);
    assert.equal(r.level, 'STABLE');
  });

  it('escalates to YELLOW after 2 consecutive low-sleep + high-activity days', () => {
    const r = computeAlertLevel([
      log({ sleepHours: 4, psychomotorSpeed: 5 }),
      log({ sleepHours: 4, psychomotorSpeed: 5 }),
    ]);
    assert.equal(r.level, 'YELLOW_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.sleepActivity'));
  });

  it('does not fire YELLOW for a single low-sleep day', () => {
    const r = computeAlertLevel([
      log({ sleepHours: 4, psychomotorSpeed: 5 }),
      log({ sleepHours: 7, psychomotorSpeed: 3 }),
    ]);
    assert.equal(r.level, 'STABLE');
  });

  it('escalates YELLOW to RED after sustained streak', () => {
    const days = Array.from({ length: ALERT_THRESHOLDS.yellowDaysForRed }, () =>
      log({ sleepHours: 3, psychomotorSpeed: 5 }),
    );
    const r = computeAlertLevel(days);
    assert.equal(r.level, 'RED_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.yellowCrossed'));
  });

  it('treats missing sleep (NaN) as unknown, not as zero', () => {
    const r = computeAlertLevel([
      log({ sleepHours: NaN, psychomotorSpeed: 5 }),
      log({ sleepHours: NaN, psychomotorSpeed: 5 }),
    ]);
    assert.equal(r.level, 'STABLE', 'missing sleep must not trigger an alert');
  });

  it('flags RED when 2+ consecutive impulsivity events are reported', () => {
    const r = computeAlertLevel([
      log({ impulsivityEvent: true }),
      log({ impulsivityEvent: true }),
    ]);
    assert.equal(r.level, 'RED_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.impulsivityStreak'));
  });

  it('flags YELLOW when meds are skipped 2+ days', () => {
    const r = computeAlertLevel([
      log({ medicationTaken: 'no' }),
      log({ medicationTaken: 'refused' }),
    ]);
    assert.equal(r.level, 'YELLOW_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.medsMissed'));
  });

  it('escalates missed meds to RED if any of those days also had < 4h sleep', () => {
    const r = computeAlertLevel([
      log({ medicationTaken: 'no', sleepHours: 3 }),
      log({ medicationTaken: 'no', sleepHours: 6 }),
    ]);
    assert.equal(r.level, 'RED_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.medsMissedLowSleep'));
  });

  it("'unknown' medication answer does not count as missed", () => {
    const r = computeAlertLevel([
      log({ medicationTaken: 'unknown' }),
      log({ medicationTaken: 'unknown' }),
    ]);
    assert.equal(r.level, 'STABLE');
  });

  it('only counts consecutive streaks from the newest log', () => {
    const r = computeAlertLevel([
      log({ sleepHours: 7, psychomotorSpeed: 3 }),
      log({ sleepHours: 3, psychomotorSpeed: 5 }),
      log({ sleepHours: 3, psychomotorSpeed: 5 }),
    ]);
    assert.equal(r.level, 'STABLE', 'breaking the streak with a normal day must reset');
  });

  it('escalates to YELLOW after 2 days of personalized warning signs', () => {
    const r = computeAlertLevel([
      log({ warningSignsHit: ['s1'] }),
      log({ warningSignsHit: ['s2'] }),
    ]);
    assert.equal(r.level, 'YELLOW_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.personalSigns'));
  });

  it('escalates personalized streak to RED after 4 days', () => {
    const r = computeAlertLevel([
      log({ warningSignsHit: ['s1'] }),
      log({ warningSignsHit: ['s2'] }),
      log({ warningSignsHit: ['s1'] }),
      log({ warningSignsHit: ['s3'] }),
    ]);
    assert.equal(r.level, 'RED_ALERT');
    assert.ok(r.reasons.some((x) => x.key === 'alert.reason.personalSignsRed'));
  });

  it('does not fire personalized escalation when warningSignsHit is empty', () => {
    const r = computeAlertLevel([
      log({ warningSignsHit: [] }),
      log({ warningSignsHit: [] }),
    ]);
    assert.equal(r.level, 'STABLE');
  });
});
