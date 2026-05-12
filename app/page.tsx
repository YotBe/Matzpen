'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertBanner } from '@/components/AlertBanner';
import { DailyLogForm } from '@/components/DailyLogForm';
import { WeeklySummary } from '@/components/WeeklySummary';
import { OnboardingOverlay } from '@/components/OnboardingOverlay';
import { RefillBanner } from '@/components/RefillBanner';
import { TrendChart } from '@/components/TrendChart';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import {
  MOCK_PATIENT_ID,
  MOCK_PATIENT_NAME,
  PREVIEW_MODE_ENABLED,
} from '@/lib/constants';
import { getGoldenRecord, getRecentLogs } from '@/services/supabaseService';
import type { DailyLog, GoldenRecord } from '@/lib/types';

// Demo logs are only ever shown when the operator explicitly opts into
// preview mode via NEXT_PUBLIC_ENABLE_PREVIEW_MODE=true. Without that flag
// the AuthGate now blocks the unconfigured app entirely, so these values
// can't leak into a real caregiver's view.
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
  const [logs, setLogs] = useState<DailyLog[]>(PREVIEW_MODE_ENABLED ? MOCK_LOGS : []);
  const [logsLoading, setLogsLoading] = useState<boolean>(configured);
  // Patient name from the Golden Record. `undefined` while loading, empty
  // string when the caregiver hasn't filled it in yet, real name otherwise.
  const [patientName, setPatientName] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<GoldenRecord | null>(null);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    t('dashboard.defaultName');

  useEffect(() => {
    if (!configured) {
      // Preview mode (explicitly opted in) shows the placeholder name so the
      // dashboard isn't blank for marketing screenshots. Otherwise leave the
      // name unset — but AuthGate won't render us at all in that case.
      setPatientName(PREVIEW_MODE_ENABLED ? MOCK_PATIENT_NAME : '');
      return;
    }
    let cancelled = false;
    setLogsLoading(true);
    (async () => {
      try {
        const [fetched, golden] = await Promise.all([
          getRecentLogs(patientId, 30),
          getGoldenRecord(patientId).catch(() => null),
        ]);
        if (!cancelled) {
          if (fetched.length > 0) setLogs(fetched);
          setPatientName(golden?.patientName?.trim() || '');
          setRecord(golden ?? null);
        }
      } catch {
        if (!cancelled) setPatientName('');
      } finally {
        if (!cancelled) setLogsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, patientId]);

  const hasPatientName = Boolean(patientName);
  const showSetupBanner = configured && patientName === '';

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
          {hasPatientName
            ? t('dashboard.subtitle', { patient: patientName as string })
            : t('dashboard.subtitleGeneric')}
        </p>
      </header>

      {showSetupBanner && <SetupBanner />}

      <RefillBanner nextRefillDate={record?.nextRefillDate} />

      <PostDischargeBanner dischargeDate={record?.dischargeDate} />

      {logsLoading ? (
        <div className="mz-card p-5 md:p-6 animate-pulse">
          <div className="h-4 w-1/3 bg-sand-100 rounded mb-3" />
          <div className="h-3 w-2/3 bg-sand-100 rounded" />
        </div>
      ) : (
        <AlertBanner logs={logs} />
      )}

      {!logsLoading && <WeeklySummary logs={logs} />}

      {!logsLoading && <TrendChart logs={logs} days={14} />}

      <div className="mz-card p-5 md:p-8">
        <DailyLogForm
          recentLogs={logs}
          onSubmitted={(log) =>
            setLogs((prev) => [{ ...log }, ...prev].slice(0, 30))
          }
        />
      </div>

      <p className="text-xs text-ink-mute text-center leading-relaxed">
        {t('dashboard.disclaimer')}
      </p>
    </div>
  );
}

function SetupBanner() {
  const { t } = useT();
  return (
    <div className="mz-card p-5 md:p-6 border-s-4 border-clay">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
            {t('dashboard.setup.kicker')}
          </div>
          <h2 className="text-lg md:text-xl font-extrabold mt-1">
            {t('dashboard.setup.title')}
          </h2>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            {t('dashboard.setup.body')}
          </p>
        </div>
        <span aria-hidden className="text-3xl shrink-0 select-none">
          ◐
        </span>
      </div>
      <Link href="/golden-record" className="mz-btn mz-btn-clay mt-4">
        {t('dashboard.setup.cta')}
      </Link>
    </div>
  );
}

// Surfaces the post-discharge timeline only during the 30-day window after
// the most recent discharge. The first month is when re-admit risk is
// highest — this nudges the family into the structured follow-up checklist.
function PostDischargeBanner({ dischargeDate }: { dischargeDate: string | undefined }) {
  const { t } = useT();
  if (!dischargeDate) return null;
  const d = new Date(`${dischargeDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const dayOffset = Math.floor(
    (Date.now() - d.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (dayOffset < 0 || dayOffset > 30) return null;
  return (
    <aside className="rounded-2xl bg-sage-bg/70 text-sage border border-sage/20 px-4 py-3 flex items-start justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wide opacity-80">
          {t('postDischarge.kicker')}
        </div>
        <p className="text-sm text-ink-soft mt-1 leading-relaxed">
          {t('postDischarge.bannerBody', { day: dayOffset })}
        </p>
      </div>
      <Link
        href="/post-discharge"
        className="text-xs font-semibold underline whitespace-nowrap"
      >
        {t('postDischarge.bannerCta')}
      </Link>
    </aside>
  );
}
