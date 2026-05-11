'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoldenRecordDisplay } from '@/components/GoldenRecordDisplay';
import { GoldenRecordForm } from '@/components/GoldenRecordForm';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PATIENT_ID } from '@/lib/constants';
import {
  getGoldenRecord,
  saveGoldenRecord,
} from '@/services/firestoreService';
import type { GoldenRecord } from '@/lib/types';

const EMPTY_LOCAL: GoldenRecord = {
  patientId: MOCK_PATIENT_ID,
  diagnosis: '',
  comorbidities: '',
  medications: [],
  allergies: '',
  riskVectors: '',
  contacts: '',
  updatedAt: 0,
};

export default function GoldenRecordPage() {
  const { configured } = useAuth();
  const [record, setRecord] = useState<GoldenRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (configured) {
        try {
          const r = await getGoldenRecord(MOCK_PATIENT_ID);
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
  }, [configured]);

  const handleSave = useCallback(
    async (data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>) => {
      const next: GoldenRecord = {
        ...data,
        patientId: MOCK_PATIENT_ID,
        updatedAt: Date.now(),
      };
      if (configured) {
        await saveGoldenRecord(MOCK_PATIENT_ID, data);
      }
      setRecord(next);
      setEditing(false);
    },
    [configured],
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        טוען…
      </div>
    );
  }

  const showForm = editing || !record || record.updatedAt === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">תיק רפואי דיגיטלי</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          תיק למיון פסיכיאטרי
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">
          ה־<em>Golden Record</em> — מסמך אחד שמכיל את כל המידע הקריטי שצוות המיון צריך תוך דקות. ניתן להדפיס או להציג למוקדן.
        </p>
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
              ביטול ושמירת הגרסה הקיימת
            </button>
          )}
        </div>
      ) : (
        <GoldenRecordDisplay record={record} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}
