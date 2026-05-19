-- Web push subscriptions per envelope member.
--
-- Each caregiver can have multiple subscriptions (one per device/browser).
-- Patient_id is stored on the row so the dispatcher can fan out a single
-- backup-request push to every device in the envelope.
--
-- Storage and dispatch happen server-side via the SECURITY DEFINER
-- function get_envelope_push_subscriptions(). Clients never read each
-- other's subscriptions directly.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  patient_id text not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (caregiver_id, endpoint)
);

create index if not exists push_subscriptions_patient_idx
  on public.push_subscriptions(patient_id);

alter table public.push_subscriptions enable row level security;

-- A caregiver can only see / write their own subscriptions.
drop policy if exists push_subscriptions_select_own on public.push_subscriptions;
create policy push_subscriptions_select_own on public.push_subscriptions
  for select using (auth.uid() = caregiver_id);

drop policy if exists push_subscriptions_insert_own on public.push_subscriptions;
create policy push_subscriptions_insert_own on public.push_subscriptions
  for insert with check (
    auth.uid() = caregiver_id
    and public.is_envelope_member(patient_id)
  );

drop policy if exists push_subscriptions_delete_own on public.push_subscriptions;
create policy push_subscriptions_delete_own on public.push_subscriptions
  for delete using (auth.uid() = caregiver_id);

-- Server-side dispatcher uses this to enumerate destinations. SECURITY
-- DEFINER bypasses the per-caregiver RLS so an envelope member can fan
-- out a push to everyone else in the envelope. The function validates
-- the caller IS an envelope member before returning rows.
create or replace function public.get_envelope_push_subscriptions(p_patient_id text)
returns table (
  caregiver_id uuid,
  endpoint text,
  p256dh text,
  auth text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_envelope_member(p_patient_id) then
    return;
  end if;
  return query
    select ps.caregiver_id, ps.endpoint, ps.p256dh, ps.auth
      from public.push_subscriptions ps
     where ps.patient_id = p_patient_id;
end;
$$;

revoke all on function public.get_envelope_push_subscriptions(text) from public;
grant execute on function public.get_envelope_push_subscriptions(text) to authenticated;

-- Delete-by-endpoint for cleaning up subscriptions that returned 410 Gone
-- from the push service (browser uninstalled, permissions revoked).
create or replace function public.delete_push_subscription_by_endpoint(p_endpoint text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.push_subscriptions where endpoint = p_endpoint;
$$;

revoke all on function public.delete_push_subscription_by_endpoint(text) from public;
grant execute on function public.delete_push_subscription_by_endpoint(text) to authenticated;
