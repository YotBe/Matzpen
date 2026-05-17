'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { SHOW_LAWYER_DIRECTORY } from '@/lib/constants';
import { getGoldenRecord } from '@/services/supabaseService';
import { IncidentForm } from '@/components/LegalShield/IncidentForm';
import { LawyerDirectory } from '@/components/LegalShield/LawyerDirectory';
import { PrintableRequest } from '@/components/LegalShield/PrintableRequest';
import { PrintIcon } from '@/components/icons';
import {
  LEGAL_TEMPLATES,
  type IncidentDetails,
  type LegalTemplateKey,
} from '@/lib/legalShield/templates';
import type { GoldenRecord } from '@/lib/types';

const TEMPLATE_ORDER: LegalTemplateKey[] = [
  'guardianship_property',
  'block_finance',
  'exit_ban',
];

type Mode =
  | { kind: 'overview' }
  | { kind: 'form'; template: LegalTemplateKey }
  | { kind: 'preview'; template: LegalTemplateKey; details: IncidentDetails };

export default function LegalShieldPage() {
  const { t } = useT();
  const { configured, user } = useAuth();
  const patientId = usePatientId();
  const [mode, setMode] = useState<Mode>({ kind: 'overview' });
  const [record, setRecord] = useState<GoldenRecord | null>(null);

  useEffect(() => {
    if (!configured || !patientId) return;
    let cancelled = false;
    getGoldenRecord(patientId)
      .then((r) => {
        if (!cancelled) setRecord(r);
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      cancelled = true;
    };
  }, [configured, patientId]);

  const initialIncident = useMemo<Partial<IncidentDetails>>(
    () => ({
      patientName: record?.patientName ?? '',
      patientAddress: [record?.city, record?.region ? t(`region.${record.region}`) : '']
        .filter(Boolean)
        .join(', '),
      applicantName: (user?.user_metadata?.full_name as string | undefined) ?? '',
      applicantRelation: record?.relationship ?? '',
    }),
    [record, user, t],
  );

  if (mode.kind === 'preview') {
    const template = LEGAL_TEMPLATES[mode.template];
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-5">
        <div className="flex items-center justify-between gap-3 mz-no-print">
          <button
            type="button"
            onClick={() => setMode({ kind: 'form', template: mode.template })}
            className="text-sm text-ink-soft underline"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="mz-btn mz-btn-clay h-10 px-4 text-sm"
          >
            <PrintIcon size={16} /> {t('legal.printable.print')}
          </button>
        </div>
        <PrintableRequest template={template} details={mode.details} />
      </div>
    );
  }

  if (mode.kind === 'form') {
    const template = LEGAL_TEMPLATES[mode.template];
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-5">
        <button
          type="button"
          onClick={() => setMode({ kind: 'overview' })}
          className="text-sm text-ink-soft underline"
        >
          {t('common.back')}
        </button>
        <header>
          <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
            {t('legal.form.kicker')}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">{template.titleHe}</h1>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            {t(template.summaryKey)}
          </p>
        </header>
        <IncidentForm
          initial={initialIncident}
          onPreview={(details) =>
            setMode({ kind: 'preview', template: mode.template, details })
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('legal.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{t('legal.title')}</h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('legal.intro')}</p>
      </header>

      <section>
        <h2 className="text-lg font-bold mb-3">{t('legal.actions.title')}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEMPLATE_ORDER.map((key) => {
            const tmpl = LEGAL_TEMPLATES[key];
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setMode({ kind: 'form', template: key })}
                  className="w-full text-start mz-card p-4 md:p-5 hover:shadow-card transition-shadow"
                >
                  <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
                    {t(`legal.template.${key}.kicker`)}
                  </div>
                  <h3 className="font-extrabold text-base mt-1 leading-snug">
                    {tmpl.titleHe}
                  </h3>
                  <p className="text-xs text-ink-soft mt-2 leading-relaxed">
                    {t(tmpl.summaryKey)}
                  </p>
                  <div className="text-xs text-clay font-semibold mt-3">
                    {t('legal.actions.cta')} →
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {SHOW_LAWYER_DIRECTORY && (
        <section>
          <h2 className="text-lg font-bold mb-3">{t('legal.lawyers.title')}</h2>
          <LawyerDirectory defaultRegion={record?.region} />
        </section>
      )}

      <aside className="rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('legal.disclaimer')}
      </aside>
    </div>
  );
}
