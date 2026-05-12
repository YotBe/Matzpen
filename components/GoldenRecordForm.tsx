'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import { REGIONS, type Region } from '@/lib/regions';
import type { GoldenRecord } from '@/lib/types';

interface Props {
  initial?: GoldenRecord | null;
  onSave: (data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>) => Promise<void> | void;
  // Error message from the parent's save handler. Rendered above the
  // submit button so users see what went wrong instead of having the
  // failure swallowed.
  errorMessage?: string | null;
}

type ExtractStatus = 'idle' | 'uploading' | 'done' | 'error';

export function GoldenRecordForm({ initial, onSave, errorMessage }: Props) {
  const { t } = useT();
  const [patientName, setPatientName] = useState(initial?.patientName ?? '');
  const [relationship, setRelationship] = useState(initial?.relationship ?? '');
  const [region, setRegion] = useState<Region | ''>(
    (initial?.region as Region | undefined) ?? '',
  );
  const [city, setCity] = useState(initial?.city ?? '');
  const [diagnosis, setDiagnosis] = useState(initial?.diagnosis ?? '');
  const [comorbidities, setComorbidities] = useState(initial?.comorbidities ?? '');
  const [medicationsText, setMedicationsText] = useState(
    (initial?.medications ?? []).join('\n'),
  );
  const [allergies, setAllergies] = useState(initial?.allergies ?? '');
  const [riskVectors, setRiskVectors] = useState(initial?.riskVectors ?? '');
  const [contacts, setContacts] = useState(initial?.contacts ?? '');
  const [dischargeDate, setDischargeDate] = useState(initial?.dischargeDate ?? '');
  const [nextRefillDate, setNextRefillDate] = useState(initial?.nextRefillDate ?? '');
  const [whenWellLoves, setWhenWellLoves] = useState(initial?.whenWellLoves ?? '');
  const [whenWellCalms, setWhenWellCalms] = useState(initial?.whenWellCalms ?? '');
  const [whenWellNeverSay, setWhenWellNeverSay] = useState(initial?.whenWellNeverSay ?? '');
  const [busy, setBusy] = useState(false);

  const handleExtracted = useCallback(
    (data: { diagnosis: string; medications: string; allergies: string }) => {
      if (data.diagnosis) setDiagnosis((prev) => merge(prev, data.diagnosis));
      if (data.medications)
        setMedicationsText((prev) => merge(prev, data.medications));
      if (data.allergies) setAllergies((prev) => merge(prev, data.allergies));
    },
    [],
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const medications = medicationsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await onSave({
        patientName: patientName.trim() || undefined,
        relationship: relationship.trim() || undefined,
        region: region || undefined,
        city: city.trim() || undefined,
        diagnosis,
        comorbidities,
        medications,
        allergies,
        riskVectors,
        contacts,
        dischargeDate: dischargeDate || undefined,
        nextRefillDate: nextRefillDate || undefined,
        whenWellLoves: whenWellLoves.trim() || undefined,
        whenWellCalms: whenWellCalms.trim() || undefined,
        whenWellNeverSay: whenWellNeverSay.trim() || undefined,
      });
    } catch {
      // Parent (handleSave) already exposes the error via errorMessage
      // prop and re-throws. We catch here so the rejected promise isn't
      // unhandled and the button correctly leaves the busy state.
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5 space-y-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
          {t('gr.form.identity.kicker')}
        </div>
        <Field
          label={t('gr.form.patientName.label')}
          hint={t('gr.form.patientName.hint')}
        >
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder={t('gr.form.patientName.placeholder')}
            className="mz-input"
            autoComplete="off"
            maxLength={120}
          />
        </Field>
        <Field
          label={t('gr.form.relationship.label')}
          hint={t('gr.form.relationship.hint')}
        >
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder={t('gr.form.relationship.placeholder')}
            className="mz-input"
            autoComplete="off"
            maxLength={60}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('gr.form.region.label')} hint={t('gr.form.region.hint')}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | '')}
              className="mz-input appearance-none"
            >
              <option value="">{t('gr.form.region.placeholder')}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t(`region.${r}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('gr.form.city.label')} hint={t('gr.form.city.hint')}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t('gr.form.city.placeholder')}
              className="mz-input"
              autoComplete="address-level2"
              maxLength={80}
            />
          </Field>
        </div>
      </div>

      <ExtractionDropzone onExtracted={handleExtracted} />

      <Field label={t('gr.form.diagnosis.label')} hint={t('gr.form.diagnosis.hint')}>
        <textarea
          rows={2}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field label={t('gr.form.comorbidities.label')} hint={t('gr.form.comorbidities.hint')}>
        <textarea
          rows={2}
          value={comorbidities}
          onChange={(e) => setComorbidities(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field label={t('gr.form.meds.label')} hint={t('gr.form.meds.hint')}>
        <textarea
          rows={5}
          value={medicationsText}
          onChange={(e) => setMedicationsText(e.target.value)}
          placeholder={'Lithium 600mg · ערב\nQuetiapine 100mg · לפני שינה'}
          className="mz-input resize-none font-mono text-sm"
          dir="ltr"
        />
      </Field>
      <Field label={t('gr.form.allergies.label')} hint={t('gr.form.allergies.hint')}>
        <textarea
          rows={3}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field label={t('gr.form.risk.label')} hint={t('gr.form.risk.hint')}>
        <textarea
          rows={3}
          value={riskVectors}
          onChange={(e) => setRiskVectors(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field label={t('gr.form.contacts.label')} hint={t('gr.form.contacts.hint')}>
        <textarea
          rows={3}
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>

      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5 space-y-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
          {t('gr.form.dates.kicker')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t('gr.form.dischargeDate.label')}
            hint={t('gr.form.dischargeDate.hint')}
          >
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              className="mz-input"
            />
          </Field>
          <Field
            label={t('gr.form.nextRefillDate.label')}
            hint={t('gr.form.nextRefillDate.hint')}
          >
            <input
              type="date"
              value={nextRefillDate}
              onChange={(e) => setNextRefillDate(e.target.value)}
              className="mz-input"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5 space-y-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
            {t('whenWell.kicker')}
          </div>
          <p className="text-xs text-ink-mute mt-1 leading-relaxed">
            {t('whenWell.intro')}
          </p>
        </div>
        <Field label={t('whenWell.loves.label')} hint={t('whenWell.loves.hint')}>
          <textarea
            rows={2}
            value={whenWellLoves}
            onChange={(e) => setWhenWellLoves(e.target.value)}
            className="mz-input resize-none"
            placeholder={t('whenWell.loves.placeholder')}
          />
        </Field>
        <Field label={t('whenWell.calms.label')} hint={t('whenWell.calms.hint')}>
          <textarea
            rows={2}
            value={whenWellCalms}
            onChange={(e) => setWhenWellCalms(e.target.value)}
            className="mz-input resize-none"
            placeholder={t('whenWell.calms.placeholder')}
          />
        </Field>
        <Field label={t('whenWell.neverSay.label')} hint={t('whenWell.neverSay.hint')}>
          <textarea
            rows={2}
            value={whenWellNeverSay}
            onChange={(e) => setWhenWellNeverSay(e.target.value)}
            className="mz-input resize-none"
            placeholder={t('whenWell.neverSay.placeholder')}
          />
        </Field>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="text-sm text-crimson-deep bg-crimson-bg rounded-xl px-3 py-2"
        >
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={busy} className="mz-btn mz-btn-clay w-full">
        {busy ? t('common.saving') : t('gr.form.submit')}
      </button>
    </form>
  );
}

function merge(prev: string, next: string) {
  const a = prev.trim();
  const b = next.trim();
  if (!a) return b;
  if (!b) return a;
  return `${a}\n${b}`;
}

function ExtractionDropzone({
  onExtracted,
}: {
  onExtracted: (data: { diagnosis: string; medications: string; allergies: string }) => void;
}) {
  const { t } = useT();
  const [status, setStatus] = useState<ExtractStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        setStatus('error');
        setErrorMsg(t('gr.extract.rejected'));
        return;
      }
      const file = accepted[0];
      if (!file) return;
      setFileName(file.name);
      setStatus('uploading');
      setErrorMsg(null);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const session = supabase ? (await supabase.auth.getSession()).data.session : null;
        const headers: Record<string, string> = {};
        if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
        const res = await fetch('/api/extract-medical', {
          method: 'POST',
          body: fd,
          headers,
        });
        const data = (await res.json().catch(() => ({}))) as {
          diagnosis?: string;
          medications?: string;
          allergies?: string;
          error?: string;
        };
        if (!res.ok) {
          setStatus('error');
          setErrorMsg(data.error || t('gr.extract.failed'));
          return;
        }
        onExtracted({
          diagnosis: data.diagnosis ?? '',
          medications: data.medications ?? '',
          allergies: data.allergies ?? '',
        });
        setStatus('done');
      } catch {
        setStatus('error');
        setErrorMsg(t('gr.extract.failed'));
      }
    },
    [onExtracted, t],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 15 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    noClick: true,
    noKeyboard: true,
    disabled: status === 'uploading',
  });

  const isLoading = status === 'uploading';

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-card border-2 border-dashed transition-colors p-5 md:p-6 text-center bg-sand-50/60 ${
        isDragActive
          ? 'border-clay bg-clay/5'
          : 'border-sand-100 hover:border-clay/50'
      } ${isLoading ? 'opacity-90' : ''}`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-white shadow-soft flex items-center justify-center text-clay">
          {isLoading ? <Spinner /> : <SparkleIcon />}
        </div>

        {isLoading ? (
          <>
            <p className="text-base font-semibold text-ink">
              {t('gr.extract.loading')}
            </p>
            {fileName && (
              <p className="text-xs text-ink-mute truncate max-w-full">
                {fileName}
              </p>
            )}
          </>
        ) : status === 'done' ? (
          <>
            <p className="text-base font-semibold text-sage">
              {t('gr.extract.done')}
            </p>
            <p className="text-xs text-ink-mute">{t('gr.extract.reviewHint')}</p>
            <button
              type="button"
              onClick={open}
              className="mz-btn mz-btn-ghost h-9 px-3 text-sm"
            >
              {t('gr.extract.another')}
            </button>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-ink leading-snug">
              {t('gr.extract.title')}
            </p>
            <p className="text-xs text-ink-mute leading-relaxed max-w-md">
              {t('gr.extract.subtitle')}
            </p>
            <button
              type="button"
              onClick={open}
              className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
            >
              {t('gr.extract.choose')}
            </button>
            {status === 'error' && errorMsg && (
              <p className="text-xs text-crimson mt-1">{errorMsg}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l1.7 4.6L18.4 9.3 13.8 11l-1.8 4.7L10.3 11 5.6 9.3l4.7-1.7L12 3z"
        fill="currentColor"
      />
      <path d="M19 14l.9 2.4L22 17l-2.1.9-.9 2.4-.9-2.4L16 17l2.1-.9.9-2.4z" fill="currentColor" />
    </svg>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mz-field-label">{label}</div>
      {hint && <div className="text-xs text-ink-mute mt-0.5">{hint}</div>}
      <div className="mt-2">{children}</div>
    </label>
  );
}
