'use client';

import { useCallback, useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import {
  createEnvelopeInvite,
  listEnvelopeInvites,
  revokeEnvelopeInvite,
} from '@/services/warRoomService';
import type { EnvelopeInvite, EnvelopeMember } from '@/lib/types';

interface Props {
  patientId: string;
  members: EnvelopeMember[];
  onMembersChange: () => void;
}

const TTL_OPTIONS = [
  { hours: 24, key: 'share.ttl.24h' },
  { hours: 24 * 7, key: 'share.ttl.7d' },
  { hours: 24 * 30, key: 'share.ttl.30d' },
];

export function EnvelopeInviteManager({ patientId, members, onMembersChange }: Props) {
  const { t, locale } = useT();
  const [invites, setInvites] = useState<EnvelopeInvite[]>([]);
  const [ttlHours, setTtlHours] = useState<number>(24 * 7);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const list = await listEnvelopeInvites(patientId);
      setInvites(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invites');
    }
  }, [patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      await createEnvelopeInvite(patientId, ttlHours);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(token: string) {
    setBusy(true);
    try {
      await revokeEnvelopeInvite(token);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  function urlFor(token: string): string {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
    return `${origin}/envelope/join/${token}`;
  }

  async function copyToken(token: string) {
    try {
      await navigator.clipboard.writeText(urlFor(token));
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const active = invites.filter((i) => !i.redeemedAt && i.expiresAt > Date.now());

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">{t('warRoom.envelope.heading')}</h2>

      <div className="mz-card p-4 md:p-5">
        <p className="text-sm text-ink-soft leading-relaxed">
          {t('warRoom.envelope.intro')}
        </p>

        {members.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {members.map((m) => (
              <li key={m.caregiverId} className="mz-pill">
                {m.displayName?.trim() || t('warRoom.shifts.unnamedMember')}
                {m.role === 'owner' && (
                  <span className="ms-1 text-[10px] opacity-70">
                    · {t('warRoom.envelope.ownerTag')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

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
            disabled={busy}
            className="mz-btn mz-btn-clay h-10 px-4 text-sm"
          >
            {t('warRoom.envelope.inviteCta')}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {active.length > 0 && (
          <ul className="mt-3 space-y-2">
            {active.map((inv) => {
              const url = urlFor(inv.token);
              const expires = new Date(inv.expiresAt).toLocaleString(
                locale === 'he' ? 'he-IL' : 'en-US',
              );
              return (
                <li
                  key={inv.token}
                  className="rounded-2xl bg-sand-50 border border-sand-100 p-3 space-y-2"
                  onClick={() => onMembersChange()}
                >
                  <div className="text-xs text-ink-mute">
                    {t('share.expiresAt', { when: expires })}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code
                      className="text-xs text-ink-soft bg-white rounded-lg px-2 py-1.5 break-all min-w-0 flex-1 border border-sand-100"
                      dir="ltr"
                    >
                      {url}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToken(inv.token)}
                      className="mz-btn mz-btn-ghost h-9 px-3 text-xs"
                    >
                      {copied === inv.token ? t('share.copied') : t('share.copy')}
                    </button>
                    <button
                      type="button"
                      onClick={() => revoke(inv.token)}
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
      </div>

      <p className="text-xs text-ink-mute mt-3 leading-relaxed">
        {t('warRoom.envelope.disclaimer')}
      </p>
    </section>
  );
}
