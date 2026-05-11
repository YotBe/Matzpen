'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertIcon, PhoneIcon, ShieldIcon, CheckIcon } from '@/components/icons';
import { useT } from '@/lib/i18n/LocaleProvider';

type Step =
  | 'q-violence'
  | 'route-police'
  | 'q-evacuation'
  | 'route-ambulance'
  | 'route-psychiatrist';

// Scripts stay in Hebrew always — they are read aloud to Israeli dispatchers.
const POLICE_SCRIPT =
  'שלום, בן משפחתי נמצא בפסיכוזה אקוטית ויש סכנת אלימות. על פי נוהל אדם עם מוגבלות נפשית, אני מבקש שהצוות יגיע ללא סירנות ויצויד בטייזר בלבד ולא בנשק חם.';

const AMBULANCE_SCRIPT =
  'אני מבקש לשלוח פראמדיק או צוות התערבות במשבר לבריאות הנפש לצורך הערכה ופינוי.';

const PSYCH_CHECKLIST = [
  { key: 'doctor-letter', labelKey: 'emergency.psych.doctor.label', hintKey: 'emergency.psych.doctor.hint' },
  { key: 'family-letter', labelKey: 'emergency.psych.family.label', hintKey: 'emergency.psych.family.hint' },
  { key: 'welfare', labelKey: 'emergency.psych.welfare.label', hintKey: 'emergency.psych.welfare.hint' },
  { key: 'district', labelKey: 'emergency.psych.district.label', hintKey: 'emergency.psych.district.hint' },
  { key: 'verify', labelKey: 'emergency.psych.verify.label', hintKey: 'emergency.psych.verify.hint' },
] as const;

function YesNo({ onYes, onNo, yesLabel, noLabel }: { onYes: () => void; onNo: () => void; yesLabel: string; noLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <button
        onClick={onNo}
        className="bg-white rounded-2xl py-6 text-xl font-bold text-ink hover:bg-sand-100 transition-colors border-2 border-transparent"
      >
        {noLabel}
      </button>
      <button
        onClick={onYes}
        className="bg-crimson-deep text-white rounded-2xl py-6 text-xl font-bold hover:bg-crimson transition-colors"
      >
        {yesLabel}
      </button>
    </div>
  );
}

function ScriptCard({ text, label }: { text: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border-s-4 border-white p-4 mt-3">
      <div className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</div>
      <p className="text-base leading-relaxed mt-2" dir="rtl">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

function ShortcutButton({
  title,
  hint,
  tone,
  onClick,
}: {
  title: string;
  hint: string;
  tone: 'crimson' | 'amber' | 'muted';
  onClick: () => void;
}) {
  const toneClass =
    tone === 'crimson'
      ? 'bg-crimson-deep hover:bg-crimson text-white'
      : tone === 'amber'
      ? 'bg-amber_ hover:bg-amber_/90 text-amber_-ink'
      : 'bg-white/12 hover:bg-white/20 text-white border border-white/20';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-start rounded-2xl px-5 py-4 transition-colors ${toneClass}`}
    >
      <div className="text-lg font-bold leading-tight">{title}</div>
      <div className="text-xs opacity-80 mt-1">{hint}</div>
    </button>
  );
}

function DialButton({ number, label }: { number: string; label: string }) {
  return (
    <a
      href={`tel:${number.replace(/[^\d]/g, '')}`}
      className="flex items-center gap-3 bg-white text-crimson-deep rounded-2xl px-5 py-4 shadow-card hover:bg-sand-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-crimson-deep text-white flex items-center justify-center">
        <PhoneIcon size={22} />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold opacity-70">{label}</div>
        <div className="text-2xl font-extrabold tabular-nums tracking-tight">{number}</div>
      </div>
    </a>
  );
}

export default function EmergencyPage() {
  const { t } = useT();
  const [step, setStep] = useState<Step>('q-violence');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const reset = () => {
    setStep('q-violence');
    setChecked({});
  };

  // Position of each step in the decision tree (translated at render time).
  const STEP_DEPTH: Record<Step, { current: number; total: number; trailKey: string }> = {
    'q-violence': { current: 1, total: 2, trailKey: 'emergency.crumb.violence' },
    'route-police': { current: 2, total: 2, trailKey: 'emergency.crumb.police' },
    'q-evacuation': { current: 2, total: 3, trailKey: 'emergency.crumb.evacuation' },
    'route-ambulance': { current: 3, total: 3, trailKey: 'emergency.crumb.ambulance' },
    'route-psychiatrist': { current: 3, total: 3, trailKey: 'emergency.crumb.psych' },
  };

  const depth = STEP_DEPTH[step];

  return (
    <div
      className="dark-surface min-h-[calc(100dvh-6rem)] bg-gradient-to-b from-[#1a0e0c] via-[#2a1410] to-[#3a1812] text-white"
      data-focus-on-dark
    >
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
              {t('emergency.kicker')}
            </div>
            <h1 className="text-3xl font-extrabold mt-1">{t('emergency.title')}</h1>
          </div>
          {step !== 'q-violence' && (
            <button
              onClick={reset}
              className="text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              {t('emergency.reset')}
            </button>
          )}
        </header>

        <nav
          aria-label={t('emergency.breadcrumbAriaLabel')}
          className="mb-6 flex items-center gap-2 text-xs text-white/70"
        >
          <div className="flex items-center gap-1" aria-hidden>
            {Array.from({ length: depth.total }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < depth.current ? 'bg-white w-6' : 'bg-white/25 w-3'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">
            {t('emergency.stepCount', { current: depth.current, total: depth.total })}
          </span>
          <span className="opacity-60 truncate">· {t(depth.trailKey)}</span>
        </nav>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-6 flex items-start gap-3">
          <ShieldIcon size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm opacity-90 leading-relaxed">{t('emergency.calm')}</p>
        </div>

        {step === 'q-violence' && (
          <section className="space-y-7">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold opacity-70 mb-3">
                {t('emergency.shortcutsTitle')}
              </h3>
              <div className="grid gap-2.5">
                <ShortcutButton
                  title={t('emergency.shortcut.violence')}
                  hint={t('emergency.shortcut.violenceHint')}
                  tone="crimson"
                  onClick={() => setStep('route-police')}
                />
                <ShortcutButton
                  title={t('emergency.shortcut.suicide')}
                  hint={t('emergency.shortcut.suicideHint')}
                  tone="amber"
                  onClick={() => setStep('route-ambulance')}
                />
                <ShortcutButton
                  title={t('emergency.shortcut.involuntary')}
                  hint={t('emergency.shortcut.involuntaryHint')}
                  tone="muted"
                  onClick={() => setStep('route-psychiatrist')}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
              <div className="relative text-center text-[11px] uppercase tracking-widest text-white/60">
                <span className="bg-[#2a1410] px-3">{t('emergency.orQuestions')}</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold leading-tight">{t('emergency.qViolence')}</h2>
              <p className="text-sm opacity-75 mt-2">{t('emergency.qViolenceHelp')}</p>
              <YesNo
                onYes={() => setStep('route-police')}
                onNo={() => setStep('q-evacuation')}
                yesLabel={t('common.yes')}
                noLabel={t('common.no')}
              />
            </div>
          </section>
        )}

        {step === 'route-police' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                {t('emergency.recommendedRoute')}
              </div>
              <h2 className="text-3xl font-extrabold mt-1">{t('emergency.routePoliceTitle')}</h2>
              <p className="opacity-80 mt-2 leading-relaxed">{t('emergency.routePoliceBody')}</p>
            </div>
            <DialButton number="100" label={t('emergency.dial.emergency')} />
            <ScriptCard label={t('emergency.scriptLabel')} text={POLICE_SCRIPT} />
            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed">
              <strong className="block mb-1">{t('emergency.beforeTeam')}</strong>
              <ul className="list-disc ps-5 space-y-1 opacity-90">
                <li>{t('emergency.policeStep1')}</li>
                <li>{t('emergency.policeStep2')}</li>
                <li>{t('emergency.policeStep3')}</li>
                <li>{t('emergency.policeStep4')}</li>
              </ul>
            </div>
          </section>
        )}

        {step === 'q-evacuation' && (
          <section>
            <h2 className="text-2xl font-bold leading-tight">{t('emergency.qEvacuation')}</h2>
            <p className="text-sm opacity-75 mt-2">{t('emergency.qEvacuationHelp')}</p>
            <YesNo
              onYes={() => setStep('route-ambulance')}
              onNo={() => setStep('route-psychiatrist')}
              yesLabel={t('common.yes')}
              noLabel={t('common.no')}
            />
          </section>
        )}

        {step === 'route-ambulance' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                {t('emergency.recommendedRoute')}
              </div>
              <h2 className="text-3xl font-extrabold mt-1">{t('emergency.routeAmbulanceTitle')}</h2>
              <p className="opacity-80 mt-2 leading-relaxed">{t('emergency.routeAmbulanceBody')}</p>
            </div>
            <DialButton number="101" label={t('emergency.dial.mda')} />
            <ScriptCard label={t('emergency.scriptLabel')} text={AMBULANCE_SCRIPT} />
            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed">
              <strong className="block mb-1">{t('emergency.ambulanceNoteTitle')}</strong>
              <p className="opacity-90">{t('emergency.ambulanceNoteBody')}</p>
            </div>
          </section>
        )}

        {step === 'route-psychiatrist' && (
          <section className="space-y-5 animate-slide-up">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                {t('emergency.recommendedRoute')}
              </div>
              <h2 className="text-3xl font-extrabold mt-1">{t('emergency.routePsychTitle')}</h2>
              <p className="opacity-80 mt-2 leading-relaxed">{t('emergency.routePsychBody')}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-widest opacity-70 font-semibold mb-3">
                {t('emergency.psychChecklistTitle')}
              </div>
              <ul className="space-y-3">
                {PSYCH_CHECKLIST.map((item, idx) => {
                  const on = checked[item.key] ?? false;
                  return (
                    <li key={item.key}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setChecked((p) => ({ ...p, [item.key]: !p[item.key] }))
                          }
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            on
                              ? 'bg-white border-white text-crimson-deep'
                              : 'bg-transparent border-white/40 text-transparent'
                          }`}
                        >
                          <CheckIcon size={18} strokeWidth={3} />
                        </button>
                        <div className="flex-1">
                          <div className="font-semibold text-base leading-snug">
                            {idx + 1}. {t(item.labelKey)}
                          </div>
                          <div className="text-xs opacity-70 mt-0.5">{t(item.hintKey)}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/6 p-4 text-sm leading-relaxed flex gap-3">
              <AlertIcon size={18} className="mt-0.5 shrink-0" />
              <span className="opacity-90">{t('emergency.psychEscalate')}</span>
            </div>
          </section>
        )}

        <Link
          href="/"
          className="mt-10 inline-block text-sm opacity-70 hover:opacity-100"
        >
          {t('emergency.backToDashboard')}
        </Link>
      </div>
    </div>
  );
}
