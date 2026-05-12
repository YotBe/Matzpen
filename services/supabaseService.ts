import { supabase } from '@/lib/supabaseClient';
import type {
  BureaucracyChecklist,
  BureaucracySection,
  DailyLog,
  GoldenRecord,
  MedicationTaken,
} from '@/lib/types';

function requireClient() {
  if (!supabase)
    throw new Error(
      'Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  return supabase;
}

export async function addDailyLog(
  patientId: string,
  log: Omit<DailyLog, 'id' | 'patientId' | 'createdAt'>,
): Promise<void> {
  const db = requireClient();
  const { error } = await db.from('daily_logs').insert({
    patient_id: patientId,
    date: new Date().toISOString().split('T')[0],
    sleep_hours: log.sleepHours,
    affective_state: log.affectiveState,
    psychomotor_speed: log.psychomotorSpeed,
    impulsivity_event: log.impulsivityEvent,
    medication_taken: log.medicationTaken ?? null,
    note: log.notes ?? null,
    logged_by: log.loggedBy,
    logged_by_name: log.loggedByName ?? null,
  });
  if (error) throw error;
}

export async function getRecentLogs(patientId: string, limit = 30): Promise<DailyLog[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('daily_logs')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    loggedBy: row.logged_by ?? '',
    loggedByName: row.logged_by_name ?? undefined,
    // Coerce nulls to NaN (not 0) so the alert algorithm can skip them instead
    // of treating "missing sleep" as "0 hours slept" and firing a false alert.
    sleepHours: row.sleep_hours == null ? NaN : Number(row.sleep_hours),
    affectiveState: row.affective_state,
    psychomotorSpeed: row.psychomotor_speed,
    impulsivityEvent: row.impulsivity_event,
    medicationTaken: (row.medication_taken ?? undefined) as MedicationTaken | undefined,
    notes: row.note ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  }));
}

export async function getChecklist(patientId: string): Promise<BureaucracyChecklist[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('checklist_items')
    .select('*')
    .eq('patient_id', patientId);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    section: row.section as BureaucracySection,
    itemKey: row.item_key,
    done: row.done,
    updatedAt: Date.now(),
  }));
}

export async function setChecklistItem(
  patientId: string,
  section: BureaucracySection,
  itemKey: string,
  done: boolean,
): Promise<void> {
  const db = requireClient();
  const { error } = await db
    .from('checklist_items')
    .upsert(
      { patient_id: patientId, section, item_key: itemKey, done },
      { onConflict: 'patient_id,section,item_key' },
    );
  if (error) throw error;
}

export async function saveGoldenRecord(
  patientId: string,
  data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>,
): Promise<void> {
  const db = requireClient();
  const { error } = await db.from('golden_records').upsert(
    {
      patient_id: patientId,
      patient_name: data.patientName?.trim() || null,
      relationship: data.relationship?.trim() || null,
      region: data.region?.trim() || null,
      city: data.city?.trim() || null,
      diagnosis: data.diagnosis,
      comorbidities: data.comorbidities,
      medications: data.medications,
      allergies: data.allergies,
      risk_vectors: data.riskVectors,
      contacts: data.contacts,
      discharge_date: data.dischargeDate || null,
      next_refill_date: data.nextRefillDate || null,
      when_well_loves: data.whenWellLoves?.trim() || null,
      when_well_calms: data.whenWellCalms?.trim() || null,
      when_well_never_say: data.whenWellNeverSay?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'patient_id' },
  );
  if (error) throw error;
}

export async function getGoldenRecord(patientId: string): Promise<GoldenRecord | null> {
  const db = requireClient();
  const { data, error } = await db
    .from('golden_records')
    .select('*')
    .eq('patient_id', patientId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    patientId: data.patient_id,
    patientName: data.patient_name ?? undefined,
    relationship: data.relationship ?? undefined,
    region: data.region ?? undefined,
    city: data.city ?? undefined,
    diagnosis: data.diagnosis ?? '',
    comorbidities: data.comorbidities ?? '',
    medications: data.medications ?? [],
    allergies: data.allergies ?? '',
    riskVectors: data.risk_vectors ?? '',
    contacts: data.contacts ?? '',
    dischargeDate: data.discharge_date ?? undefined,
    nextRefillDate: data.next_refill_date ?? undefined,
    whenWellLoves: data.when_well_loves ?? undefined,
    whenWellCalms: data.when_well_calms ?? undefined,
    whenWellNeverSay: data.when_well_never_say ?? undefined,
    updatedAt: new Date(data.updated_at).getTime(),
  };
}

// ── Share tokens ────────────────────────────────────────────────────────────
//
// Time-bound, read-only links to a caregiver's golden record. Used by ER
// staff and outpatient psychiatrists who don't have a Matzpen login. The
// /share/[token] page reads via a SECURITY DEFINER RPC so the anon role
// never gets direct table access.

export interface ShareToken {
  token: string;
  patientId: string;
  expiresAt: number;
  revokedAt: number | null;
  createdAt: number;
}

function randomToken(len = 24): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  // URL-safe base64 without padding.
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function createShareToken(
  patientId: string,
  ttlHours: number,
): Promise<ShareToken> {
  const db = requireClient();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from('share_tokens')
    .insert({ token, patient_id: patientId, expires_at: expiresAt })
    .select()
    .single();
  if (error) throw error;
  return mapToken(data);
}

export async function listShareTokens(patientId: string): Promise<ShareToken[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('share_tokens')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapToken);
}

export async function revokeShareToken(token: string): Promise<void> {
  const db = requireClient();
  const { error } = await db
    .from('share_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token);
  if (error) throw error;
}

function mapToken(row: {
  token: string;
  patient_id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}): ShareToken {
  return {
    token: row.token,
    patientId: row.patient_id,
    expiresAt: new Date(row.expires_at).getTime(),
    revokedAt: row.revoked_at ? new Date(row.revoked_at).getTime() : null,
    createdAt: new Date(row.created_at).getTime(),
  };
}
