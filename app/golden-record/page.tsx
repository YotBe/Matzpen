'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoldenRecordDisplay } from '@/components/GoldenRecordDisplay';
import { GoldenRecordForm } from '@/components/GoldenRecordForm';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import {
  getGoldenRecord,
  saveGoldenRecord,
} from '@/services/supabaseService';
import type { GoldenRecord } from '@/lib/types';

export default function GoldenRecordPage() {
  const { configured } = useAuth();
  const { t } = useT();
  const patientId = usePatientId();
  const [record, setRecord] = useState<GoldenRecord | null>(null);
  const [editing, setEditing] = useState(false);
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
      setEditing(false);
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

  const showForm = editing || !record || record.updatedAt === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">{t('gr.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('gr.title')}
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">{t('gr.subtitle')}</p>
      </header>

      {showForm ? (
        <div className="mz-card p-5 md:p-8">
          <GoldenRecordForm initial={record} onSave={handleSave} />
          {record && record.updatedAt > 0 && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="mt-4 text-sm text-ink-mute"
            >
              {t('gr.cancelEdit')}
            </button>
          )}
        </div>
      ) : (
        <GoldenRecordDisplay record={record} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}
