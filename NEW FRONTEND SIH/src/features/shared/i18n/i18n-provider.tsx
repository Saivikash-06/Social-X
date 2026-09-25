'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { SupportedLocale, LanguageInfo, I18nContextValue } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_MAP } from './language-config';
import { useLanguageStore } from './use-language-store';
import enMessages from '@/locales/en.json';

const I18nContext = createContext<I18nContextValue | null>(null);

// In-memory cache for loaded dictionaries
const dictionaryCache: Record<string, Record<string, any>> = {
  en: enMessages,
};

async function loadDictionary(locale: SupportedLocale): Promise<Record<string, any>> {
  if (dictionaryCache[locale]) {
    return dictionaryCache[locale];
  }

  try {
    let dict;
    switch (locale) {
      case 'hi':
        dict = (await import('@/locales/hi.json')).default;
        break;
      case 'ta':
        dict = (await import('@/locales/ta.json')).default;
        break;
      case 'te':
        dict = (await import('@/locales/te.json')).default;
        break;
      case 'kn':
        dict = (await import('@/locales/kn.json')).default;
        break;
      case 'ml':
        dict = (await import('@/locales/ml.json')).default;
        break;
      case 'mr':
        dict = (await import('@/locales/mr.json')).default;
        break;
      case 'bn':
        dict = (await import('@/locales/bn.json')).default;
        break;
      case 'or':
        dict = (await import('@/locales/or.json')).default;
        break;
      case 'en':
      default:
        dict = enMessages;
        break;
    }
    dictionaryCache[locale] = dict;
    return dict;
  } catch (err) {
    console.warn(`[i18n] Failed to load messages for locale "${locale}". Falling back to English.`, err);
    return enMessages;
  }
}

// Helper to resolve dot-notated key e.g. "dashboard.welcomeBack" or flat fallback
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  if (!obj || typeof obj !== 'object' || !path) return undefined;

  // 1. Direct key match (e.g. flat key or already formatted)
  if (path in obj && typeof obj[path] === 'string') {
    return obj[path];
  }

  // 2. Traversal through dot-notated path
  const parts = path.split('.');
  let current: any = obj;
  let found = true;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      found = false;
      break;
    }
  }
  if (found && typeof current === 'string') {
    return current;
  }

  // 3. Fallback: if single key, look into common sub-namespaces
  if (parts.length === 1) {
    const single = parts[0];
    const subNamespaces = [
      'nav',
      'common.labels',
      'common.buttons',
      'common.status',
      'common.priority',
      'common.departments',
      'common.categories',
      'common.validation',
      'common.loading',
      'ai',
      'toast'
    ];
    for (const ns of subNamespaces) {
      const nestedCandidate = getNestedValue(obj, `${ns}.${single}`);
      if (nestedCandidate) return nestedCandidate;
    }
  }

  return undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLanguageStore();
  const [messages, setMessages] = useState<Record<string, any>>(
    dictionaryCache[locale] || enMessages
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync dictionary when locale changes
  useEffect(() => {
    let isCancelled = false;
    async function updateDictionary() {
      if (dictionaryCache[locale]) {
        setMessages(dictionaryCache[locale]);
        return;
      }
      setIsLoading(true);
      const dict = await loadDictionary(locale);
      if (!isCancelled) {
        setMessages(dict);
        setIsLoading(false);
      }
    }
    updateDictionary();
    return () => {
      isCancelled = true;
    };
  }, [locale]);

  // Keep HTML lang & dir synchronized
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const langInfo = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
      document.documentElement.lang = locale;
      document.documentElement.dir = langInfo.direction;
    }
  }, [locale]);

  const currentLanguage: LanguageInfo = useMemo(() => {
    return LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
  }, [locale]);

  const changeLanguage = useCallback(
    (newLocale: SupportedLocale) => {
      setLocale(newLocale);
    },
    [setLocale]
  );

  // Translation function with English fallback and variable interpolation
  const t = useCallback(
    (key: string, paramsOrFallback?: Record<string, string | number> | string, defaultMsg?: string): string => {
      let params: Record<string, string | number> | undefined;
      let fallbackText = typeof paramsOrFallback === 'string' ? paramsOrFallback : defaultMsg;

      if (paramsOrFallback && typeof paramsOrFallback === 'object') {
        params = paramsOrFallback;
      }

      // 1. Try active language
      let translated = getNestedValue(messages, key);

      // 2. Fallback to English dictionary if not found in active language
      if (!translated && locale !== 'en') {
        translated = getNestedValue(enMessages, key);
      }

      // 3. Fallback to passed fallback text or key itself
      if (!translated) {
        translated = fallbackText || key;
      }

      // 4. Parameter substitution e.g. "Hello {name}"
      if (params && typeof translated === 'string') {
        return Object.entries(params).reduce((str, [paramKey, val]) => {
          return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        }, translated);
      }

      return translated;
    },
    [messages, locale]
  );

  // Formatters utilizing Intl with current locale tag
  const formatDate = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      try {
        const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
        return new Intl.DateTimeFormat(currentLanguage.localeTag, options || {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(d);
      } catch {
        return String(date);
      }
    },
    [currentLanguage.localeTag]
  );

  const formatTime = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      try {
        const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
        return new Intl.DateTimeFormat(currentLanguage.localeTag, options || {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(d);
      } catch {
        return String(date);
      }
    },
    [currentLanguage.localeTag]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(currentLanguage.localeTag, options).format(value);
      } catch {
        return String(value);
      }
    },
    [currentLanguage.localeTag]
  );

  const formatPercent = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(currentLanguage.localeTag, {
          style: 'percent',
          maximumFractionDigits: 1,
          ...options,
        }).format(value);
      } catch {
        return `${(value * 100).toFixed(1)}%`;
      }
    },
    [currentLanguage.localeTag]
  );

  const formatCurrency = useCallback(
    (value: number, currency = 'INR', options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(currentLanguage.localeTag, {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
          ...options,
        }).format(value);
      } catch {
        return `₹${value.toLocaleString()}`;
      }
    },
    [currentLanguage.localeTag]
  );

  const value: I18nContextValue = useMemo(
    () => ({
      locale,
      setLocale: changeLanguage,
      changeLanguage,
      currentLanguage,
      languages: SUPPORTED_LOCALES,
      supportedLanguages: SUPPORTED_LOCALES,
      t,
      formatDate,
      formatTime,
      formatNumber,
      formatPercent,
      formatCurrency,
      isLoading,
    }),
    [
      locale,
      currentLanguage,
      changeLanguage,
      t,
      formatDate,
      formatTime,
      formatNumber,
      formatPercent,
      formatCurrency,
      isLoading,
    ]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback if invoked outside provider (e.g. tests or isolated components)
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      changeLanguage: () => {},
      currentLanguage: LOCALE_MAP[DEFAULT_LOCALE],
      languages: SUPPORTED_LOCALES,
      supportedLanguages: SUPPORTED_LOCALES,
      t: (key: string, p?: any, d?: string) => (typeof p === 'string' ? p : d || key),
      formatDate: (d) => String(d),
      formatTime: (d) => String(d),
      formatNumber: (n) => String(n),
      formatPercent: (p) => `${p}%`,
      formatCurrency: (c) => `₹${c}`,
      isLoading: false,
    };
  }
  return context;
}

