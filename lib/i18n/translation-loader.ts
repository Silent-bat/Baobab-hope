// Translation file loading utilities with lazy loading and code splitting

import { TranslationData } from './types'
import { I18N_CONFIG } from './config'

interface TranslationChunk {
  namespace: string
  data: TranslationData
  priority: 'critical' | 'high' | 'normal' | 'low'
  size: number
}

interface LazyLoadConfig {
  enableChunking: boolean
  chunkSize: number
  criticalNamespaces: string[]
  preloadThreshold: number
}

export class TranslationLoader {
  private static loadingCache = new Map<string, Promise<TranslationData>>()
  private static chunkCache = new Map<string, Map<string, TranslationChunk>>()
  private static lazyLoadConfig: LazyLoadConfig = {
    enableChunking: true,
    chunkSize: 50, // Maximum keys per chunk
    criticalNamespaces: ['common', 'navigation', 'pages'],
    preloadThreshold: 0.7 // Preload when 70% of current chunk is used
  }
  
  /**
   * Load translation file with lazy loading and chunking
   */
  static async loadTranslationFile(language: string): Promise<TranslationData> {
    // Check if already loading
    if (this.loadingCache.has(language)) {
      return this.loadingCache.get(language)!
    }
    
    // Use chunked loading by default since we've standardized the structure
    const loadPromise = this.loadAllNamespaces(language)
    
    this.loadingCache.set(language, loadPromise)
    
    try {
      const result = await loadPromise
      return result
    } finally {
      this.loadingCache.delete(language)
    }
  }

  /**
   * Load translation chunks progressively
   */
  static async loadTranslationChunks(language: string): Promise<TranslationData> {
    // First, load critical chunks
    const criticalData = await this.loadCriticalChunks(language)
    
    // Schedule non-critical chunks for background loading
    this.scheduleBackgroundLoading(language)
    
    return criticalData
  }

  /**
   * Load critical translation chunks first
   */
  static async loadCriticalChunks(language: string): Promise<TranslationData> {
    const criticalChunks = await Promise.allSettled(
      this.lazyLoadConfig.criticalNamespaces.map(namespace => 
        this.loadTranslationChunk(language, namespace)
      )
    )

    const mergedData: TranslationData = {}
    
    for (const result of criticalChunks) {
      if (result.status === 'fulfilled' && result.value) {
        Object.assign(mergedData, result.value.data)
      }
    }

    return mergedData
  }

  /**
   * Load a specific translation chunk
   */
  static async loadTranslationChunk(language: string, namespace: string): Promise<TranslationChunk | null> {
    try {
      // Check chunk cache first
      const languageChunks = this.chunkCache.get(language)
      if (languageChunks?.has(namespace)) {
        return languageChunks.get(namespace)!
      }

      // Dynamic import for chunk-specific loading
      const chunkData = await this.dynamicImportChunk(language, namespace)
      
      if (chunkData) {
        const chunk: TranslationChunk = {
          namespace,
          data: chunkData,
          priority: this.getChunkPriority(namespace),
          size: this.estimateChunkSize(chunkData)
        }

        // Cache the chunk
        if (!this.chunkCache.has(language)) {
          this.chunkCache.set(language, new Map())
        }
        this.chunkCache.get(language)!.set(namespace, chunk)

        return chunk
      }
    } catch (error) {
      console.warn(`Failed to load chunk ${namespace} for ${language}:`, error)
    }

    return null
  }

  /**
   * Dynamic import for translation chunks with code splitting
   */
  static async dynamicImportChunk(language: string, namespace: string): Promise<TranslationData | null> {
    try {
      // For now, use fetch instead of dynamic imports to avoid path issues
      return this.fetchTranslationChunk(language, namespace)
    } catch (error) {
      console.warn(`Failed to load chunk ${namespace} for ${language}:`, error)
      return null
    }
  }

  /**
   * Load a specific namespace (public method for external use)
   */
  static async loadNamespace(language: string, namespace: string): Promise<TranslationData> {
    const chunk = await this.loadTranslationChunk(language, namespace)
    return chunk ? chunk.data : {}
  }

  /**
   * Load all namespaces for a language and merge them
   */
  static async loadAllNamespaces(language: string): Promise<TranslationData> {
    const namespaces = await this.getAvailableNamespaces(language)
    const allTranslations: TranslationData = {}

    // Load all namespaces in parallel
    const namespacePromises = namespaces.map(async (namespace) => {
      try {
        const namespaceData = await this.loadNamespace(language, namespace)
        return { namespace, data: namespaceData }
      } catch (error) {
        console.warn(`Failed to load namespace ${namespace} for ${language}:`, error)
        return { namespace, data: {} }
      }
    })

    const results = await Promise.all(namespacePromises)
    
    // Merge all namespace data
    results.forEach(({ data }) => {
      Object.assign(allTranslations, data)
    })

    return allTranslations
  }

  /**
   * Fetch translation chunk via HTTP
   */
  static async fetchTranslationChunk(language: string, namespace: string): Promise<TranslationData | null> {
    try {
      const baseUrl = this.getBaseUrl()
      const url = `${baseUrl}/locales/${language}/${namespace}.json`
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.warn(`Failed to fetch chunk ${namespace} for ${language}:`, error)
      return null
    }
  }

  /**
   * Schedule background loading of non-critical chunks
   */
  static scheduleBackgroundLoading(language: string): void {
    // Use requestIdleCallback for background loading
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.loadNonCriticalChunks(language)
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.loadNonCriticalChunks(language)
      }, 100)
    }
  }

  /**
   * Load non-critical chunks in background
   */
  static async loadNonCriticalChunks(language: string): Promise<void> {
    const allNamespaces = await this.getAvailableNamespaces(language)
    const nonCriticalNamespaces = allNamespaces.filter(
      ns => !this.lazyLoadConfig.criticalNamespaces.includes(ns)
    )

    // Load chunks with priority-based ordering
    const sortedNamespaces = this.sortNamespacesByPriority(nonCriticalNamespaces)
    
    for (const namespace of sortedNamespaces) {
      try {
        await this.loadTranslationChunk(language, namespace)
        
        // Add small delay to avoid blocking the main thread
        await this.delay(10)
      } catch (error) {
        console.warn(`Background loading failed for ${namespace}:`, error)
      }
    }
  }

  /**
   * Get available namespaces for a language
   */
  static async getAvailableNamespaces(language: string): Promise<string[]> {
    // Return the actual namespaces that exist in the file structure
    return [
      'common',
      'navigation',
      'pages',
      'forms',
      'actions',
      'misc'
    ]
  }

  /**
   * Sort namespaces by loading priority
   */
  static sortNamespacesByPriority(namespaces: string[]): string[] {
    const priorityOrder = {
      'forms': 1,
      'errors': 2,
      'pages': 3,
      'components': 4,
      'actions': 5,
      'content': 6
    }

    return namespaces.sort((a, b) => {
      const priorityA = priorityOrder[a as keyof typeof priorityOrder] || 999
      const priorityB = priorityOrder[b as keyof typeof priorityOrder] || 999
      return priorityA - priorityB
    })
  }

  /**
   * Get chunk priority based on namespace
   */
  static getChunkPriority(namespace: string): 'critical' | 'high' | 'normal' | 'low' {
    if (this.lazyLoadConfig.criticalNamespaces.includes(namespace)) {
      return 'critical'
    }
    
    const highPriority = ['forms', 'errors']
    if (highPriority.includes(namespace)) {
      return 'high'
    }
    
    const normalPriority = ['pages', 'components']
    if (normalPriority.includes(namespace)) {
      return 'normal'
    }
    
    return 'low'
  }

  /**
   * Estimate chunk size in bytes
   */
  static estimateChunkSize(data: TranslationData): number {
    return new Blob([JSON.stringify(data)]).size
  }

  /**
   * Progressive loading based on usage patterns
   */
  static async loadOnDemand(language: string, namespace: string): Promise<TranslationData> {
    const chunk = await this.loadTranslationChunk(language, namespace)
    
    if (chunk) {
      // Check if we should preload related chunks
      if (this.shouldPreloadRelated(language, namespace)) {
        this.preloadRelatedChunks(language, namespace)
      }
      
      return chunk.data
    }
    
    return {}
  }

  /**
   * Check if related chunks should be preloaded
   */
  static shouldPreloadRelated(language: string, namespace: string): boolean {
    const languageChunks = this.chunkCache.get(language)
    if (!languageChunks) return false

    const loadedChunks = Array.from(languageChunks.values())
    const totalChunks = loadedChunks.length
    const criticalChunks = loadedChunks.filter(chunk => chunk.priority === 'critical').length

    // Preload if we've loaded most critical chunks
    return criticalChunks / Math.max(this.lazyLoadConfig.criticalNamespaces.length, 1) >= this.lazyLoadConfig.preloadThreshold
  }

  /**
   * Preload related chunks based on usage patterns
   */
  static async preloadRelatedChunks(language: string, currentNamespace: string): Promise<void> {
    const relatedNamespaces = this.getRelatedNamespaces(currentNamespace)
    
    for (const namespace of relatedNamespaces) {
      try {
        await this.loadTranslationChunk(language, namespace)
      } catch (error) {
        console.warn(`Failed to preload related chunk ${namespace}:`, error)
      }
    }
  }

  /**
   * Get namespaces related to current namespace
   */
  static getRelatedNamespaces(namespace: string): string[] {
    const relationships: Record<string, string[]> = {
      'forms': ['errors', 'validation'],
      'pages': ['components', 'navigation'],
      'components': ['actions', 'common'],
      'errors': ['forms', 'validation']
    }

    return relationships[namespace] || []
  }
  
  /**
   * Load translation with retry logic
   */
  private static async loadWithRetry(
    language: string, 
    attempt: number = 1
  ): Promise<TranslationData> {
    try {
      // Use HTTP request for all languages
      const baseUrl = this.getBaseUrl()
      const url = `${baseUrl}${I18N_CONFIG.translationPath}/${language}${I18N_CONFIG.translationFileExtension}`
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Loading translations from: ${url}`)
      }
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), I18N_CONFIG.loadingTimeout)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Validate translation data structure
      if (!this.validateTranslationData(data)) {
        throw new Error('Invalid translation data structure')
      }
      
      return data
    } catch (error) {
      console.warn(`Translation loading attempt ${attempt} failed for ${language}:`, error)
      
      // Retry if we haven't exceeded max attempts
      if (attempt < I18N_CONFIG.retryAttempts) {
        await this.delay(I18N_CONFIG.retryDelay * attempt) // Exponential backoff
        return this.loadWithRetry(language, attempt + 1)
      }
      
      throw error
    }
  }

  /**
   * Get base URL for fetching translations
   */
  private static getBaseUrl(): string {
    // Client-side: use current origin
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    
    // Server-side: try to determine the correct port
    const port = process.env.PORT || '3001' // Default to 3001 since that's what we're using
    return process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
  }
  
  /**
   * Validate translation data structure
   */
  private static validateTranslationData(data: any): data is TranslationData {
    if (!data || typeof data !== 'object') {
      return false
    }
    
    // Basic validation - could be more comprehensive
    return true
  }
  
  /**
   * Preload multiple translation files
   */
  static async preloadTranslations(languages: string[]): Promise<Map<string, TranslationData>> {
    const results = new Map<string, TranslationData>()
    
    const loadPromises = languages.map(async (language) => {
      try {
        const data = await this.loadTranslationFile(language)
        results.set(language, data)
      } catch (error) {
        console.warn(`Failed to preload translations for ${language}:`, error)
      }
    })
    
    await Promise.allSettled(loadPromises)
    return results
  }
  
  /**
   * Check if translation file exists
   */
  static async checkTranslationExists(language: string): Promise<boolean> {
    try {
      const baseUrl = this.getBaseUrl()
      const url = `${baseUrl}${I18N_CONFIG.translationPath}/${language}${I18N_CONFIG.translationFileExtension}`
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
  
  /**
   * Get available translation languages by checking files
   */
  static async getAvailableLanguages(): Promise<string[]> {
    // This would need to be implemented based on your deployment strategy
    // For static sites, you might need to maintain a manifest file
    // For dynamic sites, you could scan the filesystem or use an API
    
    // For now, return the configured languages
    const { getSupportedLanguageCodes } = await import('./languages')
    return getSupportedLanguageCodes()
  }
  
  /**
   * Utility delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * Tree shake unused translations from bundle
   */
  static optimizeBundle(language: string, usedKeys: Set<string>): TranslationData {
    const languageChunks = this.chunkCache.get(language)
    if (!languageChunks) return {}

    const optimizedData: TranslationData = {}

    for (const [namespace, chunk] of languageChunks.entries()) {
      const optimizedChunk = this.treeShakeChunk(chunk.data, usedKeys)
      if (Object.keys(optimizedChunk).length > 0) {
        Object.assign(optimizedData, optimizedChunk)
      }
    }

    return optimizedData
  }

  /**
   * Tree shake unused keys from a chunk
   */
  static treeShakeChunk(chunkData: TranslationData, usedKeys: Set<string>): TranslationData {
    const optimized: TranslationData = {}

    for (const [key, value] of Object.entries(chunkData)) {
      if (usedKeys.has(key)) {
        if (typeof value === 'object' && value !== null) {
          const nestedOptimized = this.treeShakeChunk(value as TranslationData, usedKeys)
          if (Object.keys(nestedOptimized).length > 0) {
            optimized[key] = nestedOptimized
          }
        } else {
          optimized[key] = value
        }
      }
    }

    return optimized
  }

  /**
   * Get bundle size statistics
   */
  static getBundleStats(language: string): {
    totalSize: number
    chunkCount: number
    chunks: Array<{ namespace: string; size: number; priority: string }>
  } {
    const languageChunks = this.chunkCache.get(language)
    if (!languageChunks) {
      return { totalSize: 0, chunkCount: 0, chunks: [] }
    }

    const chunks = Array.from(languageChunks.values()).map(chunk => ({
      namespace: chunk.namespace,
      size: chunk.size,
      priority: chunk.priority
    }))

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)

    return {
      totalSize,
      chunkCount: chunks.length,
      chunks: chunks.sort((a, b) => b.size - a.size)
    }
  }

  /**
   * Configure lazy loading behavior
   */
  static configureLazyLoading(config: Partial<LazyLoadConfig>): void {
    this.lazyLoadConfig = { ...this.lazyLoadConfig, ...config }
  }

  /**
   * Get lazy loading configuration
   */
  static getLazyLoadConfig(): LazyLoadConfig {
    return { ...this.lazyLoadConfig }
  }

  /**
   * Prefetch translations for upcoming routes
   */
  static async prefetchForRoutes(language: string, routes: string[]): Promise<void> {
    const routeNamespaces = this.getNamespacesForRoutes(routes)
    
    const prefetchPromises = routeNamespaces.map(namespace =>
      this.loadTranslationChunk(language, namespace)
    )

    await Promise.allSettled(prefetchPromises)
  }

  /**
   * Get namespaces needed for specific routes
   */
  static getNamespacesForRoutes(routes: string[]): string[] {
    const routeNamespaceMap: Record<string, string[]> = {
      '/': ['common', 'navigation', 'pages'],
      '/about': ['common', 'navigation', 'pages', 'content'],
      '/contact': ['common', 'navigation', 'forms', 'pages'],
      '/donate': ['common', 'navigation', 'forms', 'pages'],
      '/act': ['common', 'navigation', 'pages', 'actions'],
      '/information': ['common', 'navigation', 'pages', 'content'],
      '/projects': ['common', 'navigation', 'pages', 'content'],
      '/blog': ['common', 'navigation', 'pages', 'content']
    }

    const namespaces = new Set<string>()
    
    for (const route of routes) {
      const routeNamespaces = routeNamespaceMap[route] || ['common', 'navigation', 'pages']
      routeNamespaces.forEach(ns => namespaces.add(ns))
    }

    return Array.from(namespaces)
  }

  /**
   * Clear all caches
   */
  static clearCache(): void {
    this.loadingCache.clear()
    this.chunkCache.clear()
  }
  
  /**
   * Get comprehensive cache status
   */
  static getCacheStatus(): {
    loadingCache: { size: number; keys: string[] }
    chunkCache: { languages: number; totalChunks: number }
    bundleStats: Record<string, any>
  } {
    const bundleStats: Record<string, any> = {}
    
    for (const language of this.chunkCache.keys()) {
      bundleStats[language] = this.getBundleStats(language)
    }

    return {
      loadingCache: {
        size: this.loadingCache.size,
        keys: Array.from(this.loadingCache.keys())
      },
      chunkCache: {
        languages: this.chunkCache.size,
        totalChunks: Array.from(this.chunkCache.values())
          .reduce((sum, chunks) => sum + chunks.size, 0)
      },
      bundleStats
    }
  }
}