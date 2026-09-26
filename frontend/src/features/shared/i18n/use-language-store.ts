import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SupportedLocale, LanguageInfo } from './types';
import { DEFAULT_LOCALE, LOCALE_MAP, isSupportedLocale } from './language-config';

interface LanguageState {
  locale: SupportedLocale;
  isAutoDetected: boolean;
  setLocale: (locale: SupportedLocale) => void;
  getLanguageInfo: () => LanguageInfo;
}

const STORAGE_KEY = 'social_x_locale';

// Sync cookie for Next.js SSR / middleware compatibility
function setLocaleCookie(locale: SupportedLocale) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALE_MAP[locale]?.direction || 'ltr';
}

function detectBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }
  
  // Check cookie first
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY + '=([^;]+)'));
    if (match && isSupportedLocale(match[2])) {
      return match[2] as SupportedLocale;
    }
  }

  // Check navigator languages
  const navLanguages = navigator.languages || [navigator.language];
  for (const lang of navLanguages) {
    if (!lang) continue;
    const code = lang.toLowerCase().split(/[-_]/)[0];
    if (isSupportedLocale(code)) {
      return code as SupportedLocale;
    }
  }

  return DEFAULT_LOCALE;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      isAutoDetected: false,
      setLocale: (locale: SupportedLocale) => {
        setLocaleCookie(locale);
        set({ locale, isAutoDetected: false });
      },
      getLanguageInfo: () => {
        const { locale } = get();
        return LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage))),
      onRehydrateStorage: () => (state) => {
        if (typeof window === 'undefined') return;
        if (!state || !state.locale) {
          const detected = detectBrowserLocale();
          state?.setLocale(detected);
        } else {
          setLocaleCookie(state.locale);
        }
      },
    }
  )
);
