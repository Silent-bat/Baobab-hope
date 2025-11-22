import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { headers } from "next/headers"
import { LanguageProvider } from "@/components/language-provider"
import { RTLProvider } from "@/components/rtl-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/seo/structured-data"
import { generateMetadataFromHeaders } from "@/lib/i18n/metadata-generator"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
})

// Generate metadata dynamically based on language
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataFromHeaders({
    title: "BAOBAB HOPE - One Heart, One Hand | Empowering Communities",
    description: "BAOBAB HOPE - Un Coeur, Une Main. A non-profit organization dedicated to sustainable development, education, and community empowerment across Africa and beyond.",
    keywords: "charity, non-profit, Africa, education, sustainable development, community empowerment, donations, baobab hope, one heart one hand",
    ogImage: "/images/newlogo.png",

  })
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get language and direction from headers
  const headersList = await headers()
  const language = headersList.get('x-locale') || 'en'
  const pathname = headersList.get('x-pathname') || '/'

  // Import language utilities
  const { getLanguageDirection } = await import('@/lib/i18n/url-utils')
  const direction = getLanguageDirection(language)

  return (
    <html lang={language} dir={direction} className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <OrganizationStructuredData baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'} />
        <WebsiteStructuredData baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider initialLanguage={language}>
          <RTLProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main id="main-content" className="flex-1" role="main" aria-label="Main content" data-content-section>
                {children}
              </main>
              <Footer />
              <BackToTop />
            </div>
          </RTLProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
