-- Defensive backfill for caregiver_id on existing tables.
--
-- The original 20260512_rls_and_patient_ownership.sql migration already
-- ran the same UPDATE, but it's idempotent and re-running protects
-- against the bug class where a row was created (e.g. an empty
-- golden_records row from an aborted onboarding) between the rollout
-- of the column-default change and the RLS-enforcement go-live.
--
-- Symptom this fixes: the "who are you caring for?" form looked like it
-- saved but the dashboard banner kept reappearing — because the
-- ON-CONFLICT upsert hit the UPDATE branch on a legacy row whose
-- caregiver_id was NULL, and the UPDATE USING policy rejected it
-- silently.
--
-- For each affected table, set caregiver_id = patient_id::uuid for
-- rows where caregiver_id is currently NULL and patient_id looks like
-- a real auth user id.

update public.golden_records
   set caregiver_id = patient_id::uuid
 where caregiver_id is null
   and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

update public.daily_logs
   set caregiver_id = patient_id::uuid
 where caregiver_id is null
   and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

update public.checklist_items
   set caregiver_id = patient_id::uuid
 where caregiver_id is null
   and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
