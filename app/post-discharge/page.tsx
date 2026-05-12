'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import {
  getChecklist,
  getGoldenRecord,
  setChecklistItem,
} from '@/services/supabaseService';
import {
  POST_DISCHARGE_PHASES,
  POST_DISCHARGE_SECTION,
  dayOffsetFrom,
} from '@/lib/postDischarge/timeline';

export default function PostDischargePage() {
  const { t } = useT();
  const { configured } = useAuth();
  const patientId = usePatientId();
  const [dischargeDate, setDischargeDate] = useState<string | undefined>(undefined);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!configured || !patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [record, checklist] = await Promise.all([
        getGoldenRecord(patientId).catch(() => null),
        getChecklist(patientId).catch(() => []),
      ]);
      setDischargeDate(record?.dischargeDate);
      setDone(
        new Set(
          checklist
            .filter((c) => c.section === POST_DISCHARGE_SECTION && c.done)
            .map((c) => c.itemKey),
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [configured, patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function toggle(itemKey: string, next: boolean) {
    const optimistic = new Set(done);
    if (next) optimistic.add(itemKey);
    else optimistic.delete(itemKey);
    setDone(optimistic);
    try {
      await setChecklistItem(patientId, POST_DISCHARGE_SECTION, itemKey, next);
    } catch {
      // Revert on failure.
      void refresh();
    }
  }

  const dayOffset = dayOffsetFrom(dischargeDate);
  const totalItems = POST_DISCHARGE_PHASES.reduce((n, p) => n + p.items.length, 0);
  const doneCount = POST_DISCHARGE_PHASES.reduce(
    (n, p) => n + p.items.filter((it) => done.has(it.id)).length,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('postDischarge.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('postDischarge.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('postDischarge.intro')}</p>
      </header>

      {!dischargeDate ? (
        <div className="mz-card p-5 md:p-6 border-s-4 border-clay">
          <h2 className="text-lg font-extrabold">{t('postDischarge.noDate.title')}</h2>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            {t('postDischarge.noDate.body')}
          </p>
          <Link href="/golden-record" className="mz-btn mz-btn-clay mt-4 text-sm">
            {t('postDischarge.noDate.cta')}
          </Link>
        </div>
      ) : (
        <div className="mz-card p-4 md:p-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div className="text-sm text-ink-soft">
              {t('postDischarge.dischargeOn', { date: dischargeDate })}
            </div>
            <div className="text-xs text-ink-mute">
              {t('postDischarge.dayLabel', { day: dayOffset ?? 0 })}
            </div>
          </div>
          <div className="mt-3 h-2 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-clay rounded-full transition-all"
              style={{ width: `${(doneCount / totalItems) * 100}%` }}
            />
          </div>
          <div className="text-xs text-ink-mute mt-1">
            {t('postDischarge.progress', { done: doneCount, total: totalItems })}
          </div>
        </div>
      )}

      <ol className="space-y-5">
        {POST_DISCHARGE_PHASES.map((phase) => {
          const offset = dayOffset;
          const isPast = offset != null && offset > phase.toDay;
          const isCurrent =
            offset != null && offset >= phase.fromDay && offset <= phase.toDay;
          return (
            <li key={phase.titleKey} className="mz-card p-4 md:p-5">
              <header className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
                    {t(phase.titleKey)}
                  </div>
                  <h2 className="text-base font-extrabold mt-1">{t(phase.intentKey)}</h2>
                </div>
                {isCurrent && (
                  <span className="mz-pill bg-clay/15 text-clay-deep">
                    {t('postDischarge.currentPhase')}
                  </span>
                )}
                {isPast && (
                  <span className="mz-pill bg-sage/15 text-sage">
                    {t('postDischarge.pastPhase')}
                  </span>
                )}
              </header>
              <ul className="mt-3 space-y-2">
                {phase.items.map((it) => {
                  const checked = done.has(it.id);
                  return (
                    <li key={it.id}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => void toggle(it.id, e.target.checked)}
                          disabled={loading}
                          className="mt-1.5"
                        />
                        <span className="flex-1">
                          <span
                            className={`text-base leading-snug ${
                              checked ? 'text-ink-mute line-through' : ''
                            }`}
                          >
                            {t(it.labelKey)}
                          </span>
                          {it.hintKey && (
                            <span className="block text-xs text-ink-mute mt-0.5 leading-relaxed">
                              {t(it.hintKey)}
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('postDischarge.disclaimer')}
      </aside>
    </div>
  );
}
