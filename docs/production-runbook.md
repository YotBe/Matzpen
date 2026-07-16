# Production Runbook — Matzpen

This document is what stands between today's preview deployment and a real
deployment serving real caregivers. Follow it in order. Each section is
~15–30 minutes.

## 0. Prerequisites

- Domain you control (e.g. `matzpen.org.il`).
- Credit cards on file for: Vercel, Supabase, Google AI Studio (Gemini),
  PostHog, Sentry, Upstash. Free tiers cover the cohort of 5–10 caregivers
  for at least 3 months.
- A second engineer ready to do the smoke test from a different account.

## 1. Supabase production project

1. Create a new Supabase project (NOT a branch). Region: `eu-central-1`
   (Frankfurt) is closest to Israel and inside the EU for GDPR.
2. Apply migrations **in order**:

   ```
   20260511_golden_record_patient_identity.sql
   20260512_golden_record_region.sql
   20260512_rls_and_patient_ownership.sql
   20260513_round2_envelope_extensions.sql
   20260514_envelope_and_war_room.sql
   20260515_lockdown_pulse_vault.sql
   20260516_golden_record_caregiver_backfill.sql
   20260517_warning_signs.sql
   20260518_envelope_existing_tables.sql
   20260519_push_subscriptions.sql
   20260520_token_cleanup.sql
   ```

3. Enable email/password auth + Google OAuth (the login page expects
   both). Set the site URL to your production domain.
4. Storage: confirm the `vault` bucket exists (the 20260515 migration
   creates it) and is private.
5. From Project Settings → API, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Third-party services

### Google Gemini API
- Create a key at AI Studio: `GOOGLE_GENERATIVE_AI_API_KEY`.
- Set monthly budget alerts at $10 / $25 / $50.

### PostHog
- New project, EU host (`https://eu.i.posthog.com`).
- Copy the project key: `NEXT_PUBLIC_POSTHOG_KEY` and host:
  `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`.

### Sentry
- New project, type `Next.js`.
- Copy the DSN: `NEXT_PUBLIC_SENTRY_DSN`.
- Optional, only if you want sourcemap uploads: set `SENTRY_ORG`,
  `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

### Upstash Redis (rate limit)
- Create a free Redis instance, region `eu-west-1`.
- Copy: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.

### VAPID keys (web push)
- Locally run `npx web-push generate-vapid-keys`.
- Public key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
- Private key → `VAPID_PRIVATE_KEY` (server-only; never commit).
- Subject → `VAPID_SUBJECT=mailto:ops@yourdomain.org`.

## 3. Vercel production deploy

1. Connect the GitHub repo. Production branch: whatever you merge PR #12
   into (likely `main`).
2. Framework preset: Next.js (auto-detected).
3. Project Settings → Environment Variables. Add all of the above for
   the `Production` environment:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   GOOGLE_GENERATIVE_AI_API_KEY
   NEXT_PUBLIC_POSTHOG_KEY
   NEXT_PUBLIC_POSTHOG_HOST
   NEXT_PUBLIC_SENTRY_DSN
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   NEXT_PUBLIC_VAPID_PUBLIC_KEY
   VAPID_PRIVATE_KEY
   VAPID_SUBJECT
   NEXT_PUBLIC_CONTACT_EMAIL
   NEXT_PUBLIC_APP_URL
   ```
   (`NEXT_PUBLIC_APP_URL` = the production origin, e.g.
   `https://matzpen.org.il` — used for canonical/OG metadata. The full
   annotated list lives in `.env.example`.)
4. Add the custom domain. Wait for DNS to verify.
5. Trigger a production deploy.

## 4. Post-deploy smoke test (do this from two devices)

### Caregiver A
1. Open the production URL in an **incognito** window. Sign up with a
   real email and accept the consent checkbox.
2. Visit `/golden-record`. Fill in patient name, region, city,
   diagnosis, 1 medication, 3 warning-sign phrases. Save. **The
   dashboard banner should disappear within 2 seconds of returning to
   `/`.**
3. Submit a daily log with sleep = 3h, mood = irritability, activity = 5,
   one personal warning sign marked. **Trend chart should update.**
4. Submit a SECOND daily log the next day (or fudge `createdAt` via the
   Supabase dashboard) → confirm AlertBanner turns YELLOW.
5. Click `/lockdown` from the dashboard banner → check 3 items → confirm
   "done by you" attribution shows.
6. `/war-room` → Envelope tab → create an invite. Copy the link.

### Caregiver B (different incognito window, different email)
7. Sign up with the invite link. Land back in the war room. Confirm
   you see Caregiver A's items (logs, lockdown progress, etc).
8. From `/war-room`, click "enable notifications", grant permission.
9. Back to Caregiver A → fire a Backup SOS with a message.
10. **Caregiver B should receive a push notification** even with the
    war-room tab closed.

### Both
11. Open `/safety`, `/playbook`, `/case-studies`, `/post-discharge`,
    `/vault` — each should load with no console errors.
12. `/vault` → record a 5-second audio clip → upload. Confirm it appears
    with a working signed-URL playback.
12b. Caregiver A → `/golden-record` → create a share link. Open it in a
    THIRD incognito window with **no login**. The record must render
    without redirecting to `/login` (this is the ER-doctor path), and the
    response must carry an `X-Robots-Tag: noindex` header (check the
    Network tab).
12c. While signed out, open `/terms` and `/privacy` directly — both must
    load without a login redirect (the sign-up consent checkbox links
    there).

### Operator (you)
13. PostHog → Live Events: verify `daily_log_submitted`,
    `shift_created`, `vault_file_uploaded`, etc. firing.
14. Sentry → force an error from a fresh tab (e.g. visit
    `/api/chat?explode=1` if you add a debug route, or just leave it
    quiet for now and watch for organic errors over the first week).
15. Supabase → Auth → Users — confirm both test users exist.
16. Supabase → Database → Tables — spot-check that
    `patient_envelopes` has both Caregiver A (role=owner) and Caregiver B
    (role=caregiver) for the same `patient_id`.

If any of these steps fails, **do not invite real caregivers** until the
failure is understood.

## 5. Build the PostHog insights (Round 3 #1 payoff)

1. **Weekly route opens** — line chart, X = week, Y = `$pageview` count,
   broken down by `$pathname`. Save as "Route popularity by week".
2. **Daily-log retention** — funnel: `signed_up` → `daily_log_submitted` →
   `daily_log_submitted` repeat after 7 days → after 14 → after 28.
3. **Envelope size** — bar chart, `envelope_invite_redeemed` per
   distinct patient_id grouped. Tells you "are envelopes plural?"
4. **SOS funnel** — funnel: `backup_request_sent` → preceded by
   `push.optIn.cta` in the last 30 days.

## 6. Recruit + observe (4 weeks)

1. Reach out to ENOSH-משפחות / OZMA family forums. Pitch: "free
   private-beta access to a coordination app for families managing
   psychiatric crises; we'll talk to you weekly and stop you if we ship
   anything that hurts."
2. Onboard 5–10 caregivers in two waves of 5 (so cohort 2 benefits from
   cohort 1's friction reports).
3. Office hours: a 30-min call each Wednesday with anyone who wants to
   show up.
4. Bug-report channel: a single `mailto:` link in the app footer (use
   `NEXT_PUBLIC_CONTACT_EMAIL`) + an emoji react in your Slack DM.

## 6.5. Schedule token cleanup

Migration `20260520_token_cleanup.sql` installs three SQL functions —
`cleanup_expired_share_tokens()`, `cleanup_expired_envelope_invites()`,
and `cleanup_expired_tokens()` (calls both). Wire them to run weekly via
one of:

- **Supabase scheduled edge function** — easiest. Create a tiny function
  that runs `select public.cleanup_expired_tokens();` and schedule it
  in the dashboard.
- **pg_cron** — if you've enabled the extension:
  ```sql
  select cron.schedule(
    'matzpen-cleanup-tokens',
    '0 4 * * 0',
    $$ select public.cleanup_expired_tokens(); $$
  );
  ```
- **Manual** — run the SQL from the dashboard each week if you don't
  want extra infra. Acceptable while the cohort is small.

## 6.6. Troubleshooting: Golden Record save errors

If a user reports that the "who are you caring for" form fails to save,
the error banner above the submit button now shows the actual Postgres
message (after the fix in commit replacing `instanceof Error` with the
`describeError` structural extractor). Map the banner text to the fix:

| What the banner says | Root cause | Fix |
|---|---|---|
| `column "X" of relation "golden_records" does not exist` (e.g. X = `region`, `city`, `discharge_date`, `next_refill_date`, `when_well_loves`, `when_well_calms`, `when_well_never_say`, `warning_signs`, `caregiver_id`) | A migration from the 20260512 → 20260517 range has not been applied to this Supabase project. | Open the Supabase SQL editor and apply migrations from `supabase/migrations/` in chronological order from 20260511 onwards. The ordered list is in **section 1** above. |
| `new row violates row-level security policy "golden_records_*"` or `permission denied for table golden_records` | The RLS migration `20260512_rls_and_patient_ownership.sql` is applied but the legacy backfill is missing → an existing row has `caregiver_id = NULL` and the UPDATE policy rejects the upsert. | Run `20260516_golden_record_caregiver_backfill.sql` (idempotent — safe to re-run). If the user is a brand-new sign-up, this shouldn't trigger. |
| `relation "public.golden_records" does not exist` | The base schema was never created on this Supabase project. | The schema is created implicitly by the migrations. Apply 20260511 first; the table is added by the initial migration the user ran when the project was provisioned. |
| `JWT expired` / `Invalid JWT` | Stale auth session. | Have the user sign out and sign back in. |
| Anything else | Unknown — capture the full error from the browser DevTools console (`[golden-record] save failed: …`) and check `code`, `details`, `hint`. | If it points to a specific table/column, the migration ordering is suspect. If it's a network error, check Vercel function logs. |

**To diagnose without involving the user:** open the failing deployment
in a browser with DevTools open, hit save, and copy the full
`[golden-record] save failed:` line from the console. It includes
`code`, `details`, and `hint` which the banner can't fit.

## 7. Pre-launch checklist (don't skip)

- [ ] `docs/legal-review.md` signed off — see `docs/legal-review-brief.md`.
- [ ] `docs/clinical-review.md` signed off — see `docs/clinical-review-brief.md`.
- [ ] Lawyer directory either populated with real attorneys (clear the
      `isSample: true` flags) OR confirmed-empty.
- [ ] Hospital `verifiedAt` set on every entry by an operator who
      called each number this month.
- [ ] Privacy Policy and ToS published — likely under `/privacy` and a
      new `/terms` route, both linked from the consent flow.
- [ ] Backup of the Supabase database scheduled (Settings → Database →
      Backups). Daily is enough for the cohort phase.
- [ ] Sentry alert routes set up to your email.
- [ ] PostHog weekly digest enabled.

## What's deliberately deferred

- Native iOS / Android apps — PWA + push is enough.
- Multi-org / patient-side login — wait for cohort feedback.
- E2E client encryption for vault — server-side at-rest is honest
  enough given the disclosure in `vault.encryptionNote`.
- Localized law-change feed, HMO routing wizard — high maintenance
  burden, low validated value.
