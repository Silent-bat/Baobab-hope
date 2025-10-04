"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { LanguageSelector } from "@/components/language-selector"
// RTL support removed for simplicity
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Heart,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { t } = useLanguage()
  // RTL support removed for simplicity
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Navigation data with enhanced structure
  const navigation = [
    {
      name: t("nav.home"),
      href: "/",
      icon: "🏠",
      description: "Discover our mission and impact"
    },
    {
      name: t("nav.about.title"),
      href: "/about",
      icon: "ℹ️",
      description: "Learn about our organization",
      dropdown: [
        { name: t("nav.about.history"), href: "/about/history", icon: "📜", description: "Our journey and milestones" },
        { name: t("nav.about.missions"), href: "/about/missions", icon: "🎯", description: "Core mission areas" },
        { name: t("nav.about.organizations"), href: "/about/organizations", icon: "🏢", description: "Partner organizations" },
        { name: t("nav.about.regions"), href: "/about/regions", icon: "🌍", description: "Global presence" },
        { name: t("nav.about.localGroups"), href: "/about/local-groups", icon: "👥", description: "Local community groups" },
        { name: t("nav.about.partnerNetworks"), href: "/about/partner-networks", icon: "🤝", description: "Strategic partnerships" },
        { name: t("nav.about.financialTransparency"), href: "/about/financial-transparency", icon: "📊", description: "Financial accountability" },
      ]
    },
    {
      name: t("nav.actions"),
      href: "/projects",
      icon: "🚀",
      description: "View our active projects"
    },
    {
      name: t("nav.information.title"),
      href: "/information",
      icon: "📚",
      description: "Resources and information",
      dropdown: [
        { name: t("nav.information.agenda"), href: "/information/agenda", icon: "📅", description: "Upcoming events" },
        { name: t("nav.information.advertising"), href: "/information/advertising", icon: "📢", description: "Marketing materials" },
        { name: t("nav.information.resources"), href: "/information/resources", icon: "📖", description: "Educational resources" },
        { name: t("nav.information.press"), href: "/information/press", icon: "📰", description: "Press releases" },
        { name: t("nav.information.podcast"), href: "/information/podcast", icon: "🎧", description: "Audio content" },
        { name: t("nav.information.analysis"), href: "/information/analysis", icon: "📈", description: "Research and data" },
        { name: t("nav.information.faq"), href: "/information/faq", icon: "❓", description: "Frequently asked questions" },
      ]
    },
    {
      name: t("nav.act.title"),
      href: "/act",
      icon: "💪",
      description: "Get involved and take action",
      dropdown: [
        { name: t("nav.act.volunteering"), href: "/act/volunteering", icon: "🤝", description: "Volunteer opportunities" },
        { name: t("nav.act.campaigns"), href: "/act/campaigns", icon: "📢", description: "Active campaigns" },
        { name: t("nav.act.training"), href: "/act/training", icon: "🎓", description: "Skills development" },
        { name: t("nav.act.jobs"), href: "/act/jobs", icon: "💼", description: "Career opportunities" },
        { name: t("nav.act.partners"), href: "/act/partners", icon: "🤝", description: "Partnership programs" },
        { name: t("nav.act.legacy"), href: "/act/legacy", icon: "🏛️", description: "Legacy giving" },
        { name: t("nav.act.lifeInsurance"), href: "/act/life-insurance", icon: "🛡️", description: "Insurance giving" },
        { name: t("nav.act.donation"), href: "/donate", icon: "❤️", description: "Make a donation" },
      ]
    },
    {
      name: t("nav.contact"),
      href: "/contact",
      icon: "📞",
      description: "Get in touch with us"
    }
  ]

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const localizeHref = (href: string) => {
    const currentLang = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en"
    return href === "/" ? `/${currentLang}` : `/${currentLang}${href}`
  }

  const isActivePath = (path: string) => {
    if (typeof window === "undefined") return false
    const currentPath = window.location.pathname
    const localizedPath = localizeHref(path)
    return currentPath === localizedPath || currentPath.startsWith(localizedPath + "/")
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <>
      {/* Top Bar */}
      <div className={`hidden lg:block transition-all duration-300 ${
        isScrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'
      } overflow-hidden`}>
        <div className="bg-red-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@baobabhope.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Global Impact</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Facebook className="w-4 h-4 hover:text-red-200 cursor-pointer transition-colors" />
                  <Twitter className="w-4 h-4 hover:text-red-200 cursor-pointer transition-colors" />
                  <Instagram className="w-4 h-4 hover:text-red-200 cursor-pointer transition-colors" />
                  <Linkedin className="w-4 h-4 hover:text-red-200 cursor-pointer transition-colors" />
                </div>
                <div className="w-px h-4 bg-red-400"></div>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-white/90 backdrop-blur-md"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={localizeHref("/")} className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    BAOBAB HOPE
                  </span>
                  <span className="text-xs lg:text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                    One Heart, One Hand
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label={t('accessibility.navigation')}>
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`group flex items-center space-x-2 px-3 lg:px-4 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${
                            isActivePath(item.href) 
                              ? 'text-red-600 bg-red-50' 
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <span className="text-base lg:text-lg">{item.icon}</span>
                          <span className="hidden lg:inline">{item.name}</span>
                          <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 min-w-[320px]"
                        align="start"
                        sideOffset={8}
                      >
                        <div className="px-2 py-1 mb-3">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center space-x-2">
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </h3>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                        <div className="space-y-1">
                          {item.dropdown.map((subItem) => (
                            <DropdownMenuItem key={subItem.name} asChild>
                              <Link
                                href={localizeHref(subItem.href)}
                                onClick={handleNavClick}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium group"
                              >
                                <span className="text-lg group-hover:scale-110 transition-transform">{subItem.icon}</span>
                                <div className="flex flex-col">
                                  <span className="font-medium">{subItem.name}</span>
                                  <span className="text-xs text-gray-500 group-hover:text-red-500">{subItem.description}</span>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={localizeHref(item.href)}
                      onClick={handleNavClick}
                      className={`group flex items-center space-x-2 px-3 lg:px-4 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${
                        isActivePath(item.href) 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-base lg:text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {/* Search */}
              <div className="relative" ref={searchContainerRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-12 w-72 lg:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Donate Button */}
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-4 lg:px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs lg:text-sm"
              >
                <Link href={localizeHref("/donate")} className="flex items-center space-x-1 lg:space-x-2">
                  <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Donate</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <Link href={localizeHref("/")} className="flex items-center space-x-3" onClick={closeMenu}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">BAOBAB HOPE</span>
                    <span className="text-xs sm:text-sm text-gray-600">One Heart, One Hand</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl hover:bg-red-50"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <nav className="space-y-1" role="navigation" aria-label={t('accessibility.navigation')}>
                  {navigation.map((item, index) => (
                    <div key={item.name} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link
                            href={localizeHref(item.href)}
                            onClick={!item.dropdown ? closeMenu : undefined}
                            className="flex items-center space-x-3 px-3 py-3 sm:py-4 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                          >
                            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700 group-hover:text-red-600 text-sm sm:text-base">{item.name}</span>
                              <span className="text-xs sm:text-sm text-gray-500 group-hover:text-red-500">{item.description}</span>
                            </div>
                          </Link>
                        </div>
                        {item.dropdown && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDropdownToggle(item.name)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            aria-label={`${t("common.open")} ${item.name}`}
                            aria-expanded={activeDropdown === item.name}
                          >
                            <ChevronDown
                              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                                activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        )}
                      </div>
                      {item.dropdown && activeDropdown === item.name && (
                        <div className="ml-6 mt-2 space-y-1 bg-gray-50 rounded-xl p-3 animate-in slide-in-from-top-1 duration-200">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={localizeHref(subItem.href)}
                              onClick={closeMenu}
                              className="flex items-center space-x-3 px-3 py-2.5 hover:bg-white rounded-xl transition-all duration-200 group"
                            >
                              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">{subItem.icon}</span>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">{subItem.name}</span>
                                <span className="text-xs text-gray-500 group-hover:text-red-500">{subItem.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    <Button
                      asChild
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:scale-105 transition-all duration-200"
                    >
                      <Link href={localizeHref("/donate")} onClick={closeMenu} className="flex items-center justify-center space-x-2">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Donate Now</span>
                      </Link>
                    </Button>
                    <div className="flex items-center justify-center space-x-4">
                      <LanguageSelector />
                    </div>
                    {/* Mobile Search */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-xl border-gray-200 hover:bg-red-50 hover:border-red-200"
                      >
                        <Search className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}