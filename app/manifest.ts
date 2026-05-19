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
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    categories: ['health', 'medical', 'lifestyle'],
  };
}
