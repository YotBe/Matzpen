import { NextResponse } from 'next/server';
import { getAuthorizedDb, loadRecentChatTurns } from '@/lib/chatServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Returns the caller's most recent chat turns so the assistant widget can
// hydrate `useChat` with continuity from prior sessions. Anonymous callers
// (or callers whose token doesn't resolve to a patient) get an empty list.
export async function GET(req: Request) {
  const token = req.headers.get('x-supabase-token');
  const auth = await getAuthorizedDb(token).catch(() => null);
  if (!auth) return NextResponse.json({ messages: [] });

  const messages = await loadRecentChatTurns(auth, 30);
  return NextResponse.json({ messages });
}
