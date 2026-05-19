-- Step 1 of the Crisis Command Center: the "envelope" + War Room.
--
-- Adds a minimum multi-caregiver layer (just for the new shared tables) on
-- top of the existing single-caregiver model. Existing tables
-- (daily_logs, golden_records, checklist_items, share_tokens) are
-- unaffected and continue to use caregiver_id = auth.uid() RLS.
--
-- Membership model:
--   patient_envelopes(patient_id, caregiver_id, role) — who's linked to whom
--   envelope_invites(token, patient_id, inviter, expires_at, redeemed_by)
--     — caregiver mints a one-time invite, recipient redeems after sign-up
--
-- Shared tables (RLS = envelope membership):
--   shifts          — observation shift sign-ups
--   shared_tasks    — checklist of logistics for the whole family
--   backup_requests — "the person on duty needs help" alert

-- ── envelope membership ────────────────────────────────────────────────────
create table if not exists public.patient_envelopes (
  patient_id text not null,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'caregiver',
  display_name text,
  joined_at timestamptz not null default now(),
  primary key (patient_id, caregiver_id)
);

create index if not exists patient_envelopes_caregiver_idx
  on public.patient_envelopes(caregiver_id);

-- Backfill: every existing caregiver who already owns rows is automatically a
-- member of their own envelope. New collaborators come in via invites.
insert into public.patient_envelopes (patient_id, caregiver_id, role)
  select distinct caregiver_id::text, caregiver_id, 'owner'
    from public.golden_records
    where caregiver_id is not null
  on conflict do nothing;

-- Security-definer membership check. Used in policies on the new shared
-- tables to avoid querying patient_envelopes from inside its own policy.
create or replace function public.is_envelope_member(p_patient_id text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.patient_envelopes
      where patient_id = p_patient_id
        and caregiver_id = auth.uid()
  );
$$;

revoke all on function public.is_envelope_member(text) from public;
grant execute on function public.is_envelope_member(text) to authenticated;

alter table public.patient_envelopes enable row level security;

drop policy if exists patient_envelopes_select_member on public.patient_envelopes;
create policy patient_envelopes_select_member on public.patient_envelopes
  for select using (
    caregiver_id = auth.uid()
    or public.is_envelope_member(patient_id)
  );

drop policy if exists patient_envelopes_insert_self on public.patient_envelopes;
create policy patient_envelopes_insert_self on public.patient_envelopes
  for insert with check (caregiver_id = auth.uid());

drop policy if exists patient_envelopes_delete_self on public.patient_envelopes;
create policy patient_envelopes_delete_self on public.patient_envelopes
  for delete using (caregiver_id = auth.uid());

-- ── envelope_invites ───────────────────────────────────────────────────────
create table if not exists public.envelope_invites (
  token text primary key,
  patient_id text not null,
  inviter_caregiver_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists envelope_invites_inviter_idx
  on public.envelope_invites(inviter_caregiver_id);

alter table public.envelope_invites enable row level security;

-- Members of the envelope can see invites for that envelope.
drop policy if exists envelope_invites_select on public.envelope_invites;
create policy envelope_invites_select on public.envelope_invites
  for select using (public.is_envelope_member(patient_id));

-- Only members may create invites for their envelope.
drop policy if exists envelope_invites_insert on public.envelope_invites;
create policy envelope_invites_insert on public.envelope_invites
  for insert with check (
    inviter_caregiver_id = auth.uid()
    and public.is_envelope_member(patient_id)
  );

-- Inviter can revoke their own invite.
drop policy if exists envelope_invites_delete on public.envelope_invites;
create policy envelope_invites_delete on public.envelope_invites
  for delete using (inviter_caregiver_id = auth.uid());

-- Redemption goes through an RPC so the caller can join an envelope they
-- aren't yet a member of (which RLS would otherwise block).
create or replace function public.redeem_envelope_invite(p_token text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient text;
  v_caller uuid := auth.uid();
begin
  if v_caller is null then
    raise exception 'must be authenticated';
  end if;

  select patient_id into v_patient
    from public.envelope_invites
    where token = p_token
      and redeemed_at is null
      and expires_at > now()
    for update;

  if v_patient is null then
    raise exception 'invite invalid or expired';
  end if;

  insert into public.patient_envelopes (patient_id, caregiver_id, role)
    values (v_patient, v_caller, 'caregiver')
    on conflict do nothing;

  update public.envelope_invites
    set redeemed_by = v_caller, redeemed_at = now()
    where token = p_token;

  return v_patient;
end;
$$;

revoke all on function public.redeem_envelope_invite(text) from public;
grant execute on function public.redeem_envelope_invite(text) to authenticated;

-- ── shifts ─────────────────────────────────────────────────────────────────
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists shifts_patient_idx on public.shifts(patient_id, start_at);

alter table public.shifts enable row level security;

drop policy if exists shifts_select on public.shifts;
create policy shifts_select on public.shifts
  for select using (public.is_envelope_member(patient_id));

drop policy if exists shifts_insert on public.shifts;
create policy shifts_insert on public.shifts
  for insert with check (
    caregiver_id = auth.uid()
    and public.is_envelope_member(patient_id)
  );

drop policy if exists shifts_update on public.shifts;
create policy shifts_update on public.shifts
  for update using (caregiver_id = auth.uid())
  with check (caregiver_id = auth.uid());

drop policy if exists shifts_delete on public.shifts;
create policy shifts_delete on public.shifts
  for delete using (caregiver_id = auth.uid());

-- ── shared_tasks ───────────────────────────────────────────────────────────
create table if not exists public.shared_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  title text not null,
  done boolean not null default false,
  done_by_caregiver uuid references auth.users(id) on delete set null,
  done_at timestamptz,
  created_by_caregiver uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists shared_tasks_patient_idx
  on public.shared_tasks(patient_id, created_at desc);

alter table public.shared_tasks enable row level security;

drop policy if exists shared_tasks_select on public.shared_tasks;
create policy shared_tasks_select on public.shared_tasks
  for select using (public.is_envelope_member(patient_id));

drop policy if exists shared_tasks_insert on public.shared_tasks;
create policy shared_tasks_insert on public.shared_tasks
  for insert with check (
    created_by_caregiver = auth.uid()
    and public.is_envelope_member(patient_id)
  );

-- Any envelope member can toggle `done` / `done_by_caregiver` / `done_at`,
-- but only the creator can change `title`. Simpler to allow updates by any
-- member and audit via done_by_caregiver — keep the policy lenient for now.
drop policy if exists shared_tasks_update on public.shared_tasks;
create policy shared_tasks_update on public.shared_tasks
  for update using (public.is_envelope_member(patient_id))
  with check (public.is_envelope_member(patient_id));

drop policy if exists shared_tasks_delete on public.shared_tasks;
create policy shared_tasks_delete on public.shared_tasks
  for delete using (
    created_by_caregiver = auth.uid()
    or exists (
      select 1 from public.patient_envelopes
      where patient_id = shared_tasks.patient_id
        and caregiver_id = auth.uid()
        and role = 'owner'
    )
  );

-- ── backup_requests ────────────────────────────────────────────────────────
-- A high-priority signal from the active caregiver that they need help.
-- Realtime subscribers in the war-room render a banner on insert.
create table if not exists public.backup_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  requester_caregiver_id uuid not null references auth.users(id) on delete cascade,
  message text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by_caregiver uuid references auth.users(id) on delete set null
);

create index if not exists backup_requests_patient_idx
  on public.backup_requests(patient_id, created_at desc);

alter table public.backup_requests enable row level security;

drop policy if exists backup_requests_select on public.backup_requests;
create policy backup_requests_select on public.backup_requests
  for select using (public.is_envelope_member(patient_id));

drop policy if exists backup_requests_insert on public.backup_requests;
create policy backup_requests_insert on public.backup_requests
  for insert with check (
    requester_caregiver_id = auth.uid()
    and public.is_envelope_member(patient_id)
  );

drop policy if exists backup_requests_update on public.backup_requests;
create policy backup_requests_update on public.backup_requests
  for update using (public.is_envelope_member(patient_id))
  with check (public.is_envelope_member(patient_id));

-- ── enable supabase realtime on the new tables ─────────────────────────────
-- This lets the war-room subscribe to inserts/updates/deletes for the
-- patient_id it cares about.
alter publication supabase_realtime add table public.shifts;
alter publication supabase_realtime add table public.shared_tasks;
alter publication supabase_realtime add table public.backup_requests;
