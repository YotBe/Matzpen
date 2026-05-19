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

// Scripts stay in Hebrew always — read aloud to Israeli dispatchers.
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

function YesNo({
  onYes,
  onNo,
  yesLabel,
  noLabel,
}: {
  onYes: () => void;
  onNo: () => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      <button
        onClick={onNo}
        className="mz-btn mz-btn-ghost text-lg h-16 rounded-2xl"
      >
        {noLabel}
      </button>
      <button
        onClick={onYes}
        className="mz-btn mz-btn-crimson text-lg h-16 rounded-2xl"
      >
        {yesLabel}
      </button>
    </div>
  );
}

function ScriptCard({ text, label }: { text: string; label: string }) {
  return (
    <div className="rounded-2xl bg-sand-50 border-s-4 border-crimson p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-mute mb-2">
        {label}
      </div>
      <p className="text-base leading-relaxed text-ink" dir="rtl">
        &ldquo;{text}&rdquo;
      </p>
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
  tone: 'crimson' | 'amber' | 'ghost';
  onClick: () => void;
}) {
  const cls =
    tone === 'crimson'
      ? 'bg-crimson text-white hover:bg-crimson-deep'
      : tone === 'amber'
      ? 'bg-amber_ text-amber_-ink hover:bg-amber_/90'
      : 'bg-white text-ink hover:bg-sand-100 border border-sand-100';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-start rounded-2xl px-5 py-4 transition-colors shadow-soft ${cls}`}
    >
      <div className="text-base font-bold leading-tight">{title}</div>
      <div className="text-xs opacity-75 mt-1">{hint}</div>
    </button>
  );
}

function DialButton({ number, label }: { number: string; label: string }) {
  return (
    <a
      href={`tel:${number.replace(/[^\d]/g, '')}`}
      className="flex items-center gap-4 mz-card px-5 py-4 hover:bg-sand-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-crimson text-white flex items-center justify-center shrink-0">
        <PhoneIcon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-ink-mute">{label}</div>
        <div className="text-3xl font-extrabold tabular-nums tracking-tight text-crimson-deep">
          {number}
        </div>
      </div>
    </a>
  );
}

function StepBadge({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < current ? 'bg-clay w-6' : 'bg-sand-100 w-3'
          }`}
        />
      ))}
    </div>
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

  const STEP_DEPTH: Record<Step, { current: number; total: number; trailKey: string }> = {
    'q-violence':        { current: 1, total: 2, trailKey: 'emergency.crumb.violence' },
    'route-police':      { current: 2, total: 2, trailKey: 'emergency.crumb.police' },
    'q-evacuation':      { current: 2, total: 3, trailKey: 'emergency.crumb.evacuation' },
    'route-ambulance':   { current: 3, total: 3, trailKey: 'emergency.crumb.ambulance' },
    'route-psychiatrist':{ current: 3, total: 3, trailKey: 'emergency.crumb.psych' },
  };

  const depth = STEP_DEPTH[step];

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-mute">{t('emergency.kicker')}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
            {t('emergency.title')}
          </h1>
        </div>
        {step !== 'q-violence' && (
          <button
            onClick={reset}
            className="mz-btn mz-btn-ghost h-9 px-3 text-sm shrink-0 mt-1"
          >
            {t('emergency.reset')}
          </button>
        )}
      </header>

      {/* Breadcrumb progress */}
      <nav
        aria-label={t('emergency.breadcrumbAriaLabel')}
        className="flex items-center gap-2.5 text-xs text-ink-mute"
      >
        <StepBadge current={depth.current} total={depth.total} />
        <span className="font-semibold text-ink">
          {t('emergency.stepCount', { current: depth.current, total: depth.total })}
        </span>
        <span className="truncate">· {t(depth.trailKey)}</span>
      </nav>

      {/* Calm notice */}
      <div className="mz-card p-4 flex items-start gap-3 border border-sand-100">
        <ShieldIcon size={18} className="mt-0.5 shrink-0 text-clay" />
        <p className="text-sm text-ink-soft leading-relaxed">{t('emergency.calm')}</p>
      </div>

      {/* ── Step: q-violence ──────────────────────────────────────────────── */}
      {step === 'q-violence' && (
        <section className="space-y-6">
          <div>
            <p className="mz-section-title">{t('emergency.shortcutsTitle')}</p>
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
                tone="ghost"
                onClick={() => setStep('route-psychiatrist')}
              />
            </div>
            <Link
              href="/safety"
              className="mt-3 inline-block text-sm text-clay font-semibold underline"
            >
              {t('emergency.safetyLink')}
            </Link>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-sand-100" />
            <span className="text-[11px] uppercase tracking-widest text-ink-mute whitespace-nowrap">
              {t('emergency.orQuestions')}
            </span>
            <div className="flex-1 h-px bg-sand-100" />
          </div>

          <div className="mz-card p-5 md:p-6 space-y-1">
            <h2 className="text-xl font-bold text-ink leading-snug">
              {t('emergency.qViolence')}
            </h2>
            <p className="text-sm text-ink-mute leading-relaxed">
              {t('emergency.qViolenceHelp')}
            </p>
            <YesNo
              onYes={() => setStep('route-police')}
              onNo={() => setStep('q-evacuation')}
              yesLabel={t('common.yes')}
              noLabel={t('common.no')}
            />
          </div>
        </section>
      )}

      {/* ── Step: route-police ────────────────────────────────────────────── */}
      {step === 'route-police' && (
        <section className="space-y-4 animate-slide-up">
          <div className="mz-card p-5 md:p-6 space-y-4 border-t-4 border-crimson">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-crimson mb-1">
                {t('emergency.recommendedRoute')}
              </p>
              <h2 className="text-2xl font-extrabold text-ink">
                {t('emergency.routePoliceTitle')}
              </h2>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                {t('emergency.routePoliceBody')}
              </p>
            </div>
            <DialButton number="100" label={t('emergency.dial.emergency')} />
            <ScriptCard label={t('emergency.scriptLabel')} text={POLICE_SCRIPT} />
            <div className="rounded-2xl bg-sand-50 p-4 text-sm leading-relaxed">
              <strong className="block mb-2 text-ink">{t('emergency.beforeTeam')}</strong>
              <ul className="list-disc ps-5 space-y-1 text-ink-soft">
                <li>{t('emergency.policeStep1')}</li>
                <li>{t('emergency.policeStep2')}</li>
                <li>{t('emergency.policeStep3')}</li>
                <li>{t('emergency.policeStep4')}</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── Step: q-evacuation ───────────────────────────────────────────── */}
      {step === 'q-evacuation' && (
        <section className="mz-card p-5 md:p-6 space-y-1 animate-slide-up">
          <h2 className="text-xl font-bold text-ink leading-snug">
            {t('emergency.qEvacuation')}
          </h2>
          <p className="text-sm text-ink-mute leading-relaxed">
            {t('emergency.qEvacuationHelp')}
          </p>
          <YesNo
            onYes={() => setStep('route-ambulance')}
            onNo={() => setStep('route-psychiatrist')}
            yesLabel={t('common.yes')}
            noLabel={t('common.no')}
          />
        </section>
      )}

      {/* ── Step: route-ambulance ────────────────────────────────────────── */}
      {step === 'route-ambulance' && (
        <section className="space-y-4 animate-slide-up">
          <div className="mz-card p-5 md:p-6 space-y-4 border-t-4 border-amber_">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber_-ink mb-1">
                {t('emergency.recommendedRoute')}
              </p>
              <h2 className="text-2xl font-extrabold text-ink">
                {t('emergency.routeAmbulanceTitle')}
              </h2>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                {t('emergency.routeAmbulanceBody')}
              </p>
            </div>
            <DialButton number="101" label={t('emergency.dial.mda')} />
            <ScriptCard label={t('emergency.scriptLabel')} text={AMBULANCE_SCRIPT} />
            <div className="rounded-2xl bg-sand-50 p-4 text-sm leading-relaxed">
              <strong className="block mb-1 text-ink">{t('emergency.ambulanceNoteTitle')}</strong>
              <p className="text-ink-soft">{t('emergency.ambulanceNoteBody')}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Step: route-psychiatrist ─────────────────────────────────────── */}
      {step === 'route-psychiatrist' && (
        <section className="space-y-4 animate-slide-up">
          <div className="mz-card p-5 md:p-6 space-y-4 border-t-4 border-clay">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-clay mb-1">
                {t('emergency.recommendedRoute')}
              </p>
              <h2 className="text-2xl font-extrabold text-ink">
                {t('emergency.routePsychTitle')}
              </h2>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                {t('emergency.routePsychBody')}
              </p>
            </div>

            <div className="rounded-2xl bg-sand-50 p-4">
              <p className="mz-section-title">{t('emergency.psychChecklistTitle')}</p>
              <ul className="space-y-3 mt-2">
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
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors mt-0.5 ${
                            on
                              ? 'bg-clay border-clay text-white'
                              : 'bg-white border-sand-100 text-transparent hover:border-clay/50'
                          }`}
                        >
                          <CheckIcon size={16} strokeWidth={3} />
                        </button>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-ink leading-snug">
                            {idx + 1}. {t(item.labelKey)}
                          </div>
                          <div className="text-xs text-ink-mute mt-0.5">{t(item.hintKey)}</div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-crimson-bg border border-crimson/20 p-4 text-sm leading-relaxed flex gap-3">
              <AlertIcon size={18} className="mt-0.5 shrink-0 text-crimson-deep" />
              <span className="text-crimson-deep">{t('emergency.psychEscalate')}</span>
            </div>
          </div>
        </section>
      )}

      <Link href="/" className="inline-block text-sm text-ink-mute hover:text-ink mt-2">
        {t('emergency.backToDashboard')}
      </Link>
    </div>
  );
}
