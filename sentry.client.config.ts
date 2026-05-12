// Sentry — client-side init. Only runs when NEXT_PUBLIC_SENTRY_DSN is set,
// so local dev and self-hosted deployments without an account stay silent.
//
// We deliberately keep `tracesSampleRate` low and disable session replay:
// caregivers handle deeply sensitive data and we don't want screenshots
// of golden records or daily logs floating around in Sentry by accident.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    // Replay would record DOM content — too risky for PHI.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Don't ship breadcrumbs for fetch bodies (could contain log notes).
    sendDefaultPii: false,
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
        delete breadcrumb.data?.request_body_size;
        delete breadcrumb.data?.response_body_size;
      }
      return breadcrumb;
    },
  });
}
