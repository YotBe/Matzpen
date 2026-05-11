'use client';

import { useState } from 'react';
import { addDailyLog } from '@/services/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { AFFECTIVE_LABELS, type AffectiveState, type DailyLog } from '@/lib/types';
import { MOCK_PATIENT_ID } from '@/lib/constants';
import { CheckIcon } from '@/components/icons';

const AFFECTIVE_TONES: Record<AffectiveState, string> = {
  depression: 'bg-muted_blue-bg text-muted_blue border-muted_blue/30',
  euthymia: 'bg-sage-bg text-sage border-sage/30',
  euphoria: 'bg-clay-bg text-clay border-clay/30',
  irritability: 'bg-crimson-bg text-crimson-deep border-crimson/30',
};

interface Props {
  onSubmitted?: (log: Omit<DailyLog, 'id'>) => void;
}

export function DailyLogForm({ onSubmitted }: Props) {
  const { user, configured } = useAuth();
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [affectiveState, setAffectiveState] = useState<AffectiveState>('euthymia');
  const [psychomotorSpeed, setPsychomotorSpeed] = useState<number>(3);
  const [impulsivityEvent, setImpulsivityEvent] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const psychoLabel =
    psychomotorSpeed <= 1 ? 'איטי מאוד'
    : psychomotorSpeed === 2 ? 'איטי'
    : psychomotorSpeed === 3 ? 'תקין'
    : psychomotorSpeed === 4 ? 'מואץ'
    : 'מואץ מאוד / חסר מנוח';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError(null);
    const payload = {
      sleepHours,
      affectiveState,
      psychomotorSpeed,
      impulsivityEvent,
      notes: notes.trim() || undefined,
      loggedBy: user?.uid ?? 'mock-caregiver',
      loggedByName: user?.displayName ?? user?.email ?? 'בן/בת משפחה',
    };

    try {
      if (configured) {
        await addDailyLog(MOCK_PATIENT_ID, payload);
      } else {
        await new Promise((r) => setTimeout(r, 350));
      }
      setStatus('success');
      onSubmitted?.({
        ...payload,
        patientId: MOCK_PATIENT_ID,
        createdAt: Date.now(),
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
    }
  }

  function reset() {
    setSleepHours(7);
    setAffectiveState('euthymia');
    setPsychomotorSpeed(3);
    setImpulsivityEvent(false);
    setNotes('');
    setStatus('idle');
    setError(null);
  }

  if (status === 'success') {
    return (
      <div className="mz-card p-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage-bg text-sage mb-4 animate-pop">
          <CheckIcon size={36} strokeWidth={3} />
        </div>
        <h3 className="text-xl font-bold">הדיווח נשמר ✓</h3>
        <p className="text-sm text-ink-mute mt-2 leading-relaxed">
          המידע נכלל במעקב היומי ויסונכרן עם שאר בני המשפחה.
        </p>
        <button onClick={reset} className="mz-btn mz-btn-ghost mt-6">
          הוסף דיווח נוסף
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Sleep */}
      <section>
        <label htmlFor="sleep" className="mz-field-label">
          שעות שינה אתמול
        </label>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-5xl font-extrabold tabular-nums tracking-tight ${
              sleepHours < 4 ? 'text-crimson' : sleepHours < 6 ? 'text-amber_' : 'text-ink'
            }`}
          >
            {sleepHours.toFixed(1)}
          </span>
          <span className="text-base text-ink-mute">שעות</span>
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
        <div className="mt-1 text-xs text-ink-mute">
          {sleepHours < 4
            ? '⚠ סיכון גבוה — שינה קצרה מאוד'
            : sleepHours < 6
            ? 'מתחת לטווח המומלץ'
            : 'בטווח התקין'}
        </div>
      </section>

      {/* Affective state */}
      <section>
        <fieldset>
          <legend className="mz-field-label">מצב אפקטיבי כעת</legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {(Object.entries(AFFECTIVE_LABELS) as [AffectiveState, string][]).map(([k, label]) => {
              const active = affectiveState === k;
              return (
                <button
                  type="button"
                  key={k}
                  aria-pressed={active}
                  onClick={() => setAffectiveState(k)}
                  className={`text-start rounded-2xl border-2 px-4 py-3 transition-all ${
                    active
                      ? `${AFFECTIVE_TONES[k]} font-bold`
                      : 'bg-white border-transparent text-ink-soft hover:border-sand-100'
                  }`}
                >
                  <div className="text-base">{label}</div>
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      {/* Psychomotor */}
      <section>
        <label htmlFor="psycho" className="mz-field-label">
          קצב פעילות ותנועה
        </label>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-ink-mute">איטי</span>
          <span className="font-semibold text-ink">{psychomotorSpeed} · {psychoLabel}</span>
          <span className="text-ink-mute">חסר מנוח</span>
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
      </section>

      {/* Impulsivity */}
      <section>
        <div className="mz-field-label">האם היה היום אירוע חריג של פזרנות או אימפולסיביות?</div>
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
            לא
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
            כן
          </button>
        </div>
      </section>

      {/* Notes */}
      <section>
        <label htmlFor="notes" className="mz-field-label">
          הערות (אופציונלי)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="לדוגמה: יזם נסיעה פתאומית, דיבור מואץ ולא קשור"
          className="mz-input mt-3 resize-none"
        />
      </section>

      {error && (
        <div className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <button type="submit" disabled={status === 'saving'} className="mz-btn mz-btn-clay mz-btn-big w-full">
        {status === 'saving' ? 'שומר…' : 'שמירת דיווח יומי'}
      </button>

      {!configured && (
        <p className="text-xs text-ink-mute text-center -mt-2">
          מצב תצוגה: הדיווח לא נשמר עד שהגדרות Firebase יוזנו ב־<code className="font-mono">.env.local</code>.
        </p>
      )}
    </form>
  );
}
