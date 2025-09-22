import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TranslationService } from '../translation-service'
import { CacheManager } from '../cache-manager'

// Mock the cache manager
vi.mock('../cache-manager')

describe('TranslationService', () => {
  let translationService: TranslationService
  let mockCacheManager: any

  beforeEach(() => {
    // Reset singleton instance
    ;(TranslationService as any).instance = null
    
    // Create mock cache manager
    mockCacheManager = {
      get: vi.fn(),
      set: vi.fn(),
      has: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
      getStats: vi.fn().mockReturnValue({ hits: 0, misses: 0, size: 0 })
    }
    
    vi.mocked(CacheManager.getInstance).mockReturnValue(mockCacheManager)
    
    translationService = TranslationService.getInstance()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = TranslationService.getInstance()
      const instance2 = TranslationService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('Translation Loading', () => {
    it('should load translations for a language', async () => {
      const mockTranslations = {
        common: {
          hello: 'Hello',
          goodbye: 'Goodbye'
        }
      }

      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTranslations)
      })

      const result = await translationService.loadTranslations('en')
      
      expect(fetch).toHaveBeenCalledWith('/locales/en/common.json')
      expect(result).toEqual(mockTranslations)
      expect(mockCacheManager.set).toHaveBeenCalledWith('translations:en', mockTranslations)
    })

    it('should handle loading errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await translationService.loadTranslations('en')
      
      expect(result).toEqual({})
    })

    it('should return cached translations if available', async () => {
      const cachedTranslations = { common: { hello: 'Cached Hello' } }
      mockCacheManager.has.mockReturnValue(true)
      mockCacheManager.get.mockReturnValue(cachedTranslations)

      const result = await translationService.loadTranslations('en')
      
      expect(result).toEqual(cachedTranslations)
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('Translation Retrieval', () => {
    beforeEach(() => {
      // Mock loaded translations
      ;(translationService as any).translations = {
        en: {
          common: {
            hello: 'Hello',
            welcome: 'Welcome {{name}}',
            items: {
              zero: 'No items',
              one: '1 item',
              other: '{{count}} items'
            }
          }
        },
        fr: {
          common: {
            hello: 'Bonjour'
          }
        }
      }
    })

    it('should get simple translation', () => {
      const result = translationService.getTranslation('common.hello', 'en')
      expect(result).toBe('Hello')
    })

    it('should handle parameter interpolation', () => {
      const result = translationService.getTranslation('common.welcome', 'en', { name: 'John' })
      expect(result).toBe('Welcome John')
    })

    it('should handle pluralization', () => {
      const zeroResult = translationService.getTranslation('common.items', 'en', { count: 0 })
      expect(zeroResult).toBe('No items')

      const oneResult = translationService.getTranslation('common.items', 'en', { count: 1 })
      expect(oneResult).toBe('1 item')

      const manyResult = translationService.getTranslation('common.items', 'en', { count: 5 })
      expect(manyResult).toBe('5 items')
    })

    it('should fallback to English for missing translations', () => {
      const result = translationService.getTranslation('common.welcome', 'fr', { name: 'Jean' })
      expect(result).toBe('Welcome Jean') // Falls back to English
    })

    it('should return key for completely missing translations', () => {
      const result = translationService.getTranslation('missing.key', 'en')
      expect(result).toBe('missing.key')
    })

    it('should handle nested translation keys', () => {
      ;(translationService as any).translations.en.common.nested = {
        deep: {
          value: 'Deep value'
        }
      }

      const result = translationService.getTranslation('common.nested.deep.value', 'en')
      expect(result).toBe('Deep value')
    })
  })

  describe('Preloading', () => {
    it('should preload multiple languages', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ common: { hello: 'Hello' } })
      })

      await translationService.preloadLanguages(['en', 'fr', 'es'])
      
      expect(fetch).toHaveBeenCalledTimes(3)
      expect(fetch).toHaveBeenCalledWith('/locales/en/common.json')
      expect(fetch).toHaveBeenCalledWith('/locales/fr/common.json')
      expect(fetch).toHaveBeenCalledWith('/locales/es/common.json')
    })
  })

  describe('Cache Management', () => {
    it('should invalidate cache for specific language', () => {
      translationService.invalidateCache('en')
      expect(mockCacheManager.delete).toHaveBeenCalledWith('translations:en')
    })

    it('should invalidate all cache when no language specified', () => {
      translationService.invalidateCache()
      expect(mockCacheManager.clear).toHaveBeenCalled()
    })
  })

  describe('Missing Translation Reporting', () => {
    it('should report missing translations', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      translationService.reportMissingTranslation('missing.key', 'en')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Missing translation:',
        { key: 'missing.key', language: 'en' }
      )
      
      consoleSpy.mockRestore()
    })
  })
})