'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
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
    id: 'first_hospitalization',
    titleKey: 'bur.situation.firstHosp.title',
    badgeKey: 'bur.situation.firstHosp.badge',
    introKey: 'bur.situation.firstHosp.intro',
    toneClass: 'border-clay/40 bg-clay-bg/40',
    items: [
      { key: 'family-letter', labelKey: 'bur.firstHosp.familyLetter.label', hintKey: 'bur.firstHosp.familyLetter.hint' },
      { key: 'discharge-docs', labelKey: 'bur.firstHosp.discharge.label', hintKey: 'bur.firstHosp.discharge.hint' },
      { key: 'waiver', labelKey: 'bur.firstHosp.waiver.label', hintKey: 'bur.firstHosp.waiver.hint' },
      { key: 'community-psych', labelKey: 'bur.firstHosp.psychiatrist.label', hintKey: 'bur.firstHosp.psychiatrist.hint' },
    ],
  },
  {
    id: 'discharge_followup',
    titleKey: 'bur.situation.discharge.title',
    badgeKey: 'bur.situation.discharge.badge',
    introKey: 'bur.situation.discharge.intro',
    toneClass: 'border-sage/40 bg-sage-bg/40',
    items: [
      { key: 'summary', labelKey: 'bur.discharge.summary.label', hintKey: 'bur.discharge.summary.hint' },
      { key: 'followup', labelKey: 'bur.discharge.followup.label', hintKey: 'bur.discharge.followup.hint' },
      { key: 'meds', labelKey: 'bur.discharge.meds.label', hintKey: 'bur.discharge.meds.hint' },
      { key: 'rehab', labelKey: 'bur.discharge.rehab.label', hintKey: 'bur.discharge.rehab.hint' },
      { key: 'work', labelKey: 'bur.discharge.work.label', hintKey: 'bur.discharge.work.hint' },
    ],
  },
  {
    id: 'deterioration',
    titleKey: 'bur.situation.deterioration.title',
    badgeKey: 'bur.situation.deterioration.badge',
    introKey: 'bur.situation.deterioration.intro',
    toneClass: 'border-crimson/40 bg-crimson-bg/30',
    items: [
      { key: 'open-emergency', labelKey: 'bur.deter.emergency.label', hintKey: 'bur.deter.emergency.hint' },
      { key: 'contact-team', labelKey: 'bur.deter.team.label', hintKey: 'bur.deter.team.hint' },
      { key: 'update-golden', labelKey: 'bur.deter.golden.label', hintKey: 'bur.deter.golden.hint' },
      { key: 'family-letter', labelKey: 'bur.deter.familyLetter.label', hintKey: 'bur.deter.familyLetter.hint' },
    ],
  },
  {
    id: 'disability_claim',
    titleKey: 'bur.situation.disability.title',
    badgeKey: 'bur.situation.disability.badge',
    introKey: 'bur.situation.disability.intro',
    toneClass: 'border-amber_/40 bg-amber_-bg/40',
    items: [
      { key: 'psych-annex', labelKey: 'bur.disability.psych.label', hintKey: 'bur.disability.psych.hint' },
      { key: 'discharge-file', labelKey: 'bur.disability.discharge.label', hintKey: 'bur.disability.discharge.hint' },
      { key: 'waiver', labelKey: 'bur.disability.waiver.label', hintKey: 'bur.disability.waiver.hint' },
      { key: 'income', labelKey: 'bur.disability.income.label', hintKey: 'bur.disability.income.hint' },
      { key: 'comorbid', labelKey: 'bur.disability.comorbid.label', hintKey: 'bur.disability.comorbid.hint' },
      { key: 'submit', labelKey: 'bur.disability.submit.label', hintKey: 'bur.disability.submit.hint' },
      { key: 'rehab-coord', labelKey: 'bur.disability.rehabCoord.label', hintKey: 'bur.disability.rehabCoord.hint' },
      { key: 'rehab-form', labelKey: 'bur.disability.rehabForm.label', hintKey: 'bur.disability.rehabForm.hint' },
      { key: 'rehab-committee', labelKey: 'bur.disability.rehabCommittee.label', hintKey: 'bur.disability.rehabCommittee.hint' },
      { key: 'rehab-choice', labelKey: 'bur.disability.rehabChoice.label', hintKey: 'bur.disability.rehabChoice.hint' },
    ],
  },
  {
    id: 'advance_planning',
    titleKey: 'bur.situation.planning.title',
    badgeKey: 'bur.situation.planning.badge',
    introKey: 'bur.situation.planning.intro',
    toneClass: 'border-muted_blue/40 bg-muted_blue-bg/40',
    items: [
      { key: 'epoa-talk', labelKey: 'bur.planning.epoaTalk.label', hintKey: 'bur.planning.epoaTalk.hint' },
      { key: 'epoa-signed', labelKey: 'bur.planning.epoaSigned.label', hintKey: 'bur.planning.epoaSigned.hint' },
      { key: 'lawyer', labelKey: 'bur.planning.lawyer.label', hintKey: 'bur.planning.lawyer.hint' },
    ],
  },
];

export default function BureaucracyPage() {
  const { configured } = useAuth();
  const { t } = useT();
  const patientId = usePatientId();
  const [openId, setOpenId] = useState<BureaucracySection>('first_hospitalization');
  const [state, setState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (configured) {
        try {
          const docs = await getChecklist(patientId);
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
  }, [configured, patientId]);

  const toggle = useCallback(
    async (section: BureaucracySection, itemKey: string) => {
      const k = `${section}.${itemKey}`;
      const next = !state[k];
      setState((s) => ({ ...s, [k]: next }));
      if (configured) {
        try {
          await setChecklistItem(patientId, section, itemKey, next);
        } catch {
          // revert on error
          setState((s) => ({ ...s, [k]: !next }));
        }
      }
    },
    [configured, patientId, state],
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
