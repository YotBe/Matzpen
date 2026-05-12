'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';
import { supabase, supabaseConfigured } from '@/lib/supabaseClient';
import { LanguageToggle } from '@/components/LanguageToggle';

// Public, read-only view of a caregiver's golden record. The token is the
// only secret; the get_shared_golden_record RPC validates it server-side
// and returns the matching record or null. RLS makes direct table access
// impossible — only the RPC path works for anonymous callers.

interface SharedRecord {
  patient_name: string | null;
  relationship: string | null;
  region: string | null;
  city: string | null;
  diagnosis: string | null;
  comorbidities: string | null;
  medications: string[] | null;
  allergies: string | null;
  risk_vectors: string | null;
  contacts: string | null;
  discharge_date: string | null;
  next_refill_date: string | null;
  when_well_loves: string | null;
  when_well_calms: string | null;
  when_well_never_say: string | null;
  updated_at: string;
}

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; record: SharedRecord }
  | { kind: 'expired' }
  | { kind: 'error'; message: string };

export default function SharePage({ params }: { params: { token: string } }) {
  const { t, locale } = useT();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabaseConfigured || !supabase) {
        setState({ kind: 'error', message: t('share.viewer.notConfigured') });
        return;
      }
      try {
        const { data, error } = await supabase.rpc('get_shared_golden_record', {
          p_token: params.token,
        });
        if (cancelled) return;
        if (error) {
          setState({ kind: 'error', message: error.message });
          return;
        }
        if (!data) {
          setState({ kind: 'expired' });
          return;
        }
        setState({ kind: 'ok', record: data as SharedRecord });
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.token, t]);

  return (
    <div className="min-h-dvh">
      <header className="mz-no-print sticky top-0 z-30 bg-sand-50/85 backdrop-blur border-b border-ink/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-base text-ink">
            <span aria-hidden className="text-clay">◐</span>
            מצפן
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {state.kind === 'loading' && (
          <div className="mz-card p-6 text-center text-ink-mute">
            {t('share.viewer.loading')}
          </div>
        )}
        {state.kind === 'expired' && (
          <div className="mz-card p-6 text-center">
            <div className="text-2xl mb-2" aria-hidden>
              ⏳
            </div>
            <h1 className="text-xl font-extrabold">{t('share.viewer.expiredTitle')}</h1>
            <p className="text-ink-mute mt-2 leading-relaxed">
              {t('share.viewer.expiredBody')}
            </p>
          </div>
        )}
        {state.kind === 'error' && (
          <div className="mz-card p-6 text-center">
            <h1 className="text-xl font-extrabold">{t('share.viewer.errorTitle')}</h1>
            <p className="text-ink-mute mt-2 leading-relaxed">{state.message}</p>
          </div>
        )}
        {state.kind === 'ok' && <SharedView r={state.record} locale={locale} />}
      </main>
    </div>
  );
}

function SharedView({ r, locale }: { r: SharedRecord; locale: string }) {
  const { t } = useT();
  const updated = new Date(r.updated_at).toLocaleString(
    locale === 'he' ? 'he-IL' : 'en-US',
  );
  return (
    <article className="mz-card p-6 md:p-10 print-page">
      <header className="border-b border-sand-100 pb-4 mb-5">
        <div className="text-xs uppercase tracking-widest text-ink-mute font-semibold">
          {t('share.viewer.kicker')}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
          {r.patient_name?.trim() || t('share.viewer.unnamed')}
        </h1>
        {r.relationship && (
          <div className="text-xs text-ink-mute mt-1">
            {t('share.viewer.relationship', { rel: r.relationship })}
          </div>
        )}
        {(r.city || r.region) && (
          <div className="text-xs text-ink-mute mt-1">
            {[r.city, r.region ? t(`region.${r.region}`) : ''].filter(Boolean).join(' · ')}
          </div>
        )}
        <div className="text-xs text-ink-mute mt-1">
          {t('share.viewer.updated', { when: updated })}
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        <Field label={t('gr.section.diagnosis')} value={r.diagnosis} />
        <Field label={t('gr.section.comorbidities')} value={r.comorbidities} />
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">
            {t('gr.section.medications')}
          </h2>
          {!r.medications || r.medications.length === 0 ? (
            <p className="text-ink-mute text-sm">{t('share.viewer.empty')}</p>
          ) : (
            <ol className="list-decimal ps-6 space-y-1.5">
              {r.medications.map((m, i) => (
                <li key={i} className="font-medium" dir="ltr">
                  {m}
                </li>
              ))}
            </ol>
          )}
        </div>
        <Field label={t('gr.section.allergies')} value={r.allergies} />
        <Field label={t('gr.section.risk')} value={r.risk_vectors} />
        {r.discharge_date && (
          <Field
            label={t('share.viewer.dischargeDate')}
            value={new Date(`${r.discharge_date}T00:00:00`).toLocaleDateString(
              locale === 'he' ? 'he-IL' : 'en-US',
            )}
          />
        )}
        <div className="md:col-span-2">
          <Field label={t('gr.section.contacts')} value={r.contacts} />
        </div>
        {(r.when_well_loves || r.when_well_calms || r.when_well_never_say) && (
          <div className="md:col-span-2 rounded-2xl bg-sand-50/60 border border-sand-100 p-4">
            <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">
              {t('whenWell.heading')}
            </h2>
            {r.when_well_loves && (
              <p className="text-base leading-relaxed">
                <strong>{t('whenWell.loves.label')}:</strong> {r.when_well_loves}
              </p>
            )}
            {r.when_well_calms && (
              <p className="text-base leading-relaxed mt-1.5">
                <strong>{t('whenWell.calms.label')}:</strong> {r.when_well_calms}
              </p>
            )}
            {r.when_well_never_say && (
              <p className="text-base leading-relaxed mt-1.5">
                <strong>{t('whenWell.neverSay.label')}:</strong> {r.when_well_never_say}
              </p>
            )}
          </div>
        )}
      </div>

      <aside className="mt-8 rounded-2xl bg-amber_-bg text-amber_-ink p-4 text-sm leading-relaxed border border-amber_/30">
        {t('share.viewer.disclaimer')}
      </aside>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  const { t } = useT();
  return (
    <section>
      <h2 className="text-sm font-bold text-ink-mute uppercase tracking-wide mb-2">{label}</h2>
      {value ? (
        <p className="text-base whitespace-pre-line leading-relaxed">{value}</p>
      ) : (
        <p className="text-ink-mute text-sm">{t('share.viewer.empty')}</p>
      )}
    </section>
  );
}
