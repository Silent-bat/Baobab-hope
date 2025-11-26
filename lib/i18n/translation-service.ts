// Simplified translation service for single-file translations

import { TranslationOptions } from './types'
import { DEFAULT_LANGUAGE } from './languages'

// In-memory translation cache
let translationsCache: Record<string, any> = {}
let isLoaded = false

class TranslationService {
  private static instance: TranslationService | null = null

  static getInstance(): TranslationService {
    if (!this.instance) {
      this.instance = new TranslationService()
    }
    return this.instance
  }

  /**
   * Load all translations from the single translations.json file
   */
  async loadTranslations(language?: string): Promise<void> {
    if (isLoaded) {
      return
    }

    try {
      const response = await fetch('/locales/translations.json')
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.statusText}`)
      }

      translationsCache = await response.json()
      isLoaded = true
    } catch (error) {
      console.error('Error loading translations:', error)
      throw error
    }
  }

  /**
   * Get translation for a specific key
   */
  getTranslation(key: string, language: string, options?: TranslationOptions): string {
    // Ensure we have the language translations
    if (!translationsCache[language]) {
      console.warn(`Language '${language}' not found in translations`)
      return options?.returnKeyIfNotFound !== false ? key : ''
    }

    // Split the key by dots to handle nested keys
    const keys = key.split('.')
    let value: any = translationsCache[language]

    // Navigate through the nested structure
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Key not found, try fallback language
        if (language !== DEFAULT_LANGUAGE) {
          return this.getTranslation(key, DEFAULT_LANGUAGE, options)
        }

        console.warn(`Translation key '${key}' not found for language '${language}'`)
        return options?.returnKeyIfNotFound !== false ? key : ''
      }
    }

    // Handle interpolation if needed
    if (typeof value === 'string' && options?.interpolation) {
      return this.interpolate(value, options.interpolation)
    }

    return typeof value === 'string' ? value : key
  }

  /**
   * Simple interpolation for variables in translation strings
   */
  private interpolate(str: string, params: Record<string, any>): string {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  /**
   * Check if translations are loaded
   */
  async isLanguageLoaded(language: string): Promise<boolean> {
    return isLoaded && language in translationsCache
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): string[] {
    return Object.keys(translationsCache)
  }

  /**
   * Preload translations (already loaded in single file)
   */
  async preloadLanguage(language: string): Promise<void> {
    if (!isLoaded) {
      await this.loadTranslations()
    }
  }

  /**
   * Get cached translations
   */
  getCachedTranslations(language: string): any | null {
    return translationsCache[language] || null
  }

  /**
   * Clear the cache (useful for development/testing)
   */
  clearCache(): void {
    translationsCache = {}
    isLoaded = false
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance()
export default translationService