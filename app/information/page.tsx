"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import {
  Calendar,
  Megaphone,
  BookOpen,
  Newspaper,
  Mic,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react"

export default function InformationPage() {
  const { t } = useLanguage()

  const informationSections = [
    {
      title: t("nav.information.agenda"),
      description: "Stay updated with our upcoming events, workshops, and community gatherings",
      icon: Calendar,
      href: "/information/agenda",
      color: "from-blue-500 to-blue-600",
      stats: "15+ events this month",
    },
    {
      title: t("nav.information.advertising"),
      description: "Access our communication materials and request advertising resources",
      icon: Megaphone,
      href: "/information/advertising",
      color: "from-green-500 to-green-600",
      stats: "250+ partners using our materials",
    },
    {
      title: t("nav.information.resources"),
      description: "Educational materials, tools, and guides for creating positive impact",
      icon: BookOpen,
      href: "/information/resources",
      color: "from-purple-500 to-purple-600",
      stats: "500+ resources available",
    },
    {
      title: t("nav.information.press"),
      description: "Media resources, press releases, and journalist contact information",
      icon: Newspaper,
      href: "/information/press",
      color: "from-orange-500 to-orange-600",
      stats: "Latest press releases",
    },
    {
      title: t("nav.information.podcast"),
      description: "Listen to our impact stories and meet our field teams",
      icon: Mic,
      href: "/information/podcast",
      color: "from-pink-500 to-pink-600",
      stats: "New episodes weekly",
    },
    {
      title: t("nav.information.analysis"),
      description: "In-depth analyses and insights on contemporary humanitarian issues",
      icon: BarChart3,
      href: "/information/analysis",
      color: "from-indigo-500 to-indigo-600",
      stats: "Expert analysis & insights",
    },
    {
      title: t("nav.information.faq"),
      description: "Frequently asked questions about our work, impact, and how to get involved",
      icon: HelpCircle,
      href: "/information/faq",
      color: "from-teal-500 to-teal-600",
      stats: "50+ common questions answered",
    },
  ]

  const featuredContent = [
    {
      title: "Annual Impact Report 2024",
      description: "Comprehensive overview of our achievements and impact across all regions",
      category: "Report",
      readTime: "15 min read",
      href: "/information/resources",
    },
    {
      title: "New Partnership with Local Organizations",
      description: "Expanding our reach through strategic partnerships in East Africa",
      category: "Press Release",
      readTime: "5 min read",
      href: "/information/press",
    },
    {
      title: "Voices of Hope Podcast - Episode 12",
      description: "Interview with community leaders about sustainable development",
      category: "Podcast",
      readTime: "45 min listen",
      href: "/information/podcast",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">{t("information.title")}</h1>
            <p
              className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {t("information.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              {t("information.featured")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredContent.map((content, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {content.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {content.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={content.href} className="flex items-center justify-center">
                      {t("information.readFull")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Information Sections Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {informationSections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    ></div>

                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} mr-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{section.stats}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>

                    <Button asChild className="w-full group-hover:scale-105 transition-transform duration-300">
                      <Link href={section.href} className="flex items-center justify-center">
                        {t("common.learnMore")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Information Hub Impact</h2>
            <p className="text-lg text-gray-600">How our information resources are making a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "50,000+", label: "Monthly Visitors", color: "from-blue-400 to-blue-500" },
              { icon: BookOpen, number: "500+", label: "Resources Available", color: "from-green-400 to-green-500" },
              { icon: TrendingUp, number: "95%", label: "User Satisfaction", color: "from-purple-400 to-purple-500" },
              { icon: Calendar, number: "100+", label: "Events This Year", color: "from-orange-400 to-orange-500" },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("information.newsletter.title")}</h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">{t("information.newsletter.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("information.newsletter.placeholder")}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              {t("information.newsletter.subscribe")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
