import { AITranslationMetadata, SupportedLocale } from './types';
import { LOCALE_MAP } from './language-config';

/**
 * Mock/Utility function to simulate or invoke AI translation between Indian vernacular languages
 * and English for civic grievances and officer responses.
 */
export async function translateCivicContent({
  text,
  sourceLocale,
  targetLocale,
}: {
  text: string;
  sourceLocale: SupportedLocale;
  targetLocale: SupportedLocale;
}): Promise<{ translatedText: string; metadata: AITranslationMetadata }> {
  if (!text || sourceLocale === targetLocale) {
    return {
      translatedText: text,
      metadata: {
        originalText: text,
        originalLanguage: sourceLocale,
        detectedLanguage: sourceLocale,
        translatedLanguage: targetLocale,
        translatedEnglish: text,
        translatedText: text,
        confidenceScore: 1.0,
        modelUsed: 'social-x-indic-trans-v2',
        translatedAt: new Date().toISOString(),
      },
    };
  }

  // Realistic Indic civic translation simulation with high accuracy indicator
  const translated = `[Translated into ${LOCALE_MAP[targetLocale]?.name || targetLocale}]: ${text}`;
  return {
    translatedText: translated,
    metadata: {
      originalText: text,
      originalLanguage: sourceLocale,
      detectedLanguage: sourceLocale,
      translatedLanguage: targetLocale,
      translatedEnglish: targetLocale === 'en' ? translated : text,
      translatedText: translated,
      confidenceScore: 0.985,
      modelUsed: 'social-x-indic-trans-v2',
      translatedAt: new Date().toISOString(),
    },
  };
}
