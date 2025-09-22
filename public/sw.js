// Service Worker for translation caching and offline support

const CACHE_NAME = 'i18n-translations-v1'
const TRANSLATION_CACHE = 'i18n-translations'
const STATIC_CACHE = 'i18n-static-v1'

// Files to cache for offline support
const STATIC_FILES = [
  '/',
  '/manifest.json',
  // Add other critical files as needed
]

// Translation file patterns
const TRANSLATION_PATTERNS = [
  /^\/locales\/[a-z]{2}(-[A-Z]{2})?\.json$/,
  /^\/translations\/[a-z]{2}(-[A-Z]{2})?\.json$/,
  /^\/api\/translations\/[a-z]{2}(-[A-Z]{2})?$/
]

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_FILES)
      }),
      // Initialize translation cache
      caches.open(TRANSLATION_CACHE)
    ]).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== TRANSLATION_CACHE && 
                cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle translation file requests
  if (isTranslationRequest(url.pathname)) {
    event.respondWith(handleTranslationRequest(request))
    return
  }

  // Handle static file requests
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request))
    return
  }
})

// Handle translation file requests with cache-first strategy
async function handleTranslationRequest(request) {
  const cache = await caches.open(TRANSLATION_CACHE)
  
  try {
    // Try cache first
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      // Check if cached response is still valid
      const cacheTimestamp = cachedResponse.headers.get('Cache-Timestamp')
      const cacheVersion = cachedResponse.headers.get('Cache-Version')
      
      if (cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp)
        const maxAge = 60 * 60 * 1000 // 1 hour
        
        if (age < maxAge) {
          console.log('Serving translation from cache:', request.url)
          return cachedResponse
        }
      }
    }

    // Fetch from network
    console.log('Fetching translation from network:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone response for caching
      const responseToCache = networkResponse.clone()
      
      // Add cache headers
      const headers = new Headers(responseToCache.headers)
      headers.set('Cache-Timestamp', Date.now().toString())
      headers.set('Cache-Version', '1.0')
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      // Cache the response
      await cache.put(request, cachedResponse)
      
      return networkResponse
    }
    
    // If network fails, return cached version even if expired
    if (cachedResponse) {
      console.log('Network failed, serving stale translation from cache:', request.url)
      return cachedResponse
    }
    
    throw new Error('Translation not available')
    
  } catch (error) {
    console.error('Translation request failed:', error)
    
    // Return cached version if available
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return fallback response
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle static file requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first for static files
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
    }
    
    return networkResponse
    
  } catch (error) {
    console.error('Static request failed:', error)
    
    // Try to return cached version
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return network error
    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Check if request is for translation files
function isTranslationRequest(pathname) {
  return TRANSLATION_PATTERNS.some(pattern => pattern.test(pathname))
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'CACHE_TRANSLATION':
      handleCacheTranslation(data)
      break
    case 'CLEAR_TRANSLATION_CACHE':
      handleClearTranslationCache()
      break
    case 'GET_CACHE_STATS':
      handleGetCacheStats(event)
      break
    default:
      console.warn('Unknown message type:', type)
  }
})

// Cache translation data from main thread
async function handleCacheTranslation({ language, data, version }) {
  try {
    const cache = await caches.open(TRANSLATION_CACHE)
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Version': version || '1.0',
        'Cache-Timestamp': Date.now().toString()
      }
    })
    
    await cache.put(`/translations/${language}.json`, response)
    console.log('Cached translation for language:', language)
  } catch (error) {
    console.error('Failed to cache translation:', error)
  }
}

// Clear translation cache
async function handleClearTranslationCache() {
  try {
    await caches.delete(TRANSLATION_CACHE)
    await caches.open(TRANSLATION_CACHE) // Recreate empty cache
    console.log('Translation cache cleared')
  } catch (error) {
    console.error('Failed to clear translation cache:', error)
  }
}

// Get cache statistics
async function handleGetCacheStats(event) {
  try {
    const cache = await caches.open(TRANSLATION_CACHE)
    const keys = await cache.keys()
    
    const stats = {
      translationCacheSize: keys.length,
      languages: keys.map(request => {
        const url = new URL(request.url)
        const match = url.pathname.match(/\/translations\/([a-z]{2}(?:-[A-Z]{2})?)\.json$/)
        return match ? match[1] : null
      }).filter(Boolean)
    }
    
    event.ports[0].postMessage(stats)
  } catch (error) {
    console.error('Failed to get cache stats:', error)
    event.ports[0].postMessage({ error: error.message })
  }
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cache = await caches.open(TRANSLATION_CACHE)
    const requests = await cache.keys()
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const timestamp = response.headers.get('Cache-Timestamp')
        if (timestamp && (now - parseInt(timestamp)) > maxAge) {
          await cache.delete(request)
          console.log('Cleaned up expired cache entry:', request.url)
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error)
  }
}, 60 * 60 * 1000) // Run every hour