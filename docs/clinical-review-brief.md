# Clinical Review Brief — Matzpen

> Hand this to a psychiatrist (and ideally a clinical social worker too)
> for a one-time content review. Budget: a 90-minute consult.

## Who we're looking for

A psychiatrist who has worked with **families** of patients with serious
mental illness (bipolar I, schizophrenia spectrum, major depression with
psychosis). Community-clinic experience is more useful than inpatient
only — the app's audience is families managing crises at home.

### Where to find them

- **ENOSH and OZMA** maintain panels of clinicians who consult on
  caregiver-facing content. Ask them.
- **Israeli Psychiatric Association** (האיגוד הפסיכיאטרי הישראלי) — board
  members of the family-and-community subcommittee.
- **Community Mental Health Centers** affiliated with the kupot — Geha,
  Be'er Yaakov, Shalvata each have at least one attending who lectures
  publicly on family work.
- **Bonus:** a clinical social worker (עו"ס קליני/ת) attached to a
  psychiatric ward — their day job IS caregiver communication.

Realistic fee: a few hours' work, ₪1,500–₪3,000.

## What we need them to read

| File / page | What to check |
|---|---|
| **`utils/alertAlgorithm.ts`** + `components/AlertBanner.tsx` | The yellow/red alert thresholds. Currently: sleep < 4.5h + activity ≥ 4 for 2 days → YELLOW; same pattern for 5 days → RED; 2+ days impulsivity → RED; medication missed 2+ days → YELLOW; missed + sleep < 4h → RED; personal warning signs marked 2 days → YELLOW, 4 → RED. **Are these reasonable nudges, or false-alert generators?** Specifically: chronic insomniacs, shift workers, postpartum patients. |
| **`app/playbook/page.tsx`** + Hebrew strings under `playbook.*` | LEAP-based scripts for 6 scenarios. Specifically the WORDING in `playbook.paranoid.script`, `playbook.grandiosity.script`, `playbook.refusalMeds.script`, `playbook.suicidal.script`. **Would you say these phrases to a family, or would they harm rapport?** |
| **`app/safety/page.tsx`** | Lethal-means restriction. Item-by-item review of meds / firearms / sharps / car keys / disposal. The "what to say" scripts (e.g. `safety.item.medsScript`) — defensible? |
| **`app/post-discharge/page.tsx`** + `lib/postDischarge/timeline.ts` | 30-day post-discharge timeline: 6 phases, 18 items. Are we missing high-leverage items? Are we including any item that's been shown to harm? |
| **`app/api/chat/route.ts`** SYSTEM_PROMPT | The AI assistant's instructions. Rule 2 (crisis protocol) and Rule 2a (when to suggest specific Matzpen tools) — does this match how a clinician would coach a family member by phone? |
| **`components/BurnoutBanner.tsx`** + `services/pulseService.ts:detectBurnout` | Rules: any caregiver reporting 0h sleep, OR sole-active for 48h in an envelope of ≥2. **Are these the right signals?** What else should trigger family-level concern? |
| **`app/case-studies/page.tsx`** + `lib/caseStudies/cases.ts` | 6 anonymized composite scenarios. Are the "actions taken" and "key takeaway" entries clinically responsible? Any case mixing two presentations that should be split? |

## Specific questions to ask

1. **The alert algorithm.** What's the highest-leverage tweak — adding a "consecutive missed therapy appointment" signal? An "elevated sleep" (> 12h for depression) branch? Better calibration of the sleep threshold by diagnosis?
2. **The playbook.** Are there scenarios we should NOT include because the family is wrong to engage at all (e.g. acute mania → just call 100/101, don't try to talk down)? Are there scenarios we're missing (e.g. catatonia, dissociation)?
3. **Lethal-means scripts.** The "I'm putting your meds in a locked cabinet" wording — research-backed, or paternalistic in ways that backfire?
4. **Vault evidence.** Caregivers record audio/video of the patient. Is this clinically useful when handed to an ER team or community psychiatrist? What format / length is actually helpful?
5. **Burnout signals.** The current rules are observational. Is there a validated brief instrument (Zarit-4, CES-10 short) we should swap in for the mood 1–5 picker?
6. **Disclaimers in the app.** Where should we tighten the "not a clinical instrument" language so it doesn't drift into being read as one?

## What we want back

A short written memo with:

1. **Threshold and wording changes** — concrete line edits to the files above.
2. **Items the app should NOT do** — features to remove or de-emphasize.
3. **Items the app SHOULD do** that aren't in scope yet — but only if they're high-leverage.
4. **An explicit "OK to put this in front of caregivers" statement** to store at `docs/clinical-review.md`, with the reviewer's name and date.

## What we'll give the reviewer

- Access to the latest preview deployment.
- This brief.
- A copy of the alert algorithm's test cases (`utils/alertAlgorithm.test.ts`) so they can see the threshold behavior in plain language.
