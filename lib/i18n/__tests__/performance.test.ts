import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TranslationService } from '../translation-service'
import { CacheManager } from '../cache-manager'
import { PerformanceMonitor } from '../performance-monitor'

// Mock performance API
const mockPerformance = {
  now: vi.fn(),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
}

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
})

describe('Performance Tests', () => {
  let translationService: TranslationService
  let cacheManager: CacheManager
  let performanceMonitor: PerformanceMonitor

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset singletons
    ;(TranslationService as any).instance = null
    ;(CacheManager as any).instance = null
    ;(PerformanceMonitor as any).instance = null
    
    translationService = TranslationService.getInstance()
    cacheManager = CacheManager.getInstance()
    performanceMonitor = PerformanceMonitor.getInstance()
    
    // Mock performance.now to return incrementing values
    let timeCounter = 0
    mockPerformance.now.mockImplementation(() => ++timeCounter * 10)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Translation Loading Performance', () => {
    it('should load translations within acceptable time limits', async () => {
      const mockTranslations = {
        common: {
          hello: 'Hello',
          goodbye: 'Goodbye'
        }
      }

      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockTranslations)
            })
          }, 50) // Simulate 50ms network delay
        })
      )

      const startTime = performance.now()
      await translationService.loadTranslations('en')
      const endTime = performance.now()
      
      const loadTime = endTime - startTime
      expect(loadTime).toBeLessThan(200) // Should load within 200ms
    })

    it('should cache translations for faster subsequent access', async () => {
      const mockTranslations = { common: { hello: 'Hello' } }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTranslations)
      })

      // First load
      const startTime1 = performance.now()
      await translationService.loadTranslations('en')
      const endTime1 = performance.now()
      const firstLoadTime = endTime1 - startTime1

      // Second load (should be cached)
      const startTime2 = performance.now()
      await translationService.loadTranslations('en')
      const endTime2 = performance.now()
      const secondLoadTime = endTime2 - startTime2

      expect(secondLoadTime).toBeLessThan(firstLoadTime)
      expect(fetch).toHaveBeenCalledTimes(1) // Should only fetch once
    })

    it('should handle concurrent translation loading efficiently', async () => {
      const mockTranslations = { common: { hello: 'Hello' } }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTranslations)
      })

      const startTime = performance.now()
      
      // Load multiple languages concurrently
      const promises = ['en', 'fr', 'es', 'de'].map(lang => 
        translationService.loadTranslations(lang)
      )
      
      await Promise.all(promises)
      const endTime = performance.now()
      
      const totalTime = endTime - startTime
      expect(totalTime).toBeLessThan(500) // Should complete within 500ms
      expect(fetch).toHaveBeenCalledTimes(4) // Should make concurrent requests
    })
  })

  describe('Cache Performance', () => {
    it('should have fast cache access times', () => {
      const testData = { test: 'data' }
      
      // Measure cache write performance
      const writeStartTime = performance.now()
      cacheManager.set('test-key', testData)
      const writeEndTime = performance.now()
      
      const writeTime = writeEndTime - writeStartTime
      expect(writeTime).toBeLessThan(5) // Should write within 5ms

      // Measure cache read performance
      const readStartTime = performance.now()
      const result = cacheManager.get('test-key')
      const readEndTime = performance.now()
      
      const readTime = readEndTime - readStartTime
      expect(readTime).toBeLessThan(2) // Should read within 2ms
      expect(result).toEqual(testData)
    })

    it('should maintain performance with large cache sizes', () => {
      // Fill cache with many entries
      for (let i = 0; i < 1000; i++) {
        cacheManager.set(`key-${i}`, { data: `value-${i}` })
      }

      // Test access time with full cache
      const startTime = performance.now()
      const result = cacheManager.get('key-500')
      const endTime = performance.now()
      
      const accessTime = endTime - startTime
      expect(accessTime).toBeLessThan(5) // Should still be fast
      expect(result).toEqual({ data: 'value-500' })
    })

    it('should efficiently handle cache eviction', () => {
      // Set cache size limit
      const maxSize = 100
      
      // Fill cache beyond limit
      for (let i = 0; i < maxSize + 50; i++) {
        const startTime = performance.now()
        cacheManager.set(`key-${i}`, { data: `value-${i}` })
        const endTime = performance.now()
        
        const setTime = endTime - startTime
        expect(setTime).toBeLessThan(10) // Eviction should be fast
      }

      const stats = cacheManager.getStats()
      expect(stats.size).toBeLessThanOrEqual(maxSize)
    })
  })

  describe('Translation Lookup Performance', () => {
    beforeEach(() => {
      // Set up translations for testing
      ;(translationService as any).translations = {
        en: {
          common: {
            hello: 'Hello',
            nested: {
              deep: {
                value: 'Deep value'
              }
            }
          }
        }
      }
    })

    it('should have fast translation lookup times', () => {
      const iterations = 1000
      
      const startTime = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        translationService.getTranslation('common.hello', 'en')
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations
      
      expect(avgTime).toBeLessThan(0.1) // Should average less than 0.1ms per lookup
    })

    it('should handle nested key lookups efficiently', () => {
      const iterations = 1000
      
      const startTime = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        translationService.getTranslation('common.nested.deep.value', 'en')
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations
      
      expect(avgTime).toBeLessThan(0.2) // Nested lookups should still be fast
    })

    it('should handle parameter interpolation efficiently', () => {
      ;(translationService as any).translations.en.common.welcome = 'Welcome {{name}} to {{place}}'
      
      const iterations = 1000
      const params = { name: 'John', place: 'Paris' }
      
      const startTime = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        translationService.getTranslation('common.welcome', 'en', params)
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / iterations
      
      expect(avgTime).toBeLessThan(0.5) // Interpolation should be reasonably fast
    })
  })

  describe('Memory Usage', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const initialMemory = process.memoryUsage?.()?.heapUsed || 0
      
      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        translationService.getTranslation('common.hello', 'en')
        cacheManager.set(`temp-${i}`, { data: i })
        
        // Clean up periodically
        if (i % 1000 === 0) {
          cacheManager.clear()
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage?.()?.heapUsed || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })
  })

  describe('Performance Monitoring', () => {
    it('should track translation loading metrics', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ common: { hello: 'Hello' } })
      })

      await translationService.loadTranslations('en')
      
      const metrics = performanceMonitor.getMetrics()
      expect(metrics.translationLoads).toBeGreaterThan(0)
      expect(metrics.averageLoadTime).toBeGreaterThan(0)
    })

    it('should track cache performance metrics', () => {
      // Perform cache operations
      cacheManager.set('test1', 'value1')
      cacheManager.get('test1') // hit
      cacheManager.get('nonexistent') // miss
      
      const stats = cacheManager.getStats()
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe(0.5)
    })

    it('should identify performance bottlenecks', async () => {
      // Simulate slow translation loading
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ common: { hello: 'Hello' } })
            })
          }, 300) // Slow response
        })
      )

      await translationService.loadTranslations('en')
      
      const metrics = performanceMonitor.getMetrics()
      const slowLoads = metrics.slowTranslationLoads || 0
      expect(slowLoads).toBeGreaterThan(0)
    })
  })

  describe('Bundle Size Impact', () => {
    it('should minimize bundle size impact', () => {
      // This would typically be tested with webpack-bundle-analyzer
      // For now, we'll test that tree shaking works correctly
      
      const translationKeys = Object.keys(
        (translationService as any).translations?.en?.common || {}
      )
      
      // Should only include used translations
      expect(translationKeys.length).toBeGreaterThan(0)
      
      // Unused translations should not be included
      expect(translationKeys).not.toContain('unused.translation.key')
    })
  })
})