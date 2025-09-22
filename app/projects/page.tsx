"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { AnimatedCounter } from "@/components/animated-counter"
import { MapPin, Calendar, Users, Target, Droplets, BookOpen, Heart, Leaf, ArrowRight } from "lucide-react"

export default function ProjectsPage() {
  const { t } = useLanguage()

  const projects = [
    {
      id: 1,
      title: t("projects.education.title"),
      description: t("projects.education.description"),
      location: "Kenya, Tanzania, Uganda",
      startDate: "2021",
      beneficiaries: "15,000+",
      progress: 85,
      goal: "$120,000",
      raised: "$102,000",
      image: "/images/education-project.svg",
      category: "Education",
      icon: BookOpen,
      color: "from-blue-500 to-purple-600",
      highlights: ["Built 25 community libraries", "Trained 150 local teachers", "Distributed 10,000 textbooks"],
    },
    {
      id: 2,
      title: t("projects.environment.title"),
      description: t("projects.environment.description"),
      location: "Madagascar, Senegal, Ghana",
      startDate: "2022",
      beneficiaries: "25,000+",
      progress: 70,
      goal: "$200,000",
      raised: "$140,000",
      image: "/images/environment-project.svg",
      category: "Environment",
      icon: Leaf,
      color: "from-green-500 to-teal-600",
      highlights: ["Planted 50,000 trees", "Protected 1,200 hectares", "Trained 300 eco-guardians"],
    },
    {
      id: 3,
      title: t("projects.healthcare.title"),
      description: t("projects.healthcare.description"),
      location: "Guatemala, Honduras, Nicaragua",
      startDate: "2023",
      beneficiaries: "8,000+",
      progress: 60,
      goal: "$80,000",
      raised: "$48,000",
      image: "/images/healthcare-project.svg",
      category: "Healthcare",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      highlights: ["5 mobile health clinics", "Vaccinated 3,000 children", "Trained 80 health workers"],
    },
    {
      id: 4,
      title: t("projects.water.title"),
      description: t("projects.water.description"),
      location: "Bangladesh, Nepal, Cambodia",
      startDate: "2024",
      beneficiaries: "12,000+",
      progress: 45,
      goal: "$150,000",
      raised: "$67,500",
      image: "/images/water-project.svg",
      category: "Water",
      icon: Droplets,
      color: "from-cyan-500 to-blue-600",
      highlights: [
        "15 water wells constructed",
        "Water filtration systems installed",
        "Community maintenance training",
      ],
    },
  ]

  const categories = ["All", "Education", "Environment", "Healthcare", "Water"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div
            className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <Target className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {t("projects.title")}
            </h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {t("projects.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-16 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => {
              const Icon = project.icon
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                        {project.category}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Button
                        asChild
                        variant="secondary"
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm"
                      >
                        <Link href={`/projects/${project.id}`}>
                          {t("projects.view")}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="w-8 h-8 text-red-600" />
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        {project.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-red-500" />
                        {t("common.started")} {project.startDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2 text-red-500" />
                        {project.beneficiaries} {t("project.beneficiaries").toLowerCase()}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{t("project.progress")}</span>
                        <span className="text-sm text-gray-500">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="text-sm text-gray-500">{t("project.raised")}</div>
                        <div className="font-semibold text-gray-900 text-lg">{project.raised}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{t("project.goal")}</div>
                        <div className="font-semibold text-gray-900 text-lg">{project.goal}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">{t("project.achievements")}</h4>
                      <ul className="space-y-2">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    >
                      <Link href={`/projects/${project.id}`}>{t("projects.support")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              {t("projects.impact.title")}
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {t("projects.impact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: 60000, label: t("common.people.reached"), suffix: "+", icon: Users },
              { number: 42, label: t("common.active.projects"), icon: Target },
              { number: 18, label: t("common.countries"), icon: MapPin },
              { number: 95, label: t("common.success.rate"), suffix: "%", icon: Heart },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Icon className="w-12 h-12 text-red-600 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <AnimatedCounter end={stat.number} suffix={stat.suffix || ""} />
                  <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("projects.cta.title")}</h2>
            <p className="text-xl mb-8 text-red-100 leading-relaxed">{t("projects.cta.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href="/donate">
                  <Heart className="w-5 h-5 mr-2" />
                  {t("projects.cta.support")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-red-300 text-red-300 hover:bg-red-300 hover:text-red-800 transition-all duration-300 hover:scale-105"
              >
                <Link href="/contact">
                  {t("projects.cta.involved")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
