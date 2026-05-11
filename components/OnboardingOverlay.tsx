'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n/LocaleProvider';

const STORAGE_KEY = 'matzpen.onboarded.v1';

const SCREENS = [
  { titleKey: 'onboarding.s1.title', bodyKey: 'onboarding.s1.body', emoji: '📝' },
  { titleKey: 'onboarding.s2.title', bodyKey: 'onboarding.s2.body', emoji: '🚨' },
  { titleKey: 'onboarding.s3.title', bodyKey: 'onboarding.s3.body', emoji: '🗂️' },
] as const;

function readSeen(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true; // localStorage blocked → don't pester the user
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    /* ignore */
  }
}

export function OnboardingOverlay() {
  const { t } = useT();
  // Always render `false` on the server so SSR/CSR markup matches; promote to
  // `true` only after the mount-time check confirms the user hasn't seen it.
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!readSeen()) setOpen(true);
  }, []);

  const close = useCallback(() => {
    markSeen();
    setOpen(false);
  }, []);

  // Keyboard: Esc closes; arrow keys page within.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setIndex((i) => Math.min(i + 1, SCREENS.length - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const screen = SCREENS[index];
  const isFirst = index === 0;
  const isLast = index === SCREENS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={(e) => {
        // Clicks on the backdrop (not on the dialog itself) dismiss.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-t-3xl md:rounded-3xl shadow-card w-full md:max-w-md mx-0 md:mx-4 p-6 md:p-8 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-ink-mute tracking-widest uppercase">
            {t('common.step', { current: index + 1, total: SCREENS.length })}
          </span>
          <button
            type="button"
            onClick={close}
            className="text-sm text-ink-mute hover:text-ink"
          >
            {t('common.skip')}
          </button>
        </div>

        <div className="text-center py-4">
          <div className="text-5xl mb-3" aria-hidden>
            {screen.emoji}
          </div>
          <h2 id="onboarding-title" className="text-2xl font-extrabold">
            {t(screen.titleKey)}
          </h2>
          <p className="text-base text-ink-soft mt-3 leading-relaxed">
            {t(screen.bodyKey)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 my-4" aria-hidden>
          {SCREENS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'bg-clay w-6' : 'bg-sand-100 w-2'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          {!isFirst && (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="mz-btn mz-btn-ghost flex-1"
            >
              {t('common.back')}
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(SCREENS.length - 1, i + 1))}
              className="mz-btn mz-btn-clay flex-1"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={close}
              className="mz-btn mz-btn-clay flex-1"
            >
              {t('common.done')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
