// Persist a caregiver's push subscription. Called by the client after
// `Notification.requestPermission()` + `pushManager.subscribe()`. RLS on
// push_subscriptions only allows the row to be inserted by the matching
// caregiver_id, so we just forward the caller's token as the supabase
// client auth.
import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Payload {
  patient_id?: string;
  endpoint?: string;
  p256dh?: string;
  auth?: string;
  user_agent?: string;
}

export async function POST(req: Request) {
  const ctx = await authenticateRequest(req);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.patient_id || !body.endpoint || !body.p256dh || !body.auth) {
    return NextResponse.json({ error: 'Missing subscription fields' }, { status: 400 });
  }

  const { error } = await ctx.db.from('push_subscriptions').upsert(
    {
      caregiver_id: ctx.user.id,
      patient_id: body.patient_id,
      endpoint: body.endpoint,
      p256dh: body.p256dh,
      auth: body.auth,
      user_agent: body.user_agent ?? null,
    },
    { onConflict: 'caregiver_id,endpoint' },
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const ctx = await authenticateRequest(req);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: { endpoint?: string };
  try {
    body = (await req.json()) as { endpoint?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }
  const { error } = await ctx.db
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', body.endpoint);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
