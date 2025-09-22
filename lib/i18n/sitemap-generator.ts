import { SUPPORTED_LANGUAGES } from './languages'
import { generateSitemapAlternates } from './url-utils'

export interface SitemapEntry {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: Array<{
    lang: string
    url: string
  }>
}

export interface SitemapConfig {
  baseUrl: string
  defaultLanguage: string
  routes: Array<{
    path: string
    lastModified?: Date
    changeFrequency?: SitemapEntry['changeFrequency']
    priority?: number
    excludeFromLanguages?: string[]
  }>
}

/**
 * Generate multilingual sitemap entries
 */
export function generateMultilingualSitemap(config: SitemapConfig): SitemapEntry[] {
  const { baseUrl, defaultLanguage, routes } = config
  const enabledLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.enabled)
  const sitemapEntries: SitemapEntry[] = []

  routes.forEach(route => {
    const { path, lastModified, changeFrequency, priority, excludeFromLanguages = [] } = route

    // Generate entries for each language
    enabledLanguages.forEach(language => {
      // Skip if language is excluded for this route
      if (excludeFromLanguages.includes(language.code)) {
        return
      }

      const localizedPath = path === '/' ? `/${language.code}` : `/${language.code}${path}`
      const url = `${baseUrl}${localizedPath}`

      // Generate alternates for this route
      const alternates = generateSitemapAlternates(path, baseUrl)
        .filter(alt => !excludeFromLanguages.includes(alt.lang))

      sitemapEntries.push({
        url,
        lastModified: lastModified || new Date(),
        changeFrequency: changeFrequency || 'weekly',
        priority: priority || (language.code === defaultLanguage ? 1.0 : 0.8),
        alternates
      })
    })
  })

  return sitemapEntries
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const sitemapOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  const sitemapClose = '</urlset>'

  const urlEntries = entries.map(entry => {
    const { url, lastModified, changeFrequency, priority, alternates } = entry

    let urlXml = '  <url>\n'
    urlXml += `    <loc>${escapeXml(url)}</loc>\n`
    
    if (lastModified) {
      urlXml += `    <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>\n`
    }
    
    if (changeFrequency) {
      urlXml += `    <changefreq>${changeFrequency}</changefreq>\n`
    }
    
    if (priority !== undefined) {
      urlXml += `    <priority>${priority.toFixed(1)}</priority>\n`
    }

    // Add hreflang alternates
    if (alternates && alternates.length > 0) {
      alternates.forEach(alternate => {
        urlXml += `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(alternate.url)}" />\n`
      })
    }

    urlXml += '  </url>\n'
    return urlXml
  }).join('')

  return `${xmlHeader}\n${sitemapOpen}\n${urlEntries}${sitemapClose}`
}

/**
 * Generate sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(sitemaps: Array<{
  url: string
  lastModified?: Date
}>): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const indexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const indexClose = '</sitemapindex>'

  const sitemapEntries = sitemaps.map(sitemap => {
    let entry = '  <sitemap>\n'
    entry += `    <loc>${escapeXml(sitemap.url)}</loc>\n`
    
    if (sitemap.lastModified) {
      entry += `    <lastmod>${sitemap.lastModified.toISOString()}</lastmod>\n`
    }
    
    entry += '  </sitemap>\n'
    return entry
  }).join('')

  return `${xmlHeader}\n${indexOpen}\n${sitemapEntries}${indexClose}`
}

/**
 * Get default routes for BAOBAB HOPE website
 */
export function getDefaultRoutes(): SitemapConfig['routes'] {
  return [
    {
      path: '/',
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      path: '/about',
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      path: '/projects',
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      path: '/act',
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      path: '/act/campaigns',
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      path: '/act/jobs',
      changeFrequency: 'daily',
      priority: 0.7
    },
    {
      path: '/act/volunteering',
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      path: '/act/training',
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      path: '/act/partners',
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      path: '/act/life-insurance',
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      path: '/act/legacy',
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      path: '/information',
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      path: '/information/analysis',
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      path: '/information/faq',
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      path: '/information/podcast',
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      path: '/information/resources',
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      path: '/information/press',
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      path: '/information/advertising',
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      path: '/information/agenda',
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      path: '/blog',
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      path: '/contact',
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      path: '/donate',
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ]
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}