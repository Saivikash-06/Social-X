import { LanguageInfo, SupportedLocale } from './types';

export const SUPPORTED_LOCALES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'en-IN',
    region: 'India / International',
    script: 'Latin',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'hi-IN',
    region: 'Northern / Central India',
    script: 'Devanagari',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'ta-IN',
    region: 'Tamil Nadu & Puducherry',
    script: 'Tamil',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'te-IN',
    region: 'Andhra Pradesh & Telangana',
    script: 'Telugu',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'kn-IN',
    region: 'Karnataka',
    script: 'Kannada',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'ml-IN',
    region: 'Kerala & Lakshadweep',
    script: 'Malayalam',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'mr-IN',
    region: 'Maharashtra & Goa',
    script: 'Devanagari',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'bn-IN',
    region: 'West Bengal & Tripura',
    script: 'Bengali',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'gu-IN',
    region: 'Gujarat & Daman and Diu',
    script: 'Gujarati',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'pa-IN',
    region: 'Punjab & Chandigarh',
    script: 'Gurmukhi',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'or-IN',
    region: 'Odisha',
    script: 'Odia',
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    flag: '🇮🇳',
    direction: 'ltr',
    localeTag: 'as-IN',
    region: 'Assam & North East',
    script: 'Bengali-Assamese',
  },
];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_MAP: Record<SupportedLocale, LanguageInfo> = SUPPORTED_LOCALES.reduce(
  (acc, item) => {
    acc[item.code] = item;
    return acc;
  },
  {} as Record<SupportedLocale, LanguageInfo>
);

export function isSupportedLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LOCALES.some((lang) => lang.code === code);
}
