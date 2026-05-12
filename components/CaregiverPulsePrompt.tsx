'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { getTodaysPulse, savePulse } from '@/services/pulseService';
import { track } from '@/lib/analytics';

interface Props {
  patientId: string;
  caregiverId: string;
  configured: boolean;
}

// Once-per-day "How are YOU doing?" prompt for the caregiver themselves.
// Surfaces as a non-blocking dismissable card on the dashboard. If the
// caregiver already filled it today (in this session or a previous one),
// we don't bug them again.
export function CaregiverPulsePrompt({ patientId, caregiverId, configured }: Props) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sleepHours, setSleepHours] = useState<string>('');
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedJustNow, setSavedJustNow] = useState(false);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    getTodaysPulse(patientId, caregiverId)
      .then((p) => {
        if (cancelled) return;
        if (!p) setOpen(true);
      })
      .catch(() => {
        /* If RLS / network fails, stay quiet rather than nag. */
      });
    return () => {
      cancelled = true;
    };
  }, [patientId, caregiverId, configured]);

  if (!open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const sleep = sleepHours.trim() === '' ? null : Number(sleepHours);
      const sleepValue = Number.isFinite(sleep) ? (sleep as number) : null;
      await savePulse(patientId, sleepValue, mood, note.trim() || null);
      track('pulse_submitted', { sleep_hours: sleepValue, mood });
      setSavedJustNow(true);
      setTimeout(() => setOpen(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (savedJustNow) {
    return (
      <aside className="rounded-2xl bg-sage-bg/70 border border-sage/20 text-sage px-4 py-3">
        <div className="text-xs font-bold uppercase tracking-wide opacity-80">
          {t('pulse.savedKicker')}
        </div>
        <p className="text-sm mt-1 leading-relaxed">{t('pulse.savedBody')}</p>
      </aside>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-clay/5 border border-clay/30 px-4 py-4"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
            {t('pulse.kicker')}
          </div>
          <h3 className="text-base font-extrabold mt-0.5">{t('pulse.title')}</h3>
          <p className="text-xs text-ink-mute mt-1 leading-relaxed">
            {t('pulse.intro')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-ink-mute underline"
        >
          {t('pulse.notNow')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <label className="block">
          <span className="text-xs font-semibold text-ink-soft">
            {t('pulse.sleepLabel')}
          </span>
          <input
            type="number"
            min={0}
            max={24}
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="—"
            className="mz-input mt-1 w-full"
          />
        </label>
        <div>
          <span className="text-xs font-semibold text-ink-soft">
            {t('pulse.moodLabel')}
          </span>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMood(n)}
                className={`flex-1 h-11 rounded-xl border text-base font-bold transition-colors ${
                  mood === n
                    ? 'bg-clay text-white border-clay'
                    : 'border-sand-100 text-ink-soft hover:bg-sand-50'
                }`}
                aria-pressed={mood === n}
                aria-label={t(`pulse.mood.${n}`)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-ink-mute mt-1">
            <span>{t('pulse.mood.1')}</span>
            <span>{t('pulse.mood.5')}</span>
          </div>
        </div>
      </div>

      <label className="block mt-3">
        <span className="text-xs font-semibold text-ink-soft">
          {t('pulse.noteLabel')}
        </span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('pulse.notePlaceholder')}
          className="mz-input mt-1 w-full"
          maxLength={200}
        />
      </label>

      {error && (
        <p className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2 mt-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mz-btn mz-btn-clay h-10 px-4 text-sm mt-3"
      >
        {t('pulse.save')}
      </button>
    </form>
  );
}
