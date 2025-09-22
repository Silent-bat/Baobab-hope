// Advanced caching system for translations with LRU eviction and multi-layer storage

import { TranslationData } from './types'

export interface CacheEntry {
  data: TranslationData
  timestamp: number
  version: string
  size: number
  accessCount: number
  lastAccessed: number
}

export interface CacheConfig {
  maxMemoryEntries: number
  maxMemorySize: number // in bytes
  ttl: number // time to live in milliseconds
  localStoragePrefix: string
  enableLocalStorage: boolean
  enableServiceWorker: boolean
  compressionEnabled: boolean
}

export interface CacheStats {
  memoryHits: number
  memoryMisses: number
  localStorageHits: number
  localStorageMisses: number
  serviceWorkerHits: number
  serviceWorkerMisses: number
  evictions: number
  totalSize: number
  entryCount: number
}

export class TranslationCacheManager {
  private memoryCache: Map<string, CacheEntry> = new Map()
  private config: CacheConfig
  private stats: CacheStats = {
    memoryHits: 0,
    memoryMisses: 0,
    localStorageHits: 0,
    localStorageMisses: 0,
    serviceWorkerHits: 0,
    serviceWorkerMisses: 0,
    evictions: 0,
    totalSize: 0,
    entryCount: 0
  }

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxMemoryEntries: 10,
      maxMemorySize: 5 * 1024 * 1024, // 5MB
      ttl: 60 * 60 * 1000, // 1 hour
      localStoragePrefix: 'i18n_cache_',
      enableLocalStorage: true,
      enableServiceWorker: true,
      compressionEnabled: true,
      ...config
    }

    // Initialize service worker cache if supported
    if (this.config.enableServiceWorker && typeof window !== 'undefined') {
      this.initializeServiceWorkerCache()
    }

    // Clean up expired localStorage entries on initialization
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      this.cleanupLocalStorage()
    }
  }

  /**
   * Get translation data from cache (multi-layer lookup)
   */
  async get(language: string): Promise<TranslationData | null> {
    // 1. Check memory cache first
    const memoryResult = this.getFromMemory(language)
    if (memoryResult) {
      this.stats.memoryHits++
      return memoryResult
    }
    this.stats.memoryMisses++

    // 2. Check localStorage
    if (this.config.enableLocalStorage) {
      const localStorageResult = await this.getFromLocalStorage(language)
      if (localStorageResult) {
        this.stats.localStorageHits++
        // Promote to memory cache
        this.setInMemory(language, localStorageResult, '1.0')
        return localStorageResult
      }
      this.stats.localStorageMisses++
    }

    // 3. Check service worker cache
    if (this.config.enableServiceWorker) {
      const serviceWorkerResult = await this.getFromServiceWorker(language)
      if (serviceWorkerResult) {
        this.stats.serviceWorkerHits++
        // Promote to memory and localStorage
        this.setInMemory(language, serviceWorkerResult, '1.0')
        if (this.config.enableLocalStorage) {
          await this.setInLocalStorage(language, serviceWorkerResult, '1.0')
        }
        return serviceWorkerResult
      }
      this.stats.serviceWorkerMisses++
    }

    return null
  }

  /**
   * Set translation data in all cache layers
   */
  async set(language: string, data: TranslationData, version: string = '1.0'): Promise<void> {
    // Set in memory cache
    this.setInMemory(language, data, version)

    // Set in localStorage
    if (this.config.enableLocalStorage) {
      await this.setInLocalStorage(language, data, version)
    }

    // Set in service worker cache
    if (this.config.enableServiceWorker) {
      await this.setInServiceWorker(language, data, version)
    }
  }

  /**
   * Check if language is cached in any layer
   */
  async has(language: string): Promise<boolean> {
    return (await this.get(language)) !== null
  }

  /**
   * Remove language from all cache layers
   */
  async delete(language: string): Promise<void> {
    // Remove from memory
    this.memoryCache.delete(language)
    this.updateStats()

    // Remove from localStorage
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.config.localStoragePrefix + language)
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error)
      }
    }

    // Remove from service worker cache
    if (this.config.enableServiceWorker) {
      await this.deleteFromServiceWorker(language)
    }
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear()
    this.updateStats()

    // Clear localStorage
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage)
        for (const key of keys) {
          if (key.startsWith(this.config.localStoragePrefix)) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }

    // Clear service worker cache
    if (this.config.enableServiceWorker) {
      await this.clearServiceWorkerCache()
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config }
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Preload multiple languages into cache
   */
  async preload(languages: string[], loader: (lang: string) => Promise<TranslationData>): Promise<void> {
    const loadPromises = languages.map(async (language) => {
      try {
        const cached = await this.get(language)
        if (!cached) {
          const data = await loader(language)
          await this.set(language, data)
        }
      } catch (error) {
        console.warn(`Failed to preload language ${language}:`, error)
      }
    })

    await Promise.allSettled(loadPromises)
  }

  /**
   * Get from memory cache with LRU update
   */
  private getFromMemory(language: string): TranslationData | null {
    const entry = this.memoryCache.get(language)
    if (!entry) {
      return null
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.memoryCache.delete(language)
      this.updateStats()
      return null
    }

    // Update LRU data
    entry.lastAccessed = Date.now()
    entry.accessCount++

    return entry.data
  }

  /**
   * Set in memory cache with LRU eviction
   */
  private setInMemory(language: string, data: TranslationData, version: string): void {
    const size = this.estimateSize(data)
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      version,
      size,
      accessCount: 1,
      lastAccessed: Date.now()
    }

    // Check if we need to evict entries
    this.evictIfNeeded(size)

    this.memoryCache.set(language, entry)
    this.updateStats()
  }

  /**
   * Evict entries using LRU strategy
   */
  private evictIfNeeded(newEntrySize: number): void {
    // Check entry count limit
    while (this.memoryCache.size >= this.config.maxMemoryEntries) {
      this.evictLRU()
    }

    // Check size limit
    while (this.stats.totalSize + newEntrySize > this.config.maxMemorySize && this.memoryCache.size > 0) {
      this.evictLRU()
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey = ''
    let lruTime = Date.now()

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed
        lruKey = key
      }
    }

    if (lruKey) {
      this.memoryCache.delete(lruKey)
      this.stats.evictions++
      this.updateStats()
    }
  }

  /**
   * Get from localStorage with decompression
   */
  private async getFromLocalStorage(language: string): Promise<TranslationData | null> {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const key = this.config.localStoragePrefix + language
      const stored = localStorage.getItem(key)
      if (!stored) {
        return null
      }

      const parsed = JSON.parse(stored)
      
      // Check TTL
      if (Date.now() - parsed.timestamp > this.config.ttl) {
        localStorage.removeItem(key)
        return null
      }

      let data = parsed.data
      
      // Decompress if needed
      if (this.config.compressionEnabled && parsed.compressed) {
        data = await this.decompress(data)
      }

      return data
    } catch (error) {
      console.warn('Failed to get from localStorage:', error)
      return null
    }
  }

  /**
   * Set in localStorage with compression
   */
  private async setInLocalStorage(language: string, data: TranslationData, version: string): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    try {
      let dataToStore = data
      let compressed = false

      // Compress if enabled
      if (this.config.compressionEnabled) {
        dataToStore = await this.compress(data)
        compressed = true
      }

      const entry = {
        data: dataToStore,
        timestamp: Date.now(),
        version,
        compressed
      }

      const key = this.config.localStoragePrefix + language
      localStorage.setItem(key, JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to set in localStorage:', error)
    }
  }

  /**
   * Get from service worker cache
   */
  private async getFromServiceWorker(language: string): Promise<TranslationData | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null
    }

    try {
      const cache = await caches.open('i18n-translations')
      const response = await cache.match(`/translations/${language}.json`)
      
      if (response) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.warn('Failed to get from service worker cache:', error)
    }

    return null
  }

  /**
   * Set in service worker cache
   */
  private async setInServiceWorker(language: string, data: TranslationData, version: string): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    try {
      const cache = await caches.open('i18n-translations')
      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Version': version,
          'Cache-Timestamp': Date.now().toString()
        }
      })
      
      await cache.put(`/translations/${language}.json`, response)
    } catch (error) {
      console.warn('Failed to set in service worker cache:', error)
    }
  }

  /**
   * Delete from service worker cache
   */
  private async deleteFromServiceWorker(language: string): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    try {
      const cache = await caches.open('i18n-translations')
      await cache.delete(`/translations/${language}.json`)
    } catch (error) {
      console.warn('Failed to delete from service worker cache:', error)
    }
  }

  /**
   * Clear service worker cache
   */
  private async clearServiceWorkerCache(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    try {
      await caches.delete('i18n-translations')
    } catch (error) {
      console.warn('Failed to clear service worker cache:', error)
    }
  }

  /**
   * Initialize service worker cache
   */
  private async initializeServiceWorkerCache(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    try {
      // Register service worker if not already registered
      if (!navigator.serviceWorker.controller) {
        await navigator.serviceWorker.register('/sw.js')
      }
    } catch (error) {
      console.warn('Failed to initialize service worker:', error)
    }
  }

  /**
   * Clean up expired localStorage entries
   */
  private cleanupLocalStorage(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const keys = Object.keys(localStorage)
      const now = Date.now()

      for (const key of keys) {
        if (key.startsWith(this.config.localStoragePrefix)) {
          try {
            const stored = localStorage.getItem(key)
            if (stored) {
              const parsed = JSON.parse(stored)
              if (now - parsed.timestamp > this.config.ttl) {
                localStorage.removeItem(key)
              }
            }
          } catch (error) {
            // Remove corrupted entries
            localStorage.removeItem(key)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error)
    }
  }

  /**
   * Estimate size of translation data in bytes
   */
  private estimateSize(data: TranslationData): number {
    return new Blob([JSON.stringify(data)]).size
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.entryCount = this.memoryCache.size
    this.stats.totalSize = Array.from(this.memoryCache.values())
      .reduce((total, entry) => total + entry.size, 0)
  }

  /**
   * Compress data using built-in compression
   */
  private async compress(data: TranslationData): Promise<string> {
    if (typeof window === 'undefined' || !('CompressionStream' in window)) {
      // Fallback to JSON string if compression not available
      return JSON.stringify(data)
    }

    try {
      const jsonString = JSON.stringify(data)
      const stream = new CompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()

      writer.write(new TextEncoder().encode(jsonString))
      writer.close()

      const chunks: Uint8Array[] = []
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          chunks.push(value)
        }
      }

      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        compressed.set(chunk, offset)
        offset += chunk.length
      }

      return btoa(String.fromCharCode(...compressed))
    } catch (error) {
      console.warn('Compression failed, using uncompressed data:', error)
      return JSON.stringify(data)
    }
  }

  /**
   * Decompress data
   */
  private async decompress(compressedData: string): Promise<TranslationData> {
    if (typeof window === 'undefined' || !('DecompressionStream' in window)) {
      // Fallback to JSON parse if decompression not available
      return JSON.parse(compressedData)
    }

    try {
      const compressed = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0))
      const stream = new DecompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()

      writer.write(compressed)
      writer.close()

      const chunks: Uint8Array[] = []
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          chunks.push(value)
        }
      }

      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        decompressed.set(chunk, offset)
        offset += chunk.length
      }

      const jsonString = new TextDecoder().decode(decompressed)
      return JSON.parse(jsonString)
    } catch (error) {
      console.warn('Decompression failed, trying as uncompressed data:', error)
      return JSON.parse(compressedData)
    }
  }
}