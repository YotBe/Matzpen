-- Round 2 envelope extensions:
--   * Post-discharge tracking (highest re-admit window)
--   * Medication refill SLA tracking
--   * "Who is my person when well" — humanity-in-the-chart fields
--   * Share tokens for time-bound, read-only golden record sharing
--
-- All caregiver-owned tables follow the auth.uid() = caregiver_id model
-- introduced in 20260512_rls_and_patient_ownership.sql.

-- ── golden_records extra columns ────────────────────────────────────────────
alter table public.golden_records
  add column if not exists discharge_date date,
  add column if not exists next_refill_date date,
  add column if not exists when_well_loves text,
  add column if not exists when_well_calms text,
  add column if not exists when_well_never_say text;

-- ── share_tokens table ──────────────────────────────────────────────────────
-- A caregiver can mint a time-bound token that lets the treating team open
-- a read-only view of the golden record. The token is the only secret;
-- knowing it grants read access until `expires_at`. Tokens revocable by the
-- owning caregiver at any time.
create table if not exists public.share_tokens (
  token text primary key,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  patient_id text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists share_tokens_caregiver_idx on public.share_tokens(caregiver_id);

alter table public.share_tokens enable row level security;

-- Caregivers can see and manage only their own tokens.
drop policy if exists share_tokens_select_own on public.share_tokens;
create policy share_tokens_select_own on public.share_tokens
  for select using (auth.uid() = caregiver_id);

drop policy if exists share_tokens_insert_own on public.share_tokens;
create policy share_tokens_insert_own on public.share_tokens
  for insert with check (auth.uid() = caregiver_id);

drop policy if exists share_tokens_update_own on public.share_tokens;
create policy share_tokens_update_own on public.share_tokens
  for update using (auth.uid() = caregiver_id) with check (auth.uid() = caregiver_id);

drop policy if exists share_tokens_delete_own on public.share_tokens;
create policy share_tokens_delete_own on public.share_tokens
  for delete using (auth.uid() = caregiver_id);

-- ── public read RPC for shared records ──────────────────────────────────────
-- The /share/[token] page calls this anonymously. SECURITY DEFINER lets it
-- read just the matching golden_record without granting the anon role
-- general access to the table. Returns NULL if the token is missing,
-- revoked, or expired.
create or replace function public.get_shared_golden_record(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record record;
  v_caregiver uuid;
  v_patient text;
begin
  select caregiver_id, patient_id
    into v_caregiver, v_patient
    from public.share_tokens
    where token = p_token
      and revoked_at is null
      and expires_at > now()
    limit 1;

  if v_caregiver is null then
    return null;
  end if;

  select to_jsonb(gr)
    into v_record
    from (
      select
        patient_name,
        relationship,
        region,
        city,
        diagnosis,
        comorbidities,
        medications,
        allergies,
        risk_vectors,
        contacts,
        discharge_date,
        next_refill_date,
        when_well_loves,
        when_well_calms,
        when_well_never_say,
        updated_at
      from public.golden_records
      where caregiver_id = v_caregiver
        and patient_id = v_patient
      limit 1
    ) gr;

  return v_record;
end;
$$;

revoke all on function public.get_shared_golden_record(text) from public;
grant execute on function public.get_shared_golden_record(text) to anon, authenticated;
