"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [currentYear, setCurrentYear] = useState(2024) // Default fallback year

  // Set current year on client side to prevent hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  const quickLinks = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.about.title"), href: "/about" },
    { title: t("nav.actions"), href: "/projects" },
    { title: t("nav.information.title"), href: "/information" },
    { title: t("nav.act.title"), href: "/act" },
    { title: t("nav.contact"), href: "/contact" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/baobabhope", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/baobabhope", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/baobabhope", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/baobabhope", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Mission */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/images/newlogo.png" alt="BAOBAB HOPE" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold text-red-400">BAOBAB HOPE</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">{t("footer.mission")}</p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">{t("footer.links")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {t("footer.email")}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-400 flex-shrink-0" />
                <a
                  href={`tel:${t("footer.phone")}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {t("footer.phone")}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">{t("footer.address")}</span>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">{t("footer.newsletter.title")}</h3>
            <p className="text-gray-300 mb-4 text-sm">{t("footer.newsletter.subtitle")}</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-400"
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-300">
                <Heart className="h-4 w-4 mr-2" />
                {t("footer.newsletter.subscribe")}
              </Button>
            </form>
            {isSubscribed && <p className="text-green-400 text-sm mt-2">{t("footer.newsletter.success")}</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} BAOBAB HOPE. {t("footer.rights")}
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">{t("slogan.main")}</span>
              <Heart className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
