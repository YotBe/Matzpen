# Matzpen — 7-minute demo script

> Memorize this. Don't read it. The investor / partner you're pitching
> will judge product depth in the first 90 seconds of the demo. They
> will judge YOU on whether you can navigate it without fumbling.

## Setup before the meeting

1. Deploy `NEXT_PUBLIC_ENABLE_PREVIEW_MODE=true` to a staging URL (e.g. a Vercel preview). This populates the seed data in `lib/demoSeed.ts` — a coherent 14-day story with a yellow→red alert escalation.
2. Open three tabs in the SAME browser window:
   - Tab A: Dashboard (`/`).
   - Tab B: War Room (`/war-room`).
   - Tab C: Playbook (`/playbook`).
3. Have a phone ready with the same browser session, also on `/war-room`, to demonstrate live push (if VAPID + push subscription are configured).
4. Close all unrelated tabs. Disable extensions that show notifications.

## The 7-minute walk-through

Time the script in rehearsal. Cut as needed; never overrun.

### 0:00 — 1:00 · "What you're looking at"

Open Tab A. Say:

> "This is the dashboard of a family — mom and sister — caring for their 22-year-old son and brother, who has bipolar I. They've been logging for two weeks. What I want you to notice first is this graph."

Point at the **TrendChart**. Trace the sleep curve with your finger:

> "Eight stable days, then a sleep drop, then this missed-medication day, and yellow alert fires. A psychiatrist used to a 15-minute community visit can read this in 10 seconds."

### 1:00 — 2:00 · "The alert isn't generic — it's THEIRS"

Scroll to the warning-signs section of the daily log. Say:

> "Here's the part most apps get wrong. Generic alerts cry wolf for chronic insomniacs and post-partum patients. We let the family define their own warning signs."

Point at the three pills (`stops answering the phone`, `buys big things at night`, `talks fast about new business ideas`):

> "When two of those pop on consecutive days, the alert fires regardless of sleep numbers. That's the difference between an alert the family ignores and one they trust."

### 2:00 — 4:00 · "The whole envelope sees the same picture"

Switch to Tab B (`/war-room`).

> "This is what we call the envelope. Multi-caregiver. Mom signed up first, invited the sister with a one-time link. Both see the same shifts, tasks, and most importantly..."

Hover the Backup SOS:

> "...this. When mom is overwhelmed at 2am, one tap and the sister gets a push notification on her phone, app closed or open. Then she logs in here and resolves it."

If you have the phone setup: fire an SOS from Tab B, point at the phone notification. If not:

> "I'll demo the push live afterward if you want; the infrastructure is built and the API call you can see in the Network tab right now."

### 4:00 — 5:30 · "When things heat up"

Click `/lockdown` from the war-room shortcut. Show the 11-item, 4-category checklist:

> "The yellow alert from earlier triggered this. Hide car keys, secure credit cards, remove the passport, lock up alcohol and old meds. Each item shows who completed it and when — so when the sister is on shift she can ask 'wait, did mom hide the keys yet?'."

Switch to Tab C (`/playbook`):

> "And when the actual conversation happens — paranoia, grandiosity, refusal to take meds — these are LEAP-method scripts in Hebrew. Validate the feeling without agreeing with the delusion. The lines are written; the family reads, they don't improvise."

Click one card (paranoia or grandiosity), point at the script.

### 5:30 — 6:30 · "AI that knows the app"

Click into the AI Assistant (deep-link from Playbook or from nav).

> "Hebrew-native, RAG-grounded in the family's golden record. When mom asks 'what do I do about the involuntary commitment process?' it gives Israeli law citations, not generic American advice. And critically: it knows about every other tool in the app — when it detects rising mania language, it suggests the lockdown protocol; when it detects suicidality, it routes to the safety guide and 101."

Type a quick question if time permits. Otherwise skip.

### 6:30 — 7:00 · "What this is and isn't"

Close the demo. Look up. Say:

> "What you saw is a coordination tool — explicitly not a medical device. We position as a journal-and-workflow product. The HMO economic argument is straightforward: average psychiatric readmission costs ₪40,000. A 5% reduction across 1,000 families at ₪20/family/month is an 8x ROI for the kupah."

Hand them the one-pager. Stop talking.

## If they ask hard questions

- **"What's your traction?"** — "Pre-pilot. We're recruiting 10-20 caregivers through ENOSH this month for an 8-week observation. Happy to share weekly digests during the pilot if you'd like to track."
- **"Is this a medical device?"** — "No. We're a coordination tool. Diagnosis, treatment, autonomous decisions — none of those happen here. See our regulatory position memo." (Hand them `regulatory-position.md`.)
- **"What's your moat against an HMO building this internally?"** — "Two things they don't have time to build: a 6-month clinical+legal Hebrew content library, and a multi-caregiver data structure. Their innovation budgets fund 5-10 pilots a year, not rebuilds."
- **"Who's on the clinical advisory board?"** — Be honest. If empty: "We're recruiting. The clinical review brief is doubling as our recruitment tool."

## What NOT to demo

- The legal-shield module with sample lawyers. Hide it behind the `NEXT_PUBLIC_SHOW_LAWYER_DIRECTORY=false` flag (default off). Sample lawyer phone numbers are a credibility hit.
- The vault recording flow. Live mic recording during a pitch goes wrong 30% of the time. Mention it exists, skip the click.
- Any error states. If something looks rough, click past it; don't apologize.

## Post-demo follow-up

Within 24 hours, send the partner/investor:
1. The deck (PDF).
2. The one-pager (PDF).
3. A link to the preview deployment with their email's seed account pre-populated (if you've built operator-side onboarding tooling).
4. The next 2-3 milestones with dates.

That's the entire pitch motion.
