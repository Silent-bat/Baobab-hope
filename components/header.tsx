"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelector } from "@/components/language-selector"
import {
  Menu,
  X,
  Search,
  Heart,
  Home,
  Users,
  BookOpen,
  Info,
  HandHeart,
  Phone,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

export function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Navigation data with icons
  const navigation = [
    {
      name: t("nav.home"),
      href: "/",
      icon: Home,
      description: "Discover our mission and impact",
    },
    {
      name: t("nav.about.title"),
      href: "/about",
      icon: Users,
      description: "Learn about our organization",
      dropdown: [
        { name: t("nav.about.history"), href: "/about/history", icon: BookOpen, description: "Our journey and milestones" },
        { name: t("nav.about.missions"), href: "/about/missions", icon: Heart, description: "Core mission areas" },
        { name: t("nav.about.organizations"), href: "/about/organizations", icon: Users, description: "Partner organizations" },
        { name: t("nav.about.regions"), href: "/about/regions", icon: BookOpen, description: "Global presence" },
        { name: t("nav.about.localGroups"), href: "/about/local-groups", icon: Users, description: "Local community groups" },
        { name: t("nav.about.partnerNetworks"), href: "/about/partner-networks", icon: HandHeart, description: "Strategic partnerships" },
        { name: t("nav.about.financialTransparency"), href: "/about/financial-transparency", icon: BookOpen, description: "Financial accountability" },
      ],
    },
    {
      name: t("nav.actions"),
      href: "/projects",
      icon: HandHeart,
      description: "View our active projects",
    },
    {
      name: t("nav.information.title"),
      href: "/information",
      icon: Info,
      description: "Resources and information",
      dropdown: [
        { name: t("nav.information.agenda"), href: "/information/agenda", icon: BookOpen, description: "Upcoming events" },
        { name: t("nav.information.advertising"), href: "/information/advertising", icon: BookOpen, description: "Marketing materials" },
        { name: t("nav.information.resources"), href: "/information/resources", icon: BookOpen, description: "Educational resources" },
        { name: t("nav.information.press"), href: "/information/press", icon: BookOpen, description: "Press releases" },
        { name: t("nav.information.podcast"), href: "/information/podcast", icon: BookOpen, description: "Audio content" },
        { name: t("nav.information.analysis"), href: "/information/analysis", icon: BookOpen, description: "Research and data" },
        { name: t("nav.information.faq"), href: "/information/faq", icon: BookOpen, description: "Frequently asked questions" },
      ],
    },
    {
      name: t("nav.act.title"),
      href: "/act",
      icon: HandHeart,
      description: "Get involved and take action",
      dropdown: [
        { name: t("nav.act.volunteering"), href: "/act/volunteering", icon: Users, description: "Volunteer opportunities" },
        { name: t("nav.act.campaigns"), href: "/act/campaigns", icon: Heart, description: "Active campaigns" },
        { name: t("nav.act.training"), href: "/act/training", icon: BookOpen, description: "Skills development" },
        { name: t("nav.act.jobs"), href: "/act/jobs", icon: Users, description: "Career opportunities" },
        { name: t("nav.act.partners"), href: "/act/partners", icon: HandHeart, description: "Partnership programs" },
        { name: t("nav.act.legacy"), href: "/act/legacy", icon: Heart, description: "Legacy giving" },
        { name: t("nav.act.lifeInsurance"), href: "/act/life-insurance", icon: Heart, description: "Insurance giving" },
        { name: t("nav.act.donation"), href: "/donate", icon: Heart, description: "Make a donation" },
      ],
    },
    {
      name: t("nav.contact"),
      href: "/contact",
      icon: Phone,
      description: "Get in touch with us",
    },
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const localizeHref = (href: string) => {
    const locale = pathname.split('/')[1]
    return `/${locale}${href}`
  }

  const isActivePath = (href: string) => {
    const localizedHref = localizeHref(href)
    return pathname === localizedHref || pathname.startsWith(localizedHref + '/')
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
      {/* Top Bar - Contact Info */}
      <div className="bg-red-600 text-white py-2 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span>📧 info@baobabhope.org</span>
            <span>📞 +1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Follow us on social media</span>
            <div className="flex space-x-2">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">f</span>
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">t</span>
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">i</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white shadow-lg border-b border-gray-200"
          : "bg-white"
          }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-20 lg:h-28">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={localizeHref("/")} className="flex items-center group">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <Image
                      src="/images/newlogo.png"
                      alt="Baobab Hope Logo"
                      width={96}
                      height={96}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label={t('accessibility.navigation')}>
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${isActivePath(item.href)
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                          <span className="text-lg"><item.icon className="w-7 h-7" /></span>
                          <span>{item.name}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 min-w-[320px]"
                        align="start"
                        sideOffset={8}
                      >
                        <div className="px-2 py-1 mb-3">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center space-x-2">
                            <span className="text-lg"><item.icon className="w-7 h-7" /></span>
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
                                <span className="text-lg group-hover:scale-110 transition-transform"><subItem.icon className="w-7 h-7" /></span>
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
                      className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 ${isActivePath(item.href)
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform"><item.icon className="w-7 h-7" /></span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search */}
              <div className="relative" ref={searchContainerRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <Search className="w-7 h-7" />
                </Button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Donate Button */}
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href={localizeHref("/donate")} className="flex items-center space-x-2">
                  <Heart className="w-6 h-6" />
                  <span>Donate</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-10 h-10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[9999] bg-white overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <Link href={localizeHref("/")} className="flex items-center" onClick={closeMenu}>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/newlogo.png"
                      alt="Baobab Hope Logo"
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="w-10 h-10 rounded-xl hover:bg-red-50"
                >
                  <X className="w-8 h-8" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <nav className="space-y-2" role="navigation" aria-label={t('accessibility.navigation')}>
                  {navigation.map((item, index) => (
                    <div key={item.name} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link
                            href={localizeHref(item.href)}
                            onClick={!item.dropdown ? closeMenu : undefined}
                            className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform"><item.icon className="w-8 h-8" /></span>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700 group-hover:text-red-600">{item.name}</span>
                              <span className="text-xs text-gray-500 group-hover:text-red-500">{item.description}</span>
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
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-90" : ""
                                }`}
                            />
                          </Button>
                        )}
                      </div>
                      {item.dropdown && activeDropdown === item.name && (
                        <div className="ml-6 mt-2 space-y-1 bg-gray-50 rounded-xl p-3">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={localizeHref(subItem.href)}
                              onClick={closeMenu}
                              className="flex items-center space-x-3 px-3 py-2.5 hover:bg-white rounded-xl transition-all duration-200 group"
                            >
                              <span className="text-lg group-hover:scale-110 transition-transform"><subItem.icon className="w-8 h-8" /></span>
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
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col space-y-3">
                    <Button
                      asChild
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                    >
                      <Link href={localizeHref("/donate")} onClick={closeMenu} className="flex items-center justify-center space-x-2">
                        <Heart className="w-6 h-6" />
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
                        <Search className="w-6 h-6" />
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