"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { addLocaleToPathname, removeLocaleFromPathname, isSupportedLocale } from "@/lib/i18n/url-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, X, Search, Globe, Heart, ChevronDown, ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LanguageSelector } from "@/components/language-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRTLStyles } from "@/lib/rtl-utils"
import { useAccessibility } from "@/hooks/use-accessibility"

interface SearchResult {
  title: string
  description: string
  url: string
  category: string
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { language, setLanguage, t, direction } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const rtlStyles = useRTLStyles(language)
  const { announceToScreenReader } = useAccessibility()
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const localizeHref = useCallback((href: string) => {
    try {
      // Ensure leading slash
      const path = href.startsWith('/') ? href : `/${href}`
      // Avoid double locale
      const clean = removeLocaleFromPathname(path)
      return addLocaleToPathname(clean, language)
    } catch {
      return href
    }
  }, [language])

  const isActivePath = useCallback((href: string) => {
    try {
      const current = removeLocaleFromPathname(pathname || "/")
      const target = removeLocaleFromPathname(href.startsWith('/') ? href : `/${href}`)
      return current === target || current.startsWith(`${target}/`)
    } catch {
      return false
    }
  }, [pathname])

  // Mock search data
  const searchData: SearchResult[] = [
    {
      title: "Education & Literacy Programs",
      description: "Building educational foundations that empower communities to thrive",
      url: "/projects",
      category: "Projects",
    },
    {
      title: "Healthcare Access Initiative",
      description: "Providing essential healthcare services to underserved communities",
      url: "/projects",
      category: "Projects",
    },
    {
      title: "Environmental Conservation",
      description: "Protecting ecosystems while teaching sustainable practices",
      url: "/projects",
      category: "Projects",
    },
    {
      title: "Clean Water Access",
      description: "Building sustainable water systems for communities",
      url: "/projects",
      category: "Projects",
    },
    {
      title: "Volunteer Opportunities",
      description: "Join our global community of volunteers making a difference",
      url: "/act/volunteering",
      category: "Get Involved",
    },
    {
      title: "Training & Development",
      description: "Build your skills in sustainable development",
      url: "/act/training",
      category: "Get Involved",
    },
    {
      title: "Job Opportunities",
      description: "Join our team and make a career out of making a difference",
      url: "/act/jobs",
      category: "Get Involved",
    },
    {
      title: "Partnership Opportunities",
      description: "Partner with us to amplify your impact",
      url: "/act/partners",
      category: "Get Involved",
    },
    {
      title: "Our History",
      description: "The journey of BAOBAB HOPE from idea to global movement",
      url: "/about/history",
      category: "About",
    },
    {
      title: "Our Missions",
      description: "Comprehensive mission areas that drive our global impact",
      url: "/about/missions",
      category: "About",
    },
    {
      title: "Financial Transparency",
      description: "Complete transparency in how we use donations",
      url: "/about/financial-transparency",
      category: "About",
    },
    {
      title: "Press Area",
      description: "Media resources and press releases for journalists",
      url: "/information/press",
      category: "Information",
    },
    {
      title: "Resources",
      description: "Educational materials and tools for communities",
      url: "/information/resources",
      category: "Information",
    },
    {
      title: "FAQ",
      description: "Answers to common questions about our work",
      url: "/information/faq",
      category: "Information",
    },
  ]

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10
    setIsScrolled(scrolled)
  }, [])

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 1024
    setIsMobile(mobile)
    if (window.innerWidth >= 1024) {
      setIsMenuOpen(false)
      setActiveDropdown(null)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })
    handleResize() // Set initial state
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [handleScroll, handleResize])

  // Close desktop search on outside click and Escape
  useEffect(() => {
    if (!isSearchOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSearchOpen])

  // Search functionality
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const results = searchData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 6) // Limit to 6 results

    setSearchResults(results)
    setIsSearching(false)
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, performSearch])

  const navigation = useMemo(() => [
    {
      name: t("nav.home"),
      href: "/",
    },
    {
      name: t("nav.about.title"),
      href: "/about",
      dropdown: [
        { name: t("nav.about.history"), href: "/about/history" },
        { name: t("nav.about.missions"), href: "/about/missions" },
        { name: t("nav.about.organizations"), href: "/about/organizations" },
        { name: t("nav.about.regions"), href: "/about/regions" },
        { name: t("nav.about.localGroups"), href: "/about/local-groups" },
        { name: t("nav.about.partnerNetworks"), href: "/about/partner-networks" },
        { name: t("nav.about.financialTransparency"), href: "/about/financial-transparency" },
      ],
    },
    {
      name: t("nav.actions"),
      href: "/projects",
    },
    {
      name: t("nav.information.title"),
      href: "/information",
      dropdown: [
        { name: t("nav.information.agenda"), href: "/information/agenda" },
        { name: t("nav.information.advertising"), href: "/information/advertising" },
        { name: t("nav.information.resources"), href: "/information/resources" },
        { name: t("nav.information.press"), href: "/information/press" },
        { name: t("nav.information.podcast"), href: "/information/podcast" },
        { name: t("nav.information.analysis"), href: "/information/analysis" },
        { name: t("nav.information.faq"), href: "/information/faq" },
      ],
    },
    {
      name: t("nav.act.title"),
      href: "/act",
      dropdown: [
        { name: t("nav.act.volunteering"), href: "/act/volunteering" },
        { name: t("nav.act.campaigns"), href: "/act/campaigns" },
        { name: t("nav.act.training"), href: "/act/training" },
        { name: t("nav.act.jobs"), href: "/act/jobs" },
        { name: t("nav.act.partners"), href: "/act/partners" },
        { name: t("nav.act.legacy"), href: "/act/legacy" },
        { name: t("nav.act.lifeInsurance"), href: "/act/life-insurance" },
        { name: t("nav.act.donation"), href: "/donate" },
      ],
    },
    {
      name: t("nav.contact"),
      href: "/contact",
    },
  ], [t])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }, [])

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchResults.length > 0) {
      router.push(localizeHref(searchResults[0].url))
      closeSearch()
      closeMenu()
    }
  }

  const handleSearchResultClick = (url: string) => {
    router.push(localizeHref(url))
    closeSearch()
    closeMenu()
  }

  const handleNavClick = () => {
    closeMenu()
    closeSearch()
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between h-16 sm:h-20 flex-nowrap">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="group flex items-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-1 space-x-2 sm:space-x-3 lg:space-x-4"
                aria-label="BAOBAB HOPE"
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent font-poppins leading-tight truncate">
                    BAOBAB HOPE
                  </h1>
                </div>
              </Link>
            </div>
            {/* Placeholder for navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Mobile menu button placeholder */}
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100" : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <div className={`flex items-center flex-shrink-0 ${rtlStyles.isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href={localizeHref('/')}
                onClick={handleNavClick}
                className={`group flex items-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-1 ${rtlStyles.isRTL ? 'space-x-reverse space-x-2 sm:space-x-3 lg:space-x-4' : 'space-x-2 sm:space-x-3 lg:space-x-4'}`}
                aria-label={`${t("nav.home")} - BAOBAB HOPE`}
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="absolute inset-0 bg-red-500 rounded-lg sm:rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300 -z-10"></div>
                </div>

                <div className="flex flex-col min-w-0">
                  <h1 className="text-sm sm:text-lg lg:text-xl xl:text-xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent font-poppins leading-tight group-hover:from-red-700 group-hover:via-red-800 group-hover:to-red-900 transition-all duration-300 truncate">
                    BAOBAB HOPE
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-sm text-red-600/80 font-medium tracking-wider font-poppins group-hover:text-red-700 transition-colors duration-300 hidden sm:block truncate">
                    {t("slogan.main")}
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav 
              id="main-navigation"
              className={`hidden lg:flex items-center flex-1 justify-center mx-8 ${rtlStyles.isRTL ? 'space-x-reverse space-x-2 xl:space-x-3' : 'space-x-2 xl:space-x-3'}`} 
              role="navigation"
              aria-label={t('accessibility.navigation')}
            >
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`relative group px-2 xl:px-3 py-2 font-medium text-sm xl:text-base transition-all duration-300 rounded-xl hover:bg-red-50 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            isScrolled
                              ? `${isActivePath(item.href) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`
                              : `${isActivePath(item.href) ? 'text-red-200' : 'text-white hover:text-red-200'}`
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                          <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 group-hover:rotate-180 ${rtlStyles.isRTL ? 'rtl-flip' : ''}`} />
                          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${isActivePath(item.href) ? 'w-8' : 'w-0 group-hover:w-8'} h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300`}></div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-2 min-w-[240px] xl:min-w-[260px]"
                        align={rtlStyles.isRTL ? "end" : "start"}
                        sideOffset={8}
                      >
                        {item.dropdown.map((subItem) => (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link
                              href={localizeHref(subItem.href)}
                              onClick={handleNavClick}
                              className="flex items-center px-4 py-3 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer transition-colors duration-200 text-sm xl:text-base font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={localizeHref(item.href)}
                      onClick={handleNavClick}
                      className={`relative group px-2 xl:px-3 py-2 font-medium text-sm xl:text-base transition-all duration-300 rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        isScrolled
                          ? `${isActivePath(item.href) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`
                          : `${isActivePath(item.href) ? 'text-red-200' : 'text-white hover:text-red-200'}`
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${isActivePath(item.href) ? 'w-8' : 'w-0 group-hover:w-8'} h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300`}></div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className={`hidden lg:flex items-center flex-shrink-0 ${rtlStyles.isRTL ? 'space-x-reverse space-x-2 xl:space-x-3' : 'space-x-2 xl:space-x-3'}`}>
              {/* Search Toggle */}
              <div className="relative" ref={searchContainerRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`p-2 xl:p-3 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    isScrolled ? "hover:bg-red-50 hover:text-red-600 text-gray-700" : "hover:bg-white/20 text-white"
                  }`}
                  aria-label={t("common.search")}
                  aria-expanded={isSearchOpen}
                >
                  <Search className="w-4 h-4 xl:w-5 xl:h-5" />
                </Button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className={`absolute top-full mt-2 w-72 xl:w-80 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-4 z-50 ${rtlStyles.isRTL ? 'left-0' : 'right-0'}`}>
                    <form onSubmit={handleSearchSubmit} className="space-y-3">
                      <div className="relative">
                        <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${rtlStyles.isRTL ? 'right-3' : 'left-3'}`} />
                        <Input
                          type="text"
                          placeholder={t("nav.search")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full py-3 bg-gray-50 border-0 rounded-lg text-base focus:ring-2 focus:ring-red-500 ${rtlStyles.isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                          autoFocus
                          dir={direction}
                        />
                      </div>

                      {/* Search Results */}
                      {searchQuery && (
                        <div className="max-h-64 overflow-y-auto">
                          {isSearching ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                              <span className="ml-2 text-sm text-gray-600">{t("common.loading")}</span>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                              </p>
                              {searchResults.map((result, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSearchResultClick(result.url)}
                                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <div className={`flex items-start justify-between ${rtlStyles.isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium text-gray-900 truncate ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>{result.title}</p>
                                      <p className={`text-xs text-gray-600 mt-1 line-clamp-2 ${rtlStyles.isRTL ? 'text-right' : 'text-left'}`}>{result.description}</p>
                                    </div>
                                    <span className={`text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full ${rtlStyles.isRTL ? 'mr-2' : 'ml-2'}`}>
                                      {result.category}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : searchQuery.length > 2 ? (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-600">No results found</p>
                              <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className={`${isScrolled ? "[&_button]:text-gray-700 [&_button]:hover:text-red-600 [&_button]:hover:bg-red-50" : "[&_button]:text-white [&_button]:hover:text-red-200 [&_button]:hover:bg-white/20"}`}>
                <LanguageSelector />
              </div>

              {/* Donate Button */}
              <Button
                asChild
                className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2.5 xl:px-6 xl:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Link href={localizeHref('/donate')} onClick={handleNavClick} className={`flex items-center relative z-10 ${rtlStyles.isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm xl:text-base whitespace-nowrap">{t("nav.donate")}</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-transform duration-1000 ${rtlStyles.isRTL ? 'translate-x-full group-hover:-translate-x-full' : '-translate-x-full group-hover:translate-x-full'}`}></div>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-3 transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isScrolled ? "hover:bg-red-50 text-gray-700" : "hover:bg-white/20 text-white"
                }`}
                aria-label={t("common.menu")}
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-6 relative">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      isMenuOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute inset-x-0 top-full bg-white shadow-lg border-t border-gray-200 z-50 transition-all duration-300 ${
              isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="px-4 py-6">
                {/* Mobile Navigation */}
                <nav 
                  className="space-y-2 mb-6" 
                  role="navigation"
                  aria-label={t('accessibility.navigation')}
                >
                  {navigation.map((item, index) => (
                    <div key={item.name} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                      <div className="flex items-center justify-between">
                        <Link
                          href={localizeHref(item.href)}
                          onClick={!item.dropdown ? closeMenu : undefined}
                          className="flex-1 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200 text-left"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDropdownToggle(item.name)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            aria-label={`${t("common.open")} ${item.name}`}
                            aria-expanded={activeDropdown === item.name}
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === item.name ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                        )}
                      </div>
                      {item.dropdown && activeDropdown === item.name && (
                        <div className="ml-4 mt-2 space-y-1 bg-gray-50 rounded-lg p-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={localizeHref(subItem.href)}
                              onClick={closeMenu}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-white rounded-md transition-all duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Search */}
                <div className="mb-6">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${rtlStyles.isRTL ? 'right-4' : 'left-4'}`} />
                    <Input
                      type="text"
                      placeholder={t("nav.search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 ${rtlStyles.isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                      dir={direction}
                    />
                  </form>

                  {/* Mobile Search Results */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchResultClick(result.url)}
                          className="w-full p-3 hover:bg-white transition-colors duration-200 border-b border-gray-200 last:border-b-0 text-left"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.description}</p>
                            </div>
                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full ml-2">
                              {result.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Language Selector */}
                <div className="mb-6 px-4">
                  <div className="flex items-center justify-between py-3 border-t border-gray-200 pt-4">
                    <span className="text-sm font-medium text-gray-700">Language</span>
                    <LanguageSelector />
                  </div>
                </div>

                {/* Mobile Donate Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <Link href={localizeHref('/donate')} onClick={closeMenu} className="flex items-center justify-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>{t("nav.donate")}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search/Menu overlay for mobile */}
      {(isSearchOpen || isMenuOpen) && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setIsSearchOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
