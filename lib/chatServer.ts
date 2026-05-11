import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { UIMessage } from 'ai';

export interface AuthorizedDb {
  db: SupabaseClient;
  patientId: string;
}

// Build a Supabase client scoped to the caller's JWT, and resolve their
// patient_id via the existing RPC. Returns null when the user is anonymous
// or RLS denies access.
export async function getAuthorizedDb(
  token: string | null,
): Promise<AuthorizedDb | null> {
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const db = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: patientId } = await db.rpc('get_my_patient_id');
  if (!patientId) return null;
  return { db, patientId };
}

// Latest 30 turns, returned oldest-first so they can drop straight into
// useChat's initialMessages. Each row is mapped to the AI SDK's UIMessage
// shape; older messages get newly-generated ids since the DB row id is a uuid
// we don't otherwise need on the client.
export async function loadRecentChatTurns(
  auth: AuthorizedDb,
  limit = 30,
): Promise<UIMessage[]> {
  const { data, error } = await auth.db
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('patient_id', auth.patientId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[chat] loadRecentChatTurns failed:', error);
    return [];
  }
  const rows = (data ?? []).slice().reverse();
  return rows.map((row) => ({
    id: row.id as string,
    role: row.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: row.content as string }],
  }));
}

export async function saveChatMessage(
  auth: AuthorizedDb,
  role: 'user' | 'assistant',
  content: string,
  model?: string,
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;
  const { error } = await auth.db.from('chat_messages').insert({
    patient_id: auth.patientId,
    role,
    content: trimmed,
    model: model ?? null,
  });
  if (error) {
    // Don't break the chat stream on a persistence failure — just log it.
    console.error('[chat] saveChatMessage failed:', error);
  }
}
