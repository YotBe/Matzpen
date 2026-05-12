-- Personalized warning signs.
--
-- The generic alert algorithm (sleep < 4.5h + activity ≥ 4) misses
-- atypical presentations (chronic insomniacs, shift workers, postpartum).
-- A family knows their person's prodrome — let them tell us, and use
-- THAT as the primary signal.
--
-- Schema: a small ordered array of short phrases on golden_records, and
-- a parallel array on daily_logs recording which signs the caregiver
-- ticked off today (item id strings tied to position-based ids generated
-- client-side).
--
-- Kept on the existing tables (not a separate `warning_signs` table) so
-- the RLS already applied to those tables covers this for free.

alter table public.golden_records
  add column if not exists warning_signs jsonb;

-- daily_logs gains a small array of the ids the caregiver checked today.
alter table public.daily_logs
  add column if not exists warning_signs_hit text[];

comment on column public.golden_records.warning_signs is
  'Ordered array of {id: string, label: string} objects — 3-7 short phrases the family identifies as their person''s personal warning signs. Used by the alert algorithm to escalate on family-defined patterns before generic thresholds.';
comment on column public.daily_logs.warning_signs_hit is
  'Array of warning-sign ids (from golden_records.warning_signs) the caregiver ticked when filling out today''s log.';
