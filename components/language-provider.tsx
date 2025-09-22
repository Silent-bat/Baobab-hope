"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  LanguageContextType, 
  Language, 
  TranslationOptions,
  getEnabledLanguages,
  getLanguageByCode,
  LanguageDetectionService,
  translationService,
  CulturalFormattingService,
  getLanguageDirection,
  DEFAULT_LANGUAGE
} from "@/lib/i18n"
import { getSupportedLanguages, isLanguageEnabled } from "@/lib/i18n/config"
import { i18nPerformanceMonitor } from "@/lib/i18n/performance-monitor"
import { getLocaleFromPathname, addLocaleToPathname, removeLocaleFromPathname, isSupportedLocale } from "@/lib/i18n/url-utils"
import { useLanguageAnalytics } from "@/lib/i18n/language-analytics"

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: string
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const analytics = useLanguageAnalytics()
  
  // Determine initial language: URL locale (if present) > provided initial > stored preference > default
  const urlSegments = typeof pathname === 'string' ? pathname.split('/') : ['/']
  const urlHasLocale = urlSegments.length > 1 && isSupportedLocale(urlSegments[1])
  const storedPreference = LanguageDetectionService.getUserPreferredLanguage()?.language
  const urlLanguage = getLocaleFromPathname(pathname)
  const [language, setLanguageState] = useState<string>(
    urlHasLocale ? urlLanguage : (initialLanguage || storedPreference || DEFAULT_LANGUAGE)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(getEnabledLanguages())
  const [isMounted, setIsMounted] = useState(false)
  
  // Set mounted state on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load initial translations immediately
  useEffect(() => {
    if (!isMounted) return
    
    let isMountedRef = true
    
    const loadInitialTranslations = async () => {
      try {
        // Load translations for the current language immediately
        await translationService.loadTranslations(language)
        
        // Also load default language if different
        if (language !== DEFAULT_LANGUAGE) {
          await translationService.loadTranslations(DEFAULT_LANGUAGE)
        }
        
        if (isMountedRef) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to load initial translations:', error)
        if (isMountedRef) {
          setIsLoading(false)
        }
      }
    }
    
    loadInitialTranslations()
    
    return () => {
      isMountedRef = false
    }
  }, [language, isMounted]) // Run when language changes
  
  // Preload translations for all enabled languages in background for instant switching
  useEffect(() => {
    if (!isMounted) return
    const enabled = getEnabledLanguages().map(l => l.code)
    // Preload all, but don't block UI
    enabled.forEach(code => {
      translationService.isLanguageLoaded(code).then(already => {
        if (!already) {
          translationService.loadTranslations(code).catch(() => {})
        }
      })
    })
  }, [isMounted])

  // Update available languages when feature flags change
  useEffect(() => {
    if (!isMounted) return
    
    const updateAvailableLanguages = () => {
      const supportedCodes = getSupportedLanguages()
      const enabledLanguages = getEnabledLanguages().filter(lang => 
        supportedCodes.includes(lang.code as any)
      )
      setAvailableLanguages(enabledLanguages)
    }
    
    updateAvailableLanguages()
    
    // Listen for feature flag updates
    const handleFeatureFlagUpdate = () => {
      updateAvailableLanguages()
    }
    
    window.addEventListener('featureFlagsUpdated', handleFeatureFlagUpdate)
    return () => window.removeEventListener('featureFlagsUpdated', handleFeatureFlagUpdate)
  }, [isMounted])

  // Sync language state with URL changes and track page views
  useEffect(() => {
    if (!isMounted) return
    
    const segments = typeof pathname === 'string' ? pathname.split('/') : ['/']
    const hasLocale = segments.length > 1 && isSupportedLocale(segments[1])
    if (hasLocale) {
      const currentUrlLanguage = getLocaleFromPathname(pathname)
      if (currentUrlLanguage !== language) {
        setLanguageState(currentUrlLanguage)
      }
    }
    
    // Track page view with current language
    analytics.trackPageView(hasLocale ? getLocaleFromPathname(pathname) : language, pathname)
  }, [pathname, language, analytics, isMounted])

  // Initialize language detection and loading with performance monitoring
  useEffect(() => {
    if (!isMounted) return
    
    const initializeLanguage = async () => {
      try {
        setIsLoading(true)
        
        // Start performance measurement
        i18nPerformanceMonitor.startMeasurement(`language-init-${language}`, {
          language,
          source: 'initialization'
        })
        
        // Load translations for current language first
        const startTime = performance.now()
        await translationService.loadTranslations(language)
        
        // Also preload default language if different
        if (language !== DEFAULT_LANGUAGE) {
          await translationService.loadTranslations(DEFAULT_LANGUAGE)
        }
        
        const loadTime = performance.now() - startTime
        
        // Record loading metrics
        i18nPerformanceMonitor.recordLoadingMetrics({
          language,
          loadTime,
          cacheHit: await translationService.isLanguageLoaded(language),
          chunkCount: language !== DEFAULT_LANGUAGE ? 2 : 1,
          totalSize: 0, // Would need to calculate actual size
          source: 'memory'
        })
        
        // Track language selection analytics
        analytics.trackLanguageSelection(language, 'browser')
        analytics.trackTranslationLoaded(language, loadTime)
        
        // End performance measurement
        i18nPerformanceMonitor.endMeasurement(`language-init-${language}`)
        
      } catch (error) {
        console.error('Language initialization failed:', error)
        analytics.trackTranslationError(language, 'initialization_failed', error instanceof Error ? error.message : 'Unknown error')
        setLanguageState(DEFAULT_LANGUAGE)
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [language, isMounted])

  // Handle language changes with URL navigation and performance monitoring
  const setLanguage = async (newLanguage: string) => {
    if (newLanguage === language) return
    
    // Check enablement against local registry to align with available translation files
    const isCodeEnabledLocally = getEnabledLanguages().some(l => l.code === newLanguage)
    if (!isCodeEnabledLocally) {
      console.warn(`Language ${newLanguage} is not enabled in local registry`)
      analytics.trackTranslationError(newLanguage, 'language_not_enabled', 'Language disabled in local registry')
      return
    }
    
    try {
      // Check cache before toggling loading state for instant UX
      const wasLoaded = await translationService.isLanguageLoaded(newLanguage)
      if (!wasLoaded) {
        setIsLoading(true)
      }
      
      // Start performance measurement for language switching
      i18nPerformanceMonitor.startMeasurement(`language-switch-${newLanguage}`, {
        fromLanguage: language,
        toLanguage: newLanguage,
        source: 'user-action'
      })
      
      // Save user preference
      LanguageDetectionService.setUserPreferredLanguage(newLanguage)
      
      // Load translations for new language with performance tracking
      const startTime = performance.now()
      await translationService.loadTranslations(newLanguage)
      const loadTime = performance.now() - startTime
      
      // Record loading metrics
      i18nPerformanceMonitor.recordLoadingMetrics({
        language: newLanguage,
        loadTime,
        cacheHit: wasLoaded,
        chunkCount: 1,
        totalSize: 0, // Would need to calculate actual size
        source: wasLoaded ? 'memory' : 'network'
      })
      
      // Track language switch analytics
      analytics.trackLanguageSwitch(newLanguage, language)
      analytics.trackTranslationLoaded(newLanguage, loadTime)
      
      // Announce language change to screen readers
      announceLanguageChange(language, newLanguage)
      
      // Update local state immediately so t() reflects new language
      setLanguageState(newLanguage)

      // Navigate to new language URL
      const cleanPathname = removeLocaleFromPathname(pathname)
      const newPath = addLocaleToPathname(cleanPathname, newLanguage)
      
      // Use router.push for client-side navigation
      router.push(newPath)
      
      // End performance measurement
      i18nPerformanceMonitor.endMeasurement(`language-switch-${newLanguage}`)
      
      // Update state will happen via useEffect when pathname changes
    } catch (error) {
      console.error(`Failed to switch to language ${newLanguage}:`, error)
      analytics.trackTranslationError(newLanguage, 'language_switch_failed', error instanceof Error ? error.message : 'Unknown error')
      // Don't change language if loading failed
    } finally {
      setIsLoading(false)
    }
  }

  // Announce language changes to screen readers
  const announceLanguageChange = (fromLanguage: string, toLanguage: string) => {
    const fromLang = getLanguageByCode(fromLanguage)
    const toLang = getLanguageByCode(toLanguage)
    
    // Create announcement in both languages for better accessibility
    const announcement = `Language changed from ${fromLang?.name || fromLanguage} to ${toLang?.name || toLanguage}. ${t('accessibility.languageChanged', { interpolation: { language: toLang?.name || toLanguage } })}`
    
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.setAttribute('class', 'sr-only')
    liveRegion.textContent = announcement
    
    document.body.appendChild(liveRegion)
    
    // Remove the announcement after screen readers have processed it
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }

  // Translation function with enhanced features
  const t = (key: string, options?: TranslationOptions): string => {
    return translationService.getTranslation(key, language, options)
  }

  // Get current language configuration
  const currentLanguage = getLanguageByCode(language)
  const direction = getLanguageDirection(language)
  const locale = language

  // Cultural formatting functions
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return CulturalFormattingService.formatDate(date, locale, options)
  }

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return CulturalFormattingService.formatNumber(number, locale, options)
  }

  const formatCurrency = (amount: number, currency: string): string => {
    return CulturalFormattingService.formatCurrency(amount, currency, locale)
  }

  const contextValue: LanguageContextType = {
    language,
    availableLanguages,
    setLanguage,
    t,
    isLoading,
    direction,
    locale,
    formatDate,
    formatNumber,
    formatCurrency
  }

  // Avoid SSR/CSR text mismatches: render a stable placeholder until mounted and translations are loaded
  if (!isMounted || isLoading) {
    return (
      <LanguageContext.Provider value={contextValue}>
        <div data-i18n-loading />
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
