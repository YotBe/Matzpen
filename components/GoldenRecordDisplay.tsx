'use client';

import { PrintIcon } from '@/components/icons';
import type { GoldenRecord } from '@/lib/types';
import { MOCK_PATIENT_NAME } from '@/lib/constants';
import { useT } from '@/lib/i18n/LocaleProvider';

export function GoldenRecordDisplay({
  record,
  onEdit,
}: {
  record: GoldenRecord;
  onEdit: () => void;
}) {
  const { locale, t } = useT();
  const updated = new Date(record.updatedAt).toLocaleString(
    locale === 'he' ? 'he-IL' : 'en-US',
  );

  return (
    <article className="mz-card p-6 md:p-10 print-page">
      <header className="flex items-start justify-between gap-4 pb-5 border-b border-sand-100">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-mute font-semibold">
            {t('gr.docHeader')}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
            {MOCK_PATIENT_NAME}
          </h1>
          <div className="text-xs text-ink-mute mt-1">{t('gr.updated', { when: updated })}</div>
        </div>
        <div className="flex gap-2 mz-no-print">
          <button onClick={onEdit} className="mz-btn mz-btn-ghost h-10 px-4 text-sm">
            {t('common.edit')}
          </button>
          <button onClick={() => window.print()} className="mz-btn h-10 px-4 text-sm">
            <PrintIcon size={16} /> {t('common.print')}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
        <Section title={t('gr.section.diagnosis')} value={record.diagnosis} emptyText={t('gr.empty')} />
        <Section title={t('gr.section.comorbidities')} value={record.comorbidities} emptyText={t('gr.empty')} />
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">
            {t('gr.section.medications')}
          </h2>
          {record.medications.length === 0 ? (
            <p className="text-ink-mute text-sm">{t('gr.noMeds')}</p>
          ) : (
            <ol className="list-decimal ps-6 space-y-1.5 text-base">
              {record.medications.map((m, i) => (
                <li key={i} className="font-medium" dir="ltr">
                  {m}
                </li>
              ))}
            </ol>
          )}
        </div>
        <Section title={t('gr.section.allergies')} value={record.allergies} emptyText={t('gr.empty')} />
        <Section title={t('gr.section.risk')} value={record.riskVectors} emptyText={t('gr.empty')} />
        <div className="md:col-span-2">
          <Section title={t('gr.section.contacts')} value={record.contacts} emptyText={t('gr.empty')} />
        </div>
      </div>

      <aside className="mt-8 rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('gr.disclaimer')}
      </aside>
    </article>
  );
}

function Section({ title, value, emptyText }: { title: string; value: string; emptyText: string }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">{title}</h2>
      {value ? (
        <p className="text-base whitespace-pre-line leading-relaxed">{value}</p>
      ) : (
        <p className="text-ink-mute text-sm">{emptyText}</p>
      )}
    </section>
  );
}
