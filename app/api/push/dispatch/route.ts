// Dispatch a push notification to every envelope member except the caller.
//
// Called from the client immediately after creating a backup_request row
// (or any other event that should wake other family members). The caller
// must be a member of the envelope — enforced via the SECURITY DEFINER
// RPC inside dispatchPush. We rely on the caller's token rather than a
// service-role key so a leaked key can't fan out arbitrary pushes.
import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/server/auth';
import { dispatchPush, type PushPayload } from '@/lib/server/webPush';
import { rateLimit, callerKey } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 10 dispatches per minute per user. Backup SOS is rare and pulse-like;
// anything beyond this is misuse.
const PUSH_LIMIT = 10;
const PUSH_WINDOW_MS = 60 * 1000;

interface DispatchBody {
  patient_id?: string;
  payload?: PushPayload;
}

export async function POST(req: Request) {
  const ctx = await authenticateRequest(req);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rl = await rateLimit({
    key: callerKey(req, ctx.user.id),
    limit: PUSH_LIMIT,
    windowMs: PUSH_WINDOW_MS,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many dispatches' },
      { status: 429, headers: { 'retry-after': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  let body: DispatchBody;
  try {
    body = (await req.json()) as DispatchBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.patient_id || !body.payload?.title || !body.payload?.body) {
    return NextResponse.json({ error: 'Missing patient_id or payload' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // The anon key is used here together with the caller's JWT — the
  // SECURITY DEFINER RPC will refuse if the caller isn't in the
  // envelope, so we don't need a service-role key.
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const result = await dispatchPush(
      supabaseUrl,
      anonKey,
      ctx.token,
      body.patient_id,
      body.payload,
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
