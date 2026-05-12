'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/LocaleProvider';

// Lethal-means restriction guide.
//
// Research is consistent: reducing access to highly-lethal means is the
// single highest-leverage suicide prevention action available to families.
// This page is intentionally short, action-oriented, and acknowledges the
// emotional difficulty of asking a loved one to give up their meds or
// firearm.
//
// Content reviewed against general guidance from Means Matter (Harvard
// T.H. Chan School of Public Health) and the Israeli Ministry of Health
// suicide-prevention materials. Not clinical advice.

const ITEMS: { key: string; bodyKey: string; scriptKey?: string }[] = [
  { key: 'safety.item.meds', bodyKey: 'safety.item.medsBody', scriptKey: 'safety.item.medsScript' },
  { key: 'safety.item.firearms', bodyKey: 'safety.item.firearmsBody', scriptKey: 'safety.item.firearmsScript' },
  { key: 'safety.item.sharps', bodyKey: 'safety.item.sharpsBody' },
  { key: 'safety.item.car', bodyKey: 'safety.item.carBody' },
  { key: 'safety.item.disposal', bodyKey: 'safety.item.disposalBody' },
];

export default function SafetyPage() {
  const { t } = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-7">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('safety.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{t('safety.title')}</h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('safety.intro')}</p>
      </header>

      <section className="rounded-2xl bg-sage-bg/70 border border-sage/20 p-4 md:p-5">
        <h2 className="font-bold text-base text-sage">{t('safety.why.title')}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">{t('safety.why.body')}</p>
      </section>

      <ol className="space-y-4">
        {ITEMS.map((it, i) => (
          <li key={it.key} className="mz-card p-5">
            <div className="flex items-start gap-3">
              <span className="shrink-0 h-8 w-8 rounded-full bg-sand-100 text-ink-soft flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-base">{t(it.key)}</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed whitespace-pre-line">
                  {t(it.bodyKey)}
                </p>
                {it.scriptKey && (
                  <div className="mt-3 rounded-xl bg-sand-50 border border-sand-100 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-mute">
                      {t('safety.scriptLabel')}
                    </div>
                    <p className="text-sm mt-1 leading-relaxed whitespace-pre-line">
                      {`"${t(it.scriptKey)}"`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="rounded-2xl bg-crimson-bg border border-crimson/30 p-4 md:p-5">
        <h2 className="font-bold text-base text-crimson-deep">{t('safety.crisis.title')}</h2>
        <p className="text-sm mt-2 leading-relaxed">{t('safety.crisis.body')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="tel:101" className="mz-btn mz-btn-crimson h-10 px-4 text-sm">
            {t('safety.crisis.callMDA')}
          </a>
          <a href="tel:1201" className="mz-btn mz-btn-ghost h-10 px-4 text-sm">
            {t('safety.crisis.callEran')}
          </a>
          <Link href="/emergency" className="mz-btn mz-btn-ghost h-10 px-4 text-sm">
            {t('safety.crisis.openEmergency')}
          </Link>
        </div>
      </section>

      <aside className="text-xs text-ink-mute leading-relaxed">
        {t('safety.disclaimer')}
      </aside>
    </div>
  );
}
