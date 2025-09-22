// Translation service with advanced caching and loading mechanisms

import { TranslationData, TranslationOptions, PluralTranslation } from './types'
import { getLanguageByCode, getLanguageFallback, DEFAULT_LANGUAGE } from './languages'
import { TranslationCacheManager } from './cache-manager'
import { i18nErrorHandler, I18nErrorHandler } from './error-handler'
import { translationManagementAnalytics } from './translation-management-analytics'
import productionMonitor from './production-monitor'

// Type declaration for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, any>) => void
  }
}

export class TranslationService {
  private static instance: TranslationService
  private cacheManager: TranslationCacheManager
  private loadingPromises: Map<string, Promise<TranslationData>> = new Map()
  private missingTranslations: Set<string> = new Set()
  private cache: Map<string, TranslationData> = new Map() // Synchronous cache for immediate access
  
  private constructor() {
    // Initialize cache manager with optimized configuration
    this.cacheManager = new TranslationCacheManager({
      maxMemoryEntries: 15,
      maxMemorySize: 8 * 1024 * 1024, // 8MB
      ttl: 2 * 60 * 60 * 1000, // 2 hours
      localStoragePrefix: 'baobab_i18n_',
      enableLocalStorage: true,
      enableServiceWorker: true,
      compressionEnabled: true
    })

    // Set up error handler callbacks
    i18nErrorHandler.setTranslationServiceCallbacks({
      retryTranslationLoading: this.retryTranslationLoading.bind(this),
      loadFallbackTranslations: this.loadFallbackTranslations.bind(this),
      getFinalFallback: this.getFinalFallback.bind(this),
      getFallbackTranslation: this.getFallbackTranslation.bind(this)
    })
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService()
    }
    return TranslationService.instance
  }

  /**
   * Load translations for a specific language with advanced caching and error handling
   */
  async loadTranslations(language: string): Promise<TranslationData> {
    const startTime = performance.now()
    
    // Check if already loading
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language)!
    }

    // Check multi-layer cache first
    const cached = await this.cacheManager.get(language)
    if (cached) {
      // Also store in synchronous cache for immediate access
      this.cache.set(language, cached)
      
      // Record cache hit performance
      productionMonitor.recordPerformance({
        language,
        metric: 'load_time',
        value: performance.now() - startTime,
        context: { source: 'cache' }
      })
      return cached
    }

    // Start loading
    const loadingPromise = this.fetchTranslations(language)
    this.loadingPromises.set(language, loadingPromise)

    try {
      const translations = await loadingPromise
      await this.cacheManager.set(language, translations, '1.0')
      
      // Also store in synchronous cache for immediate access
      this.cache.set(language, translations)
      
      // Record successful load performance
      productionMonitor.recordPerformance({
        language,
        metric: 'load_time',
        value: performance.now() - startTime,
        context: { source: 'network' }
      })
      
      return translations
    } catch (error) {
      // Record error in production monitoring
      productionMonitor.recordError({
        language,
        key: 'translation_loading',
        error: error instanceof Error ? error.message : 'Unknown loading error',
        context: { source: 'loadTranslations' }
      })
      
      // Use error handler for comprehensive error handling and fallback
      const fallbackTranslations = await i18nErrorHandler.handleTranslationLoadingError(
        language, 
        error as Error
      )
      
      if (fallbackTranslations) {
        return fallbackTranslations
      }
      
      // Return empty translations as final fallback
      return {}
    } finally {
      this.loadingPromises.delete(language)
    }
  }

  /**
   * Get translation for a specific key with synchronous cache support
   */
  getTranslation(key: string, language: string, options?: TranslationOptions): string {
    // Track translation usage for analytics
    const namespace = key.split('.')[0] || 'common'
    const context = options?.context || 'default'
    translationManagementAnalytics.trackTranslationUsage(key, namespace, language, context)
    
    // Try to get from synchronous cache first
    const cached = this.cache.get(language)
    if (cached) {
      const translation = this.resolveTranslationKey(cached, key, language, options)
      if (translation !== null) {
        return translation
      }
    }
    
    // Try fallback language if current language not available
    if (language !== DEFAULT_LANGUAGE) {
      const fallbackCached = this.cache.get(DEFAULT_LANGUAGE)
      if (fallbackCached) {
        const translation = this.resolveTranslationKey(fallbackCached, key, DEFAULT_LANGUAGE, options)
        if (translation !== null) {
          return translation
        }
      }
    }
    
    // If not in cache, try to load synchronously (blocking)
    if (!this.cache.has(language)) {
      try {
        // Force synchronous loading for critical translations
        this.loadTranslationsSynchronously(language)
        
        // Try again after loading
        const newCached = this.cache.get(language)
        if (newCached) {
          const translation = this.resolveTranslationKey(newCached, key, language, options)
          if (translation !== null) {
            return translation
          }
        }
      } catch (error) {
        console.warn('Failed to load translations synchronously:', error)
      }
    }
    
    // Return a more user-friendly fallback
    const fallback = options?.fallback || this.generateFallbackText(key)
    return fallback
  }

  /**
   * Load translations synchronously (blocking) - use sparingly
   */
  private loadTranslationsSynchronously(language: string): void {
    // This is a more efficient approach using fetch with async/await in a sync context
    if (typeof window !== 'undefined') {
      try {
        // Use the existing async loader but wait for it
        this.loadTranslationsSync(language)
      } catch (error) {
        console.warn('Synchronous loading failed:', error)
      }
    }
  }

  /**
   * Optimized synchronous translation loading
   */
  private loadTranslationsSync(language: string): void {
    const chunks = ['navigation', 'common', 'pages', 'actions']
    const allData = {}
    
    // Load critical chunks first (navigation and common)
    const criticalChunks = ['navigation', 'common']
    
    for (const chunk of criticalChunks) {
      try {
        const xhr = new XMLHttpRequest()
        const url = `${window.location.origin}/locales/${language}/${chunk}.json`
        xhr.open('GET', url, false) // synchronous
        xhr.send()
        
        if (xhr.status === 200) {
          const chunkData = JSON.parse(xhr.responseText)
          Object.assign(allData, chunkData)
        }
      } catch (error) {
        // If critical chunk fails, try fallback language
        if (language !== DEFAULT_LANGUAGE) {
          try {
            const fallbackXhr = new XMLHttpRequest()
            const fallbackUrl = `${window.location.origin}/locales/${DEFAULT_LANGUAGE}/${chunk}.json`
            fallbackXhr.open('GET', fallbackUrl, false)
            fallbackXhr.send()
            
            if (fallbackXhr.status === 200) {
              const fallbackData = JSON.parse(fallbackXhr.responseText)
              Object.assign(allData, fallbackData)
            }
          } catch (fallbackError) {
            console.warn(`Failed to load fallback ${chunk}:`, fallbackError)
          }
        }
      }
    }
    
    // Store in cache immediately with critical data
    this.cache.set(language, allData)
    
    // Load remaining chunks asynchronously in background
    this.loadRemainingChunksAsync(language, chunks.filter(c => !criticalChunks.includes(c)))
  }

  /**
   * Load remaining chunks asynchronously in background
   */
  private async loadRemainingChunksAsync(language: string, remainingChunks: string[]): Promise<void> {
    const currentData = this.cache.get(language) || {}
    
    for (const chunk of remainingChunks) {
      try {
        const response = await fetch(`${window.location.origin}/locales/${language}/${chunk}.json`)
        if (response.ok) {
          const chunkData = await response.json()
          Object.assign(currentData, chunkData)
          // Update cache with new data
          this.cache.set(language, currentData)
        }
      } catch (error) {
        console.warn(`Failed to load background chunk ${chunk}:`, error)
      }
    }
  }

  /**
   * Generate a more user-friendly fallback text from translation key
   */
  private generateFallbackText(key: string): string {
    // Define common fallbacks for navigation items
    const commonFallbacks: Record<string, string> = {
      'nav.home': 'Home',
      'nav.about.title': 'About',
      'nav.information.title': 'Information', 
      'nav.act.title': 'Take Action',
      'nav.contact': 'Contact',
      'nav.donate': 'Donate',
      'nav.actions': 'Our Actions',
      'slogan.main': 'One Heart, One Hand'
    }
    
    // Return predefined fallback if available
    if (commonFallbacks[key]) {
      return commonFallbacks[key]
    }
    
    // Convert key like "nav.about.title" to "About"
    const parts = key.split('.')
    const lastPart = parts[parts.length - 1]
    
    // Handle special cases
    if (lastPart === 'title' && parts.length > 1) {
      const parentKey = parts[parts.length - 2]
      return this.capitalizeFirst(parentKey)
    }
    
    return this.capitalizeFirst(lastPart)
  }

  /**
   * Capitalize first letter of a string
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * Get translation asynchronously with full cache support
   */
  async getTranslationAsync(key: string, language: string, options?: TranslationOptions): Promise<string> {
    const cached = await this.cacheManager.get(language)
    if (!cached) {
      // If translations not loaded, trigger loading
      const translations = await this.loadTranslations(language)
      const translation = this.resolveTranslationKey(translations, key, language, options)
      
      if (translation === null) {
        return this.handleMissingTranslation(key, language, options)
      }
      
      return translation
    }

    const translation = this.resolveTranslationKey(cached, key, language, options)
    
    if (translation === null) {
      return this.handleMissingTranslation(key, language, options)
    }

    return translation
  }

  /**
   * Handle missing translation with comprehensive error handling and fallback logic
   */
  private async handleMissingTranslation(key: string, language: string, options?: TranslationOptions): Promise<string> {
    // Report missing translation to analytics
    const namespace = key.split('.')[0] || 'common'
    const context = options?.context || 'default'
    const page = typeof window !== 'undefined' ? window.location.pathname : '/'
    
    translationManagementAnalytics.reportMissingTranslation(key, namespace, language, context, page)
    
    // Use error handler for comprehensive missing translation handling
    return i18nErrorHandler.handleMissingTranslation(key, language, options)
  }

  /**
   * Preload translations for multiple languages with priority and caching
   */
  async preloadLanguages(languages: string[], priority: 'high' | 'low' = 'low'): Promise<void> {
    await this.cacheManager.preload(languages, (lang) => this.fetchTranslations(lang))
  }

  /**
   * Load translations with retry mechanism
   */
  async loadTranslationsWithRetry(language: string, maxRetries = 3): Promise<TranslationData> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.loadTranslations(language)
      } catch (error) {
        lastError = error as Error
        console.warn(`Translation loading attempt ${attempt} failed for ${language}:`, error)
        
        // Record retry attempt in production monitoring
        productionMonitor.recordError({
          language,
          key: 'translation_loading_retry',
          error: error instanceof Error ? error.message : 'Unknown retry error',
          context: { attempt, maxRetries: 3 }
        })
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError || new Error(`Failed to load translations for ${language} after ${maxRetries} attempts`)
  }

  /**
   * Check if translations are loaded for a language
   */
  async isLanguageLoaded(language: string): Promise<boolean> {
    return await this.cacheManager.has(language)
  }

  /**
   * Get loading status for all languages
   */
  getLoadingStatus(): Record<string, 'loaded' | 'loading' | 'not-loaded'> {
    const status: Record<string, 'loaded' | 'loading' | 'not-loaded'> = {}
    
    // Check cached languages
    for (const lang in this.cache) {
      status[lang] = 'loaded'
    }
    
    // Check loading languages
    for (const lang of this.loadingPromises.keys()) {
      status[lang] = 'loading'
    }
    
    return status
  }

  /**
   * Invalidate cache for a language or all languages
   */
  async invalidateCache(language?: string): Promise<void> {
    if (language) {
      await this.cacheManager.delete(language)
      this.cache.delete(language)
      this.loadingPromises.delete(language)
    } else {
      await this.cacheManager.clear()
      this.cache.clear()
      this.loadingPromises.clear()
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheManager.getStats()
  }

  /**
   * Update cache configuration
   */
  updateCacheConfig(config: any) {
    this.cacheManager.updateConfig(config)
  }

  /**
   * Report missing translation for tracking with quality assurance integration
   */
  reportMissingTranslation(key: string, language: string): void {
    const missingKey = `${language}:${key}`
    if (!this.missingTranslations.has(missingKey)) {
      this.missingTranslations.add(missingKey)
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key} for language: ${language}`)
      }
      
      // Report to quality assurance system
      this.reportToQualityAssurance(key, language)
      
      // In production, send to analytics or translation management system
      this.sendMissingTranslationReport(key, language)
    }
  }

  /**
   * Report missing translation to quality assurance system
   */
  private async reportToQualityAssurance(key: string, language: string): Promise<void> {
    try {
      const { translationQA } = await import('./quality-assurance')
      
      // This would trigger a quality check for the specific key
      // For now, we'll just track it in the error handler
      i18nErrorHandler.handleMissingTranslation(key, language)
    } catch (error) {
      console.warn('Failed to report to quality assurance:', error)
    }
  }

  /**
   * Get all missing translations for reporting
   */
  getMissingTranslations(): Array<{ key: string; language: string; timestamp: number }> {
    return Array.from(this.missingTranslations).map(missingKey => {
      const [language, ...keyParts] = missingKey.split(':')
      return {
        key: keyParts.join(':'),
        language,
        timestamp: Date.now()
      }
    })
  }

  /**
   * Get missing translations grouped by language
   */
  getMissingTranslationsByLanguage(): Record<string, string[]> {
    const grouped: Record<string, string[]> = {}
    
    for (const missingKey of this.missingTranslations) {
      const [language, ...keyParts] = missingKey.split(':')
      const key = keyParts.join(':')
      
      if (!grouped[language]) {
        grouped[language] = []
      }
      grouped[language].push(key)
    }
    
    return grouped
  }

  /**
   * Get translation coverage statistics
   */
  getTranslationCoverage(language: string): { total: number; missing: number; coverage: number } {
    const cached = this.getCachedTranslations(language)
    if (!cached) {
      return { total: 0, missing: 0, coverage: 0 }
    }

    const totalKeys = this.countTranslationKeys(cached)
    const missingKeys = Array.from(this.missingTranslations)
      .filter(key => key.startsWith(`${language}:`))
      .length

    const coverage = totalKeys > 0 ? ((totalKeys - missingKeys) / totalKeys) * 100 : 0

    return {
      total: totalKeys,
      missing: missingKeys,
      coverage: Math.round(coverage * 100) / 100
    }
  }

  /**
   * Clear missing translations tracking
   */
  clearMissingTranslations(): void {
    this.missingTranslations.clear()
  }

  /**
   * Send missing translation report to external service
   */
  private sendMissingTranslationReport(key: string, language: string): void {
    // In production, implement reporting to your translation management system
    // This could be sent to services like:
    // - Google Analytics
    // - Custom analytics endpoint
    // - Translation management platforms (Crowdin, Lokalise, etc.)
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'missing_translation', {
        translation_key: key,
        language: language,
        page_url: window.location.href
      })
    }
  }

  /**
   * Count total translation keys recursively
   */
  private countTranslationKeys(obj: any, count = 0): number {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        count++
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        count = this.countTranslationKeys(obj[key], count)
      }
    }
    return count
  }

  /**
   * Fetch translations from the server using the translation loader
   */
  private async fetchTranslations(language: string): Promise<TranslationData> {
    const { TranslationLoader } = await import('./translation-loader')
    return TranslationLoader.loadTranslationFile(language)
  }

  /**
   * Retry translation loading (callback for error handler)
   */
  private async retryTranslationLoading(language: string, attempt: number): Promise<TranslationData> {
    return this.fetchTranslations(language)
  }

  /**
   * Load fallback translations (callback for error handler)
   */
  private async loadFallbackTranslations(language: string): Promise<TranslationData> {
    const fallbackLang = getLanguageFallback(language)
    if (fallbackLang !== language) {
      return this.loadTranslations(fallbackLang)
    }
    return this.loadTranslations(DEFAULT_LANGUAGE)
  }

  /**
   * Get final fallback translations (callback for error handler)
   */
  private getFinalFallback(language: string): TranslationData {
    // Try to get from cache first
    const cached = this.getCachedTranslations(language)
    if (cached) {
      return cached
    }

    // Try fallback language cache
    const fallbackLang = getLanguageFallback(language)
    if (fallbackLang !== language) {
      const fallbackCached = this.getCachedTranslations(fallbackLang)
      if (fallbackCached) {
        return fallbackCached
      }
    }

    // Try default language cache
    if (DEFAULT_LANGUAGE !== language && DEFAULT_LANGUAGE !== fallbackLang) {
      const defaultCached = this.getCachedTranslations(DEFAULT_LANGUAGE)
      if (defaultCached) {
        return defaultCached
      }
    }

    return {}
  }

  /**
   * Get fallback translation for a specific key (callback for error handler)
   */
  private getFallbackTranslation(key: string, language: string): string | null {
    const cached = this.getCachedTranslations(language)
    if (cached) {
      return this.resolveTranslationKey(cached, key, language) || null
    }
    return null
  }

  /**
   * Get cached translations synchronously
   */
  private getCachedTranslations(language: string): TranslationData | null {
    return this.cache.get(language) || null
  }



  /**
   * Resolve translation key with support for nested keys and pluralization
   */
  private resolveTranslationKey(
    translations: TranslationData, 
    key: string, 
    language: string,
    options?: TranslationOptions
  ): string | null {
    const keys = key.split('.')
    let value: any = translations

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return null
      }
    }

    if (typeof value === 'string') {
      return this.interpolateWithFormatting(value, options?.interpolation, language, key)
    }

    // Handle pluralization
    if (typeof value === 'object' && options?.count !== undefined) {
      const pluralTranslation = value as PluralTranslation
      const pluralForm = this.getPluralForm(options.count, language, key)
      
      const translation = pluralTranslation[pluralForm] || pluralTranslation.other
      if (typeof translation === 'string') {
        return this.interpolateWithFormatting(translation, options?.interpolation, language, key)
      }
    }

    return null
  }

  /**
   * Interpolate variables in translation string with advanced parameter support and error handling
   */
  private interpolateTranslation(
    translation: string, 
    params?: Record<string, string | number>,
    key?: string,
    language?: string
  ): string {
    if (!params) {
      return translation
    }

    try {
      // Support multiple interpolation patterns:
      // ${key} - basic interpolation
      // {{key}} - alternative syntax
      // {key} - simple syntax
      return translation
        .replace(/\$\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
        .replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
        .replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
    } catch (error) {
      // Use error handler for interpolation errors
      if (key && language) {
        return i18nErrorHandler.handleInterpolationError(
          key, 
          language, 
          translation, 
          params, 
          error as Error
        )
      }
      
      // Fallback: return original translation
      return translation
    }
  }

  /**
   * Advanced interpolation with formatting support and error handling
   */
  private interpolateWithFormatting(
    translation: string,
    params?: Record<string, string | number>,
    language?: string,
    key?: string
  ): string {
    if (!params) {
      return translation
    }

    try {
      // Support formatted interpolation: {key:format}
      return translation.replace(/\{(\w+)(?::(\w+))?\}/g, (match, paramKey, format) => {
        const value = params[paramKey]
        if (value === undefined) {
          return match
        }

        if (format && language) {
          return this.formatValue(value, format, language)
        }

        return value.toString()
      })
    } catch (error) {
      // Use error handler for interpolation errors
      if (key && language) {
        return i18nErrorHandler.handleInterpolationError(
          key, 
          language, 
          translation, 
          params, 
          error as Error
        )
      }
      
      // Fallback: return original translation
      return translation
    }
  }

  /**
   * Format values based on type and locale with error handling
   */
  private formatValue(value: string | number, format: string, language: string): string {
    try {
      switch (format) {
        case 'number':
          if (typeof value === 'number') {
            return new Intl.NumberFormat(language).format(value)
          }
          break
        case 'currency':
          if (typeof value === 'number') {
            const languageConfig = getLanguageByCode(language)
            const currency = languageConfig?.currencyFormats.primary || 'USD'
            return new Intl.NumberFormat(language, { 
              style: 'currency', 
              currency 
            }).format(value)
          }
          break
        case 'percent':
          if (typeof value === 'number') {
            return new Intl.NumberFormat(language, { 
              style: 'percent' 
            }).format(value)
          }
          break
        case 'date':
          if (value instanceof Date || typeof value === 'string') {
            const date = value instanceof Date ? value : new Date(value)
            return new Intl.DateTimeFormat(language).format(date)
          }
          break
      }
    } catch (error) {
      // Use error handler for formatting errors
      return i18nErrorHandler.handleFormattingError(value, format, language, error as Error)
    }

    return value.toString()
  }

  /**
   * Get plural form for a number using proper pluralization rules with error handling
   */
  private getPluralForm(count: number, language: string, key?: string): keyof PluralTranslation {
    try {
      // Use Intl.PluralRules for proper pluralization
      const pluralRules = new Intl.PluralRules(language)
      const rule = pluralRules.select(count)
      
      // Map Intl.PluralRules result to our PluralTranslation keys
      switch (rule) {
        case 'zero': return 'zero'
        case 'one': return 'one'
        case 'two': return 'two'
        case 'few': return 'few'
        case 'many': return 'many'
        case 'other': return 'other'
        default: return 'other'
      }
    } catch (error) {
      // Use error handler for pluralization errors
      if (key) {
        i18nErrorHandler.handlePluralizationError(key, language, count, error as Error)
      }
      
      // Fallback to simple English rules
      if (count === 0) return 'zero'
      if (count === 1) return 'one'
      if (count === 2) return 'two'
      return 'other'
    }
  }

  /**
   * Get pluralization rules for a language from our language configuration
   */
  private getLanguagePluralRules(language: string): string[] {
    const languageConfig = getLanguageByCode(language)
    return languageConfig?.pluralRules.map(rule => rule.rule) || ['one', 'other']
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance()