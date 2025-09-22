import { NextResponse } from 'next/server'
import { 
  generateMultilingualSitemap, 
  generateSitemapXML, 
  getDefaultRoutes,
  type SitemapConfig 
} from '@/lib/i18n/sitemap-generator'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'
    
    // Get all routes including dynamic ones
    const routes = [
      ...getDefaultRoutes(),
      // Add dynamic routes that might exist
      {
        path: '/projects/[id]',
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        // You would typically fetch these from your CMS/database
        dynamicPaths: [] // e.g., ['/projects/education', '/projects/healthcare']
      },
      {
        path: '/blog/[id]',
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        dynamicPaths: [] // e.g., ['/blog/latest-news', '/blog/impact-story']
      }
    ]

    const config: SitemapConfig = {
      baseUrl,
      defaultLanguage: 'en',
      routes: routes.flatMap(route => {
        if ('dynamicPaths' in route && route.dynamicPaths) {
          // Expand dynamic routes
          return route.dynamicPaths.map(path => ({
            path,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
            excludeFromLanguages: route.excludeFromLanguages
          }))
        }
        return [route]
      })
    }

    // Generate multilingual sitemap entries
    const sitemapEntries = generateMultilingualSitemap(config)
    
    // Generate XML content
    const xmlContent = generateSitemapXML(sitemapEntries)

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Don't index the sitemap itself
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}

// Also handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}