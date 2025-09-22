// Internationalization configuration

export const I18N_CONFIG = {
  // Default language settings
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  
  // Translation file settings
  translationPath: '/locales',
  translationFileExtension: '.json',
  
  // Cache settings
  cacheEnabled: true,
  cacheTTL: 1000 * 60 * 60, // 1 hour
  maxCacheSize: 10, // Maximum number of languages to cache
  
  // Loading settings
  loadingTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Detection settings
  enableBrowserDetection: true,
  enableGeolocationDetection: true,
  geolocationTimeout: 5000, // 5 seconds
  
  // Development settings
  enableMissingTranslationWarnings: process.env.NODE_ENV === 'development',
  enableTranslationDebugging: process.env.NODE_ENV === 'development',
  
  // SEO settings
  enableHreflangTags: true,
  enableLocalizedUrls: true,
  urlStructure: 'subdirectory' as const, // 'subdirectory' | 'subdomain' | 'parameter'
  
  // Performance settings
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableServiceWorkerCaching: true,
  
  // Accessibility settings
  enableLanguageAnnouncements: true,
  enableRTLSupport: true,
  
  // Analytics settings
  enableLanguageTracking: true,
  enableMissingTranslationTracking: true,
  
  // Deployment settings
  enableFeatureFlags: true,
  enablePhasedRollout: true
}

// All possible languages (for development and testing)
export const allSupportedLanguages = [
  // UN Official Languages (Priority 1)
  'en', 'fr', 'es', 'ar', 'zh', 'ru',
  // Major World Languages (Priority 2)
  'pt', 'de', 'ja', 'hi', 'it', 'nl', 'ko', 'tr', 'pl', 'bn', 'ur', 'fa', 'he', 'sv', 'no', 'da',
  // Additional Languages (Priority 3)
  'vi', 'th', 'id', 'ms', 'sw', 'am', 'yo', 'ha', 'el', 'cs', 'hu', 'ro', 'bg', 'hr', 'sr', 'sk', 'sl', 'fi', 'is', 'ga', 'cy', 'ca', 'eu', 'gl', 'et', 'lv', 'lt', 'mt', 'sq'
] as const

export type SupportedLanguage = typeof allSupportedLanguages[number]

// Get currently enabled languages based on feature flags
export const getSupportedLanguages = (userId?: string): SupportedLanguage[] => {
  if (!I18N_CONFIG.enableFeatureFlags) {
    return [...allSupportedLanguages] as SupportedLanguage[]
  }

  if (typeof window === 'undefined') {
    // Server-side: return all languages for SSR
    return [...allSupportedLanguages] as SupportedLanguage[]
  }

  // Lazy load feature flag manager to avoid circular dependencies
  try {
    const { default: featureFlagManager } = require('./feature-flags')
    return featureFlagManager.getAvailableLanguages(userId) as SupportedLanguage[]
  } catch {
    return [...allSupportedLanguages] as SupportedLanguage[]
  }
}

// Check if a specific language is enabled
export const isLanguageEnabled = (languageCode: string, userId?: string): boolean => {
  if (!I18N_CONFIG.enableFeatureFlags) {
    return allSupportedLanguages.includes(languageCode as SupportedLanguage)
  }

  // Lazy load feature flag manager to avoid circular dependencies
  try {
    const { default: featureFlagManager } = require('./feature-flags')
    return featureFlagManager.isLanguageEnabled(languageCode, userId)
  } catch {
    return allSupportedLanguages.includes(languageCode as SupportedLanguage)
  }
}

export type I18nConfig = typeof I18N_CONFIG