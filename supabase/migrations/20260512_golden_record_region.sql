-- Add geographic region to the Golden Record so the hospitalization module
-- can prioritize psychiatric hospitals and ERs near the patient.
--
-- `region` is a coarse bucket from a fixed list (see lib/regions.ts) used for
-- routing. `city` is free-text so caregivers can record the actual address
-- the team will dispatch to. Both nullable so existing rows keep working
-- until the caregiver updates the record.

alter table public.golden_records
  add column if not exists region text,
  add column if not exists city text;
