'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import {
  createShift,
  deleteShift,
  listShifts,
} from '@/services/warRoomService';
import { track } from '@/lib/analytics';
import type { EnvelopeMember, Shift } from '@/lib/types';

interface Props {
  patientId: string;
  currentUserId: string;
  members: EnvelopeMember[];
}

export function ShiftBoard({ patientId, currentUserId, members }: Props) {
  const { t, locale } = useT();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Default to a 4-hour block starting at the next half hour.
  useEffect(() => {
    if (startAt && endAt) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() < 30 ? 30 : 60);
    now.setSeconds(0);
    now.setMilliseconds(0);
    const end = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    setStartAt(toInputLocal(now));
    setEndAt(toInputLocal(end));
  }, [startAt, endAt]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listShifts(patientId)
      .then((s) => {
        if (!cancelled) setShifts(s);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // Realtime: refetch on any insert/update/delete touching this patient's
  // shifts. Cheap because RLS already filters server-side.
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`shifts:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          void listShifts(patientId).then(setShifts).catch(() => {});
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

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const s = new Date(startAt);
    const eDate = new Date(endAt);
    if (Number.isNaN(s.getTime()) || Number.isNaN(eDate.getTime())) {
      setError(t('warRoom.shifts.errorBadDate'));
      return;
    }
    if (eDate <= s) {
      setError(t('warRoom.shifts.errorEndBeforeStart'));
      return;
    }
    setBusy(true);
    try {
      await createShift(patientId, s, eDate, note.trim() || null);
      track('shift_created', {
        duration_minutes: Math.round((eDate.getTime() - s.getTime()) / 60000),
      });
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteShift(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">{t('warRoom.shifts.heading')}</h2>

      <form onSubmit={submit} className="mz-card p-4 md:p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-ink-soft">
              {t('warRoom.shifts.startAt')}
            </span>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
              className="mz-input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink-soft">
              {t('warRoom.shifts.endAt')}
            </span>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
              className="mz-input mt-1.5"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-ink-soft">
            {t('warRoom.shifts.note')}
          </span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('warRoom.shifts.notePlaceholder')}
            className="mz-input mt-1.5"
            maxLength={120}
          />
        </label>
        {error && (
          <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mz-btn mz-btn-clay w-full sm:w-auto"
        >
          {t('warRoom.shifts.signUp')}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink-mute mt-4">{t('common.loading')}</p>
      ) : shifts.length === 0 ? (
        <p className="text-sm text-ink-mute mt-4 text-center py-6">
          {t('warRoom.shifts.empty')}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {shifts.map((s) => {
            const start = new Date(s.startAt);
            const end = new Date(s.endAt);
            const now = Date.now();
            const active = s.startAt <= now && s.endAt > now;
            const past = s.endAt <= now;
            const mine = s.caregiverId === currentUserId;
            return (
              <li
                key={s.id}
                className={`mz-card p-4 ${
                  active ? 'ring-2 ring-clay/40 bg-clay/5' : past ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-base font-bold">
                      {formatRange(start, end, locale)}
                    </div>
                    <div className="text-xs text-ink-mute mt-0.5">
                      {nameFor(s.caregiverId)}
                      {active && (
                        <span className="ms-2 mz-pill bg-clay/15 text-clay-deep">
                          {t('warRoom.shifts.activeNow')}
                        </span>
                      )}
                    </div>
                    {s.note && (
                      <p className="text-sm text-ink-soft mt-1.5">{s.note}</p>
                    )}
                  </div>
                  {mine && (
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-xs text-ink-mute underline hover:text-crimson-deep"
                    >
                      {t('common.cancel')}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function toInputLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatRange(start: Date, end: Date, locale: string): string {
  const tag = locale === 'he' ? 'he-IL' : 'en-US';
  const sameDay = start.toDateString() === end.toDateString();
  const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  if (sameDay) {
    return `${start.toLocaleDateString(tag, dateOpts)} · ${start.toLocaleTimeString(
      tag,
      timeOpts,
    )}–${end.toLocaleTimeString(tag, timeOpts)}`;
  }
  return `${start.toLocaleString(tag, { ...dateOpts, ...timeOpts })} → ${end.toLocaleString(
    tag,
    { ...dateOpts, ...timeOpts },
  )}`;
}
