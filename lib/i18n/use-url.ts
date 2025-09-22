'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '../../components/language-provider'
import {
  addLocaleToPathname,
  removeLocaleFromPathname,
  generateLocalizedUrls,
  getCanonicalUrl,
  generateHreflangLinks,
  getLanguageDirection
} from './url-utils'

/**
 * Hook for URL utilities in components
 */
export function useUrl() {
  const pathname = usePathname()
  const { language } = useLanguage()
  
  // Get base URL from environment or window
  const getBaseUrl = (): string => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`
    }
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'
  }
  
  const baseUrl = getBaseUrl()
  
  /**
   * Get the current pathname without locale
   */
  const getCleanPathname = (): string => {
    return removeLocaleFromPathname(pathname)
  }
  
  /**
   * Get localized URL for a specific language
   */
  const getLocalizedUrl = (locale: string, path?: string): string => {
    const targetPath = path || getCleanPathname()
    const localizedPath = addLocaleToPathname(targetPath, locale)
    return `${baseUrl}${localizedPath}`
  }
  
  /**
   * Get all localized URLs for the current page
   */
  const getAllLocalizedUrls = (): Record<string, string> => {
    return generateLocalizedUrls(getCleanPathname(), baseUrl)
  }
  
  /**
   * Get canonical URL for the current page
   */
  const getCanonicalUrlForPage = (): string => {
    return getCanonicalUrl(getCleanPathname(), baseUrl)
  }
  
  /**
   * Get hreflang links for the current page
   */
  const getHreflangLinks = (): Array<{ hreflang: string; href: string }> => {
    return generateHreflangLinks(getCleanPathname(), baseUrl)
  }
  
  /**
   * Get current language direction
   */
  const getCurrentDirection = (): 'ltr' | 'rtl' => {
    return getLanguageDirection(language)
  }
  
  /**
   * Navigate to a different language version of the current page
   */
  const switchLanguage = (locale: string): string => {
    return getLocalizedUrl(locale)
  }
  
  /**
   * Check if current page is the default language
   */
  const isDefaultLanguage = (): boolean => {
    return language === 'en'
  }
  
  /**
   * Get current full URL
   */
  const getCurrentUrl = (): string => {
    return getLocalizedUrl(language)
  }
  
  return {
    // Current state
    pathname,
    language,
    baseUrl,
    direction: getCurrentDirection(),
    isDefaultLanguage: isDefaultLanguage(),
    
    // URL utilities
    getCleanPathname,
    getLocalizedUrl,
    getAllLocalizedUrls,
    getCanonicalUrlForPage,
    getHreflangLinks,
    switchLanguage,
    getCurrentUrl,
    
    // For components that need raw access
    generateLocalizedUrls: (path: string) => generateLocalizedUrls(path, baseUrl),
    generateHreflangLinks: (path: string) => generateHreflangLinks(path, baseUrl)
  }
}