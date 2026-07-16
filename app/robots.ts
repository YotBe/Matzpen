import type { MetadataRoute } from 'next';

// Everything behind AuthGate is invisible to crawlers anyway, but the
// token-addressed pages (/share, /envelope) are public by design and must
// never be indexed — a leaked share link in a search index is a medical-data
// breach. Belt: this file. Suspenders: X-Robots-Tag headers in
// next.config.mjs, which bind even when a crawler ignores robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/api/', '/share/', '/envelope/', '/monitoring'],
      },
    ],
  };
}
