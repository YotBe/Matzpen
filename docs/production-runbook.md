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
   ```
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
