'use client';

import { useState, type FormEvent } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import type { IncidentDetails } from '@/lib/legalShield/templates';

export function IncidentForm({
  initial,
  onPreview,
}: {
  initial?: Partial<IncidentDetails>;
  onPreview: (details: IncidentDetails) => void;
}) {
  const { t } = useT();
  const [d, setD] = useState<IncidentDetails>({
    patientName: initial?.patientName ?? '',
    patientId: initial?.patientId ?? '',
    patientAddress: initial?.patientAddress ?? '',
    applicantName: initial?.applicantName ?? '',
    applicantId: initial?.applicantId ?? '',
    applicantRelation: initial?.applicantRelation ?? '',
    applicantPhone: initial?.applicantPhone ?? '',
    applicantAddress: initial?.applicantAddress ?? '',
    incidentDate: initial?.incidentDate ?? new Date().toISOString().split('T')[0],
    incidentSummary: initial?.incidentSummary ?? '',
    riskDescription: initial?.riskDescription ?? '',
    evidence: initial?.evidence ?? '',
    requestedRelief: initial?.requestedRelief ?? '',
  });

  function field<K extends keyof IncidentDetails>(key: K, value: IncidentDetails[K]) {
    setD((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onPreview(d);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title={t('legal.form.patientSection')}>
        <Two>
          <Input
            label={t('legal.form.patientName')}
            value={d.patientName}
            onChange={(v) => field('patientName', v)}
            required
          />
          <Input
            label={t('legal.form.patientId')}
            value={d.patientId}
            onChange={(v) => field('patientId', v)}
            placeholder="000000000"
            required
          />
        </Two>
        <Input
          label={t('legal.form.patientAddress')}
          value={d.patientAddress}
          onChange={(v) => field('patientAddress', v)}
          required
        />
      </Section>

      <Section title={t('legal.form.applicantSection')}>
        <Two>
          <Input
            label={t('legal.form.applicantName')}
            value={d.applicantName}
            onChange={(v) => field('applicantName', v)}
            required
          />
          <Input
            label={t('legal.form.applicantId')}
            value={d.applicantId}
            onChange={(v) => field('applicantId', v)}
            placeholder="000000000"
            required
          />
        </Two>
        <Two>
          <Input
            label={t('legal.form.applicantRelation')}
            value={d.applicantRelation}
            onChange={(v) => field('applicantRelation', v)}
            placeholder={t('legal.form.applicantRelationPlaceholder')}
            required
          />
          <Input
            label={t('legal.form.applicantPhone')}
            value={d.applicantPhone}
            onChange={(v) => field('applicantPhone', v)}
            type="tel"
            required
          />
        </Two>
        <Input
          label={t('legal.form.applicantAddress')}
          value={d.applicantAddress}
          onChange={(v) => field('applicantAddress', v)}
          required
        />
      </Section>

      <Section title={t('legal.form.incidentSection')}>
        <Input
          label={t('legal.form.incidentDate')}
          value={d.incidentDate}
          onChange={(v) => field('incidentDate', v)}
          type="date"
          required
        />
        <Textarea
          label={t('legal.form.incidentSummary')}
          hint={t('legal.form.incidentSummaryHint')}
          value={d.incidentSummary}
          onChange={(v) => field('incidentSummary', v)}
          rows={4}
          required
        />
        <Textarea
          label={t('legal.form.riskDescription')}
          hint={t('legal.form.riskDescriptionHint')}
          value={d.riskDescription}
          onChange={(v) => field('riskDescription', v)}
          rows={3}
          required
        />
        <Textarea
          label={t('legal.form.evidence')}
          hint={t('legal.form.evidenceHint')}
          value={d.evidence}
          onChange={(v) => field('evidence', v)}
          rows={3}
        />
        <Textarea
          label={t('legal.form.requestedRelief')}
          hint={t('legal.form.requestedReliefHint')}
          value={d.requestedRelief}
          onChange={(v) => field('requestedRelief', v)}
          rows={3}
        />
      </Section>

      <div className="flex justify-end">
        <button type="submit" className="mz-btn mz-btn-clay">
          {t('legal.form.preview')}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-sand-100 bg-sand-50/40 p-4 md:p-5 space-y-4">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">{title}</h3>
      {children}
    </section>
  );
}

function Two({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mz-field-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mz-input mt-2"
      />
    </label>
  );
}

function Textarea({
  label,
  hint,
  value,
  onChange,
  rows,
  required,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mz-field-label">{label}</span>
      {hint && <p className="text-xs text-ink-mute mt-1 leading-relaxed">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="mz-input mt-2 resize-y"
      />
    </label>
  );
}
