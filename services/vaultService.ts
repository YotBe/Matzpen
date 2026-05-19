import { supabase } from '@/lib/supabaseClient';

export interface VaultFile {
  id: string;
  patientId: string;
  caregiverId: string;
  storagePath: string;
  kind: 'video' | 'audio' | 'image' | 'other';
  mimeType: string | null;
  byteSize: number | null;
  durationSeconds: number | null;
  caption: string | null;
  recordedAt: number | null;
  createdAt: number;
}

function requireClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

const BUCKET = 'vault';

// Hard caps. Bigger files block on slow connections during a crisis and
// often aren't more useful than a 60-second clip for clinical evidence.
export const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_PREFIXES = ['video/', 'audio/', 'image/'];

function kindFromMime(mime: string): VaultFile['kind'] {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('image/')) return 'image';
  return 'other';
}

function safeExt(mime: string): string {
  const ext = mime.split('/')[1]?.split(';')[0]?.toLowerCase() ?? 'bin';
  return ext.replace(/[^a-z0-9]/g, '') || 'bin';
}

export async function uploadVaultFile(
  patientId: string,
  blob: Blob,
  options: { caption?: string; durationSeconds?: number; originalName?: string } = {},
): Promise<VaultFile> {
  const db = requireClient();
  const mime = blob.type || 'application/octet-stream';
  if (!ALLOWED_PREFIXES.some((p) => mime.startsWith(p))) {
    throw new Error('Unsupported file type');
  }
  if (blob.size <= 0 || blob.size > MAX_BYTES) {
    throw new Error('File is empty or too large');
  }
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const id = crypto.randomUUID();
  // Path convention: <patient_id>/<file_id>.<ext>
  // The storage RLS policy parses out the first path segment to enforce
  // envelope membership, so this layout is load-bearing.
  const path = `${patientId}/${id}.${safeExt(mime)}`;

  const { error: uploadErr } = await db.storage.from(BUCKET).upload(path, blob, {
    contentType: mime,
    upsert: false,
  });
  if (uploadErr) throw uploadErr;

  const { data, error } = await db
    .from('vault_files')
    .insert({
      id,
      patient_id: patientId,
      caregiver_id: user.id,
      storage_path: path,
      kind: kindFromMime(mime),
      mime_type: mime,
      byte_size: blob.size,
      duration_seconds: options.durationSeconds ?? null,
      caption: options.caption?.trim() || options.originalName || null,
      recorded_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) {
    // Try to clean up the orphaned object so we don't leak storage.
    await db.storage.from(BUCKET).remove([path]).catch(() => {});
    throw error;
  }
  return mapFile(data);
}

export async function listVaultFiles(patientId: string): Promise<VaultFile[]> {
  const db = requireClient();
  const { data, error } = await db
    .from('vault_files')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapFile);
}

export async function signVaultUrl(path: string, ttlSeconds = 60 * 10): Promise<string> {
  const db = requireClient();
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, ttlSeconds);
  if (error || !data) throw error ?? new Error('Failed to sign URL');
  return data.signedUrl;
}

export async function deleteVaultFile(file: VaultFile): Promise<void> {
  const db = requireClient();
  // Delete metadata first; even if storage fails, the row is gone so the
  // file becomes invisible to the UI. A nightly cleanup would catch the
  // orphan if we ever wire one up.
  const { error } = await db.from('vault_files').delete().eq('id', file.id);
  if (error) throw error;
  await db.storage.from('vault').remove([file.storagePath]).catch(() => {});
}

function mapFile(row: {
  id: string;
  patient_id: string;
  caregiver_id: string;
  storage_path: string;
  kind: string;
  mime_type: string | null;
  byte_size: number | null;
  duration_seconds: number | null;
  caption: string | null;
  recorded_at: string | null;
  created_at: string;
}): VaultFile {
  return {
    id: row.id,
    patientId: row.patient_id,
    caregiverId: row.caregiver_id,
    storagePath: row.storage_path,
    kind: (row.kind as VaultFile['kind']) ?? 'other',
    mimeType: row.mime_type,
    byteSize: row.byte_size,
    durationSeconds: row.duration_seconds == null ? null : Number(row.duration_seconds),
    caption: row.caption,
    recordedAt: row.recorded_at ? new Date(row.recorded_at).getTime() : null,
    createdAt: new Date(row.created_at).getTime(),
  };
}
