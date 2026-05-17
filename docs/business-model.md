# Matzpen — business model (B2B2C through HMOs)

> Internal strategy doc. The single source of truth for "who pays, how
> much, and why." Cite from this when an investor or partner asks.

## The model in one sentence

**Israeli kupot holim pay Matzpen ~₪15-25/family/month to provide the app to families of insured patients with serious mental illness, in exchange for measurable reduction in psychiatric readmissions.**

## Why this model (and not B2C, NGO, or pharma)

| Model | Pro | Con | Verdict |
|---|---|---|---|
| **B2B2C via HMO (primary)** | Aligned incentives (HMO saves on readmissions, family gets free tool); large per-customer revenue; defensible distribution. | 6-12 month sales cycle; political. | **Primary.** |
| NGO partnership (ENOSH, OZMA) | Faster close; aligned mission; brand boost. | Tiny payment ceiling (NGOs are budget-constrained); not scalable as primary. | **Secondary / channel.** |
| B2C subscription (caregiver pays) | Direct validation; no enterprise sales. | Caregivers are financially strapped; LTV/CAC will not pencil. | **Freemium tier only; not a real revenue path.** |
| Pharma adherence partnership | Highest gross margin; pharma has budget. | Requires clinical study (~12 months, ~$300k). | **Post-seed exploration; not a primary.** |

## The HMO economic argument

This is the slide you'll be asked to defend in every meeting. Memorize.

**Inputs (round numbers, cite real sources before pitching):**
- Average psychiatric readmission cost to HMO: **₪40,000** per stay.
- 12-month readmission rate after a first inpatient psychiatric stay in Israel: ~**40%** (varies by diagnosis).
- Conservative readmission reduction from a coordinated family-side intervention: **5% absolute** (research backing: family-psycho-education studies show 10-30% relative reduction).

**Math for a 1,000-family HMO cohort:**
- Without Matzpen: 400 readmissions/year × ₪40k = **₪16M cost.**
- With Matzpen: 350 readmissions/year × ₪40k = **₪14M cost. Saves ₪2M/year.**
- Matzpen cost to HMO: 1,000 families × ₪20/month × 12 = **₪240k/year.**
- **Net HMO savings: ₪1.76M/year. ROI: ~8x.**

Even at half the assumed reduction (2.5% absolute), HMO still saves ₪880k/year on ₪240k spend → 3.7x ROI. The model survives a wide range of conservative assumptions.

## Sales path to the first HMO

You will not walk in cold. The path:

1. **Innovation Authority grant submission first.** The Israeli Innovation Authority's digital-health track is the unofficial credentialing system that HMO innovation labs use to triage incoming pitches. A grant submission (~6 weeks) produces a packet HMOs read.
2. **Get an NGO endorsement.** ENOSH or OZMA family-advocacy arms. Their endorsement opens doors.
3. **Identify a single HMO champion.** Each kupah has 1-2 named individuals who run innovation pilots:
   - **Maccabi-Tech** (most likely first partner — strongest digital-health unit).
   - **Clalit Innovation Center.**
   - **Sheba ARC** (technically a hospital, not a kupah, but the most active digital-health pilot site).
   - **Maccabi behavioral health unit** — separate from Maccabi-Tech; sometimes faster decision-maker.
4. **Propose a 100-family, 6-month pilot.** Free or near-free. Defined success metric: readmission rate of pilot vs matched cohort, OR caregiver-reported QoL (Zarit short form).
5. **Convert the pilot to a paying engagement** at month 6 if the metrics land.

Timeline: 12-18 months from today to first paying HMO. Expect 8 meetings before the first yes.

## Pricing rationale

₪15-25/family/month bracket comes from:
- HMO supplementary insurance products (כללית מושלם, מכבי שלי) are priced at ₪30-100/month per insured for similar wraparound services. Caregiver-side coverage at half that is defensible.
- Israeli SaaS pricing for B2B2C health tools clusters at ₪20-35/active user/month.
- At ₪20 × 12 months × 5,000 families = ₪1.2M ARR — enough to support Series A timing.

**Avoid percentage-of-savings pricing.** HMOs hate it (accountability nightmare), and you'd be on the hook for proving the savings on every renewal.

## Unit economics

**Per active family per month:**
- Revenue (HMO pays): ₪20
- Direct costs:
  - Supabase: ₪0.50 (database + RLS + realtime + storage for vault clips)
  - Gemini API: ₪2-3 (AI assistant + extraction; depends on use frequency)
  - PostHog + Sentry + Vercel hosting: ₪0.30
  - **Total direct: ₪3-4** (lower as we scale)
- **Gross margin: ~80%.**
- LTV at 24-month retention: ₪480.
- CAC: through HMO channel, near zero per family (HMO does the onboarding).

The economics are healthtech-typical (high gross margin, distribution-bound).

## What an investor will probe

1. *"Why won't the HMOs build this themselves?"* → They've had 10 years to and haven't. Internal HMO digital teams build patient portals, not family-side tools. Different product surface, different empathy, different team. We sell into their existing patient-portal channel, not against it.

2. *"What stops Maccabi from copying you in 12 months?"* → The clinical+legal Hebrew content library took 6 months and a clinical advisory board (slide 9). They could build it; they won't, because their innovation budgets fund 5-10 pilots/year and "rebuild a partner's product" is never one. Once we're in, we're sticky.

3. *"What if you only land 1 HMO?"* → 1 HMO at 10k families = ₪2.4M ARR. That's a meaningful Series A.

4. *"Why now and not 5 years ago?"* → 2015 reform shifted care to community → families became frontline → 2024-2026 is when HMO innovation budgets started funding family-side. We're at the right hand of the right wave.

## What this model rules out

- Pure B2C marketing spend. Don't burn cash on Facebook acquiring caregivers directly.
- Aggressive pricing experimentation. ₪20/family/month is the anchor; don't move it until we have 3 HMO contracts.
- Pivoting to patient-facing. Different product, different market, different moat. Stay on the family.

## When to revisit

Revisit this doc:
- After the first HMO meeting (calibrate price/expectations).
- After the first pilot results (validate the 5% absolute reduction assumption).
- Annually thereafter.
