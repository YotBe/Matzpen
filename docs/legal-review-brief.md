# Legal Review Brief — Matzpen

> Hand this to a mental-health attorney you retain for a one-time review.
> Budget: a single 60–90 minute consult should suffice. Repeat once a year.

## Who we're looking for

An Israeli attorney with practical experience in **at least three** of:

- Mental-health law (חוק טיפול בחולי נפש, תשנ"א-1991)
- Family-court guardianship orders (חוק הכשרות המשפטית והאפוטרופסות)
- Privacy law (חוק הגנת הפרטיות) and HIPAA-equivalent thinking for health data
- Consumer/SaaS terms of service drafting
- Cross-border data transfer (Supabase + Google Gemini are US-hosted)

Bonus if they've worked with ENOSH / OZMA / Bizchut on family-side advocacy.

### Where to find them

- **Israel Bar Association — Mental Health Law Forum** (ועדת בריאות הנפש בלשכה).
- **ENOSH legal helpline** (the staff attorney will refer you).
- **Bizchut (בזכות)** — Center for Human Rights of People with Disabilities.
- **Faculty connections** at the Tel Aviv University / Hebrew University law clinics that handle psychiatric-rights cases.

Realistic fee for a fixed-scope review: ₪1,800–₪3,500 inclusive.

## What we need them to read

(Approx. 25 pages worth — they can skim the rest.)

| File / page | What to check |
|---|---|
| **`app/safety/page.tsx`** + Hebrew translations under `safety.*` | The lethal-means restriction guide. Does any phrasing advise something a caregiver could be sued for? (e.g. removing a firearm without the patient's knowledge) |
| **`app/legal-shield/page.tsx`** + `lib/legalShield/templates.ts` | Three court-filing templates (guardianship, credit freeze, exit ban). Verify the legal citations (sections of the Capacity & Guardianship Law). Confirm the disclaimer wording covers us when a caregiver files unmodified. |
| **`app/emergency/page.tsx`** | Decision-tree wording for calling 100 / 101 / district psychiatrist. Any liability around the "psychiatric hospitalization without consent" script? |
| **`app/playbook/page.tsx`** + `lib/playbook/scripts.ts` | LEAP-based de-escalation scripts. Specifically: the `suicidal_ideation` script tells caregivers what NOT to say ("I won't tell anyone"). Is that wording defensible if a caregiver follows it and the patient self-harms? |
| **`app/login/page.tsx`** — sign-up consent checkbox | Translation key `login.consentLabel`. Is this enough for informed consent under Israeli health-data law + GDPR-equivalent? |
| **`app/api/chat/route.ts`** SYSTEM_PROMPT (Hebrew) | The AI assistant's instructions. Specifically rules 1–4 (no prescribing, crisis protocol, no inventing laws, privacy). Does the prompt expose us to "the AI told my client to do X" liability? |
| **`app/vault/page.tsx`** + translation key `vault.encryptionNote` | Caregivers upload audio/video of erratic behavior. Encryption is server-side only. Is the disclosure sufficient? Any consent requirement from the *patient* whose behavior is being recorded? |
| **`app/share/[token]/page.tsx`** | Time-bound public-URL view of the medical record. Liability if a token leaks? |

## Specific questions to ask

1. **Patient consent for vault recordings.** Israeli wiretapping / privacy law: does a caregiver need explicit consent from a person with a psychiatric diagnosis to record them in their own home? Does it matter if the recording is shown only to clinicians?
2. **Court-filing template liability.** If a caregiver prints a template, signs it, and a judge rejects it for a procedural error — does Matzpen carry any exposure? Is the disclaimer in `legal.printable.disclaimer` enough?
3. **AI assistant.** The system prompt forbids prescribing/diagnosing, but the assistant nevertheless answers questions adjacent to medical advice (sleep, side effects, when to call a psychiatrist). What additional safe-harbor language is needed?
4. **Cross-border data transfer.** Supabase data resides in (likely) Frankfurt or Singapore depending on the project. Gemini calls resolve in US. Israeli health data — does this need a specific data-processing agreement or notice?
5. **Terms of Service.** We don't have one. What's the minimum viable ToS that covers caregiver tools without overpromising?
6. **Liability for stale lawyer / hospital data.** A caregiver calls a phone number from `lib/legalShield/lawyers.ts` (currently sample data) — what's our exposure? What disclaimer wording closes it?

## What we want back

A short written memo with:

1. **Red-flag items** that must change before launch, with proposed language.
2. **Yellow-flag items** to fix within 30 days post-launch.
3. **A drafted Terms of Service + Privacy Policy** — or a referral if drafting is out of scope.
4. **An explicit "OK to launch with these changes" statement** the project can store at `docs/legal-review.md`.

## What we'll give the reviewer

- Access to the latest preview deployment of `claude/project-feedback-xn1Yn`.
- This brief.
- Sample data the app will populate (golden record + a daily log + a generated court filing).
