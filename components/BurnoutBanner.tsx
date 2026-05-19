'use client';

import { useEffect, useMemo, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import { detectBurnout, listRecentPulse } from '@/services/pulseService';
import { listEnvelopeMembers } from '@/services/warRoomService';
import type { EnvelopeMember } from '@/lib/types';

interface Props {
  patientId: string;
  configured: boolean;
}

// Heuristic burnout watch. Pulls the last 7 days of caregiver_pulse rows
// + envelope membership + 48h activity log, and renders a banner if the
// detection function says one caregiver is at risk. Visible to ALL
// envelope members — the point is for the rest of the family to see
// "X has been carrying this alone, jump in."
export function BurnoutBanner({ patientId, configured }: Props) {
  const { t } = useT();
  const [signal, setSignal] = useState<{
    name: string;
    reason: 'no_sleep' | 'solo_48h';
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!configured || dismissed) return;
    let cancelled = false;

    async function check() {
      if (!supabase) return;
      try {
        const [pulses, members] = await Promise.all([
          listRecentPulse(patientId, 7),
          listEnvelopeMembers(patientId),
        ]);
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const [{ data: tasksAct }, { data: shiftsAct }, { data: backupsAct }] =
          await Promise.all([
            supabase
              .from('shared_tasks')
              .select('created_by_caregiver')
              .eq('patient_id', patientId)
              .gte('created_at', cutoff),
            supabase
              .from('shifts')
              .select('caregiver_id')
              .eq('patient_id', patientId)
              .gte('created_at', cutoff),
            supabase
              .from('backup_requests')
              .select('requester_caregiver_id')
              .eq('patient_id', patientId)
              .gte('created_at', cutoff),
          ]);

        const actorIds = new Set<string>();
        for (const r of (tasksAct ?? []) as { created_by_caregiver: string }[])
          actorIds.add(r.created_by_caregiver);
        for (const r of (shiftsAct ?? []) as { caregiver_id: string }[])
          actorIds.add(r.caregiver_id);
        for (const r of (backupsAct ?? []) as { requester_caregiver_id: string }[])
          actorIds.add(r.requester_caregiver_id);

        const det = detectBurnout({
          pulses,
          envelopeCaregiverIds: members.map((m) => m.caregiverId),
          recentActorIds: [...actorIds],
        });

        if (cancelled) return;

        if (!det) {
          setSignal(null);
          return;
        }
        const name = nameOf(members, det.caregiverId, t);
        setSignal({ name, reason: det.reason });
      } catch {
        /* swallow — non-blocking */
      }
    }

    void check();
    const id = setInterval(check, 5 * 60 * 1000); // refresh every 5 min
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [configured, dismissed, patientId, t]);

  const message = useMemo(() => {
    if (!signal) return null;
    return signal.reason === 'no_sleep'
      ? t('burnout.noSleep', { name: signal.name })
      : t('burnout.solo48h', { name: signal.name });
  }, [signal, t]);

  if (!signal || !message) return null;

  return (
    <aside className="rounded-2xl bg-amber_-bg text-amber_-ink border border-amber_/30 px-4 py-3 flex items-start justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wide opacity-80">
          {t('burnout.kicker')}
        </div>
        <p className="text-sm mt-1 leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <a href="/self-care" className="text-xs font-semibold underline">
          {t('burnout.selfCareCta')}
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-ink-mute underline"
        >
          {t('burnout.dismiss')}
        </button>
      </div>
    </aside>
  );
}

function nameOf(
  members: EnvelopeMember[],
  caregiverId: string,
  t: (key: string) => string,
): string {
  const m = members.find((x) => x.caregiverId === caregiverId);
  return m?.displayName?.trim() || t('warRoom.shifts.unnamedMember');
}
