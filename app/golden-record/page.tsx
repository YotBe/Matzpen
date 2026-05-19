'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { GoldenRecordDisplay } from '@/components/GoldenRecordDisplay';
import { GoldenRecordForm } from '@/components/GoldenRecordForm';
import { ShareManager } from '@/components/ShareManager';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import {
  getGoldenRecord,
  saveGoldenRecord,
} from '@/services/supabaseService';
import { track } from '@/lib/analytics';
import type { GoldenRecord } from '@/lib/types';

type Mode = 'edit' | 'view';

export default function GoldenRecordPage() {
  const { configured } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const patientId = usePatientId();
  const [record, setRecord] = useState<GoldenRecord | null>(null);
  const [mode, setMode] = useState<Mode>('edit');
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (configured) {
        try {
          const r = await getGoldenRecord(patientId);
          if (!cancelled) setRecord(r);
        } catch {
          /* leave empty */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, patientId]);

  const handleSave = useCallback(
    async (data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>) => {
      setSaveError(null);
      const next: GoldenRecord = {
        ...data,
        patientId,
        updatedAt: Date.now(),
      };
      try {
        if (configured) {
          await saveGoldenRecord(patientId, data);
        }
      } catch (err) {
        // Surface the failure to the user. We deliberately do NOT use
        // `err instanceof Error` — Supabase JS throws PostgrestError which
        // formally extends Error, but the instanceof check can return
        // false across Next.js client/server chunk boundaries. Structural
        // extraction handles Error, PostgrestError, and plain { message }
        // shapes uniformly.
        const message = describeError(err, t('gr.form.saveError'));
        setSaveError(message);
        // Full object to the console for debugging — Postgres errors carry
        // code/hint/details that don't render in the UI but matter for
        // operators applying migrations or fixing RLS.
        console.error('[golden-record] save failed:', err);
        throw err;
      }
      setRecord(next);
      track('golden_record_saved', {
        has_name: Boolean(data.patientName),
        has_region: Boolean(data.region),
        meds_count: data.medications.length,
      });
      // Invalidate the App Router cache so the dashboard re-fetches the
      // golden record when the user navigates back. Belt-and-suspenders;
      // the unmount/remount should already re-run the effect, but this
      // kills the stale-cache class of bug.
      router.refresh();
      setMode('view');
    },
    [configured, patientId, router, t],
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('common.loading')}
      </div>
    );
  }

  const hasSavedRecord = Boolean(record && record.updatedAt > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-ink-mute">{t('gr.kicker')}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
            {t('gr.title')}
          </h1>
          <p className="text-ink-mute mt-2 leading-relaxed">{t('gr.subtitle')}</p>
        </div>
        <ModeToggle mode={mode} onChange={setMode} editLabel={t('gr.mode.edit')} viewLabel={t('gr.mode.view')} />
      </header>

      {mode === 'edit' ? (
        <div className="mz-card p-5 md:p-8">
          <GoldenRecordForm
            initial={record}
            onSave={handleSave}
            errorMessage={saveError}
          />
        </div>
      ) : hasSavedRecord && record ? (
        <GoldenRecordDisplay
          record={record}
          onEdit={() => setMode('edit')}
          printLabel={t('gr.printPdf')}
        />
      ) : (
        <div className="mz-card p-8 text-center">
          <h3 className="text-lg font-bold">{t('gr.viewEmpty.title')}</h3>
          <p className="text-sm text-ink-mute mt-2 leading-relaxed">
            {t('gr.viewEmpty.body')}
          </p>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className="mz-btn mz-btn-ghost mt-6"
          >
            {t('gr.mode.edit')}
          </button>
        </div>
      )}

      {mode === 'view' && hasSavedRecord && configured && (
        <section className="mz-no-print">
          <h2 className="text-lg font-bold mb-3">{t('share.title')}</h2>
          <ShareManager patientId={patientId} configured={configured} />
        </section>
      )}

      {mode === 'view' && configured && (
        <section className="mz-no-print rounded-2xl bg-sand-50/60 border border-sand-100 p-4 md:p-5">
          <h2 className="font-bold">{t('gr.vaultLink.title')}</h2>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            {t('gr.vaultLink.body')}
          </p>
          <Link href="/vault" className="mz-btn mz-btn-ghost mt-3 h-10 px-4 text-sm">
            {t('gr.vaultLink.cta')}
          </Link>
        </section>
      )}
    </div>
  );
}

// Two-button segmented control. Mounted at the top-right of the page so it sits
// above both the edit form and the printable view.
function ModeToggle({
  mode,
  onChange,
  editLabel,
  viewLabel,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  editLabel: string;
  viewLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={editLabel}
      className="mz-no-print shrink-0 inline-flex rounded-xl bg-sand-100 p-1 text-xs font-semibold"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'edit'}
        onClick={() => onChange('edit')}
        className={`px-3 py-1.5 rounded-lg transition-colors ${
          mode === 'edit' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'
        }`}
      >
        {editLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'view'}
        onClick={() => onChange('view')}
        className={`px-3 py-1.5 rounded-lg transition-colors ${
          mode === 'view' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'
        }`}
      >
        {viewLabel}
      </button>
    </div>
  );
}

// Structural error extractor. Pulls .message / .code / .hint off any
// object-shaped value, so a PostgrestError (`{ message, code, details,
// hint }`) renders as something like:
//   `column "warning_signs" of relation "golden_records" does not exist (PGRST204)`
// rather than a useless generic fallback. Returns `fallback` only when
// the error has no extractable text at all.
function describeError(err: unknown, fallback: string): string {
  if (typeof err === 'string' && err) return err;
  if (err && typeof err === 'object') {
    const e = err as { message?: unknown; code?: unknown; hint?: unknown };
    const parts: string[] = [];
    if (typeof e.message === 'string' && e.message) parts.push(e.message);
    if (typeof e.code === 'string' && e.code) parts.push(`(${e.code})`);
    if (typeof e.hint === 'string' && e.hint) parts.push(`— ${e.hint}`);
    if (parts.length > 0) return parts.join(' ');
  }
  return fallback;
}
