'use client';

import { useI18n } from './i18n-provider';
import { useCallback } from 'react';

export function useTranslation(namespace?: string) {
  const i18n = useI18n();

  const t = useCallback(
    (key: string, paramsOrFallback?: Record<string, string | number> | string, defaultMsg?: string): string => {
      if (namespace && !key.includes('.')) {
        const namespacedKey = `${namespace}.${key}`;
        const translated = i18n.t(namespacedKey, paramsOrFallback, defaultMsg);
        if (translated !== namespacedKey) {
          return translated;
        }
      }
      return i18n.t(key, paramsOrFallback, defaultMsg);
    },
    [i18n, namespace]
  );

  return {
    ...i18n,
    t,
  };
}
