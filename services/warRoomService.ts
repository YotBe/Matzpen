import { supabase } from '@/lib/supabaseClient';
import type {
  BackupRequest,
  EnvelopeInvite,
  EnvelopeMember,
  Shift,
  SharedTask,
} from '@/lib/types';

function requireClient() {
  if (!supabase)
    throw new Error(
      'Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  return supabase;
}

function randomToken(len = 24): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ── Envelope membership ────────────────────────────────────────────────────

export async function ensureSelfEnvelopeMembership(
  patientId: string,
  displayName: string | null,
): Promise<void> {
  const db = requireClient();
  // Idempotent: only insert if the row doesn't exist yet.
  const { data: existing } = await db
    .from('patient_envelopes')
    .select('patient_id')
    .eq('patient_id', patientId)
    .limit(1)
    .maybeSingle();
  if (existing) return;
  await db.from('patient_envelopes').insert({
    patient_id: patientId,
    role: 'owner',
    display_name: displayName,
  });
}

export async function listEnvelopeMembers(patientId: string): Promise<EnvelopeMember[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('patient_envelopes')
    .select('*')
    .eq('patient_id', patientId)
    .order('joined_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    patientId: r.patient_id,
    caregiverId: r.caregiver_id,
    role: r.role,
    displayName: r.display_name ?? undefined,
    joinedAt: new Date(r.joined_at).getTime(),
  }));
}

export async function leaveEnvelope(patientId: string, caregiverId: string): Promise<void> {
  const db = requireClient();
  const { error } = await db
    .from('patient_envelopes')
    .delete()
    .eq('patient_id', patientId)
    .eq('caregiver_id', caregiverId);
  if (error) throw error;
}

// ── Invites ────────────────────────────────────────────────────────────────

export async function createEnvelopeInvite(
  patientId: string,
  ttlHours: number,
): Promise<EnvelopeInvite> {
  const db = requireClient();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from('envelope_invites')
    .insert({ token, patient_id: patientId, expires_at: expiresAt })
    .select()
    .single();
  if (error) throw error;
  return mapInvite(data);
}

export async function listEnvelopeInvites(patientId: string): Promise<EnvelopeInvite[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('envelope_invites')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInvite);
}

export async function revokeEnvelopeInvite(token: string): Promise<void> {
  const db = requireClient();
  const { error } = await db.from('envelope_invites').delete().eq('token', token);
  if (error) throw error;
}

export async function redeemEnvelopeInvite(token: string): Promise<string> {
  const db = requireClient();
  const { data, error } = await db.rpc('redeem_envelope_invite', { p_token: token });
  if (error) throw error;
  return data as string;
}

// ── Shifts ─────────────────────────────────────────────────────────────────

export async function listShifts(patientId: string): Promise<Shift[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('shifts')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapShift);
}

export async function createShift(
  patientId: string,
  startAt: Date,
  endAt: Date,
  note: string | null,
): Promise<Shift> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await db
    .from('shifts')
    .insert({
      patient_id: patientId,
      caregiver_id: user.id,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      note,
    })
    .select()
    .single();
  if (error) throw error;
  return mapShift(data);
}

export async function deleteShift(id: string): Promise<void> {
  const db = requireClient();
  const { error } = await db.from('shifts').delete().eq('id', id);
  if (error) throw error;
}

// ── Shared tasks ───────────────────────────────────────────────────────────

export async function listSharedTasks(patientId: string): Promise<SharedTask[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('shared_tasks')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapTask);
}

export async function createSharedTask(
  patientId: string,
  title: string,
): Promise<SharedTask> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await db
    .from('shared_tasks')
    .insert({
      patient_id: patientId,
      title,
      created_by_caregiver: user.id,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTask(data);
}

export async function setSharedTaskDone(
  id: string,
  done: boolean,
): Promise<void> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await db
    .from('shared_tasks')
    .update({
      done,
      done_by_caregiver: done ? user.id : null,
      done_at: done ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSharedTask(id: string): Promise<void> {
  const db = requireClient();
  const { error } = await db.from('shared_tasks').delete().eq('id', id);
  if (error) throw error;
}

// ── Backup requests ────────────────────────────────────────────────────────

export async function listOpenBackupRequests(
  patientId: string,
): Promise<BackupRequest[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('backup_requests')
    .select('*')
    .eq('patient_id', patientId)
    .is('resolved_at', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBackup);
}

export async function createBackupRequest(
  patientId: string,
  message: string | null,
): Promise<BackupRequest> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await db
    .from('backup_requests')
    .insert({
      patient_id: patientId,
      requester_caregiver_id: user.id,
      message,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBackup(data);
}

export async function resolveBackupRequest(id: string): Promise<void> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await db
    .from('backup_requests')
    .update({
      resolved_at: new Date().toISOString(),
      resolved_by_caregiver: user.id,
    })
    .eq('id', id);
  if (error) throw error;
}

// ── Mappers ────────────────────────────────────────────────────────────────

function mapInvite(row: {
  token: string;
  patient_id: string;
  inviter_caregiver_id: string;
  expires_at: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
  created_at: string;
}): EnvelopeInvite {
  return {
    token: row.token,
    patientId: row.patient_id,
    inviterCaregiverId: row.inviter_caregiver_id,
    expiresAt: new Date(row.expires_at).getTime(),
    redeemedBy: row.redeemed_by,
    redeemedAt: row.redeemed_at ? new Date(row.redeemed_at).getTime() : null,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapShift(row: {
  id: string;
  patient_id: string;
  caregiver_id: string;
  start_at: string;
  end_at: string;
  note: string | null;
  created_at: string;
}): Shift {
  return {
    id: row.id,
    patientId: row.patient_id,
    caregiverId: row.caregiver_id,
    startAt: new Date(row.start_at).getTime(),
    endAt: new Date(row.end_at).getTime(),
    note: row.note ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapTask(row: {
  id: string;
  patient_id: string;
  title: string;
  done: boolean;
  done_by_caregiver: string | null;
  done_at: string | null;
  created_by_caregiver: string;
  created_at: string;
}): SharedTask {
  return {
    id: row.id,
    patientId: row.patient_id,
    title: row.title,
    done: row.done,
    doneByCaregiver: row.done_by_caregiver ?? undefined,
    doneAt: row.done_at ? new Date(row.done_at).getTime() : undefined,
    createdByCaregiver: row.created_by_caregiver,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapBackup(row: {
  id: string;
  patient_id: string;
  requester_caregiver_id: string;
  message: string | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by_caregiver: string | null;
}): BackupRequest {
  return {
    id: row.id,
    patientId: row.patient_id,
    requesterCaregiverId: row.requester_caregiver_id,
    message: row.message ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : undefined,
    resolvedByCaregiver: row.resolved_by_caregiver ?? undefined,
  };
}
