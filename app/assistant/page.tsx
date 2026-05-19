'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { useT } from '@/lib/i18n/LocaleProvider';
import { usePatientId } from '@/lib/usePatientId';
import { useAuth } from '@/context/AuthContext';
import { getGoldenRecord } from '@/services/supabaseService';

export default function AssistantPage() {
  return (
    <Suspense fallback={null}>
      <AssistantPageInner />
    </Suspense>
  );
}

function AssistantPageInner() {
  const { t } = useT();
  const { configured } = useAuth();
  const patientId = usePatientId();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') ?? undefined;
  const [patientContext, setPatientContext] = useState<{ name: string; diagnosis: string } | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    getGoldenRecord(patientId)
      .then((record) => {
        if (cancelled || !record) return;
        const name = record.patientName?.trim() || '';
        const diagnosis = record.diagnosis?.trim() || '';
        if (name || diagnosis) setPatientContext({ name, diagnosis });
      })
      .catch(() => {/* silently ignore */});
    return () => { cancelled = true; };
  }, [configured, patientId]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
      <header>
        <p className="text-sm text-ink-mute">{t('assistant.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
          {t('assistant.title')}
        </h1>
        <p className="text-ink-mute mt-2 leading-relaxed">
          {t('assistant.pageSubtitle')}
        </p>
      </header>

      <div className="mz-card overflow-hidden">
        <AIAssistant variant="page" initialPrompt={initialPrompt} patientContext={patientContext} />
      </div>
    </div>
  );
}
