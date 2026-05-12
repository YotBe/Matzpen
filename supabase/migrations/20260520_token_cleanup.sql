-- Housekeeping for short-lived tokens.
--
-- share_tokens and envelope_invites accumulate forever right now. The
-- application paths filter on `expires_at > now()` so expired rows are
-- invisible — but they still occupy storage and clutter the dashboards.
-- This migration installs two functions an operator can call (or wire
-- to pg_cron / Supabase scheduled function) to delete:
--   - share_tokens that have been expired for > 7 days OR revoked > 7 days
--   - envelope_invites that have been expired for > 30 days OR redeemed > 30 days
--
-- Idempotent. Safe to run from the Supabase SQL editor on any schedule.

create or replace function public.cleanup_expired_share_tokens()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.share_tokens
   where (expires_at < now() - interval '7 days')
      or (revoked_at is not null and revoked_at < now() - interval '7 days');
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

create or replace function public.cleanup_expired_envelope_invites()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.envelope_invites
   where (expires_at < now() - interval '30 days')
      or (redeemed_at is not null and redeemed_at < now() - interval '30 days');
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- Single entry point that runs both. Callers can ignore the return value.
create or replace function public.cleanup_expired_tokens()
returns table (share_tokens_deleted integer, invites_deleted integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_share integer;
  v_invites integer;
begin
  select public.cleanup_expired_share_tokens() into v_share;
  select public.cleanup_expired_envelope_invites() into v_invites;
  return query select v_share, v_invites;
end;
$$;

-- Reserved for operator/cron use — do NOT expose to clients.
revoke all on function public.cleanup_expired_share_tokens() from public, authenticated, anon;
revoke all on function public.cleanup_expired_envelope_invites() from public, authenticated, anon;
revoke all on function public.cleanup_expired_tokens() from public, authenticated, anon;

comment on function public.cleanup_expired_tokens() is
  'Run from the SQL editor or wire to pg_cron / a Supabase scheduled edge function. Returns a single row with two counts.';
