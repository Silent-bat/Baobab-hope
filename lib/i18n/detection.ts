// Language detection service with browser and geolocation detection

import { LanguageDetectionResult } from './types'
import { isLanguageSupported, DEFAULT_LANGUAGE } from './languages'

export class LanguageDetectionService {
  private static readonly STORAGE_KEY = 'baobab-hope-language'
  private static readonly GEOLOCATION_TIMEOUT = 5000

  // Language to country mapping for geolocation-based detection
  private static readonly COUNTRY_LANGUAGE_MAP: Record<string, string> = {
    // Major countries and their primary languages
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
    'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es',
    'CL': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
    'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es',
    'UY': 'es', 'GQ': 'es',
    'DE': 'de', 'AT': 'de',
    'IT': 'it', 'SM': 'it', 'VA': 'it',
    'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt', 'CV': 'pt', 'GW': 'pt',
    'ST': 'pt', 'TL': 'pt',
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'KG': 'ru',
    'CN': 'zh', 'TW': 'zh', 'SG': 'zh',
    'JP': 'ja',
    'KR': 'ko',
    'IN': 'hi', 'NP': 'hi',
    'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar', 'DZ': 'ar', 'TN': 'ar',
    'LY': 'ar', 'SD': 'ar', 'SY': 'ar', 'IQ': 'ar', 'JO': 'ar', 'LB': 'ar',
    'KW': 'ar', 'QA': 'ar', 'BH': 'ar', 'OM': 'ar', 'YE': 'ar',
    'TR': 'tr',
    'NL': 'nl',
    'PL': 'pl',
    'UA': 'uk',
    'VN': 'vi',
    'TH': 'th',
    'ID': 'id',
    'MY': 'ms',
    'PH': 'en', // English is widely used
    'NG': 'en', // English is official language
    'KE': 'en', // English is official language
    'ZA': 'en', // English is one of official languages
    'GH': 'en', // English is official language
    'UG': 'en', // English is official language
    'TZ': 'sw', // Swahili
    'ET': 'am', // Amharic
    'BD': 'bn', // Bengali
    'PK': 'ur', // Urdu
    'IR': 'fa', // Persian
    'IL': 'he', // Hebrew
    'GR': 'el', // Greek
    'CZ': 'cs', // Czech
    'HU': 'hu', // Hungarian
    'RO': 'ro', // Romanian
    'BG': 'bg', // Bulgarian
    'HR': 'hr', // Croatian
    'RS': 'sr', // Serbian
    'SK': 'sk', // Slovak
    'SI': 'sl', // Slovenian
    'EE': 'et', // Estonian
    'LV': 'lv', // Latvian
    'LT': 'lt', // Lithuanian
    'FI': 'fi', // Finnish
    'SE': 'sv', // Swedish
    'NO': 'no', // Norwegian
    'DK': 'da', // Danish
    'IS': 'is', // Icelandic
  }

  /**
   * Detect user's preferred language from browser settings with advanced preference parsing
   */
  static detectBrowserLanguage(): LanguageDetectionResult {
    try {
      // Get browser languages in order of preference
      const browserLanguages = navigator.languages || [navigator.language]

      // Parse language preferences with quality values
      const parsedLanguages = this.parseBrowserLanguages(browserLanguages)

      for (const { language: browserLang, quality } of parsedLanguages) {
        // Extract language code (e.g., 'en-US' -> 'en')
        const langCode = browserLang.split('-')[0].toLowerCase()

        if (isLanguageSupported(langCode)) {
          return {
            language: langCode,
            confidence: Math.min(0.9, quality),
            source: 'browser'
          }
        }
      }

      // If no supported language found, return fallback
      return {
        language: DEFAULT_LANGUAGE,
        confidence: 0.3,
        source: 'fallback'
      }
    } catch (error) {
      console.warn('Browser language detection failed:', error)
      return {
        language: DEFAULT_LANGUAGE,
        confidence: 0.1,
        source: 'fallback'
      }
    }
  }

  /**
   * Parse browser languages with quality values
   */
  private static parseBrowserLanguages(languages: readonly string[]): Array<{ language: string; quality: number }> {
    return languages.map((lang, index) => {
      // Browser languages are ordered by preference, so assign decreasing quality
      const quality = Math.max(0.1, 1.0 - (index * 0.1))
      return { language: lang, quality }
    }).sort((a, b) => b.quality - a.quality)
  }

  /**
   * Detect language based on user's geolocation
   */
  static async detectLocationLanguage(): Promise<LanguageDetectionResult> {
    return new Promise((resolve) => {
      // Set timeout for geolocation request
      const timeout = setTimeout(() => {
        resolve({
          language: DEFAULT_LANGUAGE,
          confidence: 0.1,
          source: 'fallback'
        })
      }, this.GEOLOCATION_TIMEOUT)

      if (!navigator.geolocation) {
        clearTimeout(timeout)
        resolve({
          language: DEFAULT_LANGUAGE,
          confidence: 0.1,
          source: 'fallback'
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeout)
          try {
            const { latitude, longitude } = position.coords
            const countryCode = await this.getCountryFromCoordinates(latitude, longitude)

            if (countryCode && this.COUNTRY_LANGUAGE_MAP[countryCode]) {
              const detectedLang = this.COUNTRY_LANGUAGE_MAP[countryCode]

              if (isLanguageSupported(detectedLang)) {
                resolve({
                  language: detectedLang,
                  confidence: 0.7,
                  source: 'geolocation'
                })
                return
              }
            }

            resolve({
              language: DEFAULT_LANGUAGE,
              confidence: 0.2,
              source: 'fallback'
            })
          } catch (error) {
            console.warn('Geolocation language detection failed:', error)
            resolve({
              language: DEFAULT_LANGUAGE,
              confidence: 0.1,
              source: 'fallback'
            })
          }
        },
        (error) => {
          clearTimeout(timeout)
          console.warn('Geolocation access denied:', error)
          resolve({
            language: DEFAULT_LANGUAGE,
            confidence: 0.1,
            source: 'fallback'
          })
        },
        {
          timeout: this.GEOLOCATION_TIMEOUT,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  /**
   * Get user's preferred language from localStorage
   */
  static getUserPreferredLanguage(): LanguageDetectionResult | null {
    // Only access localStorage on client side
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored && isLanguageSupported(stored)) {
        return {
          language: stored,
          confidence: 1.0,
          source: 'user-preference'
        }
      }
    } catch (error) {
      console.warn('Failed to read user language preference:', error)
    }
    return null
  }

  /**
   * Save user's language preference to localStorage
   */
  static setUserPreferredLanguage(language: string): void {
    // Only access localStorage on client side
    if (typeof window === 'undefined') {
      return
    }

    try {
      if (isLanguageSupported(language)) {
        localStorage.setItem(this.STORAGE_KEY, language)
      }
    } catch (error) {
      console.warn('Failed to save user language preference:', error)
    }
  }

  /**
   * Get the best supported language for a requested language
   */
  static getSupportedLanguage(requestedLanguage: string): string {
    const langCode = requestedLanguage.split('-')[0].toLowerCase()

    if (isLanguageSupported(langCode)) {
      return langCode
    }

    // Only support en/fr, so fallback to default
    return DEFAULT_LANGUAGE
  }

  /**
   * Comprehensive language detection combining all methods with fallback chain logic
   */
  static async detectLanguage(): Promise<LanguageDetectionResult> {
    const detectionResults: LanguageDetectionResult[] = []

    // 1. Check user preference first (highest priority)
    const userPreference = this.getUserPreferredLanguage()
    if (userPreference) {
      return userPreference
    }

    // 2. Check browser language
    const browserDetection = this.detectBrowserLanguage()
    detectionResults.push(browserDetection)

    // 3. Try geolocation detection
    try {
      const locationDetection = await this.detectLocationLanguage()
      detectionResults.push(locationDetection)
    } catch (error) {
      console.warn('Geolocation detection failed:', error)
    }

    // 4. Find the best detection result
    const bestResult = this.getBestDetectionResult(detectionResults)

    // 5. If not supported, fallback to default
    if (!isLanguageSupported(bestResult.language)) {
      return {
        language: DEFAULT_LANGUAGE,
        confidence: 0.3,
        source: 'fallback'
      }
    }

    return bestResult
  }

  /**
   * Get the best detection result from multiple sources
   */
  private static getBestDetectionResult(results: LanguageDetectionResult[]): LanguageDetectionResult {
    if (results.length === 0) {
      return {
        language: DEFAULT_LANGUAGE,
        confidence: 0.1,
        source: 'fallback'
      }
    }

    // Sort by confidence and source priority
    const sourceWeights = {
      'user-preference': 1.0,
      'browser': 0.9,
      'geolocation': 0.7,
      'fallback': 0.1
    }

    return results
      .map(result => ({
        ...result,
        weightedConfidence: result.confidence * sourceWeights[result.source]
      }))
      .sort((a, b) => b.weightedConfidence - a.weightedConfidence)[0]
  }

  /**
   * Get country code from coordinates using a reverse geocoding service
   * This is a simplified implementation - in production, you'd use a proper service
   */
  private static async getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
    try {
      // This is a placeholder implementation
      // In production, you would use a service like:
      // - Google Maps Geocoding API
      // - OpenStreetMap Nominatim
      // - MaxMind GeoIP
      // - IP-based geolocation as fallback

      // For now, return null to use fallback detection
      return null
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
      return null
    }
  }

  /**
   * Clear stored language preference
   */
  static clearUserPreference(): void {
    // Only access localStorage on client side
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear user language preference:', error)
    }
  }

  /**
   * Detect multiple language preferences in order
   */
  static detectMultipleLanguages(): LanguageDetectionResult[] {
    const results: LanguageDetectionResult[] = []

    // Add user preference if available
    const userPreference = this.getUserPreferredLanguage()
    if (userPreference) {
      results.push(userPreference)
    }

    // Add browser languages
    const browserDetection = this.detectBrowserLanguage()
    if (!results.some(r => r.language === browserDetection.language)) {
      results.push(browserDetection)
    }

    // With only en/fr support, add default as fallback if not already present
    if (!results.some(r => r.language === DEFAULT_LANGUAGE)) {
      results.push({
        language: DEFAULT_LANGUAGE,
        confidence: 0.3,
        source: 'fallback'
      })
    }

    return results.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Check if language switching is recommended based on user behavior
   */
  static shouldSuggestLanguageSwitch(currentLanguage: string): { suggest: boolean; recommendedLanguage?: string; reason?: string } {
    try {
      const browserDetection = this.detectBrowserLanguage()

      // Suggest switch if browser language has high confidence and differs from current
      if (browserDetection.confidence > 0.8 &&
        browserDetection.language !== currentLanguage &&
        isLanguageSupported(browserDetection.language)) {
        return {
          suggest: true,
          recommendedLanguage: browserDetection.language,
          reason: 'browser-preference'
        }
      }

      return { suggest: false }
    } catch (error) {
      console.warn('Language switch suggestion failed:', error)
      return { suggest: false }
    }
  }

  /**
   * Get language detection statistics for analytics
   */
  static getDetectionStats(): {
    browserLanguages: string[]
    supportedBrowserLanguages: string[]
    detectedLanguage: string
    confidence: number
    source: string
  } {
    const browserLanguages = navigator.languages || [navigator.language]
    const supportedBrowserLanguages = browserLanguages
      .map(lang => lang.split('-')[0].toLowerCase())
      .filter(lang => isLanguageSupported(lang))

    const detection = this.detectBrowserLanguage()

    return {
      browserLanguages: Array.from(browserLanguages),
      supportedBrowserLanguages,
      detectedLanguage: detection.language,
      confidence: detection.confidence,
      source: detection.source
    }
  }
}