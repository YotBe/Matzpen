// In-memory sliding-window rate limit, keyed by caller (auth user id, or IP).
//
// This is a best-effort guardrail against runaway Gemini bills. It is per
// process — on Vercel that means per warm lambda instance, so a hostile
// client can amplify by hitting cold starts. For real protection, swap in
// Upstash Redis or a Vercel KV store. For now this catches the common case
// (one logged-in caregiver looping requests).

type Bucket = { hits: number[]; warned: boolean };

const buckets = new Map<string, Bucket>();

function prune(bucket: Bucket, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  while (bucket.hits.length > 0 && bucket.hits[0] < cutoff) bucket.hits.shift();
}

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetMs: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [], warned: false };
  prune(bucket, windowMs, now);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, resetMs: Math.max(0, windowMs - (now - oldest)) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.max(0, limit - bucket.hits.length), resetMs: windowMs };
}

export function callerKey(req: Request, userId: string | null): string {
  if (userId) return `u:${userId}`;
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anon';
  return `ip:${ip}`;
}
