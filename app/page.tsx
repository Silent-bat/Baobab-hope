"use client"

import { HeroCarousel } from "@/components/hero-carousel"
import { AnimatedCounter } from "@/components/animated-counter"
import { BackToTop } from "@/components/back-to-top"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe, Award, ArrowRight, BookOpen, Stethoscope, Droplets } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  const impactStats = [
    {
      icon: Users,
      number: 75000,
      label: t("home.impact.people"),
      color: "from-red-400 to-red-500",
    },
    {
      icon: Globe,
      number: 42,
      label: t("home.impact.projects"),
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: Heart,
      number: 18,
      label: t("home.impact.countries"),
      color: "from-green-400 to-green-500",
    },
    {
      icon: Award,
      number: 850,
      label: t("home.impact.volunteers"),
      color: "from-purple-400 to-purple-500",
    },
  ]

  const impactStories = [
    {
      title: "Clean Water Transforms Village Life",
      description: "How a new well system brought hope and health to 500 families in rural Mali",
      image: "/images/impact/impact-community.jpg",
      category: "Water Access",
      readTime: "5 min read",
      href: "/blog/clean-water-mali",
    },
    {
      title: "Education Opens New Doors",
      description: "Meet Amina, whose literacy program participation led to starting her own business",
      image: "/images/impact/impact-education.jpg",
      category: "Education",
      readTime: "7 min read",
      href: "/blog/amina-success-story",
    },
    {
      title: "Healthcare Reaches Remote Communities",
      description: "Mobile clinics bring essential medical care to previously unreachable areas",
      image: "/images/impact/impact-healthcare.jpg",
      category: "Healthcare",
      readTime: "6 min read",
      href: "/blog/mobile-healthcare",
    },
  ]

  const focusAreas = [
    {
      icon: BookOpen,
      title: t("projects.education.title"),
      description: t("projects.education.description"),
      color: "from-blue-500 to-blue-600",
      href: "/projects#education",
    },
    {
      icon: Stethoscope,
      title: t("projects.healthcare.title"),
      description: t("projects.healthcare.description"),
      color: "from-green-500 to-green-600",
      href: "/projects#healthcare",
    },
    {
      icon: Droplets,
      title: t("projects.water.title"),
      description: t("projects.water.description"),
      color: "from-cyan-500 to-cyan-600",
      href: "/projects#water",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Impact Statistics */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("home.impact.title")}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-6 lg:p-8">
                    <div className={`inline-flex p-3 lg:p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 lg:mb-6`}>
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      <AnimatedCounter end={stat.number} duration={2000} />
                      {stat.number > 1000 ? "+" : ""}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              Our Focus Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work across multiple interconnected areas to create comprehensive, sustainable change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden"
                >
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${area.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    ></div>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${area.color} mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{area.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="group-hover:bg-red-50 group-hover:border-red-200 bg-transparent"
                    >
                      <Link href={area.href} className="flex items-center">
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

      {/* Impact Stories */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("home.stories.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("home.stories.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStories.map((story, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={story.image || "/images/impact/impact-community.jpg"}
                    alt={story.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/images/impact/impact-community.jpg"
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {story.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{story.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{story.readTime}</span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={story.href}>{t("blog.readMore")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-poppins">{t("home.cta.title")}</h2>
          <p className="text-xl mb-8 text-red-100 leading-relaxed">{t("home.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/donate" className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                {t("home.hero.donate")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-red-300 text-red-300 hover:bg-red-300 hover:text-red-800 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/about/history" className="flex items-center">
                {t("home.cta.learn")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  )
}
