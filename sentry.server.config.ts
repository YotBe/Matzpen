// Sentry — server-side init for API routes & server components.
//
// Same PII philosophy as the client: nuke anything that could carry PHI.
// API routes shouldn't be capturing user input into Sentry in the first
// place, but if a library does, this stops it from leaving the box.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request) {
        if (typeof event.request.url === 'string') {
          event.request.url = event.request.url.split('?')[0];
        }
        delete event.request.data;
        delete event.request.query_string;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
          delete event.request.headers['x-supabase-token'];
        }
      }
      return event;
    },
  });
}
