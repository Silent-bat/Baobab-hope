"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { AnimatedCounter } from "@/components/animated-counter"
import { Heart, Users, Globe, Award, ArrowRight, Target, Lightbulb, Shield, TreePine } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  const stats = [
    {
      label: t("about.impact.livesTransformed"),
      value: 75000,
      icon: Users,
      suffix: "+",
      color: "from-red-400 to-red-500",
    },
    {
      label: t("about.impact.activeProjects"),
      value: 42,
      icon: Heart,
      color: "from-blue-400 to-blue-500",
    },
    {
      label: t("about.impact.countriesReached"),
      value: 18,
      icon: Globe,
      color: "from-green-400 to-green-500",
    },
    {
      label: t("about.impact.volunteers"),
      value: 850,
      icon: Award,
      suffix: "+",
      color: "from-purple-400 to-purple-500",
    },
  ]

  const values = [
    {
      icon: TreePine,
      title: t("about.values.growth"),
      description: t("about.values.growthDescription"),
      color: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: t("about.values.community"),
      description: t("about.values.communityDescription"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: t("about.values.transparency"),
      description: t("about.values.transparencyDescription"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: t("about.values.empowerment"),
      description: t("about.values.empowermentDescription"),
      color: "from-orange-500 to-orange-600",
    },
  ]

  const timeline = [
    {
      year: "2020",
      event: t("about.timeline.milestone1.event"),
      description: t("about.timeline.milestone1.description"),
      icon: Lightbulb,
      color: "from-blue-400 to-blue-500",
    },
    {
      year: "2021",
      event: t("about.timeline.milestone2.event"),
      description: t("about.timeline.milestone2.description"),
      icon: Award,
      color: "from-green-400 to-green-500",
    },
    {
      year: "2022",
      event: t("about.timeline.milestone3.event"),
      description: t("about.timeline.milestone3.description"),
      icon: Globe,
      color: "from-emerald-400 to-emerald-500",
    },
    {
      year: "2023",
      event: t("about.timeline.milestone4.event"),
      description: t("about.timeline.milestone4.description"),
      icon: Heart,
      color: "from-red-400 to-red-500",
    },
    {
      year: "2024",
      event: t("about.timeline.milestone5.event"),
      description: t("about.timeline.milestone5.description"),
      icon: Target,
      color: "from-purple-400 to-purple-500",
    },
  ]

  const team = [
    {
      name: t("about.team.member1.name"),
      role: t("about.team.member1.role"),
      bio: t("about.team.member1.bio"),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: t("about.team.member2.name"),
      role: t("about.team.member2.role"),
      bio: t("about.team.member2.bio"),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: t("about.team.member3.name"),
      role: t("about.team.member3.role"),
      bio: t("about.team.member3.bio"),
      image: "/placeholder.svg?height=300&width=300",
    },
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
              <span>{t("about.hero.badge")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-poppins">{t("about.title")}</h1>
            <p className="text-xl sm:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>{t("about.mission.badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                {t("about.mission.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t("about.mission.text")}</p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t("about.mission.description")}</p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/about/missions" className="flex items-center space-x-2">
                  <span>Learn About Our Missions</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-education.svg"
                alt="BAOBAB HOPE mission"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>{t("about.values.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("about.values.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("about.values.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>{t("about.timeline.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("about.timeline.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("about.timeline.subtitle")}</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200 hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((milestone, index) => {
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-poppins">{t("about.impact.title")}</h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">{t("about.impact.subtitle")}</p>
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
                      <AnimatedCounter end={stat.value} duration={2000} />
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

      {/* Team Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>{t("about.team.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              {t("about.team.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("about.team.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-red-600 font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            {t("about.history.cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t("about.history.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/donate" className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Donate Now</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Link href="/act/volunteering" className="flex items-center space-x-2">
                <span>Become a Volunteer</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
