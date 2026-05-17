'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/LocaleProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { CONTACT_EMAIL } from '@/lib/constants';

// Public-facing landing page rendered at `/` for unauthenticated visitors.
// First impression for investors, kupah partners, and curious caregivers.
// Hebrew-first; the LanguageToggle in the header switches to English.
//
// Structure follows a standard healthtech landing: hero → problem →
// product (3 cards) → social proof slot → two CTAs (caregiver sign-up
// and partner contact) → footer. Kept intentionally lean — every section
// has one job.
export function MarketingLanding() {
  const { t } = useT();
  return (
    <div className="min-h-dvh bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-sand-50/85 backdrop-blur border-b border-ink/5">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-lg text-ink">
            <span aria-hidden className="text-clay">◐</span>
            מצפן
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-clay underline-offset-2 hover:underline"
            >
              {t('landing.nav.signIn')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center md:text-start">
          <p className="text-xs font-bold uppercase tracking-widest text-clay">
            {t('landing.hero.kicker')}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-3 leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-ink-soft mt-5 leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 mt-7 justify-center md:justify-start">
            <Link href="/login" className="mz-btn mz-btn-clay h-12 px-6 text-base">
              {t('landing.hero.familyCta')}
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('landing.hero.partnerSubject'))}`}
              className="mz-btn mz-btn-ghost h-12 px-6 text-base"
            >
              {t('landing.hero.partnerCta')}
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-4 md:px-6 py-12 bg-white border-y border-sand-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute">
            {t('landing.problem.kicker')}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2 leading-tight">
            {t('landing.problem.title')}
          </h2>
          <p className="text-base text-ink-soft mt-4 leading-relaxed">
            {t('landing.problem.body')}
          </p>
          <ul className="mt-6 space-y-3 text-base text-ink-soft leading-relaxed">
            <li className="flex items-start gap-3">
              <span aria-hidden className="text-clay shrink-0 mt-1">●</span>
              <span>{t('landing.problem.bullet1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="text-clay shrink-0 mt-1">●</span>
              <span>{t('landing.problem.bullet2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="text-clay shrink-0 mt-1">●</span>
              <span>{t('landing.problem.bullet3')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Product */}
      <section className="px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-mute text-center">
            {t('landing.product.kicker')}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2 text-center">
            {t('landing.product.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard
              icon="📓"
              title={t('landing.product.f1.title')}
              body={t('landing.product.f1.body')}
            />
            <FeatureCard
              icon="🛡"
              title={t('landing.product.f2.title')}
              body={t('landing.product.f2.body')}
            />
            <FeatureCard
              icon="⚡"
              title={t('landing.product.f3.title')}
              body={t('landing.product.f3.body')}
            />
          </div>
        </div>
      </section>

      {/* For partners */}
      <section className="px-4 md:px-6 py-12 bg-sage-bg/40 border-y border-sage/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-sage">
            {t('landing.partner.kicker')}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2 leading-tight">
            {t('landing.partner.title')}
          </h2>
          <p className="text-base text-ink-soft mt-4 leading-relaxed">
            {t('landing.partner.body')}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('landing.hero.partnerSubject'))}`}
            className="mz-btn mz-btn-sage h-12 px-6 text-base mt-6"
          >
            {t('landing.partner.cta')}
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            {t('landing.finalCta.title')}
          </h2>
          <p className="text-base text-ink-soft mt-3 leading-relaxed">
            {t('landing.finalCta.body')}
          </p>
          <Link
            href="/login"
            className="mz-btn mz-btn-clay h-12 px-6 text-base mt-6"
          >
            {t('landing.finalCta.cta')}
          </Link>
          <p className="text-xs text-ink-mute mt-4 leading-relaxed">
            {t('landing.finalCta.privacyNote')}{' '}
            <Link href="/privacy" className="underline">
              {t('landing.finalCta.privacyLink')}
            </Link>{' '}
            ·{' '}
            <Link href="/terms" className="underline">
              {t('landing.finalCta.termsLink')}
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-mute">
          <div>© Matzpen</div>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">
              {t('nav.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-ink">
              {t('nav.terms')}
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Matzpen%20feedback`}
              className="hover:text-ink"
            >
              {t('nav.feedback')}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mz-card p-5 md:p-6">
      <div className="text-3xl" aria-hidden>
        {icon}
      </div>
      <h3 className="text-lg font-extrabold mt-3">{title}</h3>
      <p className="text-sm text-ink-soft mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
