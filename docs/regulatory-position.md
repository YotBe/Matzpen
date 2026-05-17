# Matzpen — regulatory position (Israel)

> Internal draft. Not legal advice. The Israeli Medical Equipment
> regulations (חוק אבזרים רפואיים, תשנ"ב-2012 + תקנות 2013) and the
> Ministry of Health's Medical Devices Department (AMAR) are the relevant
> bodies. Before any commercial deployment, an attorney specializing in
> Israeli medical-device regulation should sign off — see
> `docs/legal-review-brief.md` for the briefing.

## The position in one sentence

**Matzpen is a caregiver-facing coordination, documentation, and educational tool — not a medical device — because it does not diagnose, treat, monitor for clinical purposes, or drive autonomous clinical decisions.**

## Why this position holds

Israel's Medical Devices Regulations (Reg. 2(a)) classify software as a medical device when it is *"intended for use in the diagnosis, prevention, monitoring, treatment, or alleviation of disease"* — language closely aligned with the EU MDR. Matzpen does none of these:

| Activity a medical device does | Matzpen's posture |
|---|---|
| **Diagnoses** a condition | No. Matzpen renders the caregiver's own observations back to them. The "alert banner" is explicitly labeled `non-clinical heuristic`. We do not output diagnoses, scores, or classifications. |
| **Recommends or modifies treatment** | No. The AI assistant's system prompt forbids prescribing, dosage advice, or treatment changes (`app/api/chat/route.ts` SYSTEM_PROMPT rule 1). It defers all clinical questions to the treating clinician. |
| **Monitors a patient for clinical purposes** | No. Daily logs are self-reported by the family for *their own* coordination. The data is never sent to a clinician without explicit caregiver action (the share-link flow). No automated clinical surveillance. |
| **Drives an alarm based on physiological measurements** | No. There are no physiological sensors. "Alerts" are non-clinical labels (yellow / red) derived from family-reported metrics, with disclaimers in the UI. |
| **Autonomously makes a clinical decision** | No. Every action in the app requires a human family member. The AI assistant gives information; it does not act. |

The product is closest to a **journal + workflow tool**, comparable to:
- Care.com (caregiving coordination — not a medical device).
- WhatsApp groups for caregivers (the status quo we replace).
- Personal health records (PHRs) — explicitly excluded from medical-device classification under most regulatory regimes when caregiver-controlled.

## Disclaimers as the regulatory shield

The product surfaces four disclaimers, each tied to a specific potential classification risk:

1. **Alert banner** (`components/AlertBanner.tsx`): `"alert.howCalculated"` and `"alert.nonClinicalNote"` — emphasizes the alert is a family-defined heuristic, NOT a clinical instrument.
2. **AI assistant** (`app/api/chat/route.ts` SYSTEM_PROMPT): explicit "you are not a doctor; you do not prescribe; you do not diagnose" baked into every response.
3. **Vault** (`vault.encryptionNote` translation): "Files are visible only to envelope members. Do not share publicly. Intended for professionals only."
4. **Sign-up consent** (`login.consentLabel`): user explicitly acknowledges Matzpen is a self-help documentation tool and not a substitute for medical care.

The Terms of Service (`/terms`) repeats these and adds the AS-IS warranty disclaimer.

## Open regulatory questions

These need an attorney's input before launch:

1. **Vault recordings.** When a caregiver records a person with a psychiatric condition (audio/video) in their own home, are there privacy / consent / wiretapping implications under Israeli law (חוק האזנת סתר, חוק הגנת הפרטיות)? Our position: the caregiver is responsible for compliance; we provide the storage tool with clear retention controls. Need confirmation.
2. **Data residency.** Supabase hosts in EU / US. Israeli health data: does this require a specific data-processing agreement under the new Israeli privacy law amendments (2024-2025)? Probably yes for HMO partnerships.
3. **AMAR pre-classification opinion.** For Class I medical software exemption clarity, an operator can request an AMAR opinion ("חוות דעת מקדמית") before commercial launch. Costs ~₪3-5k, takes 6-8 weeks. Worth doing before HMO contracts, NOT before pilots.
4. **Cross-border AI processing.** Gemini calls resolve in US data centers. Israeli health data crossing borders: notice requirement under PRA. Mitigation: route through EU Gemini regions when available.

## What to do if regulators reach out anyway

If AMAR contacts you and asks about classification (unlikely but possible), the response is:

1. Provide the URL to `/terms`, `/privacy`, and `/safety` so they can see disclaimers in context.
2. Provide this document.
3. Offer a 30-minute walkthrough.
4. Argue: we are a Personal Health Record + caregiver workflow tool, comparable to Care.com or personal journaling apps. We do not perform any of the activities triggering medical-device classification.
5. If they push back, propose a voluntary Class I registration with a software-as-PHR carve-out. Class I is the lightest classification (registration only, no QMS audit).

## Worst case

If we are classified as Class I medical software:
- **Registration with AMAR** (not approval — just listing). Annual fee in the low ₪ thousands.
- **Quality Management System** alignment to ISO 13485-lite. Manageable.
- **Adverse event reporting** obligation. Operationally trivial at our scale.
- **No material product changes required.**

The worst case is not catastrophic. The classification fight is winnable, and even losing it produces a manageable outcome. Don't let regulatory anxiety drive product decisions.

## When to revisit

- Before signing the first HMO contract (regulatory clarity is part of due diligence).
- Before any pharma partnership (different ball game; pharma post-marketing surveillance rules may extend to integrated tools).
- After major Israeli regulatory updates (typically annually).
