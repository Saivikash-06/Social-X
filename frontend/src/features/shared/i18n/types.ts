export type SupportedLocale =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "mr"
  | "bn"
  | "or"
  | "gu"
  | "pa"
  | "as";

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
  localeTag: string; // e.g. "en-IN", "hi-IN", "ta-IN"
  direction: "ltr" | "rtl";
  region?: string;
}

export type TranslationDictionary = Record<string, any>;

export interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  changeLanguage: (locale: SupportedLocale) => void;
  t: (key: string, paramsOrFallback?: Record<string, string | number> | string, defaultMsg?: string) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number, options?: Intl.NumberFormatOptions) => string;
  currentLanguage: LanguageInfo;
  languages: LanguageInfo[];
  supportedLanguages: LanguageInfo[];
  isLoading: boolean;
}

export interface AITranslationMetadata {
  originalText: string;
  originalLanguage: string;
  detectedLanguage?: string;
  translatedLanguage?: string;
  translatedEnglish?: string;
  translatedText?: string;
  translatedAt: string;
  confidenceScore: number;
  modelUsed?: string;
}
