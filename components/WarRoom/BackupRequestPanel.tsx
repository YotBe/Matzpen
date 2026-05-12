'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import {
  createBackupRequest,
  listOpenBackupRequests,
  resolveBackupRequest,
} from '@/services/warRoomService';
import { track } from '@/lib/analytics';
import {
  dispatchPushNotification,
  pushStatus,
  subscribeToBackupPush,
} from '@/lib/pushClient';
import type { BackupRequest, EnvelopeMember } from '@/lib/types';

interface Props {
  patientId: string;
  currentUserId: string;
  members: EnvelopeMember[];
}

export function BackupRequestPanel({ patientId, currentUserId, members }: Props) {
  const { t, locale } = useT();
  const [open, setOpen] = useState<BackupRequest[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listOpenBackupRequests(patientId)
      .then((b) => {
        if (!cancelled) setOpen(b);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // Realtime: react to inserts so other tabs flash the SOS banner; also
  // to updates so the "resolved" state propagates.
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`backup_requests:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'backup_requests',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          void listOpenBackupRequests(patientId).then(setOpen).catch(() => {});
        },
      )
      .subscribe();
    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [patientId]);

  const nameFor = useMemo(() => {
    const map = new Map(members.map((m) => [m.caregiverId, m.displayName ?? '']));
    return (id: string) => map.get(id) || t('warRoom.shifts.unnamedMember');
  }, [members, t]);

  async function send(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createBackupRequest(patientId, message.trim() || null);
      track('backup_request_sent', { has_message: message.trim().length > 0 });
      // Fire push to the rest of the envelope. Best-effort — the row is
      // already in the DB and the realtime subscription will show it in
      // any open tab. Push only matters for members with the app closed.
      void dispatchPushNotification(patientId, {
        title: t('push.sos.title'),
        body: message.trim() || t('push.sos.fallbackBody'),
        url: '/war-room',
        tag: 'matzpen-sos',
      });
      setMessage('');
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function resolve(id: string) {
    try {
      await resolveBackupRequest(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">{t('warRoom.backup.heading')}</h2>

      {/* Active alerts from any member — visible to all members. */}
      {open.length > 0 && (
        <ul className="space-y-2 mb-4">
          {open.map((req) => {
            const mine = req.requesterCaregiverId === currentUserId;
            return (
              <li
                key={req.id}
                className="rounded-2xl bg-crimson-bg text-crimson-deep border border-crimson/30 p-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                      {t('warRoom.backup.activeBanner')}
                    </div>
                    <div className="font-extrabold text-base mt-1">
                      {mine
                        ? t('warRoom.backup.yoursWaiting')
                        : t('warRoom.backup.requestedBy', {
                            name: nameFor(req.requesterCaregiverId),
                          })}
                    </div>
                    {req.message && (
                      <p className="text-sm mt-2 leading-relaxed">{req.message}</p>
                    )}
                    <div className="text-[11px] mt-2 opacity-75">
                      {new Date(req.createdAt).toLocaleString(
                        locale === 'he' ? 'he-IL' : 'en-US',
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => resolve(req.id)}
                    className="mz-btn mz-btn-ghost h-9 px-3 text-xs"
                  >
                    {t('warRoom.backup.resolve')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Request form / button. */}
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mz-btn mz-btn-crimson w-full"
        >
          {t('warRoom.backup.sosCta')}
        </button>
      ) : (
        <form
          onSubmit={send}
          className="mz-card p-4 md:p-5 space-y-3 border-2 border-crimson/30"
        >
          <p className="text-sm text-ink-soft leading-relaxed">
            {t('warRoom.backup.confirmIntro')}
          </p>
          <label className="block">
            <span className="text-xs font-semibold text-ink-soft">
              {t('warRoom.backup.messageLabel')}
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder={t('warRoom.backup.messagePlaceholder')}
              className="mz-input mt-1.5 resize-y"
              maxLength={240}
            />
          </label>
          {error && (
            <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="mz-btn mz-btn-crimson h-10 px-4 text-sm"
            >
              {t('warRoom.backup.send')}
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-ink-mute mt-3 leading-relaxed">
        {t('warRoom.backup.disclaimer')}
      </p>

      <PushOptIn patientId={patientId} />
    </section>
  );
}

function PushOptIn({ patientId }: { patientId: string }) {
  const { t } = useT();
  const [status, setStatus] = useState<ReturnType<typeof pushStatus>>('unsupported');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(pushStatus());
  }, []);

  if (status === 'unsupported' || status === 'unconfigured' || status === 'granted') {
    return null;
  }

  async function enable() {
    setBusy(true);
    try {
      const ok = await subscribeToBackupPush(patientId);
      if (ok) setStatus('granted');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl bg-sand-50 border border-sand-100 px-3 py-2 flex items-center justify-between gap-3">
      <p className="text-xs text-ink-soft leading-relaxed">
        {status === 'denied' ? t('push.optIn.denied') : t('push.optIn.body')}
      </p>
      {status !== 'denied' && (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="mz-btn mz-btn-clay h-8 px-3 text-xs whitespace-nowrap"
        >
          {t('push.optIn.cta')}
        </button>
      )}
    </div>
  );
}
