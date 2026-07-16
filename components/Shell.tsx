'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { NavBar } from '@/components/NavBar';
import { BottomNav } from '@/components/BottomNav';
import { ConfigBanner } from '@/components/ConfigBanner';
import { Footer } from '@/components/Footer';
import { AIAssistantWidget } from '@/components/AIAssistantWidget';

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  // /share/[token] is viewed by people outside the account (ER staff, on-call
  // psychiatrists) — it renders its own minimal header, so the authenticated
  // app chrome (nav, AI widget) would be broken noise there.
  const hideChrome = pathname === '/login' || pathname.startsWith('/share/');

  return (
    <div className="min-h-dvh flex flex-col">
      {!hideChrome && <NavBar />}
      <ConfigBanner />
      <main className="flex-1 pb-24 md:pb-10">{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      {!hideChrome && <AIAssistantWidget />}
    </div>
  );
}
