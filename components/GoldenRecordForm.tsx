'use client';

import { useState, type FormEvent } from 'react';
import type { GoldenRecord } from '@/lib/types';

interface Props {
  initial?: GoldenRecord | null;
  onSave: (data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>) => Promise<void> | void;
}

export function GoldenRecordForm({ initial, onSave }: Props) {
  const [diagnosis, setDiagnosis] = useState(initial?.diagnosis ?? '');
  const [comorbidities, setComorbidities] = useState(initial?.comorbidities ?? '');
  const [medicationsText, setMedicationsText] = useState(
    (initial?.medications ?? []).join('\n'),
  );
  const [allergies, setAllergies] = useState(initial?.allergies ?? '');
  const [riskVectors, setRiskVectors] = useState(initial?.riskVectors ?? '');
  const [contacts, setContacts] = useState(initial?.contacts ?? '');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const medications = medicationsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await onSave({
        diagnosis,
        comorbidities,
        medications,
        allergies,
        riskVectors,
        contacts,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        label="אבחנה בסיסית"
        hint="לדוגמה: Bipolar 1 Disorder."
      >
        <textarea
          rows={2}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field
        label="מחלות רקע"
        hint="סוכרת, יתר לחץ דם, מחלות לב, השמנת יתר וכו׳ — קריטי לבחירת תרופות."
      >
        <textarea
          rows={2}
          value={comorbidities}
          onChange={(e) => setComorbidities(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field
        label="רשימת תרופות נוכחית"
        hint="שורה לכל תרופה: שם · מינון · תזמון."
      >
        <textarea
          rows={5}
          value={medicationsText}
          onChange={(e) => setMedicationsText(e.target.value)}
          placeholder={'Lithium 600mg · ערב\nQuetiapine 100mg · לפני שינה'}
          className="mz-input resize-none font-mono text-sm"
          dir="ltr"
        />
      </Field>
      <Field
        label="אלרגיות ותופעות לוואי חריגות"
        hint="תרופות שגרמו לרעד, נוקשות, טוקסיות — להימנע מהן במיון."
      >
        <textarea
          rows={3}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field
        label="גורמי סיכון (אובדנות / סמים / נשק)"
        hint="ניסיונות אובדנות בעבר, שימוש בחומרים, החזקת רישיון נשק."
      >
        <textarea
          rows={3}
          value={riskVectors}
          onChange={(e) => setRiskVectors(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>
      <Field
        label="אנשי קשר רפואיים בקהילה"
        hint="פסיכיאטר מטפל, מסגרת שיקומית, רופא משפחה — שם וטלפון."
      >
        <textarea
          rows={3}
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
          className="mz-input resize-none"
        />
      </Field>

      <button type="submit" disabled={busy} className="mz-btn mz-btn-clay w-full">
        {busy ? 'שומר…' : 'שמירת התיק'}
      </button>
    </form>
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
