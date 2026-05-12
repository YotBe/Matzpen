'use client';

import { useCallback, useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import {
  createShareToken,
  listShareTokens,
  revokeShareToken,
  type ShareToken,
} from '@/services/supabaseService';

interface Props {
  patientId: string;
  configured: boolean;
}

const TTL_OPTIONS = [
  { hours: 24, key: 'share.ttl.24h' },
  { hours: 24 * 7, key: 'share.ttl.7d' },
  { hours: 24 * 30, key: 'share.ttl.30d' },
] as const;

export function ShareManager({ patientId, configured }: Props) {
  const { t, locale } = useT();
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttlHours, setTtlHours] = useState<number>(24 * 7);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!configured) return;
    try {
      const list = await listShareTokens(patientId);
      setTokens(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load share links');
    }
  }, [configured, patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function create() {
    if (!configured) {
      setError(t('share.notConfigured'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createShareToken(patientId, ttlHours);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create share link');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(token: string) {
    setBusy(true);
    setError(null);
    try {
      await revokeShareToken(token);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke link');
    } finally {
      setBusy(false);
    }
  }

  function urlFor(token: string): string {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
    return `${origin}/share/${token}`;
  }

  async function copy(token: string) {
    try {
      await navigator.clipboard.writeText(urlFor(token));
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      /* clipboard blocked — user will copy manually */
    }
  }

  const active = tokens.filter((t) => !t.revokedAt && t.expiresAt > Date.now());

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute mb-3">
          {t('share.kicker')}
        </div>
        <p className="text-sm text-ink-soft leading-relaxed">{t('share.intro')}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="text-sm text-ink-soft">
            {t('share.ttlLabel')}
            <select
              value={ttlHours}
              onChange={(e) => setTtlHours(Number(e.target.value))}
              className="mz-input mt-1 ms-2 inline-block w-auto py-2 px-3 text-sm"
            >
              {TTL_OPTIONS.map((opt) => (
                <option key={opt.hours} value={opt.hours}>
                  {t(opt.key)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={create}
            disabled={busy || !configured}
            className="mz-btn mz-btn-clay h-10 px-4 text-sm"
          >
            {t('share.createCta')}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {active.length > 0 && (
        <ul className="space-y-2">
          {active.map((tk) => {
            const url = urlFor(tk.token);
            const expires = new Date(tk.expiresAt).toLocaleString(
              locale === 'he' ? 'he-IL' : 'en-US',
            );
            return (
              <li key={tk.token} className="mz-card p-4">
                <div className="text-xs text-ink-mute">
                  {t('share.expiresAt', { when: expires })}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <code
                    className="text-xs text-ink-soft bg-sand-100 rounded-lg px-2 py-1.5 break-all min-w-0 flex-1"
                    dir="ltr"
                  >
                    {url}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(tk.token)}
                    className="mz-btn mz-btn-ghost h-9 px-3 text-xs"
                  >
                    {copiedToken === tk.token ? t('share.copied') : t('share.copy')}
                  </button>
                  <button
                    type="button"
                    onClick={() => revoke(tk.token)}
                    disabled={busy}
                    className="mz-btn mz-btn-ghost h-9 px-3 text-xs"
                  >
                    {t('share.revoke')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-ink-mute leading-relaxed">{t('share.disclaimer')}</p>
    </div>
  );
}
