'use client';

import Link from 'next/link';
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
import type { GoldenRecord } from '@/lib/types';

type Mode = 'edit' | 'view';

export default function GoldenRecordPage() {
  const { configured } = useAuth();
  const { t } = useT();
  const patientId = usePatientId();
  const [record, setRecord] = useState<GoldenRecord | null>(null);
  const [mode, setMode] = useState<Mode>('edit');
  const [loading, setLoading] = useState(true);

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
      const next: GoldenRecord = {
        ...data,
        patientId,
        updatedAt: Date.now(),
      };
      if (configured) {
        await saveGoldenRecord(patientId, data);
      }
      setRecord(next);
      // After a successful save, drop the user into view mode so they can
      // immediately read or print the freshly saved record.
      setMode('view');
    },
    [configured, patientId],
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
          <GoldenRecordForm initial={record} onSave={handleSave} />
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
