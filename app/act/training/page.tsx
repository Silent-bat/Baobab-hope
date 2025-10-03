"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, Award, CheckCircle, Calendar, MapPin } from "lucide-react"

const translations = {
  en: {
    title: "Training & Development",
    subtitle: "Build skills and knowledge to maximize your impact",
    description:
      "Our comprehensive training programs equip individuals and organizations with the tools, knowledge, and skills needed to create lasting positive change in their communities.",
    onlineCourses: "Online Courses",
    workshops: "Workshops & Seminars",
    certifications: "Certifications",
    webinars: "Webinars",
    enroll: "Enroll Now",
    register: "Register",
    watch: "Watch",
    free: "Free",
    paid: "Paid",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    duration: "Duration",
    participants: "Participants",
    rating: "Rating",
    certificate: "Certificate Included",
    upcoming: "Upcoming",
    onDemand: "On Demand",
    inPerson: "In Person",
    virtual: "Virtual",
    featured: "Featured Training",
    popular: "Popular Courses",
    newCourses: "New Courses",
  },
  fr: {
    title: "Formation et Développement",
    subtitle: "Développez vos compétences et connaissances pour maximiser votre impact",
    description:
      "Nos programmes de formation complets équipent les individus et organisations avec les outils, connaissances et compétences nécessaires pour créer un changement positif durable dans leurs communautés.",
    onlineCourses: "Cours en Ligne",
    workshops: "Ateliers et Séminaires",
    certifications: "Certifications",
    webinars: "Webinaires",
    enroll: "S'inscrire Maintenant",
    register: "S'inscrire",
    watch: "Regarder",
    free: "Gratuit",
    paid: "Payant",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    duration: "Durée",
    participants: "Participants",
    rating: "Évaluation",
    certificate: "Certificat Inclus",
    upcoming: "À Venir",
    onDemand: "À la Demande",
    inPerson: "En Personne",
    virtual: "Virtuel",
    featured: "Formation en Vedette",
    popular: "Cours Populaires",
    newCourses: "Nouveaux Cours",
  },
}

const courses = [
  {
    id: 1,
    title: "Nonprofit Leadership Fundamentals",
    description: "Essential leadership skills for nonprofit executives and board members",
    type: "course",
    level: "beginner",
    duration: "6 weeks",
    format: "online",
    price: 0,
    rating: 4.8,
    participants: 1250,
    hasCertificate: true,
    instructor: "Dr. Sarah Johnson",
    modules: 8,
    progress: 0,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["leadership", "management", "governance"],
  },
  {
    id: 2,
    title: "Digital Fundraising Strategies",
    description: "Master online fundraising techniques and digital donor engagement",
    type: "course",
    level: "intermediate",
    duration: "4 weeks",
    format: "online",
    price: 199,
    rating: 4.9,
    participants: 890,
    hasCertificate: true,
    instructor: "Mark Thompson",
    modules: 6,
    progress: 0,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["fundraising", "digital", "marketing"],
  },
  {
    id: 3,
    title: "Impact Measurement Workshop",
    description: "Learn to measure and communicate your organization's social impact",
    type: "workshop",
    level: "intermediate",
    duration: "1 day",
    format: "in-person",
    price: 150,
    rating: 4.7,
    participants: 45,
    hasCertificate: false,
    instructor: "Dr. Maria Rodriguez",
    date: "2024-02-15",
    location: "New York, NY",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["impact", "measurement", "evaluation"],
  },
  {
    id: 4,
    title: "Volunteer Management Certification",
    description: "Comprehensive certification program for volunteer coordinators",
    type: "certification",
    level: "advanced",
    duration: "12 weeks",
    format: "hybrid",
    price: 499,
    rating: 4.9,
    participants: 320,
    hasCertificate: true,
    instructor: "Jennifer Lee",
    modules: 12,
    progress: 0,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["volunteers", "management", "certification"],
  },
]

const webinars = [
  {
    id: 1,
    title: "Grant Writing Best Practices",
    description: "Tips and strategies for successful grant applications",
    date: "2024-01-25",
    time: "2:00 PM EST",
    duration: "1 hour",
    presenter: "Lisa Chen",
    isUpcoming: true,
    registrations: 450,
  },
  {
    id: 2,
    title: "Building Sustainable Partnerships",
    description: "How to create and maintain long-term organizational partnerships",
    date: "2024-02-08",
    time: "3:00 PM EST",
    duration: "90 minutes",
    presenter: "Robert Kim",
    isUpcoming: true,
    registrations: 320,
  },
]

export default function TrainingPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en // Fallback to English
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesFormat = selectedFormat === "all" || course.format === selectedFormat
    return matchesLevel && matchesFormat
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Levels</option>
              <option value="beginner">{t.beginner}</option>
              <option value="intermediate">{t.intermediate}</option>
              <option value="advanced">{t.advanced}</option>
            </select>

            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Formats</option>
              <option value="online">Online</option>
              <option value="in-person">{t.inPerson}</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Training Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">{t.onlineCourses}</TabsTrigger>
              <TabsTrigger value="workshops">{t.workshops}</TabsTrigger>
              <TabsTrigger value="certifications">{t.certifications}</TabsTrigger>
              <TabsTrigger value="webinars">{t.webinars}</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter((course) => course.type === "course")
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {course.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                            <Progress value={course.progress} className="h-2" />
                            <span className="text-white text-xs">{course.progress}% complete</span>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <div className="flex flex-col gap-1">
                            <Badge variant={course.price === 0 ? "secondary" : "outline"}>
                              {course.price === 0 ? t.free : `$${course.price}`}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.level}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.participants}
                            </span>
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {course.rating}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{course.modules} modules</span>
                            {course.hasCertificate && (
                              <>
                                <span className="mx-2">•</span>
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                <span>{t.certificate}</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {course.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button className="w-full">{course.progress > 0 ? "Continue" : t.enroll}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="workshops" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter((course) => course.type === "workshop")
                  .map((workshop) => (
                    <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <img
                          src={workshop.image || "/placeholder.svg"}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{workshop.title}</CardTitle>
                          <Badge variant="outline">${workshop.price}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{workshop.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(workshop.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{workshop.duration}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{workshop.location}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{workshop.participants} registered</span>
                            <span className="mx-2">•</span>
                            <Award className="h-4 w-4 mr-1" />
                            <span>{workshop.rating}</span>
                          </div>

                          <Button className="w-full">{t.register}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="webinars" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                {webinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{webinar.title}</CardTitle>
                        <Badge variant={webinar.isUpcoming ? "default" : "secondary"}>
                          {webinar.isUpcoming ? t.upcoming : "Recorded"}
                        </Badge>
                      </div>
                      <CardDescription>{webinar.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(webinar.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{webinar.time}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{webinar.duration}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Presenter: {webinar.presenter}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <span>{webinar.registrations} registered</span>
                        </div>

                        <Button className="w-full">{webinar.isUpcoming ? t.register : t.watch}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Skills?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of changemakers who have transformed their impact through our training programs.
          </p>
          <Button size="lg" variant="secondary">
            Browse All Courses
          </Button>
        </div>
      </section>
    </div>
  )
}
