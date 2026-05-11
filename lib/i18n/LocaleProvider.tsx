'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LOCALES, TRANSLATIONS, translate, type Locale } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'matzpen.locale';
const DEFAULT_LOCALE: Locale = 'he';

function readInitial(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'he' || saved === 'en') return saved;
  } catch {
    // localStorage may be blocked
  }
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // SSR renders Hebrew (matches the static <html lang="he">). The client
  // upgrades on mount if a different locale was saved — no flash for the
  // default case, only a one-frame swap for users who picked English.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const initial = readInitial();
    if (initial !== DEFAULT_LOCALE) setLocaleState(initial);
  }, []);

  useEffect(() => {
    const info = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
    if (typeof document !== 'undefined') {
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  const value = useMemo<LocaleContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useT(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback so a missing provider doesn't crash — still translates via the default.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, vars) => translate(DEFAULT_LOCALE, key, vars),
    };
  }
  return ctx;
}

export { TRANSLATIONS };
