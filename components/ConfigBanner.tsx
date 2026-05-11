'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/lib/i18n/LocaleProvider';

export function ConfigBanner() {
  const { configured } = useAuth();
  const { t } = useT();
  const [onVercel, setOnVercel] = useState(false);

  useEffect(() => {
    setOnVercel(/\.vercel\.app$/.test(window.location.hostname));
  }, []);

  if (configured) return null;
  return (
    <div className="bg-amber_-bg/80 text-amber_-ink text-sm px-4 py-2 text-center border-b border-amber_/30">
      {onVercel ? t('config.previewVercel') : t('config.previewLocal')}
    </div>
  );
}
