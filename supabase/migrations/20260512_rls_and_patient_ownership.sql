-- Row-Level Security for caregiver data.
--
-- Until this migration, every signed-in user could read/write every other
-- user's daily logs, golden records, and bureaucracy checklists using only
-- the public anon key. This migration:
--
--   1. Enables RLS on daily_logs, golden_records, checklist_items.
--   2. Pins each row to an owning auth.uid() via a `caregiver_id` column.
--   3. Backfills existing rows so we don't orphan data: rows whose
--      `patient_id` looks like an auth UID (the post-`usePatientId` regime)
--      get their caregiver_id set to that UID. Demo rows
--      (patient_id = 'demo-patient' or non-UUID) are left with NULL
--      caregiver_id and become unreadable until reassigned manually.
--   4. Installs a SECURITY DEFINER function `get_my_patient_id()` used by
--      the chat API to resolve the calling user's data scope without
--      trusting client-supplied IDs.
--
-- Schema for the three tables is assumed to already exist (the app has been
-- writing to them). We only add columns, indexes, and policies here.

-- ── columns ────────────────────────────────────────────────────────────────

alter table public.daily_logs
  add column if not exists caregiver_id uuid references auth.users(id) on delete cascade;

alter table public.golden_records
  add column if not exists caregiver_id uuid references auth.users(id) on delete cascade;

alter table public.checklist_items
  add column if not exists caregiver_id uuid references auth.users(id) on delete cascade;

-- ── backfill from patient_id when it's a uuid ──────────────────────────────
-- Older rows wrote `patient_id = auth.uid()::text`, so the UID is recoverable.

update public.daily_logs
  set caregiver_id = patient_id::uuid
  where caregiver_id is null
    and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

update public.golden_records
  set caregiver_id = patient_id::uuid
  where caregiver_id is null
    and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

update public.checklist_items
  set caregiver_id = patient_id::uuid
  where caregiver_id is null
    and patient_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- ── default caregiver_id to auth.uid() on insert ───────────────────────────
-- Clients writing through PostgREST never have to supply the column.

alter table public.daily_logs
  alter column caregiver_id set default auth.uid();

alter table public.golden_records
  alter column caregiver_id set default auth.uid();

alter table public.checklist_items
  alter column caregiver_id set default auth.uid();

-- ── indexes ────────────────────────────────────────────────────────────────

create index if not exists daily_logs_caregiver_id_idx on public.daily_logs(caregiver_id);
create index if not exists golden_records_caregiver_id_idx on public.golden_records(caregiver_id);
create index if not exists checklist_items_caregiver_id_idx on public.checklist_items(caregiver_id);

-- ── enable RLS ─────────────────────────────────────────────────────────────

alter table public.daily_logs enable row level security;
alter table public.golden_records enable row level security;
alter table public.checklist_items enable row level security;

-- daily_logs: full CRUD limited to owning caregiver.
drop policy if exists daily_logs_select_own on public.daily_logs;
create policy daily_logs_select_own on public.daily_logs
  for select using (auth.uid() = caregiver_id);

drop policy if exists daily_logs_insert_own on public.daily_logs;
create policy daily_logs_insert_own on public.daily_logs
  for insert with check (auth.uid() = caregiver_id);

drop policy if exists daily_logs_update_own on public.daily_logs;
create policy daily_logs_update_own on public.daily_logs
  for update using (auth.uid() = caregiver_id) with check (auth.uid() = caregiver_id);

drop policy if exists daily_logs_delete_own on public.daily_logs;
create policy daily_logs_delete_own on public.daily_logs
  for delete using (auth.uid() = caregiver_id);

-- golden_records: same pattern.
drop policy if exists golden_records_select_own on public.golden_records;
create policy golden_records_select_own on public.golden_records
  for select using (auth.uid() = caregiver_id);

drop policy if exists golden_records_insert_own on public.golden_records;
create policy golden_records_insert_own on public.golden_records
  for insert with check (auth.uid() = caregiver_id);

drop policy if exists golden_records_update_own on public.golden_records;
create policy golden_records_update_own on public.golden_records
  for update using (auth.uid() = caregiver_id) with check (auth.uid() = caregiver_id);

drop policy if exists golden_records_delete_own on public.golden_records;
create policy golden_records_delete_own on public.golden_records
  for delete using (auth.uid() = caregiver_id);

-- checklist_items: same pattern.
drop policy if exists checklist_items_select_own on public.checklist_items;
create policy checklist_items_select_own on public.checklist_items
  for select using (auth.uid() = caregiver_id);

drop policy if exists checklist_items_insert_own on public.checklist_items;
create policy checklist_items_insert_own on public.checklist_items
  for insert with check (auth.uid() = caregiver_id);

drop policy if exists checklist_items_update_own on public.checklist_items;
create policy checklist_items_update_own on public.checklist_items
  for update using (auth.uid() = caregiver_id) with check (auth.uid() = caregiver_id);

drop policy if exists checklist_items_delete_own on public.checklist_items;
create policy checklist_items_delete_own on public.checklist_items
  for delete using (auth.uid() = caregiver_id);

-- ── helper RPC used by the chat API ────────────────────────────────────────
-- Returns the patient_id scope the caller owns. Today that's just their
-- own auth.uid() rendered as text, but isolating this in a function lets us
-- later swap in a real Patient model without touching the API code.

create or replace function public.get_my_patient_id()
returns text
language sql
security definer
set search_path = public
as $$
  select auth.uid()::text where auth.uid() is not null;
$$;

revoke all on function public.get_my_patient_id() from public;
grant execute on function public.get_my_patient_id() to authenticated;
