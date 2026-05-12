import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// These tests cover the in-memory branch only — the Upstash branch
// requires UPSTASH_REDIS_REST_URL+TOKEN env vars and hits a real
// Redis. We ensure those vars are unset before importing so the
// module captures the in-memory path at module load.
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

import { callerKey, rateLimit } from './rateLimit';

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('https://example.com', { headers });
}

describe('rateLimit (in-memory)', () => {
  beforeEach(() => {
    // Each test uses a unique key so the global Map doesn't pollute.
  });

  it('allows requests under the limit', async () => {
    const key = `t-${Math.random()}`;
    const r1 = await rateLimit({ key, limit: 3, windowMs: 1000 });
    assert.equal(r1.ok, true);
    assert.equal(r1.remaining, 2);
    const r2 = await rateLimit({ key, limit: 3, windowMs: 1000 });
    assert.equal(r2.ok, true);
    assert.equal(r2.remaining, 1);
  });

  it('blocks the (limit+1)-th request', async () => {
    const key = `t-${Math.random()}`;
    await rateLimit({ key, limit: 2, windowMs: 1000 });
    await rateLimit({ key, limit: 2, windowMs: 1000 });
    const r3 = await rateLimit({ key, limit: 2, windowMs: 1000 });
    assert.equal(r3.ok, false);
    assert.equal(r3.remaining, 0);
    assert.ok(r3.resetMs > 0 && r3.resetMs <= 1000);
  });

  it('isolates buckets by key', async () => {
    const a = `t-${Math.random()}`;
    const b = `t-${Math.random()}`;
    await rateLimit({ key: a, limit: 1, windowMs: 1000 });
    const blockedA = await rateLimit({ key: a, limit: 1, windowMs: 1000 });
    assert.equal(blockedA.ok, false);
    const okB = await rateLimit({ key: b, limit: 1, windowMs: 1000 });
    assert.equal(okB.ok, true, 'a different key should still be allowed');
  });

  it('callerKey prefers user id when present', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4' });
    assert.equal(callerKey(req, 'user-abc'), 'u:user-abc');
  });

  it('callerKey falls back to first XFF entry when anonymous', () => {
    const req = makeRequest({ 'x-forwarded-for': '203.0.113.10, 10.0.0.1' });
    assert.equal(callerKey(req, null), 'ip:203.0.113.10');
  });

  it('callerKey falls back to x-real-ip then "anon"', () => {
    const r1 = makeRequest({ 'x-real-ip': '198.51.100.7' });
    assert.equal(callerKey(r1, null), 'ip:198.51.100.7');
    const r2 = makeRequest({});
    assert.equal(callerKey(r2, null), 'ip:anon');
  });
});
