'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { PLAYBOOK, type Scenario } from '@/lib/playbook/scripts';

const SCENARIOS: Scenario[] = [
  'paranoid_delusions',
  'grandiosity',
  'agitation',
  'refusal_meds',
  'suicidal_ideation',
  'withdrawal',
];

export default function PlaybookPage() {
  const { t } = useT();
  const [active, setActive] = useState<Scenario | 'all'>('all');

  const cards = active === 'all' ? PLAYBOOK : PLAYBOOK.filter((c) => c.scenario === active);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('playbook.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('playbook.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('playbook.intro')}</p>
      </header>

      <section className="rounded-2xl bg-sand-50/60 border border-sand-100 p-4 md:p-5">
        <h2 className="font-bold text-base">{t('playbook.leap.title')}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('playbook.leap.body')}
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive('all')}
          className={`mz-pill ${active === 'all' ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''}`}
        >
          {t('playbook.allScenarios')}
        </button>
        {SCENARIOS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            className={`mz-pill ${
              active === s ? 'bg-clay/15 text-clay-deep ring-1 ring-clay/30' : ''
            }`}
          >
            {t(`playbook.${cardKey(s)}.title`)}
          </button>
        ))}
      </div>

      <ul className="space-y-5">
        {cards.map((card) => (
          <li key={card.scenario} className="mz-card p-5 md:p-6">
            <h3 className="text-xl font-extrabold">{t(card.titleKey)}</h3>

            <Section
              kicker={t('playbook.signsLabel')}
              tone="muted"
              body={t(card.signsKey)}
            />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Section
                kicker={t('playbook.doLabel')}
                tone="sage"
                body={t(card.doKey)}
              />
              <Section
                kicker={t('playbook.dontLabel')}
                tone="crimson"
                body={t(card.dontKey)}
              />
            </div>

            <ScriptBox label={t('playbook.scriptLabel')} body={t(card.scriptKey)} />
            {card.scriptAltKey && (
              <ScriptBox
                label={t('playbook.scriptAltLabel')}
                body={t(card.scriptAltKey)}
              />
            )}
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-clay/5 border border-clay/20 p-4 md:p-5">
        <h2 className="font-bold">{t('playbook.askAssistant.title')}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('playbook.askAssistant.body')}
        </p>
        <Link
          href={`/assistant?prompt=${encodeURIComponent(t('playbook.askAssistant.prompt'))}`}
          className="mz-btn mz-btn-clay mt-3 h-10 px-4 text-sm"
        >
          {t('playbook.askAssistant.cta')}
        </Link>
      </section>

      <aside className="text-xs text-ink-mute leading-relaxed">
        {t('playbook.disclaimer')}
      </aside>
    </div>
  );
}

function Section({
  kicker,
  body,
  tone,
}: {
  kicker: string;
  body: string;
  tone: 'sage' | 'crimson' | 'muted';
}) {
  const colorClass =
    tone === 'sage' ? 'text-sage' : tone === 'crimson' ? 'text-crimson-deep' : 'text-ink-mute';
  return (
    <div className="mt-4">
      <div className={`text-[11px] font-bold uppercase tracking-widest ${colorClass}`}>
        {kicker}
      </div>
      <p className="text-sm text-ink-soft mt-1 leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}

function ScriptBox({ label, body }: { label: string; body: string }) {
  return (
    <div className="mt-4 rounded-xl bg-sand-50 border border-sand-100 p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-mute">
        {label}
      </div>
      <p className="text-base mt-1 leading-relaxed whitespace-pre-line font-medium">
        {body}
      </p>
    </div>
  );
}

function cardKey(s: Scenario): string {
  switch (s) {
    case 'paranoid_delusions':
      return 'paranoid';
    case 'grandiosity':
      return 'grandiosity';
    case 'agitation':
      return 'agitation';
    case 'refusal_meds':
      return 'refusalMeds';
    case 'suicidal_ideation':
      return 'suicidal';
    case 'withdrawal':
      return 'withdrawal';
  }
}
