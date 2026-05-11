// Matzpen service worker — minimal offline shell.
// Strategy:
//   - Network-first for HTML navigations (so updates land), with cache fallback when offline.
//   - Cache-first for /_next/static and /icon.svg (immutable build artifacts).
//   - Bypass everything else (Supabase, Google fonts during SW lifetime, etc.) — let the network handle it.

const CACHE_VERSION = 'matzpen-v2';
const SHELL_URLS = [
  '/',
  '/emergency',
  '/golden-record',
  '/bureaucracy',
  '/assistant',
  '/privacy',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Use addAll with individual catches so one 404 doesn't abort install.
      Promise.all(
        SHELL_URLS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_VERSION).map((n) => caches.delete(n))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Same-origin only.
  if (url.origin !== self.location.origin) return;

  // Never intercept Supabase, auth callbacks, or Next.js data fetches.
  if (url.pathname.startsWith('/api/')) return;

  // Cache-first for hashed static assets.
  if (url.pathname.startsWith('/_next/static/') || url.pathname === '/icon.svg') {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for HTML navigations.
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/'))),
    );
  }
});
