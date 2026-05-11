'use client';

import { useAuth } from '@/context/AuthContext';

export function ConfigBanner() {
  const { configured } = useAuth();
  if (configured) return null;
  return (
    <div className="bg-amber_-bg/80 text-amber_-ink text-sm px-4 py-2 text-center border-b border-amber_/30">
      מצב תצוגה: Firebase לא מוגדר. ראה <code className="font-mono mx-1">.env.example</code> להפעלת אימות ושמירה.
    </div>
  );
}
