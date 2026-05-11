import { supabase } from '@/lib/supabaseClient';
import type {
  BureaucracyChecklist,
  BureaucracySection,
  DailyLog,
  GoldenRecord,
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
    note: log.notes ?? null,
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
    loggedBy: row.patient_id,
    sleepHours: Number(row.sleep_hours),
    affectiveState: row.affective_state,
    psychomotorSpeed: row.psychomotor_speed,
    impulsivityEvent: row.impulsivity_event,
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
      diagnosis: data.diagnosis,
      comorbidities: data.comorbidities,
      medications: data.medications,
      allergies: data.allergies,
      risk_vectors: data.riskVectors,
      contacts: data.contacts,
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
    diagnosis: data.diagnosis ?? '',
    comorbidities: data.comorbidities ?? '',
    medications: data.medications ?? [],
    allergies: data.allergies ?? '',
    riskVectors: data.risk_vectors ?? '',
    contacts: data.contacts ?? '',
    updatedAt: new Date(data.updated_at).getTime(),
  };
}
