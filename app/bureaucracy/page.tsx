'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { MOCK_PATIENT_ID } from '@/lib/constants';
import { getChecklist, setChecklistItem } from '@/services/supabaseService';
import type { BureaucracySection } from '@/lib/types';
import { CheckIcon, ChevronEnd, ChevronStart } from '@/components/icons';

interface Item {
  key: string;
  labelKey: string;
  hintKey: string;
}

interface SectionDef {
  id: BureaucracySection;
  titleKey: string;
  badgeKey: string;
  introKey: string;
  toneClass: string;
  items: Item[];
  noteKey?: string;
}

const SECTIONS: SectionDef[] = [
  {
    id: 'national_insurance',
    titleKey: 'bur.ni.title',
    badgeKey: 'bur.ni.badge',
    introKey: 'bur.ni.intro',
    toneClass: 'border-clay/40 bg-clay-bg/40',
    items: [
      { key: 'psychiatric-annex', labelKey: 'bur.ni.psych.label', hintKey: 'bur.ni.psych.hint' },
      { key: 'discharge-summaries', labelKey: 'bur.ni.discharge.label', hintKey: 'bur.ni.discharge.hint' },
      { key: 'confidentiality-waiver', labelKey: 'bur.ni.waiver.label', hintKey: 'bur.ni.waiver.hint' },
      { key: 'income-docs', labelKey: 'bur.ni.income.label', hintKey: 'bur.ni.income.hint' },
      { key: 'comorbidity-docs', labelKey: 'bur.ni.comorbid.label', hintKey: 'bur.ni.comorbid.hint' },
      { key: 'submit-online', labelKey: 'bur.ni.submit.label', hintKey: 'bur.ni.submit.hint' },
    ],
  },
  {
    id: 'rehab_basket',
    titleKey: 'bur.rehab.title',
    badgeKey: 'bur.rehab.badge',
    introKey: 'bur.rehab.intro',
    toneClass: 'border-sage/40 bg-sage-bg/40',
    noteKey: 'bur.rehab.note',
    items: [
      { key: 'rehab-coordinator', labelKey: 'bur.rehab.coord.label', hintKey: 'bur.rehab.coord.hint' },
      { key: 'rehab-form', labelKey: 'bur.rehab.form.label', hintKey: 'bur.rehab.form.hint' },
      { key: 'rehab-committee', labelKey: 'bur.rehab.committee.label', hintKey: 'bur.rehab.committee.hint' },
      { key: 'rehab-choice', labelKey: 'bur.rehab.choice.label', hintKey: 'bur.rehab.choice.hint' },
    ],
  },
  {
    id: 'legal',
    titleKey: 'bur.legal.title',
    badgeKey: 'bur.legal.badge',
    introKey: 'bur.legal.intro',
    toneClass: 'border-muted_blue/40 bg-muted_blue-bg/40',
    items: [
      { key: 'epoa-discussed', labelKey: 'bur.legal.epoa-discussed.label', hintKey: 'bur.legal.epoa-discussed.hint' },
      { key: 'epoa-signed', labelKey: 'bur.legal.epoa-signed.label', hintKey: 'bur.legal.epoa-signed.hint' },
      { key: 'lawyer-contact', labelKey: 'bur.legal.lawyer.label', hintKey: 'bur.legal.lawyer.hint' },
    ],
  },
];

export default function BureaucracyPage() {
  const { configured } = useAuth();
  const { t } = useT();
  const [openId, setOpenId] = useState<BureaucracySection>('national_insurance');
  const [state, setState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (configured) {
        try {
          const docs = await getChecklist(MOCK_PATIENT_ID);
          if (!cancelled) {
            const m: Record<string, boolean> = {};
            for (const d of docs) m[`${d.section}.${d.itemKey}`] = d.done;
            setState(m);
          }
        } catch {
          /* leave empty */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  const toggle = useCallback(
    async (section: BureaucracySection, itemKey: string) => {
      const k = `${section}.${itemKey}`;
      const next = !state[k];
      setState((s) => ({ ...s, [k]: next }));
      if (configured) {
        try {
          await setChecklistItem(MOCK_PATIENT_ID, section, itemKey, next);
        } catch {
          // revert on error
          setState((s) => ({ ...s, [k]: !next }));
        }
      }
    },
    [configured, state],
  );

  const sectionsWithProgress = useMemo(
    () =>
      SECTIONS.map((s) => {
        const total = s.items.length;
        const done = s.items.filter((i) => state[`${s.id}.${i.key}`]).length;
        return { ...s, total, done };
      }),
    [state],
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center text-ink-mute">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">{t('bur.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('bur.title')}
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">{t('bur.subtitle')}</p>
      </header>

      <LegalEducationCard />

      <div className="space-y-3">
        {sectionsWithProgress.map((sec) => {
          const open = openId === sec.id;
          return (
            <section
              key={sec.id}
              className={`mz-card overflow-hidden border ${sec.toneClass} border-transparent`}
            >
              <button
                onClick={() => setOpenId(open ? ('' as BureaucracySection) : sec.id)}
                aria-expanded={open}
                className="w-full text-start p-5 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mz-pill bg-white/70">{t(sec.badgeKey)}</span>
                    <h2 className="text-lg font-bold truncate">{t(sec.titleKey)}</h2>
                  </div>
                  <p className="text-sm text-ink-soft mt-1 leading-relaxed">{t(sec.introKey)}</p>
                  <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
                    <div
                      className="h-full bg-ink/70"
                      style={{ width: `${(sec.done / sec.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-ink-mute mt-1.5 font-semibold">
                    {t('bur.progress', { done: sec.done, total: sec.total })}
                  </div>
                </div>
                <span className="text-ink-mute shrink-0">
                  {open ? <ChevronStart size={20} /> : <ChevronEnd size={20} />}
                </span>
              </button>

              {open && (
                <div className="px-5 pb-5">
                  {sec.noteKey && (
                    <div className="mb-4 text-xs font-semibold bg-white/80 rounded-xl px-3 py-2 text-ink-soft">
                      {t(sec.noteKey)}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {sec.items.map((item) => {
                      const k = `${sec.id}.${item.key}`;
                      const on = state[k] ?? false;
                      return (
                        <li key={item.key}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(sec.id, item.key)}
                            className="w-full text-start flex items-start gap-3 p-3 rounded-2xl bg-white hover:bg-sand-50 transition-colors"
                          >
                            <span
                              className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                                on
                                  ? 'bg-sage border-sage text-white'
                                  : 'border-ink-mute/30 text-transparent bg-white'
                              }`}
                            >
                              <CheckIcon size={14} strokeWidth={3} />
                            </span>
                            <span className="flex-1">
                              <span
                                className={`font-semibold text-base ${
                                  on ? 'line-through text-ink-mute' : 'text-ink'
                                }`}
                              >
                                {t(item.labelKey)}
                              </span>
                              <span className="block text-xs text-ink-mute mt-0.5 leading-relaxed">
                                {t(item.hintKey)}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {!configured && (
        <p className="text-xs text-ink-mute text-center">{t('bur.previewNote')}</p>
      )}
    </div>
  );
}

function LegalEducationCard() {
  const { t } = useT();
  return (
    <div className="mz-card p-5 md:p-6 grid md:grid-cols-2 gap-4 border-s-4 border-muted_blue">
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-muted_blue mb-1">
          {t('bur.legal.proactive')}
        </div>
        <h3 className="text-lg font-bold">{t('bur.legal.epoa.title')}</h3>
        <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
          {t('bur.legal.epoa.body')}
        </p>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-crimson-deep mb-1">
          {t('bur.legal.reactive')}
        </div>
        <h3 className="text-lg font-bold">{t('bur.legal.guard.title')}</h3>
        <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
          {t('bur.legal.guard.body')}
        </p>
      </div>
    </div>
  );
}
