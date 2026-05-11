'use client';

import { useEffect, useState } from 'react';
import { AlertBanner } from '@/components/AlertBanner';
import { DailyLogForm } from '@/components/DailyLogForm';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PATIENT_ID, MOCK_PATIENT_NAME } from '@/lib/constants';
import { getRecentLogs } from '@/services/firestoreService';
import type { DailyLog } from '@/lib/types';

// Mock recent logs used when Firebase isn't configured so the AlertBanner
// has something realistic to render in the live preview.
const MOCK_LOGS: DailyLog[] = [
  {
    patientId: MOCK_PATIENT_ID,
    loggedBy: 'mock',
    sleepHours: 4.0,
    affectiveState: 'irritability',
    psychomotorSpeed: 4,
    impulsivityEvent: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    patientId: MOCK_PATIENT_ID,
    loggedBy: 'mock',
    sleepHours: 4.5,
    affectiveState: 'euphoria',
    psychomotorSpeed: 4,
    impulsivityEvent: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
  },
  {
    patientId: MOCK_PATIENT_ID,
    loggedBy: 'mock',
    sleepHours: 6,
    affectiveState: 'euthymia',
    psychomotorSpeed: 3,
    impulsivityEvent: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 54,
  },
];

export default function DashboardPage() {
  const { configured } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_LOGS);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getRecentLogs(MOCK_PATIENT_ID, 7);
        if (!cancelled && fetched.length > 0) setLogs(fetched);
      } catch {
        /* leave mock logs */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header className="text-center md:text-start">
        <p className="text-sm text-ink-mute">שלום, יעל</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          דיווח מעקב יומי
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">
          המצפן של {MOCK_PATIENT_NAME} · המעקב היומי לוקח כדקה ועוזר לזהות סימני אזהרה מוקדמים.
        </p>
      </header>

      <AlertBanner logs={logs} />

      <div className="mz-card p-5 md:p-8">
        <DailyLogForm
          onSubmitted={(log) => setLogs((prev) => [{ ...log }, ...prev].slice(0, 7))}
        />
      </div>
    </div>
  );
}
