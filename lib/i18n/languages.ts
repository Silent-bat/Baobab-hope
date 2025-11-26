// Language configuration registry - simplified for English and French only

import { Language } from './types'

export const SUPPORTED_LANGUAGES: Language[] = [
  // English
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    region: 'Global',
    flag: '🇺🇸',
    enabled: true,
    priority: 1,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'USD',
      supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    }
  },
  // French
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    region: 'Europe/Africa',
    flag: '🇫🇷',
    enabled: true,
    priority: 2,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'XOF', 'XAF', 'CHF']
    }
  },
  // German
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇩🇪',
    enabled: true,
    priority: 3,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'CHF']
    }
  },
  // Spanish
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    region: 'Americas/Europe',
    flag: '🇪🇸',
    enabled: true,
    priority: 4,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'MXN', 'ARS', 'COP']
    }
  },
  // Italian
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇮🇹',
    enabled: true,
    priority: 5,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'CHF']
    }
  },
  // Arabic
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    region: 'Middle East/North Africa',
    flag: '🇸🇦',
    enabled: true,
    priority: 6,
    fallback: 'en',
    pluralRules: [
      { rule: 'zero', condition: 'n = 0' },
      { rule: 'one', condition: 'n = 1' },
      { rule: 'two', condition: 'n = 2' },
      { rule: 'few', condition: 'n % 100 = 3..10' },
      { rule: 'many', condition: 'n % 100 = 11..99' },
      { rule: 'other', condition: 'n != 0,1,2 and n % 100 != 3..10 and n % 100 != 11..99' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'SAR',
      supported: ['SAR', 'AED', 'EGP', 'USD', 'EUR']
    }
  }
]

export const DEFAULT_LANGUAGE = 'en'
export const FALLBACK_LANGUAGE = 'en'

// Helper functions
export function getAllLanguages(): Language[] {
  return SUPPORTED_LANGUAGES
}

export function getEnabledLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.enabled)
}

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

export function getSupportedLanguages(): Language[] {
  return SUPPORTED_LANGUAGES
}

export function isLanguageSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
}

export function getLanguageDirection(code: string): 'ltr' | 'rtl' {
  const language = getLanguageByCode(code)
  return language?.direction || 'ltr'
}

export function getLanguageName(code: string, native: boolean = false): string {
  const language = getLanguageByCode(code)
  if (!language) return code
  return native ? language.nativeName : language.name
}

// Export for compatibility
export { SUPPORTED_LANGUAGES as languages }