/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

// Baseline security headers applied to every response. These are intentionally
// conservative: no CSP yet (would need allow-listing Supabase + Google Fonts +
// Gemini endpoints), but the cheap wins are here.
//
// `camera=(self) microphone=(self)` is required so the /vault page can use
// MediaRecorder. Other origins are still blocked.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=(), interest-cohort=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
      {
        // The service worker file must never be cached by intermediaries,
        // otherwise users get stuck on an old SW that serves stale shells.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

// withSentryConfig is a no-op at runtime when no DSN is set, but it does
// inject the Sentry tunnel route. Keep silent in dev/CI by leaving the
// upload options unset — only configured deploys upload sourcemaps.
export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
  // Avoid creating a release at build time unless org/project envs are set.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  tunnelRoute: '/monitoring',
});
