'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { addDailyLog } from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { computeAlertLevel } from '@/utils/alertAlgorithm';
import { track } from '@/lib/analytics';
import {
  type AffectiveState,
  type AlertLevel,
  type DailyLog,
  type MedicationTaken,
  type WarningSign,
} from '@/lib/types';
import { CheckIcon } from '@/components/icons';

const AFFECTIVE_TONES: Record<AffectiveState, string> = {
  depression: 'bg-muted_blue-bg text-muted_blue border-muted_blue/30',
  euthymia: 'bg-sage-bg text-sage border-sage/30',
  euphoria: 'bg-clay-bg text-clay border-clay/30',
  irritability: 'bg-crimson-bg text-crimson-deep border-crimson/30',
};

interface Props {
  onSubmitted?: (log: Omit<DailyLog, 'id'>) => void;
  // Recent logs used to compute the post-submit guidance level. Optional.
  recentLogs?: DailyLog[];
  // Personalized warning signs from the golden record. When present, the
  // form renders a quick multi-select; the chosen ids are saved on the
  // daily log and used by the alert algorithm.
  warningSigns?: WarningSign[];
}

function SectionCard({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section>
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute mb-2.5">
        {kicker}
      </div>
      {children}
    </section>
  );
}

export function DailyLogForm({ onSubmitted, recentLogs, warningSigns }: Props) {
  const { user, configured } = useAuth();
  const { t } = useT();
  const patientId = usePatientId();
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [affectiveState, setAffectiveState] = useState<AffectiveState>('euthymia');
  const [psychomotorSpeed, setPsychomotorSpeed] = useState<number>(3);
  const [impulsivityEvent, setImpulsivityEvent] = useState<boolean>(false);
  const [medicationTaken, setMedicationTaken] = useState<MedicationTaken>('yes');
  const [notes, setNotes] = useState<string>('');
  const [warningSignsHit, setWarningSignsHit] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<Omit<DailyLog, 'id'> | null>(null);

  const psychoLabel = t(
    psychomotorSpeed <= 1 ? 'dailyLog.psycho1'
    : psychomotorSpeed === 2 ? 'dailyLog.psycho2'
    : psychomotorSpeed === 3 ? 'dailyLog.psycho3'
    : psychomotorSpeed === 4 ? 'dailyLog.psycho4'
    : 'dailyLog.psycho5',
  );

  const affectiveLabels: Record<AffectiveState, string> = {
    depression: t('affective.depression'),
    euthymia: t('affective.euthymia'),
    euphoria: t('affective.euphoria'),
    irritability: t('affective.irritability'),
  };

  // Re-run the alert algorithm including the just-submitted snapshot so the
  // post-submit guidance reflects the freshly logged data.
  const postSubmitLevel: AlertLevel = useMemo(() => {
    if (!submittedSnapshot) return 'STABLE';
    return computeAlertLevel([submittedSnapshot, ...(recentLogs ?? [])]).level;
  }, [submittedSnapshot, recentLogs]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError(null);
    const payload = {
      sleepHours,
      affectiveState,
      psychomotorSpeed,
      impulsivityEvent,
      medicationTaken,
      notes: notes.trim() || undefined,
      warningSignsHit: warningSignsHit.length > 0 ? warningSignsHit : undefined,
      loggedBy: user?.id ?? 'mock-caregiver',
      loggedByName:
        (user?.user_metadata?.full_name as string | undefined) ??
        user?.email ??
        t('dashboard.defaultName'),
    };

    try {
      if (configured) {
        await addDailyLog(patientId, payload);
      } else {
        await new Promise((r) => setTimeout(r, 350));
      }
      track('daily_log_submitted', {
        sleep_hours: payload.sleepHours,
        affective_state: payload.affectiveState,
        impulsivity_event: payload.impulsivityEvent,
        medication_taken: payload.medicationTaken ?? 'unknown',
      });
      const snapshot: Omit<DailyLog, 'id'> = {
        ...payload,
        patientId,
        createdAt: Date.now(),
      };
      setSubmittedSnapshot(snapshot);
      setStatus('success');
      onSubmitted?.(snapshot);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('login.unknownError'));
    }
  }

  function reset() {
    setSleepHours(7);
    setAffectiveState('euthymia');
    setPsychomotorSpeed(3);
    setImpulsivityEvent(false);
    setMedicationTaken('yes');
    setNotes('');
    setStatus('idle');
    setError(null);
    setSubmittedSnapshot(null);
  }

  if (status === 'success' && submittedSnapshot) {
    const snap = submittedSnapshot;
    const nextKey =
      postSubmitLevel === 'RED_ALERT'
        ? { title: 'dailyLog.nextEscalateTitle', body: 'dailyLog.nextEscalateBody', tone: 'bg-crimson-bg text-crimson-deep border-crimson/30' }
        : postSubmitLevel === 'YELLOW_ALERT'
        ? { title: 'dailyLog.nextWatchTitle', body: 'dailyLog.nextWatchBody', tone: 'bg-amber_-bg text-amber_-ink border-amber_/30' }
        : { title: 'dailyLog.nextStableTitle', body: 'dailyLog.nextStableBody', tone: 'bg-sage-bg/70 text-sage border-sage/30' };

    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage-bg text-sage mb-4 animate-pop">
            <CheckIcon size={36} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-bold">{t('dailyLog.successTitle')}</h3>
          <p className="text-sm text-ink-mute mt-2 leading-relaxed">
            {t('dailyLog.successBody')}
          </p>
        </div>

        <div className="rounded-2xl bg-sand-50 p-4 text-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-mute mb-3">
            {t('dailyLog.successSummaryTitle')}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div>
              <dt className="text-xs text-ink-mute">{t('dailyLog.sectionSleep')}</dt>
              <dd className="font-semibold">
                {snap.sleepHours.toFixed(1)} {t('dailyLog.sleepUnit')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-mute">{t('dailyLog.sectionAffect')}</dt>
              <dd className="font-semibold">{affectiveLabels[snap.affectiveState]}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-mute">{t('dailyLog.sectionActivity')}</dt>
              <dd className="font-semibold">
                {snap.psychomotorSpeed} · {t(`dailyLog.psycho${snap.psychomotorSpeed}`)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-mute">{t('dailyLog.sectionEvents')}</dt>
              <dd className="font-semibold">
                {snap.impulsivityEvent
                  ? t('dailyLog.fieldImpulsivityYes')
                  : t('dailyLog.fieldImpulsivityNo')}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-mute">{t('dailyLog.sectionMeds')}</dt>
              <dd className="font-semibold">
                {t(`dailyLog.medsField.${snap.medicationTaken ?? 'unknown'}`)}
              </dd>
            </div>
          </dl>
        </div>

        <div className={`rounded-2xl border p-4 ${nextKey.tone}`}>
          <div className="font-bold text-sm">{t(nextKey.title)}</div>
          <p className="text-sm leading-relaxed mt-1">{t(nextKey.body)}</p>
        </div>

        <button onClick={reset} className="mz-btn mz-btn-ghost w-full">
          {t('dailyLog.addAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Sleep */}
      <SectionCard kicker={t('dailyLog.sectionSleep')}>
        <label htmlFor="sleep" className="mz-field-label">
          {t('dailyLog.sleepLabel')}
        </label>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={`text-5xl font-extrabold tabular-nums tracking-tight ${
              sleepHours < 4 ? 'text-crimson' : sleepHours < 6 ? 'text-amber_' : 'text-ink'
            }`}
          >
            {sleepHours.toFixed(1)}
          </span>
          <span className="text-base text-ink-mute">{t('dailyLog.sleepUnit')}</span>
          <span className="text-xs text-ink-mute ms-auto basis-full md:basis-auto md:text-end">
            {sleepHours < 4
              ? t('dailyLog.sleepHigh')
              : sleepHours < 6
              ? t('dailyLog.sleepLow')
              : t('dailyLog.sleepOk')}
          </span>
        </div>
        <input
          id="sleep"
          type="range"
          min={0}
          max={24}
          step={0.5}
          value={sleepHours}
          onChange={(e) => setSleepHours(parseFloat(e.target.value))}
          className="w-full mt-2"
        />
        <div className="flex justify-between text-[11px] text-ink-mute mt-1 px-0.5" dir="ltr">
          <span>0</span>
          <span>6</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </SectionCard>

      {/* Affective state */}
      <SectionCard kicker={t('dailyLog.sectionAffect')}>
        <fieldset>
          <legend className="mz-field-label">{t('dailyLog.affectiveLabel')}</legend>
          <div
            role="radiogroup"
            aria-label={t('dailyLog.affectiveLabel')}
            className="mt-3 grid grid-cols-2 gap-2.5"
          >
            {(Object.entries(affectiveLabels) as [AffectiveState, string][]).map(([k, label]) => {
              const active = affectiveState === k;
              return (
                <button
                  type="button"
                  key={k}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setAffectiveState(k)}
                  className={`text-start rounded-2xl border-2 px-4 py-3 transition-all flex items-center gap-3 ${
                    active
                      ? `${AFFECTIVE_TONES[k]} font-bold shadow-soft`
                      : 'bg-white border-sand-100 text-ink-soft hover:border-clay/40 hover:bg-sand-50/60'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      active ? 'border-current' : 'border-ink-mute/40'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-transform ${
                        active ? 'bg-current scale-100' : 'bg-transparent scale-0'
                      }`}
                    />
                  </span>
                  <span className="text-base">{label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </SectionCard>

      {/* Psychomotor */}
      <SectionCard kicker={t('dailyLog.sectionActivity')}>
        <label htmlFor="psycho" className="mz-field-label">
          {t('dailyLog.psychoLabel')}
        </label>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-ink-mute">{t('dailyLog.psychoSlow')}</span>
          <span className="font-semibold text-ink">{psychomotorSpeed} · {psychoLabel}</span>
          <span className="text-ink-mute">{t('dailyLog.psychoRestless')}</span>
        </div>
        <input
          id="psycho"
          type="range"
          min={1}
          max={5}
          step={1}
          value={psychomotorSpeed}
          onChange={(e) => setPsychomotorSpeed(parseInt(e.target.value, 10))}
          className="w-full mt-2"
        />
        <div className="flex justify-between text-[11px] text-ink-mute mt-1 px-0.5" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-ink-mute">{t('dailyLog.psychoLegend')}</div>
      </SectionCard>

      {/* Medication adherence */}
      <SectionCard kicker={t('dailyLog.sectionMeds')}>
        <div className="mz-field-label">{t('dailyLog.medsLabel')}</div>
        <div
          role="radiogroup"
          aria-label={t('dailyLog.medsLabel')}
          className="mt-3 grid grid-cols-3 gap-2"
        >
          {(
            [
              { value: 'yes', label: t('dailyLog.medsYes'), tone: 'sage' },
              { value: 'no', label: t('dailyLog.medsNo'), tone: 'amber' },
              { value: 'refused', label: t('dailyLog.medsRefused'), tone: 'crimson' },
            ] as const
          ).map((opt) => {
            const active = medicationTaken === opt.value;
            const activeTone =
              opt.tone === 'sage'
                ? 'bg-sage-bg border-sage text-sage'
                : opt.tone === 'amber'
                ? 'bg-amber_-bg border-amber_ text-amber_-ink'
                : 'bg-crimson-bg border-crimson text-crimson-deep';
            return (
              <button
                type="button"
                key={opt.value}
                role="radio"
                aria-checked={active}
                onClick={() => setMedicationTaken(opt.value)}
                className={`rounded-2xl px-2 py-3 font-semibold border-2 transition-all text-center ${
                  active ? activeTone : 'bg-white border-sand-100 text-ink-soft hover:border-clay/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Impulsivity */}
      <SectionCard kicker={t('dailyLog.sectionEvents')}>
        <div className="mz-field-label">{t('dailyLog.impulsivityLabel')}</div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            aria-pressed={impulsivityEvent === false}
            onClick={() => setImpulsivityEvent(false)}
            className={`rounded-2xl px-4 py-4 font-semibold border-2 transition-all ${
              impulsivityEvent === false
                ? 'bg-sage-bg border-sage text-sage'
                : 'bg-white border-transparent text-ink-soft'
            }`}
          >
            {t('common.no')}
          </button>
          <button
            type="button"
            aria-pressed={impulsivityEvent === true}
            onClick={() => setImpulsivityEvent(true)}
            className={`rounded-2xl px-4 py-4 font-semibold border-2 transition-all ${
              impulsivityEvent === true
                ? 'bg-crimson-bg border-crimson text-crimson-deep'
                : 'bg-white border-transparent text-ink-soft'
            }`}
          >
            {t('common.yes')}
          </button>
        </div>

        <label htmlFor="notes" className="mz-field-label block mt-5">
          {t('dailyLog.notesLabel')}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t('dailyLog.notesPlaceholder')}
          className="mz-input mt-3 resize-none"
        />
      </SectionCard>

      {warningSigns && warningSigns.length > 0 && (
        <SectionCard kicker={t('dailyLog.warningSignsKicker')}>
          <p className="text-xs text-ink-mute mb-2 leading-relaxed">
            {t('dailyLog.warningSignsHint')}
          </p>
          <div className="flex flex-wrap gap-2">
            {warningSigns.map((sign) => {
              const checked = warningSignsHit.includes(sign.id);
              return (
                <button
                  key={sign.id}
                  type="button"
                  onClick={() =>
                    setWarningSignsHit((prev) =>
                      checked ? prev.filter((id) => id !== sign.id) : [...prev, sign.id],
                    )
                  }
                  aria-pressed={checked}
                  className={`mz-pill text-sm py-2 px-3 ${
                    checked ? 'bg-amber_/30 text-amber_-ink ring-1 ring-amber_/60' : ''
                  }`}
                >
                  {sign.label}
                </button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {error && (
        <div className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <button type="submit" disabled={status === 'saving'} className="mz-btn mz-btn-big w-full">
        {status === 'saving' ? t('dailyLog.submitting') : t('dailyLog.submit')}
      </button>

      {!configured && (
        <p className="text-xs text-ink-mute text-center -mt-2">
          {t('dailyLog.previewNote')}
        </p>
      )}
    </form>
  );
}
