"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Calendar, Users, Globe, Heart, ArrowRight, Award, Target, Lightbulb } from "lucide-react"

export default function HistoryPage() {
  const { t } = useLanguage()

  const milestones = [
    {
      year: "2020",
      event: t("history.timeline.milestones.2020.event"),
      description: t("history.timeline.milestones.2020.description"),
      icon: Lightbulb,
      color: "from-blue-400 to-blue-500",
    },
    {
      year: "2021",
      event: t("history.timeline.milestones.2021.event"),
      description: t("history.timeline.milestones.2021.description"),
      icon: Award,
      color: "from-green-400 to-green-500",
    },
    {
      year: "2022",
      event: t("history.timeline.milestones.2022.event"),
      description: t("history.timeline.milestones.2022.description"),
      icon: Globe,
      color: "from-emerald-400 to-emerald-500",
    },
    {
      year: "2023",
      event: t("history.timeline.milestones.2023.event"),
      description: t("history.timeline.milestones.2023.description"),
      icon: Heart,
      color: "from-red-400 to-red-500",
    },
    {
      year: "2024",
      event: t("history.timeline.milestones.2024.event"),
      description: t("history.timeline.milestones.2024.description"),
      icon: Target,
      color: "from-purple-400 to-purple-500",
    },
  ]

  const stats = [
    { label: t("history.impact.stats.livesTransformed"), value: 75000, icon: Users, suffix: "+", color: "from-red-400 to-red-500" },
    { label: t("history.impact.stats.countriesReached"), value: 18, icon: Globe, color: "from-blue-400 to-blue-500" },
    { label: t("history.impact.stats.activeProjects"), value: 42, icon: Heart, color: "from-green-400 to-green-500" },
    { label: t("history.impact.stats.volunteers"), value: 850, icon: Calendar, suffix: "+", color: "from-purple-400 to-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full animate-float filter blur-xl"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full animate-float filter blur-xl"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>{t("history.hero.badge")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-poppins">{t("history.title")}</h1>
            <p className="text-xl sm:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              {t("history.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>{t("history.founding.subtitle")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                {t("history.founding.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t("history.founding.description1")}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t("history.founding.description2")}
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/about" className="flex items-center space-x-2">
                  <span>{t("history.founding.learnMission")}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/heroes/hero-about.jpg"
                alt="BAOBAB HOPE founding story"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>{t("history.timeline.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("history.timeline.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("history.timeline.subtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? "lg:pr-8" : "lg:pl-8"}`}>
                      <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${milestone.color}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-red-600">{milestone.year}</div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.event}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden lg:flex w-2/12 justify-center">
                      <div className="w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                    </div>

                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-poppins">{t("history.impact.title")}</h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              {t("history.impact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-md border-0 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-6 lg:p-8">
                    <div className={`inline-flex p-3 lg:p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 lg:mb-6`}>
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-2">
                      {stat.value.toLocaleString()}
                      {stat.suffix || ""}
                    </div>
                    <div className="text-red-100 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            {t("history.cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t("history.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/donate" className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>{t("history.cta.donateNow")}</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Link href="/act/volunteering" className="flex items-center space-x-2">
                <span>{t("history.cta.becomeVolunteer")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
