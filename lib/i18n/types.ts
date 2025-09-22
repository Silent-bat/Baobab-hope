// Core internationalization types and interfaces

export interface Language {
  code: string // ISO 639-1 code
  name: string // English name
  nativeName: string // Native name
  direction: 'ltr' | 'rtl'
  region: string // Geographic region
  flag: string // Flag emoji
  enabled: boolean
  priority: number // Loading priority (lower = higher priority)
  fallback: string // Fallback language code
  pluralRules: PluralRule[]
  dateFormats: DateFormatConfig
  numberFormats: NumberFormatConfig
  currencyFormats: CurrencyFormatConfig
}

export interface PluralRule {
  rule: 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
  condition: string // ICU plural rule condition
}

export interface DateFormatConfig {
  short: Intl.DateTimeFormatOptions
  medium: Intl.DateTimeFormatOptions
  long: Intl.DateTimeFormatOptions
  full: Intl.DateTimeFormatOptions
}

export interface NumberFormatConfig {
  decimal: Intl.NumberFormatOptions
  currency: Intl.NumberFormatOptions
  percent: Intl.NumberFormatOptions
}

export interface CurrencyFormatConfig {
  primary: string // Primary currency code for this locale
  supported: string[] // List of supported currencies
}

export interface TranslationOptions {
  fallback?: string
  count?: number
  context?: string
  interpolation?: Record<string, string | number>
}

export interface TranslationData {
  [key: string]: string | TranslationData | PluralTranslation
}

export interface PluralTranslation {
  zero?: string
  one: string
  two?: string
  few?: string
  many?: string
  other: string
}

export interface TranslationFile {
  language: string
  version: string
  lastUpdated: Date
  namespace: string
  translations: TranslationData
}

export interface LanguageContextType {
  language: string
  availableLanguages: Language[]
  setLanguage: (lang: string) => void
  t: (key: string, options?: TranslationOptions) => string
  isLoading: boolean
  direction: 'ltr' | 'rtl'
  locale: string
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (amount: number, currency: string) => string
}

export interface LanguageDetectionResult {
  language: string
  confidence: number
  source: 'browser' | 'geolocation' | 'user-preference' | 'fallback'
}

export interface TranslationCache {
  [language: string]: {
    data: TranslationData
    timestamp: number
    version: string
  }
}