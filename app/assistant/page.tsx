'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { useT } from '@/lib/i18n/LocaleProvider';

export default function AssistantPage() {
  return (
    <Suspense fallback={null}>
      <AssistantPageInner />
    </Suspense>
  );
}

function AssistantPageInner() {
  const { t } = useT();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') ?? undefined;

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
        <AIAssistant variant="page" initialPrompt={initialPrompt} />
      </div>
    </div>
  );
}
