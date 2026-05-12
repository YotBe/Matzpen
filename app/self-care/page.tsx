'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/LocaleProvider';

interface Resource {
  key: string;
  // External URL (verified before publish, or omitted if uncertain).
  url?: string;
  // tel: link for phone-first resources.
  tel?: string;
}

// Israel-specific caregiver / family-of-patient support resources. Each
// entry has a translation key for name + description. Links here should
// be verified against the source organization's site before launch.
const RESOURCES: Resource[] = [
  { key: 'selfCare.enosh', url: 'https://enosh.org.il' },
  { key: 'selfCare.ozma', url: 'https://www.ozma.org.il' },
  { key: 'selfCare.eran', tel: '1201' },
  { key: 'selfCare.yad_sarah', url: 'https://www.yadsarah.org.il' },
  { key: 'selfCare.kupa_therapy' },
  { key: 'selfCare.support_group' },
];

export default function SelfCarePage() {
  const { t } = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-clay">
          {t('selfCare.kicker')}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
          {t('selfCare.title')}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t('selfCare.intro')}</p>
      </header>

      <section className="rounded-2xl bg-sage-bg/70 border border-sage/20 p-4 md:p-5">
        <h2 className="font-bold text-base text-sage">{t('selfCare.why.title')}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('selfCare.why.body')}
        </p>
      </section>

      <ul className="space-y-3">
        {RESOURCES.map((r) => (
          <li key={r.key} className="mz-card p-4 md:p-5">
            <h3 className="font-extrabold text-base">{t(`${r.key}.title`)}</h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed whitespace-pre-line">
              {t(`${r.key}.body`)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.tel && (
                <a
                  href={`tel:${r.tel}`}
                  className="mz-btn mz-btn-clay h-10 px-4 text-sm"
                >
                  {t('selfCare.callCta', { number: r.tel })}
                </a>
              )}
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mz-btn mz-btn-ghost h-10 px-4 text-sm"
                >
                  {t('selfCare.openCta')}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-sand-50/60 border border-sand-100 p-4 md:p-5">
        <h2 className="font-bold text-base">{t('selfCare.shareLoad.title')}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">
          {t('selfCare.shareLoad.body')}
        </p>
        <Link href="/war-room" className="mz-btn mz-btn-clay mt-3 h-10 px-4 text-sm">
          {t('selfCare.shareLoad.cta')}
        </Link>
      </section>

      <aside className="text-xs text-ink-mute leading-relaxed">
        {t('selfCare.disclaimer')}
      </aside>
    </div>
  );
}
