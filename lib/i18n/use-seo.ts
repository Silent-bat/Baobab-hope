'use client'

import { useUrl } from './use-url'
import { useLanguage } from '../../components/language-provider'

export interface SEOData {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noindex?: boolean
}

/**
 * Hook for managing SEO data in components
 */
export function useSEO() {
  const {
    getCanonicalUrlForPage,
    getHreflangLinks,
    getCurrentUrl,
    baseUrl,
    language,
    direction
  } = useUrl()
  const { t } = useLanguage()

  /**
   * Generate meta tags for the current page
   */
  const generateMetaTags = (seoData: SEOData) => {
    const canonicalUrl = getCanonicalUrlForPage()
    const hreflangLinks = getHreflangLinks()
    const currentUrl = getCurrentUrl()

    return {
      canonical: canonicalUrl,
      hreflang: hreflangLinks,
      currentUrl,
      language,
      direction,
      ...seoData
    }
  }

  /**
   * Get localized page title with site name
   */
  const getPageTitle = (pageTitle?: string, includeSiteName = true) => {
    const siteName = t('site.name', { fallback: 'BAOBAB HOPE' })
    const separator = ' | '

    if (!pageTitle) return siteName
    if (!includeSiteName) return pageTitle

    return `${pageTitle}${separator}${siteName}`
  }

  /**
   * Get localized meta description
   */
  const getMetaDescription = (key?: string, fallback?: string) => {
    if (!key) return fallback
    return t(key, { fallback })
  }

  /**
   * Get localized keywords
   */
  const getKeywords = (key?: string, fallback?: string) => {
    if (!key) return fallback
    return t(key, { fallback })
  }

  /**
   * Generate breadcrumb data
   */
  const generateBreadcrumbs = (breadcrumbs: Array<{ nameKey: string; path: string; fallbackName?: string }>) => {
    return breadcrumbs.map(crumb => ({
      name: t(crumb.nameKey, { fallback: crumb.fallbackName || crumb.nameKey }),
      path: crumb.path
    }))
  }

  /**
   * Get social sharing URLs
   */
  const getSocialSharingUrls = (title?: string, description?: string) => {
    const currentUrl = getCurrentUrl()
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedTitle = encodeURIComponent(title || '')
    const encodedDescription = encodeURIComponent(description || '')

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      copy: currentUrl
    }
  }

  /**
   * Generate Open Graph image URL
   */
  const getOGImageUrl = (imagePath?: string) => {
    if (!imagePath) return `${baseUrl}/images/newlogo.png`
    if (imagePath.startsWith('http')) return imagePath
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  }

  return {
    // Core data
    language,
    direction,
    baseUrl,
    canonicalUrl: getCanonicalUrlForPage(),
    currentUrl: getCurrentUrl(),
    hreflangLinks: getHreflangLinks(),

    // Utility functions
    generateMetaTags,
    getPageTitle,
    getMetaDescription,
    getKeywords,
    generateBreadcrumbs,
    getSocialSharingUrls,
    getOGImageUrl,

    // Translation function for convenience
    t
  }
}