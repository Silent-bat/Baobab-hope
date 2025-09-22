// Comprehensive error handling and fallback system for internationalization

import { TranslationData, TranslationOptions, Language } from './types'
import { DEFAULT_LANGUAGE, getLanguageByCode, getLanguageFallback } from './languages'

export interface I18nError {
  code: string
  message: string
  language: string
  key?: string
  timestamp: number
  context?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface ErrorHandlerConfig {
  enableLogging: boolean
  enableRetry: boolean
  maxRetries: number
  retryDelay: number
  fallbackLanguage: string
  enableUserFeedback: boolean
  enableAnalytics: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryableErrors: string[]
}

export interface FallbackStrategy {
  type: 'language' | 'key' | 'empty' | 'placeholder'
  value?: string
  showIndicator?: boolean
}

export class I18nErrorHandler {
  private static instance: I18nErrorHandler
  private errors: Map<string, I18nError[]> = new Map()
  private config: ErrorHandlerConfig
  private retryConfig: RetryConfig
  private errorListeners: Array<(error: I18nError) => void> = []

  private constructor() {
    this.config = {
      enableLogging: process.env.NODE_ENV === 'development',
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
      fallbackLanguage: DEFAULT_LANGUAGE,
      enableUserFeedback: true,
      enableAnalytics: process.env.NODE_ENV === 'production',
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn'
    }

    this.retryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryableErrors: [
        'NETWORK_ERROR',
        'TIMEOUT_ERROR',
        'SERVER_ERROR',
        'LOADING_FAILED'
      ]
    }
  }

  static getInstance(): I18nErrorHandler {
    if (!I18nErrorHandler.instance) {
      I18nErrorHandler.instance = new I18nErrorHandler()
    }
    return I18nErrorHandler.instance
  }

  /**
   * Handle translation loading errors with retry mechanism
   */
  async handleTranslationLoadingError(
    language: string,
    error: Error,
    attempt: number = 1
  ): Promise<TranslationData | null> {
    const i18nError: I18nError = {
      code: 'TRANSLATION_LOADING_FAILED',
      message: `Failed to load translations for ${language}: ${error.message}`,
      language,
      timestamp: Date.now(),
      context: { attempt, originalError: error.message },
      severity: attempt >= this.config.maxRetries ? 'high' : 'medium'
    }

    this.logError(i18nError)

    // Try retry if enabled and within limits
    if (this.config.enableRetry && attempt < this.config.maxRetries) {
      const delay = this.calculateRetryDelay(attempt)
      
      this.log('info', `Retrying translation loading for ${language} in ${delay}ms (attempt ${attempt + 1})`)
      
      await this.delay(delay)
      
      try {
        // This would be called by the translation service
        return await this.retryTranslationLoading(language, attempt + 1)
      } catch (retryError) {
        return this.handleTranslationLoadingError(language, retryError as Error, attempt + 1)
      }
    }

    // If all retries failed, try fallback language
    if (language !== this.config.fallbackLanguage) {
      this.log('warn', `All retries failed for ${language}, falling back to ${this.config.fallbackLanguage}`)
      
      try {
        return await this.loadFallbackTranslations(language)
      } catch (fallbackError) {
        this.log('error', `Fallback loading also failed: ${fallbackError}`)
      }
    }

    // Final fallback: return cached translations or empty object
    return this.getFinalFallback(language)
  }

  /**
   * Handle missing translation keys with fallback strategies
   */
  handleMissingTranslation(
    key: string,
    language: string,
    options?: TranslationOptions
  ): string {
    const i18nError: I18nError = {
      code: 'MISSING_TRANSLATION',
      message: `Missing translation for key "${key}" in language "${language}"`,
      language,
      key,
      timestamp: Date.now(),
      context: { options },
      severity: 'low'
    }

    this.logError(i18nError)

    // Try fallback strategies in order
    const strategies: FallbackStrategy[] = [
      { type: 'language', value: this.config.fallbackLanguage },
      { type: 'key', value: options?.fallback },
      { type: 'placeholder', showIndicator: process.env.NODE_ENV === 'development' },
      { type: 'empty' }
    ]

    for (const strategy of strategies) {
      const result = this.applyFallbackStrategy(key, language, strategy, options)
      if (result !== null) {
        return result
      }
    }

    // Final fallback: return the key itself
    return this.formatMissingTranslation(key, language)
  }

  /**
   * Handle translation interpolation errors
   */
  handleInterpolationError(
    key: string,
    language: string,
    translation: string,
    params: Record<string, any>,
    error: Error
  ): string {
    const i18nError: I18nError = {
      code: 'INTERPOLATION_ERROR',
      message: `Interpolation failed for key "${key}" in language "${language}": ${error.message}`,
      language,
      key,
      timestamp: Date.now(),
      context: { translation, params, originalError: error.message },
      severity: 'medium'
    }

    this.logError(i18nError)

    // Try to return the translation without interpolation
    if (translation) {
      this.log('warn', `Returning uninterpolated translation for ${key}`)
      return translation
    }

    // Fallback to missing translation handling
    return this.handleMissingTranslation(key, language)
  }

  /**
   * Handle pluralization errors
   */
  handlePluralizationError(
    key: string,
    language: string,
    count: number,
    error: Error
  ): string {
    const i18nError: I18nError = {
      code: 'PLURALIZATION_ERROR',
      message: `Pluralization failed for key "${key}" in language "${language}" with count ${count}: ${error.message}`,
      language,
      key,
      timestamp: Date.now(),
      context: { count, originalError: error.message },
      severity: 'medium'
    }

    this.logError(i18nError)

    // Try simple fallback to 'other' form or singular
    const fallbackOptions: TranslationOptions = {
      fallback: count === 1 ? 'singular form' : 'plural form'
    }

    return this.handleMissingTranslation(key, language, fallbackOptions)
  }

  /**
   * Handle formatting errors (dates, numbers, currency)
   */
  handleFormattingError(
    value: any,
    format: string,
    language: string,
    error: Error
  ): string {
    const i18nError: I18nError = {
      code: 'FORMATTING_ERROR',
      message: `Formatting failed for value "${value}" with format "${format}" in language "${language}": ${error.message}`,
      language,
      timestamp: Date.now(),
      context: { value, format, originalError: error.message },
      severity: 'low'
    }

    this.logError(i18nError)

    // Return basic string representation
    try {
      return String(value)
    } catch {
      return '[formatting error]'
    }
  }

  /**
   * Apply fallback strategy for missing translations
   */
  private applyFallbackStrategy(
    key: string,
    language: string,
    strategy: FallbackStrategy,
    options?: TranslationOptions
  ): string | null {
    switch (strategy.type) {
      case 'language':
        if (strategy.value && strategy.value !== language) {
          // This would need to be called by the translation service
          const fallbackTranslation = this.getFallbackTranslation(key, strategy.value)
          if (fallbackTranslation) {
            return strategy.showIndicator 
              ? `${fallbackTranslation} [${strategy.value}]`
              : fallbackTranslation
          }
        }
        break

      case 'key':
        if (strategy.value) {
          return strategy.showIndicator 
            ? `${strategy.value} [fallback]`
            : strategy.value
        }
        break

      case 'placeholder':
        return strategy.showIndicator 
          ? `[${key}]`
          : key

      case 'empty':
        return ''
    }

    return null
  }

  /**
   * Format missing translation for display
   */
  private formatMissingTranslation(key: string, language: string): string {
    if (process.env.NODE_ENV === 'development') {
      return `[Missing: ${key} (${language})]`
    }
    
    // In production, return a more user-friendly format
    const parts = key.split('.')
    const lastPart = parts[parts.length - 1]
    
    // Convert camelCase or snake_case to readable text
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim()
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1)
    return Math.min(delay, this.retryConfig.maxDelay)
  }

  /**
   * Log error based on configuration
   */
  private logError(error: I18nError): void {
    if (!this.config.enableLogging) return

    // Store error for reporting
    const languageErrors = this.errors.get(error.language) || []
    languageErrors.push(error)
    this.errors.set(error.language, languageErrors)

    // Log to console based on severity and log level
    const shouldLog = this.shouldLogError(error.severity)
    if (shouldLog) {
      const logMethod = this.getLogMethod(error.severity)
      console[logMethod](`[I18n Error] ${error.message}`, {
        code: error.code,
        language: error.language,
        key: error.key,
        context: error.context
      })
    }

    // Notify listeners
    this.notifyErrorListeners(error)

    // Send to analytics if enabled
    if (this.config.enableAnalytics) {
      this.sendErrorToAnalytics(error)
    }
  }

  /**
   * Determine if error should be logged based on level
   */
  private shouldLogError(severity: I18nError['severity']): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 }
    
    const configLevel = levels[this.config.logLevel]
    const errorLevel = severityLevels[severity]
    
    return errorLevel >= configLevel
  }

  /**
   * Get appropriate console method for error severity
   */
  private getLogMethod(severity: I18nError['severity']): 'debug' | 'info' | 'warn' | 'error' {
    switch (severity) {
      case 'low': return 'debug'
      case 'medium': return 'warn'
      case 'high': return 'error'
      case 'critical': return 'error'
      default: return 'warn'
    }
  }

  /**
   * Notify error listeners
   */
  private notifyErrorListeners(error: I18nError): void {
    for (const listener of this.errorListeners) {
      try {
        listener(error)
      } catch (listenerError) {
        console.error('Error in I18n error listener:', listenerError)
      }
    }
  }

  /**
   * Send error to analytics service
   */
  private sendErrorToAnalytics(error: I18nError): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'i18n_error', {
        error_code: error.code,
        language: error.language,
        translation_key: error.key,
        severity: error.severity,
        custom_map: {
          error_message: error.message
        }
      })
    }
  }

  /**
   * Get errors for a specific language
   */
  getErrorsForLanguage(language: string): I18nError[] {
    return this.errors.get(language) || []
  }

  /**
   * Get all errors grouped by language
   */
  getAllErrors(): Map<string, I18nError[]> {
    return new Map(this.errors)
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number
    errorsByLanguage: Record<string, number>
    errorsBySeverity: Record<string, number>
    errorsByCode: Record<string, number>
    recentErrors: I18nError[]
  } {
    const allErrors = Array.from(this.errors.values()).flat()
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)

    const errorsByLanguage: Record<string, number> = {}
    const errorsBySeverity: Record<string, number> = {}
    const errorsByCode: Record<string, number> = {}

    for (const error of allErrors) {
      errorsByLanguage[error.language] = (errorsByLanguage[error.language] || 0) + 1
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1
      errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1
    }

    const recentErrors = allErrors
      .filter(error => error.timestamp > oneHourAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)

    return {
      totalErrors: allErrors.length,
      errorsByLanguage,
      errorsBySeverity,
      errorsByCode,
      recentErrors
    }
  }

  /**
   * Clear errors for a language or all errors
   */
  clearErrors(language?: string): void {
    if (language) {
      this.errors.delete(language)
    } else {
      this.errors.clear()
    }
  }

  /**
   * Add error listener
   */
  addErrorListener(listener: (error: I18nError) => void): () => void {
    this.errorListeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.errorListeners.indexOf(listener)
      if (index > -1) {
        this.errorListeners.splice(index, 1)
      }
    }
  }

  /**
   * Update error handler configuration
   */
  updateConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Update retry configuration
   */
  updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): ErrorHandlerConfig {
    return { ...this.config }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(errorCode: string): boolean {
    return this.retryConfig.retryableErrors.includes(errorCode)
  }

  /**
   * Create user-friendly error message in user's language
   */
  createUserFriendlyMessage(error: I18nError, userLanguage: string): string {
    // This would use the translation system to get localized error messages
    const errorMessages: Record<string, Record<string, string>> = {
      en: {
        TRANSLATION_LOADING_FAILED: 'We\'re having trouble loading the page content. Please try refreshing.',
        MISSING_TRANSLATION: 'Some content may not be available in your language.',
        INTERPOLATION_ERROR: 'There was an issue displaying some content.',
        PLURALIZATION_ERROR: 'There was an issue with content formatting.',
        FORMATTING_ERROR: 'Some numbers or dates may not display correctly.'
      },
      fr: {
        TRANSLATION_LOADING_FAILED: 'Nous avons des difficultés à charger le contenu de la page. Veuillez actualiser.',
        MISSING_TRANSLATION: 'Certains contenus peuvent ne pas être disponibles dans votre langue.',
        INTERPOLATION_ERROR: 'Il y a eu un problème d\'affichage de certains contenus.',
        PLURALIZATION_ERROR: 'Il y a eu un problème de formatage du contenu.',
        FORMATTING_ERROR: 'Certains nombres ou dates peuvent ne pas s\'afficher correctement.'
      },
      es: {
        TRANSLATION_LOADING_FAILED: 'Tenemos problemas para cargar el contenido de la página. Por favor, actualice.',
        MISSING_TRANSLATION: 'Algunos contenidos pueden no estar disponibles en su idioma.',
        INTERPOLATION_ERROR: 'Hubo un problema al mostrar algunos contenidos.',
        PLURALIZATION_ERROR: 'Hubo un problema con el formato del contenido.',
        FORMATTING_ERROR: 'Algunos números o fechas pueden no mostrarse correctamente.'
      }
    }

    const messages = errorMessages[userLanguage] || errorMessages.en
    return messages[error.code] || messages.TRANSLATION_LOADING_FAILED || 'An error occurred.'
  }

  // Private helper methods - these will be set by the translation service
  private translationServiceCallbacks: {
    retryTranslationLoading?: (language: string, attempt: number) => Promise<TranslationData>
    loadFallbackTranslations?: (language: string) => Promise<TranslationData>
    getFinalFallback?: (language: string) => TranslationData
    getFallbackTranslation?: (key: string, language: string) => string | null
  } = {}

  /**
   * Set callbacks for translation service integration
   */
  setTranslationServiceCallbacks(callbacks: {
    retryTranslationLoading?: (language: string, attempt: number) => Promise<TranslationData>
    loadFallbackTranslations?: (language: string) => Promise<TranslationData>
    getFinalFallback?: (language: string) => TranslationData
    getFallbackTranslation?: (key: string, language: string) => string | null
  }): void {
    this.translationServiceCallbacks = { ...this.translationServiceCallbacks, ...callbacks }
  }

  private async retryTranslationLoading(language: string, attempt: number): Promise<TranslationData> {
    if (this.translationServiceCallbacks.retryTranslationLoading) {
      return this.translationServiceCallbacks.retryTranslationLoading(language, attempt)
    }
    throw new Error('Translation service callback not set')
  }

  private async loadFallbackTranslations(language: string): Promise<TranslationData> {
    if (this.translationServiceCallbacks.loadFallbackTranslations) {
      return this.translationServiceCallbacks.loadFallbackTranslations(language)
    }
    throw new Error('Translation service callback not set')
  }

  private getFinalFallback(language: string): TranslationData {
    if (this.translationServiceCallbacks.getFinalFallback) {
      return this.translationServiceCallbacks.getFinalFallback(language)
    }
    return {}
  }

  private getFallbackTranslation(key: string, language: string): string | null {
    if (this.translationServiceCallbacks.getFallbackTranslation) {
      return this.translationServiceCallbacks.getFallbackTranslation(key, language)
    }
    return null
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (this.config.enableLogging) {
      console[level](`[I18n] ${message}`)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const i18nErrorHandler = I18nErrorHandler.getInstance()

// Type declarations for global analytics
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, any>) => void
  }
}