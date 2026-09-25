import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enDict from '../locales/en.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
];

export const LANGUAGE_STORAGE_KEY = 'socialx-language';

// In-memory dictionary cache for dynamic imports
const dictionaryCache: Record<string, Record<string, any>> = {
  en: enDict,
};

/**
 * Dynamically import a language dictionary using import(`@/locales/${lang}.json`)
 * Only the active language is loaded into memory.
 */
export async function loadLanguageBundle(lang: string): Promise<Record<string, any>> {
  if (dictionaryCache[lang]) {
    return dictionaryCache[lang];
  }

  try {
    let dict: Record<string, any>;
    switch (lang) {
      case 'ta':
        dict = (await import('../locales/ta.json')).default;
        break;
      case 'hi':
        dict = (await import('../locales/hi.json')).default;
        break;
      case 'te':
        dict = (await import('../locales/te.json')).default;
        break;
      case 'kn':
        dict = (await import('../locales/kn.json')).default;
        break;
      case 'ml':
        dict = (await import('../locales/ml.json')).default;
        break;
      case 'mr':
        dict = (await import('../locales/mr.json')).default;
        break;
      case 'bn':
        dict = (await import('../locales/bn.json')).default;
        break;
      case 'or':
        dict = (await import('../locales/or.json')).default;
        break;
      case 'en':
      default:
        dict = enDict;
        break;
    }

    dictionaryCache[lang] = dict;
    // Register bundle under both 'common' and 'translation' namespaces for seamless lookup
    i18n.addResourceBundle(lang, 'common', dict, true, true);
    i18n.addResourceBundle(lang, 'translation', dict, true, true);
    return dict;
  } catch (err) {
    console.warn(`[i18n] Failed to dynamically load language "${lang}". Falling back to English.`, err);
    return enDict;
  }
}

// Initial language detection from localStorage or cookie
let initialLang = 'en';
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
    initialLang = stored;
  }
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          common: enDict,
          translation: enDict,
        },
      },
      lng: initialLang,
      fallbackLng: 'en',
      defaultNS: 'common',
      fallbackNS: 'common',
      interpolation: {
        escapeValue: false, // React already protects against XSS
      },
      react: {
        useSuspense: false, // Prevents SSR/prerender suspending issues
      },
    });

  // If initial language is non-English, dynamically load and apply it immediately
  if (initialLang !== 'en') {
    loadLanguageBundle(initialLang).then(() => {
      i18n.changeLanguage(initialLang);
    });
  }
}

/**
 * Function to switch language dynamically, persist to localStorage and Cookies,
 * and immediately trigger in-memory re-render without page reload or form clearing.
 */
export const changeAppLanguage = async (lang: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem('social_x_locale', lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `social_x_locale=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  // Load language dictionary dynamically on demand
  await loadLanguageBundle(lang);
  return i18n.changeLanguage(lang);
};

export default i18n;
