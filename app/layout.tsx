import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGate } from '@/components/AuthGate';
import { Shell } from '@/components/Shell';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'מצפן · Matzpen — מרכז ניהול משבר למשפחות',
  description:
    'אפליקציה למשפחות וצוות תומך של אדם המתמודד עם הפרעה דו-קוטבית — מעקב, התראות מוקדמות, וניהול חירום וזכויות',
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
        <AuthProvider>
          <AuthGate>
            <Shell>{children}</Shell>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
