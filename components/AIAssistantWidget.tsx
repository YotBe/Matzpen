'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AIAssistant } from '@/components/AIAssistant';
import { useT } from '@/lib/i18n/LocaleProvider';

export function AIAssistantWidget() {
  const { t } = useT();
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  // Hide on login and on the dedicated assistant page (avoid duplicate UIs).
  const hidden = pathname === '/login' || pathname.startsWith('/assistant');

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('assistant.openLabel')}
        aria-expanded={open}
        className="mz-no-print fixed z-40 start-4 bottom-20 md:bottom-6 h-14 w-14 rounded-full bg-clay text-white shadow-card flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div
          className="mz-no-print fixed z-40 inset-x-3 bottom-36 md:start-6 md:end-auto md:bottom-24 md:w-[380px] md:h-[560px] max-h-[80vh] rounded-card bg-white shadow-card border border-sand-100 overflow-hidden flex flex-col"
          role="dialog"
          aria-label={t('assistant.title')}
          dir="rtl"
        >
          <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-sand-100 bg-sand-50/60">
            <div>
              <p className="text-[11px] text-ink-mute leading-tight">
                {t('assistant.kicker')}
              </p>
              <h2 className="font-bold text-ink text-base leading-tight">
                {t('assistant.title')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('assistant.close')}
              className="text-ink-mute hover:text-ink p-1 rounded-lg"
            >
              <CloseIcon />
            </button>
          </header>
          <div className="flex-1 min-h-0">
            <AIAssistant variant="panel" />
          </div>
        </div>
      )}
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
