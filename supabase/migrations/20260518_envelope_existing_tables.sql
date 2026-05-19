-- Migrate the legacy single-caregiver tables (daily_logs, golden_records,
-- checklist_items) onto envelope-membership RLS. Without this, an envelope
-- member invited to the war room can see shifts/tasks but NOT the daily
-- journal or golden record — which is confusing and undermines the whole
-- "shared envelope" framing.
--
-- Approach: SELECT is gated on is_envelope_member(patient_id). INSERT is
-- still constrained to the calling caregiver (so attribution is preserved
-- via the existing caregiver_id column). UPDATE/DELETE: same — only the
-- owning caregiver can edit/delete their own row. For golden_records and
-- checklist_items (single-source-of-truth-per-patient) UPDATE is opened
-- to any envelope member.

-- ── daily_logs ─────────────────────────────────────────────────────────
drop policy if exists daily_logs_select_own on public.daily_logs;
create policy daily_logs_select_envelope on public.daily_logs
  for select using (public.is_envelope_member(patient_id));

drop policy if exists daily_logs_insert_own on public.daily_logs;
create policy daily_logs_insert_envelope on public.daily_logs
  for insert with check (
    auth.uid() = caregiver_id
    and public.is_envelope_member(patient_id)
  );

-- Keep UPDATE/DELETE restricted to the original logger so observations
-- can't be retroactively edited by other envelope members.
drop policy if exists daily_logs_update_own on public.daily_logs;
create policy daily_logs_update_own_envelope on public.daily_logs
  for update using (auth.uid() = caregiver_id)
  with check (auth.uid() = caregiver_id);

drop policy if exists daily_logs_delete_own on public.daily_logs;
create policy daily_logs_delete_own_envelope on public.daily_logs
  for delete using (auth.uid() = caregiver_id);

-- ── golden_records ─────────────────────────────────────────────────────
-- Single row per patient. Any envelope member can read AND modify (the
-- record is the shared "who is this person" document).
drop policy if exists golden_records_select_own on public.golden_records;
create policy golden_records_select_envelope on public.golden_records
  for select using (public.is_envelope_member(patient_id));

drop policy if exists golden_records_insert_own on public.golden_records;
create policy golden_records_insert_envelope on public.golden_records
  for insert with check (
    auth.uid() = caregiver_id
    and public.is_envelope_member(patient_id)
  );

drop policy if exists golden_records_update_own on public.golden_records;
create policy golden_records_update_envelope on public.golden_records
  for update using (public.is_envelope_member(patient_id))
  with check (public.is_envelope_member(patient_id));

drop policy if exists golden_records_delete_own on public.golden_records;
create policy golden_records_delete_envelope on public.golden_records
  for delete using (public.is_envelope_member(patient_id));

-- ── checklist_items ────────────────────────────────────────────────────
-- Shared bureaucracy + post-discharge tasks. Same model as golden_records.
drop policy if exists checklist_items_select_own on public.checklist_items;
create policy checklist_items_select_envelope on public.checklist_items
  for select using (public.is_envelope_member(patient_id));

drop policy if exists checklist_items_insert_own on public.checklist_items;
create policy checklist_items_insert_envelope on public.checklist_items
  for insert with check (
    auth.uid() = caregiver_id
    and public.is_envelope_member(patient_id)
  );

drop policy if exists checklist_items_update_own on public.checklist_items;
create policy checklist_items_update_envelope on public.checklist_items
  for update using (public.is_envelope_member(patient_id))
  with check (public.is_envelope_member(patient_id));

drop policy if exists checklist_items_delete_own on public.checklist_items;
create policy checklist_items_delete_envelope on public.checklist_items
  for delete using (public.is_envelope_member(patient_id));

-- Also add daily_logs to the realtime publication so dashboard widgets
-- live-update when an envelope member logs.
alter publication supabase_realtime add table public.daily_logs;
