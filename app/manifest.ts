import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'מצפן · Matzpen',
    short_name: 'מצפן',
    description:
      'מרכז ניהול משבר למשפחות — מעקב, התראות מוקדמות, וניהול חירום וזכויות.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5efe6',
    theme_color: '#f5efe6',
    lang: 'he',
    dir: 'rtl',
    orientation: 'portrait',
    icons: [
      // PNGs are what Android's install prompt and splash screen require;
      // the SVG stays as a crisp fallback for browsers that prefer it.
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    categories: ['health', 'medical', 'lifestyle'],
  };
}
