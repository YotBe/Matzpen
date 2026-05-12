import { supabase } from '@/lib/supabaseClient';

export interface LockdownEntry {
  itemKey: string;
  done: boolean;
  doneByCaregiver: string | null;
  doneAt: number | null;
}

function requireClient() {
  if (!supabase)
    throw new Error('Supabase not configured');
  return supabase;
}

export async function listLockdownProgress(
  patientId: string,
): Promise<LockdownEntry[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('lockdown_progress')
    .select('item_key, done, done_by_caregiver, done_at')
    .eq('patient_id', patientId);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    itemKey: r.item_key,
    done: r.done,
    doneByCaregiver: r.done_by_caregiver,
    doneAt: r.done_at ? new Date(r.done_at).getTime() : null,
  }));
}

export async function setLockdownItemDone(
  patientId: string,
  itemKey: string,
  done: boolean,
): Promise<void> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await db.from('lockdown_progress').upsert(
    {
      patient_id: patientId,
      item_key: itemKey,
      done,
      done_by_caregiver: done ? user.id : null,
      done_at: done ? new Date().toISOString() : null,
    },
    { onConflict: 'patient_id,item_key' },
  );
  if (error) throw error;
}

export async function resetLockdownProgress(patientId: string): Promise<void> {
  const db = requireClient();
  const { error } = await db
    .from('lockdown_progress')
    .delete()
    .eq('patient_id', patientId);
  if (error) throw error;
}
