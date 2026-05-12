// Post-discharge 30-day timeline.
//
// Research-backed observation: the first 30 days after a psychiatric
// inpatient stay carry the highest re-admit and self-harm risk. The phases
// below are not a clinical protocol — they're a structured caregiver
// checklist that aligns with what discharge planners typically recommend.

export type Phase = {
  // Day offset window from the discharge date.
  fromDay: number;
  toDay: number;
  // i18n key for the phase title (e.g. "Day 0–3").
  titleKey: string;
  // i18n key for the phase intent (one short sentence).
  intentKey: string;
  items: { id: string; labelKey: string; hintKey?: string }[];
};

export const POST_DISCHARGE_PHASES: Phase[] = [
  {
    fromDay: 0,
    toDay: 2,
    titleKey: 'postDischarge.phase.day0.title',
    intentKey: 'postDischarge.phase.day0.intent',
    items: [
      { id: 'discharge_summary', labelKey: 'postDischarge.item.dischargeSummary' },
      { id: 'meds_7day_supply', labelKey: 'postDischarge.item.meds7day' },
      { id: 'next_appt_booked', labelKey: 'postDischarge.item.bookNextAppt' },
      { id: 'home_safety_swept', labelKey: 'postDischarge.item.homeSafety', hintKey: 'postDischarge.item.homeSafetyHint' },
    ],
  },
  {
    fromDay: 3,
    toDay: 6,
    titleKey: 'postDischarge.phase.day3.title',
    intentKey: 'postDischarge.phase.day3.intent',
    items: [
      { id: 'follow_up_confirmed', labelKey: 'postDischarge.item.followUpConfirmed' },
      { id: 'family_routine', labelKey: 'postDischarge.item.familyRoutine' },
      { id: 'sleep_logged_3days', labelKey: 'postDischarge.item.sleepLogged' },
    ],
  },
  {
    fromDay: 7,
    toDay: 13,
    titleKey: 'postDischarge.phase.day7.title',
    intentKey: 'postDischarge.phase.day7.intent',
    items: [
      { id: 'first_outpatient_visit', labelKey: 'postDischarge.item.firstOutpatient' },
      { id: 'escalation_if_missed', labelKey: 'postDischarge.item.escalationScript', hintKey: 'postDischarge.item.escalationScriptHint' },
      { id: 'side_effects_logged', labelKey: 'postDischarge.item.sideEffects' },
    ],
  },
  {
    fromDay: 14,
    toDay: 20,
    titleKey: 'postDischarge.phase.day14.title',
    intentKey: 'postDischarge.phase.day14.intent',
    items: [
      { id: 'refill_scheduled', labelKey: 'postDischarge.item.refillScheduled' },
      { id: 'second_visit_booked', labelKey: 'postDischarge.item.secondVisit' },
      { id: 'community_re_engage', labelKey: 'postDischarge.item.communityReengage' },
    ],
  },
  {
    fromDay: 21,
    toDay: 29,
    titleKey: 'postDischarge.phase.day21.title',
    intentKey: 'postDischarge.phase.day21.intent',
    items: [
      { id: 'sick_leave_paperwork', labelKey: 'postDischarge.item.sickLeave' },
      { id: 'insurance_claim_started', labelKey: 'postDischarge.item.insuranceClaim' },
      { id: 'return_to_work_plan', labelKey: 'postDischarge.item.returnPlan' },
    ],
  },
  {
    fromDay: 30,
    toDay: 90,
    titleKey: 'postDischarge.phase.day30.title',
    intentKey: 'postDischarge.phase.day30.intent',
    items: [
      { id: 'three_month_review', labelKey: 'postDischarge.item.threeMonthReview' },
      { id: 'family_debrief', labelKey: 'postDischarge.item.familyDebrief' },
      { id: 'warning_signs_updated', labelKey: 'postDischarge.item.warningSignsUpdated' },
    ],
  },
];

// The post-discharge checklist lives under the existing checklist_items
// table to inherit RLS for free. We use a synthetic section key.
export const POST_DISCHARGE_SECTION = 'post_discharge_30day' as const;

export function dayOffsetFrom(dischargeDate: string | undefined | null): number | null {
  if (!dischargeDate) return null;
  const d = new Date(`${dischargeDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
}
