'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import {
  createSharedTask,
  deleteSharedTask,
  listSharedTasks,
  setSharedTaskDone,
} from '@/services/warRoomService';
import { track } from '@/lib/analytics';
import type { EnvelopeMember, SharedTask } from '@/lib/types';

interface Props {
  patientId: string;
  members: EnvelopeMember[];
}

export function TaskList({ patientId, members }: Props) {
  const { t } = useT();
  const [tasks, setTasks] = useState<SharedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listSharedTasks(patientId)
      .then((t) => {
        if (!cancelled) setTasks(t);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`shared_tasks:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_tasks',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          void listSharedTasks(patientId).then(setTasks).catch(() => {});
        },
      )
      .subscribe();
    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [patientId]);

  function nameFor(id: string | undefined): string {
    if (!id) return '';
    const m = members.find((x) => x.caregiverId === id);
    return m?.displayName?.trim() || t('warRoom.shifts.unnamedMember');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = title.trim();
    if (!v || busy) return;
    setBusy(true);
    try {
      await createSharedTask(patientId, v);
      track('shared_task_created');
      setTitle('');
    } catch {
      /* surfaced via realtime */
    } finally {
      setBusy(false);
    }
  }

  async function toggle(task: SharedTask) {
    // Optimistic flip.
    const next = !task.done;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: next } : t)),
    );
    try {
      await setSharedTaskDone(task.id, next);
      if (next) track('shared_task_completed');
    } catch {
      // Realtime refetch will restore truth.
    }
  }

  const open = tasks.filter((t) => !t.done);
  const closed = tasks.filter((t) => t.done);

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">{t('warRoom.tasks.heading')}</h2>

      <form onSubmit={submit} className="mz-card p-4 flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('warRoom.tasks.placeholder')}
          className="mz-input flex-1"
          maxLength={140}
        />
        <button
          type="submit"
          disabled={busy || !title.trim()}
          className="mz-btn mz-btn-clay h-11 px-4 text-sm"
        >
          {t('warRoom.tasks.add')}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink-mute mt-4">{t('common.loading')}</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-ink-mute mt-4 text-center py-6">
          {t('warRoom.tasks.empty')}
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {open.map((task) => (
              <TaskRow key={task.id} task={task} nameFor={nameFor} onToggle={toggle} onDelete={deleteSharedTask} />
            ))}
          </ul>
          {closed.length > 0 && (
            <details className="mt-4">
              <summary className="text-xs text-ink-mute cursor-pointer">
                {t('warRoom.tasks.completed', { n: closed.length })}
              </summary>
              <ul className="mt-3 space-y-2">
                {closed.map((task) => (
                  <TaskRow key={task.id} task={task} nameFor={nameFor} onToggle={toggle} onDelete={deleteSharedTask} />
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </section>
  );
}

function TaskRow({
  task,
  nameFor,
  onToggle,
  onDelete,
}: {
  task: SharedTask;
  nameFor: (id: string | undefined) => string;
  onToggle: (task: SharedTask) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const { t, locale } = useT();
  return (
    <li className="mz-card p-3 flex items-start gap-3">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
        className="mt-1.5 shrink-0"
        aria-label={task.title}
      />
      <div className="min-w-0 flex-1">
        <div
          className={`text-base leading-snug ${
            task.done ? 'text-ink-mute line-through' : ''
          }`}
        >
          {task.title}
        </div>
        <div className="text-[11px] text-ink-mute mt-0.5">
          {task.done && task.doneAt
            ? t('warRoom.tasks.doneBy', {
                name: nameFor(task.doneByCaregiver),
                when: new Date(task.doneAt).toLocaleString(
                  locale === 'he' ? 'he-IL' : 'en-US',
                ),
              })
            : t('warRoom.tasks.createdBy', {
                name: nameFor(task.createdByCaregiver),
              })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => void onDelete(task.id)}
        className="text-xs text-ink-mute underline shrink-0 hover:text-crimson-deep"
      >
        {t('warRoom.tasks.remove')}
      </button>
    </li>
  );
}
