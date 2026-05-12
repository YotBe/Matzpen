'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { getGoldenRecord } from '@/services/supabaseService';
import {
  ensureSelfEnvelopeMembership,
  listEnvelopeMembers,
} from '@/services/warRoomService';
import { ShiftBoard } from '@/components/WarRoom/ShiftBoard';
import { TaskList } from '@/components/WarRoom/TaskList';
import { BackupRequestPanel } from '@/components/WarRoom/BackupRequestPanel';
import { EnvelopeInviteManager } from '@/components/WarRoom/EnvelopeInvite';
import type { EnvelopeMember } from '@/lib/types';

type Tab = 'shifts' | 'tasks' | 'envelope';

export default function WarRoomPage() {
  const { t } = useT();
  const { configured, user } = useAuth();
  const patientId = usePatientId();
  const [tab, setTab] = useState<Tab>('shifts');
  const [members, setMembers] = useState<EnvelopeMember[]>([]);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshMembers = useCallback(async () => {
    try {
      const list = await listEnvelopeMembers(patientId);
      setMembers(list);
    } catch {
      /* RLS will surface empty list when not configured */
    }
  }, [patientId]);

  useEffect(() => {
    if (!configured || !patientId || !user) {
      setBootstrapping(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const golden = await getGoldenRecord(patientId).catch(() => null);
        const displayName =
          golden?.patientName?.trim() ||
          (user.user_metadata?.full_name as string | undefined) ||
          user.email ||
          null;
        await ensureSelfEnvelopeMembership(patientId, displayName);
        if (!cancelled) await refreshMembers();
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, patientId, user, refreshMembers]);

  if (!configured) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('warRoom.notConfigured')}
      </div>
    );
  }

  if (bootstrapping) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('warRoom.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('warRoom.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('warRoom.intro')}</p>
      </header>

      {/* The backup panel always shows the active SOS at the top so anyone
          landing on the page sees the alert immediately. */}
      {user && (
        <BackupRequestPanel
          patientId={patientId}
          currentUserId={user.id}
          members={members}
        />
      )}

      <div role="tablist" className="flex gap-2 border-b border-sand-100">
        <TabBtn label={t('warRoom.tab.shifts')} active={tab === 'shifts'} onClick={() => setTab('shifts')} />
        <TabBtn label={t('warRoom.tab.tasks')} active={tab === 'tasks'} onClick={() => setTab('tasks')} />
        <TabBtn label={t('warRoom.tab.envelope')} active={tab === 'envelope'} onClick={() => setTab('envelope')} />
      </div>

      {tab === 'shifts' && user && (
        <ShiftBoard
          patientId={patientId}
          currentUserId={user.id}
          members={members}
        />
      )}
      {tab === 'tasks' && <TaskList patientId={patientId} members={members} />}
      {tab === 'envelope' && (
        <EnvelopeInviteManager
          patientId={patientId}
          members={members}
          onMembersChange={refreshMembers}
        />
      )}

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('warRoom.disclaimer')}
      </aside>
    </div>
  );
}

function TabBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={onClick}
      className={`relative -mb-px px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
        active ? 'border-clay text-clay' : 'border-transparent text-ink-soft hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}
