// Performance monitoring for translation loading and caching

interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

interface LoadingMetrics {
  language: string
  loadTime: number
  cacheHit: boolean
  chunkCount: number
  totalSize: number
  source: 'memory' | 'localStorage' | 'serviceWorker' | 'network'
}

interface CacheMetrics {
  hitRate: number
  missRate: number
  evictionCount: number
  averageLoadTime: number
  totalRequests: number
}

export class I18nPerformanceMonitor {
  private static instance: I18nPerformanceMonitor
  private metrics: Map<string, PerformanceMetric> = new Map()
  private loadingMetrics: LoadingMetrics[] = []
  private cacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0,
    totalLoadTime: 0
  }

  private constructor() {
    // Initialize performance observer if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializePerformanceObserver()
    }
  }

  static getInstance(): I18nPerformanceMonitor {
    if (!I18nPerformanceMonitor.instance) {
      I18nPerformanceMonitor.instance = new I18nPerformanceMonitor()
    }
    return I18nPerformanceMonitor.instance
  }

  /**
   * Start measuring a performance metric
   */
  startMeasurement(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    }
    
    this.metrics.set(name, metric)
    
    // Use Performance API mark if available
    if (typeof window !== 'undefined' && 'performance' in window && 'mark' in performance) {
      performance.mark(`i18n-${name}-start`)
    }
  }

  /**
   * End measuring a performance metric
   */
  endMeasurement(name: string, additionalMetadata?: Record<string, any>): number | null {
    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`No measurement started for: ${name}`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime
    metric.duration = duration
    
    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata }
    }

    // Use Performance API measure if available
    if (typeof window !== 'undefined' && 'performance' in window && 'measure' in performance) {
      try {
        performance.mark(`i18n-${name}-end`)
        performance.measure(`i18n-${name}`, `i18n-${name}-start`, `i18n-${name}-end`)
      } catch (error) {
        // Ignore performance API errors
      }
    }

    return duration
  }

  /**
   * Record translation loading metrics
   */
  recordLoadingMetrics(metrics: LoadingMetrics): void {
    this.loadingMetrics.push({
      ...metrics,
      loadTime: Math.round(metrics.loadTime * 100) / 100 // Round to 2 decimal places
    })

    // Update cache statistics
    this.cacheStats.totalRequests++
    this.cacheStats.totalLoadTime += metrics.loadTime

    if (metrics.cacheHit) {
      this.cacheStats.hits++
    } else {
      this.cacheStats.misses++
    }

    // Keep only recent metrics (last 100 entries)
    if (this.loadingMetrics.length > 100) {
      this.loadingMetrics.shift()
    }
  }

  /**
   * Record cache eviction
   */
  recordCacheEviction(): void {
    this.cacheStats.evictions++
  }

  /**
   * Get cache performance metrics
   */
  getCacheMetrics(): CacheMetrics {
    const { hits, misses, evictions, totalRequests, totalLoadTime } = this.cacheStats

    return {
      hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (misses / totalRequests) * 100 : 0,
      evictionCount: evictions,
      averageLoadTime: totalRequests > 0 ? totalLoadTime / totalRequests : 0,
      totalRequests
    }
  }

  /**
   * Get loading performance by language
   */
  getLoadingPerformanceByLanguage(): Record<string, {
    averageLoadTime: number
    cacheHitRate: number
    requestCount: number
    averageSize: number
  }> {
    const languageStats: Record<string, any> = {}

    for (const metric of this.loadingMetrics) {
      if (!languageStats[metric.language]) {
        languageStats[metric.language] = {
          totalLoadTime: 0,
          totalSize: 0,
          requestCount: 0,
          cacheHits: 0
        }
      }

      const stats = languageStats[metric.language]
      stats.totalLoadTime += metric.loadTime
      stats.totalSize += metric.totalSize
      stats.requestCount++
      
      if (metric.cacheHit) {
        stats.cacheHits++
      }
    }

    // Calculate averages and rates
    const result: Record<string, any> = {}
    for (const [language, stats] of Object.entries(languageStats)) {
      result[language] = {
        averageLoadTime: stats.totalLoadTime / stats.requestCount,
        cacheHitRate: (stats.cacheHits / stats.requestCount) * 100,
        requestCount: stats.requestCount,
        averageSize: stats.totalSize / stats.requestCount
      }
    }

    return result
  }

  /**
   * Get performance metrics by source
   */
  getPerformanceBySource(): Record<string, {
    averageLoadTime: number
    requestCount: number
    percentage: number
  }> {
    const sourceStats: Record<string, any> = {}
    const totalRequests = this.loadingMetrics.length

    for (const metric of this.loadingMetrics) {
      if (!sourceStats[metric.source]) {
        sourceStats[metric.source] = {
          totalLoadTime: 0,
          requestCount: 0
        }
      }

      sourceStats[metric.source].totalLoadTime += metric.loadTime
      sourceStats[metric.source].requestCount++
    }

    const result: Record<string, any> = {}
    for (const [source, stats] of Object.entries(sourceStats)) {
      result[source] = {
        averageLoadTime: stats.totalLoadTime / stats.requestCount,
        requestCount: stats.requestCount,
        percentage: (stats.requestCount / totalRequests) * 100
      }
    }

    return result
  }

  /**
   * Get slowest loading languages
   */
  getSlowestLanguages(limit: number = 5): Array<{
    language: string
    averageLoadTime: number
    requestCount: number
  }> {
    const languagePerformance = this.getLoadingPerformanceByLanguage()
    
    return Object.entries(languagePerformance)
      .map(([language, stats]) => ({
        language,
        averageLoadTime: stats.averageLoadTime,
        requestCount: stats.requestCount
      }))
      .sort((a, b) => b.averageLoadTime - a.averageLoadTime)
      .slice(0, limit)
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = []
    const cacheMetrics = this.getCacheMetrics()
    const sourcePerformance = this.getPerformanceBySource()

    // Cache hit rate recommendations
    if (cacheMetrics.hitRate < 70) {
      recommendations.push('Consider increasing cache TTL or preloading more languages')
    }

    // Network performance recommendations
    if (sourcePerformance.network?.averageLoadTime > 1000) {
      recommendations.push('Network loading is slow - consider CDN or compression')
    }

    // Memory usage recommendations
    if (cacheMetrics.evictionCount > 10) {
      recommendations.push('High cache eviction rate - consider increasing memory cache size')
    }

    // Service worker recommendations
    if (!sourcePerformance.serviceWorker || sourcePerformance.serviceWorker.percentage < 20) {
      recommendations.push('Low service worker usage - ensure service worker is properly configured')
    }

    return recommendations
  }

  /**
   * Export performance data for analysis
   */
  exportPerformanceData(): {
    cacheMetrics: CacheMetrics
    loadingMetrics: LoadingMetrics[]
    languagePerformance: Record<string, any>
    sourcePerformance: Record<string, any>
    recommendations: string[]
    timestamp: number
  } {
    return {
      cacheMetrics: this.getCacheMetrics(),
      loadingMetrics: [...this.loadingMetrics],
      languagePerformance: this.getLoadingPerformanceByLanguage(),
      sourcePerformance: this.getPerformanceBySource(),
      recommendations: this.getPerformanceRecommendations(),
      timestamp: Date.now()
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear()
    this.loadingMetrics.length = 0
    this.cacheStats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
      totalLoadTime: 0
    }
  }

  /**
   * Initialize Performance Observer for automatic metrics collection
   */
  private initializePerformanceObserver(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.startsWith('i18n-')) {
            // Automatically collect i18n-related performance entries
            console.debug('I18n Performance:', entry.name, entry.duration)
          }
        }
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] })
    } catch (error) {
      console.warn('Failed to initialize Performance Observer:', error)
    }
  }

  /**
   * Monitor Core Web Vitals impact
   */
  monitorWebVitals(): void {
    if (typeof window === 'undefined') return

    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          // Check if i18n loading affected LCP
          if (this.loadingMetrics.length > 0) {
            const recentLoading = this.loadingMetrics[this.loadingMetrics.length - 1]
            if (recentLoading.loadTime > 100) {
              console.warn('I18n loading may be affecting LCP:', {
                lcp: lastEntry.startTime,
                i18nLoadTime: recentLoading.loadTime
              })
            }
          }
        })

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('Failed to monitor LCP:', error)
      }
    }
  }
}

// Export singleton instance
export const i18nPerformanceMonitor = I18nPerformanceMonitor.getInstance()