'use client';

import { PrintIcon } from '@/components/icons';
import type { GoldenRecord } from '@/lib/types';
import { MOCK_PATIENT_NAME } from '@/lib/constants';

const DISCLAIMER =
  'מסמך זה הופק על ידי משפחת המטופל על מנת לספק רקע רפואי קריטי לצוות המיון ולשמור על רצף טיפולי, גם במקרים של התנגדות המטופל למסירת מידע.';

export function GoldenRecordDisplay({
  record,
  onEdit,
}: {
  record: GoldenRecord;
  onEdit: () => void;
}) {
  const updated = new Date(record.updatedAt).toLocaleString('he-IL');

  return (
    <article className="mz-card p-6 md:p-10 print-page">
      <header className="flex items-start justify-between gap-4 pb-5 border-b border-sand-100">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-mute font-semibold">
            תיק רפואי למיון
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
            {MOCK_PATIENT_NAME}
          </h1>
          <div className="text-xs text-ink-mute mt-1">עודכן: {updated}</div>
        </div>
        <div className="flex gap-2 mz-no-print">
          <button onClick={onEdit} className="mz-btn mz-btn-ghost h-10 px-4 text-sm">
            עריכה
          </button>
          <button onClick={() => window.print()} className="mz-btn h-10 px-4 text-sm">
            <PrintIcon size={16} /> הדפסה
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
        <Section title="אבחנה בסיסית" value={record.diagnosis} />
        <Section title="מחלות רקע" value={record.comorbidities} />
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">
            רשימת תרופות נוכחית
          </h2>
          {record.medications.length === 0 ? (
            <p className="text-ink-mute text-sm">לא הוזנו תרופות.</p>
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
        <Section title="אלרגיות ותופעות לוואי חריגות בעבר" value={record.allergies} />
        <Section title="גורמי סיכון (אובדנות / סמים)" value={record.riskVectors} />
        <div className="md:col-span-2">
          <Section title="אנשי קשר רפואיים בקהילה" value={record.contacts} />
        </div>
      </div>

      <aside className="mt-8 rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {DISCLAIMER}
      </aside>
    </article>
  );
}

function Section({ title, value }: { title: string; value: string }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">{title}</h2>
      {value ? (
        <p className="text-base whitespace-pre-line leading-relaxed">{value}</p>
      ) : (
        <p className="text-ink-mute text-sm">לא הוזן.</p>
      )}
    </section>
  );
}
