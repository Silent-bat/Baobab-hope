// Main internationalization module exports

// Types
export type {
  Language,
  LanguageContextType,
  TranslationOptions,
  TranslationData,
  PluralTranslation,
  LanguageDetectionResult,
  TranslationCache
} from './types'

// Language configuration
export {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  getEnabledLanguages,
  getAllLanguages,
  getSupportedLanguages,
  isLanguageSupported,
  getLanguageDirection,
  getLanguageName,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE
} from './languages'

// Language detection
export { LanguageDetectionService } from './detection'

// Translation service
export { translationService } from './translation-service'

// Cultural formatting
export { CulturalFormattingService } from './cultural-formatting'

// Utility functions
export function createTranslationKey(namespace: string, key: string): string {
  return `${namespace}.${key}`
}

export function parseTranslationKey(fullKey: string): { namespace: string; key: string } {
  const parts = fullKey.split('.')
  const namespace = parts[0]
  const key = parts.slice(1).join('.')
  return { namespace, key }
}

export function isRTLLanguage(languageCode: string): boolean {
  // Arabic is RTL, others are LTR
  return languageCode === 'ar'
}

export function normalizeLanguageCode(code: string): string {
  return code.toLowerCase().split('-')[0]
}