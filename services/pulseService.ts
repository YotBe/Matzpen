import { supabase } from '@/lib/supabaseClient';

export interface CaregiverPulse {
  id: string;
  patientId: string;
  caregiverId: string;
  pulseDate: string;
  sleepHours: number | null;
  mood: number | null;
  note: string | null;
  createdAt: number;
}

function requireClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getTodaysPulse(
  patientId: string,
  caregiverId: string,
): Promise<CaregiverPulse | null> {
  const db = requireClient();
  const { data, error } = await db
    .from('caregiver_pulse')
    .select('*')
    .eq('patient_id', patientId)
    .eq('caregiver_id', caregiverId)
    .eq('pulse_date', todayISO())
    .maybeSingle();
  if (error) throw error;
  return data ? mapPulse(data) : null;
}

export async function listRecentPulse(
  patientId: string,
  days = 7,
): Promise<CaregiverPulse[]> {
  const db = requireClient();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const { data, error } = await db
    .from('caregiver_pulse')
    .select('*')
    .eq('patient_id', patientId)
    .gte('pulse_date', cutoff)
    .order('pulse_date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPulse);
}

export async function savePulse(
  patientId: string,
  sleepHours: number | null,
  mood: number | null,
  note: string | null,
): Promise<void> {
  const db = requireClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await db.from('caregiver_pulse').upsert(
    {
      patient_id: patientId,
      caregiver_id: user.id,
      pulse_date: todayISO(),
      sleep_hours: sleepHours,
      mood,
      note,
    },
    { onConflict: 'caregiver_id,pulse_date' },
  );
  if (error) throw error;
}

function mapPulse(row: {
  id: string;
  patient_id: string;
  caregiver_id: string;
  pulse_date: string;
  sleep_hours: number | null;
  mood: number | null;
  note: string | null;
  created_at: string;
}): CaregiverPulse {
  return {
    id: row.id,
    patientId: row.patient_id,
    caregiverId: row.caregiver_id,
    pulseDate: row.pulse_date,
    sleepHours: row.sleep_hours == null ? null : Number(row.sleep_hours),
    mood: row.mood,
    note: row.note,
    createdAt: new Date(row.created_at).getTime(),
  };
}

// Heuristic burnout detection. Inputs:
//   - the most recent pulse rows for the envelope
//   - the list of envelope members
//   - the last-48h activity (shifts/tasks/backups) authored by each member
// Returns the caregiver_id we're worried about, plus a reason.
export interface BurnoutSignal {
  caregiverId: string;
  reason: 'no_sleep' | 'solo_48h';
}

export function detectBurnout({
  pulses,
  envelopeCaregiverIds,
  recentActorIds,
}: {
  pulses: CaregiverPulse[];
  envelopeCaregiverIds: string[];
  // Caregiver ids who created/updated anything (shifts, tasks, backup
  // requests) within the last 48 hours.
  recentActorIds: string[];
}): BurnoutSignal | null {
  // Rule 1: anyone whose latest pulse reports 0 hours of sleep.
  for (const p of pulses) {
    if (p.sleepHours != null && p.sleepHours <= 0) {
      return { caregiverId: p.caregiverId, reason: 'no_sleep' };
    }
  }
  // Rule 2: only ONE caregiver is showing up for the past 48h while the
  // envelope has 2+ members. They're carrying it alone.
  if (envelopeCaregiverIds.length >= 2 && recentActorIds.length === 1) {
    return { caregiverId: recentActorIds[0], reason: 'solo_48h' };
  }
  return null;
}
