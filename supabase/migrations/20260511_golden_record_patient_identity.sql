-- Add patient identity to the Golden Record so the dashboard and triage view
-- can address the real person by name (and the caregiver's relationship to
-- them) instead of the hardcoded "דורון" placeholder.
--
-- Run this in the Supabase SQL Editor against the production database.
-- Both columns are nullable so existing rows keep working until the user
-- visits the Golden Record page and fills them in.

alter table public.golden_records
  add column if not exists patient_name text,
  add column if not exists relationship text;
