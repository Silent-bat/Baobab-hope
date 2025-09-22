import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LanguageDetectionService } from '../detection'

describe('LanguageDetectionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Browser Language Detection', () => {
    it('should detect browser language from navigator.language', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      })

      const result = LanguageDetectionService.detectBrowserLanguage()
      
      expect(result.language).toBe('fr')
      expect(result.source).toBe('browser')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('should detect from navigator.languages array', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'xyz-XYZ', // Unsupported language
        configurable: true
      })
      Object.defineProperty(window.navigator, 'languages', {
        value: ['xyz-XYZ', 'es-ES', 'en-US'],
        configurable: true
      })

      const result = LanguageDetectionService.detectBrowserLanguage()
      
      expect(result.language).toBe('es')
      expect(result.source).toBe('browser')
    })

    it('should fallback to English when no supported language found', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'xyz-XYZ',
        configurable: true
      })
      Object.defineProperty(window.navigator, 'languages', {
        value: ['xyz-XYZ', 'abc-DEF'],
        configurable: true
      })

      const result = LanguageDetectionService.detectBrowserLanguage()
      
      expect(result.language).toBe('en')
      expect(result.source).toBe('fallback')
      expect(result.confidence).toBeLessThan(0.5)
    })

    it('should handle missing navigator properties', () => {
      Object.defineProperty(window, 'navigator', {
        value: {},
        configurable: true
      })

      const result = LanguageDetectionService.detectBrowserLanguage()
      
      expect(result.language).toBe('en')
      expect(result.source).toBe('fallback')
    })
  })

  describe('Location-based Language Detection', () => {
    it('should detect language from geolocation', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn().mockImplementation((success) => {
          success({
            coords: {
              latitude: 48.8566,
              longitude: 2.3522 // Paris coordinates
            }
          })
        })
      }

      Object.defineProperty(window.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true
      })

      // Mock the geocoding API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [{
            components: {
              country: 'France'
            }
          }]
        })
      })

      const result = await LanguageDetectionService.detectLocationLanguage()
      
      expect(result.language).toBe('fr')
      expect(result.source).toBe('geolocation')
    })

    it('should handle geolocation errors', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn().mockImplementation((success, error) => {
          error(new Error('Location access denied'))
        })
      }

      Object.defineProperty(window.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true
      })

      const result = await LanguageDetectionService.detectLocationLanguage()
      
      expect(result.language).toBe('en')
      expect(result.source).toBe('fallback')
    })

    it('should handle missing geolocation API', async () => {
      Object.defineProperty(window.navigator, 'geolocation', {
        value: undefined,
        configurable: true
      })

      const result = await LanguageDetectionService.detectLocationLanguage()
      
      expect(result.language).toBe('en')
      expect(result.source).toBe('fallback')
    })
  })

  describe('User Preference Management', () => {
    it('should get user preferred language from localStorage', () => {
      localStorage.setItem('preferred-language', 'es')

      const result = LanguageDetectionService.getUserPreferredLanguage()
      
      expect(result?.language).toBe('es')
      expect(result?.source).toBe('user-preference')
      expect(result?.confidence).toBe(1.0)
    })

    it('should return null when no preference stored', () => {
      const result = LanguageDetectionService.getUserPreferredLanguage()
      expect(result).toBeNull()
    })

    it('should set user preferred language', () => {
      LanguageDetectionService.setUserPreferredLanguage('fr')
      
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'fr')
    })

    it('should clear user preference', () => {
      LanguageDetectionService.clearUserPreference()
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('preferred-language')
    })

    it('should validate language code when setting preference', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      LanguageDetectionService.setUserPreferredLanguage('invalid-lang')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Attempted to set unsupported language preference:',
        'invalid-lang'
      )
      expect(localStorage.setItem).not.toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Language Support Validation', () => {
    it('should return supported language for valid code', () => {
      const result = LanguageDetectionService.getSupportedLanguage('fr')
      expect(result).toBe('fr')
    })

    it('should return base language for region-specific code', () => {
      const result = LanguageDetectionService.getSupportedLanguage('fr-CA')
      expect(result).toBe('fr')
    })

    it('should fallback to English for unsupported language', () => {
      const result = LanguageDetectionService.getSupportedLanguage('xyz')
      expect(result).toBe('en')
    })

    it('should handle empty or invalid input', () => {
      expect(LanguageDetectionService.getSupportedLanguage('')).toBe('en')
      expect(LanguageDetectionService.getSupportedLanguage(null as any)).toBe('en')
      expect(LanguageDetectionService.getSupportedLanguage(undefined as any)).toBe('en')
    })
  })

  describe('Comprehensive Language Detection', () => {
    it('should prioritize user preference over browser detection', async () => {
      localStorage.setItem('preferred-language', 'es')
      
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      })

      const result = await LanguageDetectionService.detectLanguage()
      
      expect(result.language).toBe('es')
      expect(result.source).toBe('user-preference')
    })

    it('should use browser detection when no user preference', async () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'de-DE',
        configurable: true
      })

      const result = await LanguageDetectionService.detectLanguage()
      
      expect(result.language).toBe('de')
      expect(result.source).toBe('browser')
    })

    it('should combine multiple detection methods', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn().mockImplementation((success) => {
          success({
            coords: { latitude: 40.7128, longitude: -74.0060 } // NYC
          })
        })
      }

      Object.defineProperty(window.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true
      })

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [{
            components: { country: 'United States' }
          }]
        })
      })

      const result = await LanguageDetectionService.detectLanguage({
        includeGeolocation: true
      })
      
      expect(result.language).toBe('en')
      expect(['browser', 'geolocation', 'fallback']).toContain(result.source)
    })
  })
})