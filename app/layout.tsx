import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGate } from '@/components/AuthGate';
import { Shell } from '@/components/Shell';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heebo',
  display: 'swap',
});

const APP_NAME = 'מצפן · Matzpen — מרכז ניהול משבר למשפחות';
const APP_DESCRIPTION =
  'אפליקציה למשפחות וצוות תומך של אדם המתמודד עם הפרעה דו-קוטבית — מעקב, התראות מוקדמות, וניהול חירום וזכויות';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: 'Matzpen',
  appleWebApp: {
    capable: true,
    title: 'מצפן',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website',
    locale: 'he_IL',
    siteName: 'Matzpen',
  },
};

export const viewport: Viewport = {
  themeColor: '#f5efe6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans bg-sand-50 text-ink min-h-dvh">
        <ServiceWorkerRegister />
        <LocaleProvider>
          <AuthProvider>
            <AuthGate>
              <Shell>{children}</Shell>
            </AuthGate>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
