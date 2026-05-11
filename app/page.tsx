'use client';

import { useEffect, useState } from 'react';
import { AlertBanner } from '@/components/AlertBanner';
import { DailyLogForm } from '@/components/DailyLogForm';
import { WeeklySummary } from '@/components/WeeklySummary';
import { OnboardingOverlay } from '@/components/OnboardingOverlay';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { MOCK_PATIENT_ID, MOCK_PATIENT_NAME } from '@/lib/constants';
import { getRecentLogs } from '@/services/supabaseService';
import type { DailyLog } from '@/lib/types';

// Mock recent logs used when Supabase isn't configured so the AlertBanner
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
  const { user, configured } = useAuth();
  const { t } = useT();
  const patientId = usePatientId();
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_LOGS);
  const [logsLoading, setLogsLoading] = useState<boolean>(configured);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    t('dashboard.defaultName');

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    setLogsLoading(true);
    (async () => {
      try {
        const fetched = await getRecentLogs(patientId, 7);
        if (!cancelled && fetched.length > 0) setLogs(fetched);
      } catch {
        /* leave mock logs */
      } finally {
        if (!cancelled) setLogsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, patientId]);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <OnboardingOverlay />
      <header className="text-center md:text-start">
        <p className="text-sm text-ink-mute">{t('dashboard.greeting', { name: displayName })}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('dashboard.title')}
        </h1>
        <p className="text-ink mt-2 leading-relaxed font-semibold">
          {t('dashboard.valueProp')}
        </p>
        <p className="text-ink-mute mt-1 text-sm leading-relaxed">
          {t('dashboard.subtitle', { patient: MOCK_PATIENT_NAME })}
        </p>
      </header>

      {logsLoading ? (
        <div className="mz-card p-5 md:p-6 animate-pulse">
          <div className="h-4 w-1/3 bg-sand-100 rounded mb-3" />
          <div className="h-3 w-2/3 bg-sand-100 rounded" />
        </div>
      ) : (
        <AlertBanner logs={logs} />
      )}

      {!logsLoading && <WeeklySummary logs={logs} />}

      <div className="mz-card p-5 md:p-8">
        <DailyLogForm
          recentLogs={logs}
          onSubmitted={(log) => setLogs((prev) => [{ ...log }, ...prev].slice(0, 7))}
        />
      </div>

      <p className="text-xs text-ink-mute text-center leading-relaxed">
        {t('dashboard.disclaimer')}
      </p>
    </div>
  );
}
