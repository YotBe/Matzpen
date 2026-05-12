-- Steps 2, 4, 5 of the Crisis Command Center.
--   2. lockdown_progress (envelope-scoped)
--   4. caregiver_pulse (own pulse; envelope members see each other's for
--      burnout detection)
--   5. vault_files + Supabase Storage bucket "vault" (envelope-scoped)
--
-- All envelope-scoped tables piggyback on the is_envelope_member() helper
-- introduced in 20260514_envelope_and_war_room.sql.

-- ── lockdown_progress ──────────────────────────────────────────────────────
-- One row per (patient_id, item_key). Multiple envelope members may toggle
-- items; we record the last actor in done_by_caregiver / done_at.
create table if not exists public.lockdown_progress (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  item_key text not null,
  done boolean not null default false,
  done_by_caregiver uuid references auth.users(id) on delete set null,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  unique (patient_id, item_key)
);

create index if not exists lockdown_progress_patient_idx
  on public.lockdown_progress(patient_id);

alter table public.lockdown_progress enable row level security;

drop policy if exists lockdown_progress_select on public.lockdown_progress;
create policy lockdown_progress_select on public.lockdown_progress
  for select using (public.is_envelope_member(patient_id));

drop policy if exists lockdown_progress_insert on public.lockdown_progress;
create policy lockdown_progress_insert on public.lockdown_progress
  for insert with check (public.is_envelope_member(patient_id));

drop policy if exists lockdown_progress_update on public.lockdown_progress;
create policy lockdown_progress_update on public.lockdown_progress
  for update using (public.is_envelope_member(patient_id))
  with check (public.is_envelope_member(patient_id));

drop policy if exists lockdown_progress_delete on public.lockdown_progress;
create policy lockdown_progress_delete on public.lockdown_progress
  for delete using (public.is_envelope_member(patient_id));

alter publication supabase_realtime add table public.lockdown_progress;

-- ── caregiver_pulse ────────────────────────────────────────────────────────
-- The caregiver's own daily check-in: their sleep, mood, energy. Shared
-- inside the envelope so the burnout banner can detect when one person is
-- carrying the load alone or running on no sleep.
create table if not exists public.caregiver_pulse (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  pulse_date date not null,
  sleep_hours numeric(4,1),
  -- 1 (overwhelmed) — 5 (fine). Tiny scale on purpose; this is a check-in,
  -- not a clinical instrument.
  mood smallint check (mood between 1 and 5),
  -- Free-text "what's heaviest right now" — optional, kept short.
  note text,
  created_at timestamptz not null default now(),
  unique (caregiver_id, pulse_date)
);

create index if not exists caregiver_pulse_patient_idx
  on public.caregiver_pulse(patient_id, pulse_date desc);

alter table public.caregiver_pulse enable row level security;

drop policy if exists caregiver_pulse_select on public.caregiver_pulse;
create policy caregiver_pulse_select on public.caregiver_pulse
  for select using (public.is_envelope_member(patient_id));

drop policy if exists caregiver_pulse_insert on public.caregiver_pulse;
create policy caregiver_pulse_insert on public.caregiver_pulse
  for insert with check (
    caregiver_id = auth.uid()
    and public.is_envelope_member(patient_id)
  );

drop policy if exists caregiver_pulse_update on public.caregiver_pulse;
create policy caregiver_pulse_update on public.caregiver_pulse
  for update using (caregiver_id = auth.uid())
  with check (caregiver_id = auth.uid());

drop policy if exists caregiver_pulse_delete on public.caregiver_pulse;
create policy caregiver_pulse_delete on public.caregiver_pulse
  for delete using (caregiver_id = auth.uid());

-- ── vault_files ────────────────────────────────────────────────────────────
-- Metadata for media stored in the "vault" Storage bucket. Actual bytes
-- live in Storage; this table tracks ownership, caption, and the path
-- needed to render a signed-URL preview.
create table if not exists public.vault_files (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  kind text not null,
  mime_type text,
  byte_size bigint,
  duration_seconds numeric(8,2),
  caption text,
  recorded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists vault_files_patient_idx
  on public.vault_files(patient_id, created_at desc);

alter table public.vault_files enable row level security;

drop policy if exists vault_files_select on public.vault_files;
create policy vault_files_select on public.vault_files
  for select using (public.is_envelope_member(patient_id));

drop policy if exists vault_files_insert on public.vault_files;
create policy vault_files_insert on public.vault_files
  for insert with check (
    caregiver_id = auth.uid()
    and public.is_envelope_member(patient_id)
  );

drop policy if exists vault_files_update on public.vault_files;
create policy vault_files_update on public.vault_files
  for update using (caregiver_id = auth.uid())
  with check (caregiver_id = auth.uid());

drop policy if exists vault_files_delete on public.vault_files;
create policy vault_files_delete on public.vault_files
  for delete using (
    caregiver_id = auth.uid()
    or public.is_envelope_member(patient_id) and exists (
      select 1 from public.patient_envelopes
        where patient_id = vault_files.patient_id
          and caregiver_id = auth.uid()
          and role = 'owner'
    )
  );

-- ── Storage bucket + object policies ───────────────────────────────────────
-- The "vault" bucket holds the encrypted-at-rest media bytes. Bucket is
-- NOT public; all access goes through createSignedUrl from authenticated
-- callers whom we authorize via these RLS policies. Path convention:
--   vault/<patient_id>/<file_id>.<ext>
-- The patient_id is parsed out of storage.objects.name to enforce
-- envelope membership.

insert into storage.buckets (id, name, public)
  values ('vault', 'vault', false)
  on conflict (id) do nothing;

-- Helper that yanks the patient_id segment from a storage object name.
create or replace function public.vault_patient_id_from_name(p_name text)
returns text
language sql
immutable
as $$
  select split_part(p_name, '/', 1);
$$;

drop policy if exists vault_objects_select on storage.objects;
create policy vault_objects_select on storage.objects
  for select to authenticated using (
    bucket_id = 'vault'
    and public.is_envelope_member(public.vault_patient_id_from_name(name))
  );

drop policy if exists vault_objects_insert on storage.objects;
create policy vault_objects_insert on storage.objects
  for insert to authenticated with check (
    bucket_id = 'vault'
    and public.is_envelope_member(public.vault_patient_id_from_name(name))
    and (storage.foldername(name))[1] is not null
  );

drop policy if exists vault_objects_delete on storage.objects;
create policy vault_objects_delete on storage.objects
  for delete to authenticated using (
    bucket_id = 'vault'
    and public.is_envelope_member(public.vault_patient_id_from_name(name))
  );

drop policy if exists vault_objects_update on storage.objects;
create policy vault_objects_update on storage.objects
  for update to authenticated using (
    bucket_id = 'vault'
    and public.is_envelope_member(public.vault_patient_id_from_name(name))
  );
