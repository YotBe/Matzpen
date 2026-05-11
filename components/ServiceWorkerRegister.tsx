'use client';

import { useEffect } from 'react';

// Registers the offline shell SW once on mount. Only runs in production builds
// so `next dev` HMR keeps working.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registration failures shouldn't break the page */
      });
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
