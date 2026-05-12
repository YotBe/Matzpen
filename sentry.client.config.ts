// Sentry — client-side init. Only runs when NEXT_PUBLIC_SENTRY_DSN is set,
// so local dev and self-hosted deployments without an account stay silent.
//
// We deliberately keep `tracesSampleRate` low and disable session replay:
// caregivers handle deeply sensitive data and we don't want screenshots
// of golden records or daily logs floating around in Sentry by accident.
//
// Aggressive PII scrubbing: any breadcrumb URL or event request body that
// looks like it could contain patient data is redacted. False positives
// (a debug message that happens to mention "patient") are fine; false
// negatives (leaking actual PHI) are not.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Routes whose request bodies definitely carry PHI / PII. Any fetch
// breadcrumb to these paths gets its body and query string redacted.
const SENSITIVE_PATH_PATTERNS = [
  /\/api\/chat/i,
  /\/api\/extract-medical/i,
  /\/api\/push\//i,
  // Supabase REST tables that hold caregiver data.
  /\/rest\/v1\/golden_records/i,
  /\/rest\/v1\/daily_logs/i,
  /\/rest\/v1\/checklist_items/i,
  /\/rest\/v1\/caregiver_pulse/i,
  /\/rest\/v1\/vault_files/i,
  /\/rest\/v1\/shared_tasks/i,
];

function isSensitivePath(url: string | undefined): boolean {
  if (!url) return false;
  return SENSITIVE_PATH_PATTERNS.some((p) => p.test(url));
}

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    // Replay would record DOM content — too risky for PHI.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
        const data = breadcrumb.data;
        if (data && isSensitivePath(typeof data.url === 'string' ? data.url : undefined)) {
          // Keep the status code, drop everything else.
          breadcrumb.data = {
            url: '[redacted-sensitive-url]',
            status_code: data.status_code,
            method: data.method,
          };
        } else if (data) {
          delete data.request_body_size;
          delete data.response_body_size;
        }
      }
      // Console breadcrumbs occasionally include user input — drop the
      // body if it's longer than a debug message has any business being.
      if (breadcrumb.category === 'console' && breadcrumb.message && breadcrumb.message.length > 500) {
        breadcrumb.message = '[redacted-long-console]';
      }
      return breadcrumb;
    },
    beforeSend(event) {
      // Strip URL query strings from the request and the page URL — they
      // can carry share tokens or AI-assistant prompts.
      if (event.request) {
        if (typeof event.request.url === 'string') {
          event.request.url = event.request.url.split('?')[0];
        }
        // Never ship the request body. If we ever do need a payload for
        // debugging, redact at the route level into a small whitelist.
        delete event.request.data;
        delete event.request.query_string;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
          delete event.request.headers['x-supabase-token'];
        }
      }
      // Some libraries pin user input into `extra` — wipe it.
      if (event.extra) {
        for (const key of Object.keys(event.extra)) {
          const v = event.extra[key];
          if (typeof v === 'string' && v.length > 200) {
            event.extra[key] = '[redacted-long-string]';
          }
        }
      }
      return event;
    },
  });
}
