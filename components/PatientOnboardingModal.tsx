'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { saveGoldenRecord } from '@/services/supabaseService';

const STORAGE_KEY = 'matzpen.patient-onboarding.v1';

function readSkipped(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'skipped';
  } catch {
    return false;
  }
}

function markSkipped() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'skipped');
  } catch {/* ignore */}
}

interface Props {
  /** Called after the user completes or skips, with the patient name if saved. */
  onComplete: (patientName: string) => void;
}

const RELATIONSHIP_KEYS = [
  'onboarding.patient.relationship.spouse',
  'onboarding.patient.relationship.child',
  'onboarding.patient.relationship.parent',
  'onboarding.patient.relationship.sibling',
  'onboarding.patient.relationship.other',
] as const;

const DIAGNOSIS_CHIPS = [
  'onboarding.patient.chip.depression',
  'onboarding.patient.chip.bipolar',
  'onboarding.patient.chip.schizophrenia',
  'onboarding.patient.chip.anxiety',
  'onboarding.patient.chip.other',
] as const;

const SITUATION_KEYS = [
  { key: 'onboarding.patient.situation.stable', icon: '🟢', color: 'border-sage ring-sage/30 bg-sage-bg' },
  { key: 'onboarding.patient.situation.deteriorating', icon: '🟡', color: 'border-amber_ ring-amber_/30 bg-amber_-bg' },
  { key: 'onboarding.patient.situation.crisis', icon: '🔴', color: 'border-crimson ring-crimson/30 bg-crimson-bg' },
] as const;

const TOTAL_STEPS = 3;

export function PatientOnboardingModal({ onComplete }: Props) {
  const { t } = useT();
  const patientId = usePatientId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [diagnosisChips, setDiagnosisChips] = useState<string[]>([]);
  const [situation, setSituation] = useState('');
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!readSkipped()) setOpen(true);
  }, []);

  const handleSkip = useCallback(() => {
    markSkipped();
    setOpen(false);
    onComplete('');
  }, [onComplete]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleSkip]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  function toggleChip(label: string) {
    setDiagnosisChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  }

  async function handleDone() {
    setSaving(true);
    try {
      const chipText = diagnosisChips.length > 0 ? diagnosisChips.join(', ') : '';
      const fullDiagnosis = [diagnosisText.trim(), chipText].filter(Boolean).join(' — ');
      await saveGoldenRecord(patientId, {
        patientName: name.trim() || undefined,
        relationship: relationship || undefined,
        diagnosis: fullDiagnosis,
        comorbidities: '',
        medications: [],
        allergies: '',
        riskVectors: situation ? `מצב נוכחי: ${situation}` : '',
        contacts: '',
      });
      markSkipped();
      setOpen(false);
      onComplete(name.trim());
    } catch {
      setSaving(false);
    }
  }

  if (!open) return null;

  const isLast = step === TOTAL_STEPS - 1;
  const isFirst = step === 0;

  const stepTitles = [
    t('onboarding.patient.step1.title'),
    t('onboarding.patient.step2.title'),
    t('onboarding.patient.step3.title'),
  ];
  const stepBodies = [
    t('onboarding.patient.step1.body'),
    t('onboarding.patient.step2.body'),
    t('onboarding.patient.step3.body'),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-onboarding-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleSkip(); }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-t-3xl md:rounded-3xl shadow-card w-full md:max-w-md mx-0 md:mx-4 p-6 md:p-8 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-ink-mute tracking-widest uppercase">
            {t('common.step', { current: step + 1, total: TOTAL_STEPS })}
          </span>
          <button type="button" onClick={handleSkip} className="text-sm text-ink-mute hover:text-ink">
            {t('common.skip')}
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'bg-clay w-6' : i < step ? 'bg-clay/40 w-3' : 'bg-sand-100 w-2'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <h2 id="patient-onboarding-title" className="text-xl font-extrabold text-ink mb-1">
          {stepTitles[step]}
        </h2>
        <p className="text-sm text-ink-mute leading-relaxed mb-5">{stepBodies[step]}</p>

        {/* Step 1: Name + Relationship */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('onboarding.patient.namePlaceholder')}
              className="mz-input"
              autoFocus
            />
            <div>
              <label className="mz-field-label block mb-2">הקשר שלכם</label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_KEYS.map((key) => {
                  const label = t(key);
                  const active = relationship === label;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRelationship(active ? '' : label)}
                      className={`mz-chip transition-colors ${active ? 'mz-chip-active' : ''}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Diagnosis text + chips */}
        {step === 1 && (
          <div className="space-y-4">
            <textarea
              value={diagnosisText}
              onChange={(e) => setDiagnosisText(e.target.value)}
              placeholder={t('onboarding.patient.diagnosisPlaceholder')}
              rows={2}
              className="mz-input resize-none"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {DIAGNOSIS_CHIPS.map((key) => {
                const label = t(key);
                const active = diagnosisChips.includes(label);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleChip(label)}
                    className={`mz-chip transition-colors ${active ? 'mz-chip-active' : ''}`}
                  >
                    {active && <span className="me-1">✓</span>}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Situation */}
        {step === 2 && (
          <div className="space-y-3">
            {SITUATION_KEYS.map(({ key, icon, color }) => {
              const label = t(key);
              const active = situation === label;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSituation(active ? '' : label)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-start ${
                    active
                      ? `${color} ring-2`
                      : 'border-sand-100 hover:border-ink/20 bg-white'
                  }`}
                >
                  <span className="text-2xl" aria-hidden>{icon}</span>
                  <span className="font-semibold text-ink">{label}</span>
                  {active && <span className="ms-auto text-xs font-bold text-clay">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-2 mt-6">
          {!isFirst && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mz-btn mz-btn-ghost flex-1"
            >
              {t('common.back')}
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="mz-btn mz-btn-clay flex-1"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDone}
              disabled={saving}
              className="mz-btn mz-btn-clay flex-1"
            >
              {saving ? t('onboarding.patient.saving') : t('onboarding.patient.done')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
