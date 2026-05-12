// Sliding-window rate limit.
//
// Two implementations:
//   - In-memory (default): per-process Map. Best-effort only — a hostile
//     client can bypass by hitting cold-start lambdas.
//   - Upstash REST: persistent across instances. Activated when both
//     UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
//
// API stays callsite-compatible: `rateLimit({ key, limit, windowMs })`
// returns a Promise<RateLimitResult>. Existing callers await the result.

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

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// ── In-memory fallback ─────────────────────────────────────────────────
type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

function inMemory({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  const cutoff = now - windowMs;
  while (bucket.hits.length > 0 && bucket.hits[0] < cutoff) bucket.hits.shift();
  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, resetMs: Math.max(0, windowMs - (now - oldest)) };
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.max(0, limit - bucket.hits.length), resetMs: windowMs };
}

// ── Upstash REST ──────────────────────────────────────────────────────
// Single INCR + EXPIRE per request via pipeline. Cheap and atomic.
async function upstash({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, String(ttlSec), 'NX'],
        ['PTTL', redisKey],
      ]),
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);
    const data = (await res.json()) as Array<{ result: number }>;
    const count = data[0]?.result ?? 0;
    const pttl = data[2]?.result ?? windowMs;
    const resetMs = pttl > 0 ? pttl : windowMs;
    if (count > limit) {
      return { ok: false, remaining: 0, resetMs };
    }
    return { ok: true, remaining: Math.max(0, limit - count), resetMs };
  } catch {
    // Fail open with in-memory fallback rather than blocking legitimate
    // traffic during a Redis outage. The error is logged but doesn't
    // propagate.
    console.error('[rateLimit] upstash failed, falling back to in-memory');
    return inMemory({ key, limit, windowMs });
  }
}

export function rateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  return useUpstash ? upstash(opts) : Promise.resolve(inMemory(opts));
}

export function callerKey(req: Request, userId: string | null): string {
  if (userId) return `u:${userId}`;
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anon';
  return `ip:${ip}`;
}
