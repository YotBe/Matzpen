'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[matzpen] route error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center" dir="rtl">
      <div className="mz-card p-8 md:p-12">
        <div className="text-5xl mb-4" aria-hidden>
          ◐
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold">משהו השתבש</h1>
        <p className="text-ink-mute mt-3 leading-relaxed">
          נתקלנו בתקלה זמנית. נסי לרענן או חזרי לעמוד הראשי. אם הבעיה חוזרת,
          פני אלינו.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <button onClick={reset} className="mz-btn mz-btn-clay">
            נסי שוב
          </button>
          <Link href="/" className="mz-btn mz-btn-ghost">
            חזרה לעמוד הראשי
          </Link>
        </div>

        {error.digest && (
          <p className="text-[11px] text-ink-mute mt-6 font-mono" dir="ltr">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
