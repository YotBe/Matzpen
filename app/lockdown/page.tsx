'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { supabase } from '@/lib/supabaseClient';
import {
  LOCKDOWN_CATEGORY_ORDER,
  LOCKDOWN_ITEMS,
  type LockdownCategory,
} from '@/lib/lockdown/items';
import {
  listLockdownProgress,
  resetLockdownProgress,
  setLockdownItemDone,
  type LockdownEntry,
} from '@/services/lockdownService';
import { track } from '@/lib/analytics';
import { listEnvelopeMembers } from '@/services/warRoomService';
import type { EnvelopeMember } from '@/lib/types';

export default function LockdownPage() {
  const { t, locale } = useT();
  const { configured } = useAuth();
  const patientId = usePatientId();
  const [progress, setProgress] = useState<Record<string, LockdownEntry>>({});
  const [members, setMembers] = useState<EnvelopeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    try {
      const [entries, mems] = await Promise.all([
        listLockdownProgress(patientId),
        listEnvelopeMembers(patientId).catch(() => []),
      ]);
      const map: Record<string, LockdownEntry> = {};
      for (const e of entries) map[e.itemKey] = e;
      setProgress(map);
      setMembers(mems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [configured, patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Realtime sync — when one envelope member checks off an item, the rest
  // see it within a second. Keeps the protocol coherent under load.
  useEffect(() => {
    if (!supabase || !configured) return;
    const channel = supabase
      .channel(`lockdown:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lockdown_progress',
          filter: `patient_id=eq.${patientId}`,
        },
        () => void refresh(),
      )
      .subscribe();
    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [configured, patientId, refresh]);

  const nameFor = useMemo(() => {
    const map = new Map(members.map((m) => [m.caregiverId, m.displayName ?? '']));
    return (id: string | null) =>
      (id && map.get(id)) || t('warRoom.shifts.unnamedMember');
  }, [members, t]);

  async function toggle(itemKey: string) {
    const entry = progress[itemKey];
    const next = !entry?.done;
    // Optimistic.
    setProgress((prev) => ({
      ...prev,
      [itemKey]: {
        itemKey,
        done: next,
        doneByCaregiver: next ? 'me' : null,
        doneAt: next ? Date.now() : null,
      },
    }));
    try {
      await setLockdownItemDone(patientId, itemKey, next);
      track('lockdown_item_toggled', { item: itemKey, done: next });
    } catch {
      void refresh();
    }
  }

  async function reset() {
    if (!confirm(t('lockdown.resetConfirm'))) return;
    try {
      await resetLockdownProgress(patientId);
      setProgress({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  const total = LOCKDOWN_ITEMS.length;
  const doneCount = LOCKDOWN_ITEMS.filter((it) => progress[it.id]?.done).length;
  const itemsByCategory: Record<LockdownCategory, typeof LOCKDOWN_ITEMS> = {
    access: [],
    finance: [],
    travel: [],
    substances: [],
  };
  for (const it of LOCKDOWN_ITEMS) itemsByCategory[it.category].push(it);

  if (!configured) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('warRoom.notConfigured')}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-crimson">
          {t('lockdown.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('lockdown.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('lockdown.intro')}</p>
      </header>

      {/* Sticky progress bar — visible while scrolling so the family
          immediately sees "we're at 4/11" without re-scrolling. */}
      <div className="sticky top-16 md:top-16 z-20 -mx-4 px-4 md:-mx-6 md:px-6 py-3 bg-sand-50/95 backdrop-blur border-y border-sand-100">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="text-sm font-semibold">
            {t('lockdown.progress', { done: doneCount, total })}
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-ink-mute underline"
          >
            {t('lockdown.resetCta')}
          </button>
        </div>
        <div className="mt-2 h-2 bg-sand-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-crimson rounded-full transition-all"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>
      </div>

      {loading && <p className="text-sm text-ink-mute">{t('common.loading')}</p>}
      {error && (
        <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {LOCKDOWN_CATEGORY_ORDER.map((cat) => (
        <section key={cat}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink-mute mb-2">
            {t(`lockdown.category.${cat}`)}
          </h2>
          <ul className="space-y-2">
            {itemsByCategory[cat].map((it) => {
              const entry = progress[it.id];
              const checked = entry?.done ?? false;
              return (
                <li
                  key={it.id}
                  className={`mz-card p-4 transition-colors ${
                    checked ? 'bg-sage-bg/40 border border-sage/30' : ''
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => void toggle(it.id)}
                      className="mt-1.5 shrink-0 h-5 w-5"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-base font-semibold leading-snug ${
                          checked ? 'text-ink-mute line-through' : ''
                        }`}
                      >
                        {t(it.labelKey)}
                      </div>
                      {it.hintKey && (
                        <p className="text-xs text-ink-mute mt-1 leading-relaxed">
                          {t(it.hintKey)}
                        </p>
                      )}
                      {checked && entry?.doneAt && (
                        <div className="text-[11px] text-ink-mute mt-1.5">
                          {t('lockdown.doneBy', {
                            name: nameFor(entry.doneByCaregiver),
                            when: new Date(entry.doneAt).toLocaleString(
                              locale === 'he' ? 'he-IL' : 'en-US',
                            ),
                          })}
                        </div>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl bg-crimson-bg border border-crimson/30 p-4 md:p-5">
        <h2 className="font-bold text-base text-crimson-deep">
          {t('lockdown.followUp.title')}
        </h2>
        <p className="text-sm mt-2 leading-relaxed">{t('lockdown.followUp.body')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/legal-shield" className="mz-btn mz-btn-ghost h-9 px-3 text-xs">
            {t('lockdown.followUp.legalCta')}
          </Link>
          <Link href="/war-room" className="mz-btn mz-btn-ghost h-9 px-3 text-xs">
            {t('lockdown.followUp.warRoomCta')}
          </Link>
          <Link href="/safety" className="mz-btn mz-btn-ghost h-9 px-3 text-xs">
            {t('lockdown.followUp.safetyCta')}
          </Link>
        </div>
      </section>

      <aside className="text-xs text-ink-mute leading-relaxed">
        {t('lockdown.disclaimer')}
      </aside>
    </div>
  );
}
