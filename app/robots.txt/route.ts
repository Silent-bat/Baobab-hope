import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'
  
  const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and internal paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow all language versions
Allow: /en/
Allow: /fr/
Allow: /es/
Allow: /ar/
Allow: /zh/
Allow: /ru/
Allow: /pt/
Allow: /de/
Allow: /ja/
Allow: /hi/
Allow: /it/
Allow: /nl/
Allow: /ko/
Allow: /tr/
Allow: /pl/
Allow: /uk/
Allow: /vi/
Allow: /th/
Allow: /id/
Allow: /ms/
Allow: /sw/
Allow: /am/
Allow: /yo/
Allow: /ha/
Allow: /bn/
Allow: /ur/
Allow: /fa/
Allow: /he/

# Crawl-delay for respectful crawling
Crawl-delay: 1`

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  })
}