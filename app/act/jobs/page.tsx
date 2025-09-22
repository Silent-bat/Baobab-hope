"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Users, Search, Briefcase, GraduationCap } from "lucide-react"

const jobOffers = [
  {
    id: 1,
    title: "Coordinateur de Projet - Éducation",
    titleEn: "Education Project Coordinator",
    type: "CDI",
    typeEn: "Full-time",
    location: "Dakar, Sénégal",
    department: "Programmes",
    departmentEn: "Programs",
    experience: "3-5 ans",
    experienceEn: "3-5 years",
    description:
      "Coordonner les projets éducatifs en Afrique de l'Ouest, gérer les partenariats locaux et superviser l'équipe terrain.",
    descriptionEn:
      "Coordinate educational projects in West Africa, manage local partnerships and supervise field teams.",
    requirements: [
      "Master en développement international ou équivalent",
      "Expérience en gestion de projet humanitaire",
      "Maîtrise du français et de l'anglais",
      "Capacité à travailler en environnement multiculturel",
    ],
    requirementsEn: [
      "Master's in international development or equivalent",
      "Experience in humanitarian project management",
      "Fluency in French and English",
      "Ability to work in multicultural environment",
    ],
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
  },
  {
    id: 2,
    title: "Spécialiste Communication Digitale",
    titleEn: "Digital Communication Specialist",
    type: "CDD",
    typeEn: "Contract",
    location: "Paris, France",
    department: "Communication",
    departmentEn: "Communication",
    experience: "2-4 ans",
    experienceEn: "2-4 years",
    description:
      "Développer et mettre en œuvre la stratégie de communication digitale, gérer les réseaux sociaux et créer du contenu engageant.",
    descriptionEn:
      "Develop and implement digital communication strategy, manage social media and create engaging content.",
    requirements: [
      "Formation en communication ou marketing digital",
      "Expérience en gestion de réseaux sociaux",
      "Maîtrise des outils de création graphique",
      "Passion pour les causes humanitaires",
    ],
    requirementsEn: [
      "Education in communication or digital marketing",
      "Experience in social media management",
      "Proficiency in graphic design tools",
      "Passion for humanitarian causes",
    ],
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
  },
  {
    id: 3,
    title: "Stage - Assistant Logistique",
    titleEn: "Internship - Logistics Assistant",
    type: "Stage",
    typeEn: "Internship",
    location: "Nairobi, Kenya",
    department: "Logistique",
    departmentEn: "Logistics",
    experience: "Étudiant",
    experienceEn: "Student",
    description:
      "Assister l'équipe logistique dans la gestion des approvisionnements et la coordination des livraisons sur le terrain.",
    descriptionEn: "Assist the logistics team in supply management and coordination of field deliveries.",
    requirements: [
      "Étudiant en logistique, commerce international ou équivalent",
      "Anglais courant requis",
      "Capacité d'adaptation et esprit d'équipe",
      "Intérêt pour l'action humanitaire",
    ],
    requirementsEn: [
      "Student in logistics, international trade or equivalent",
      "Fluent English required",
      "Adaptability and team spirit",
      "Interest in humanitarian action",
    ],
    postedDate: "2024-01-08",
    deadline: "2024-02-08",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isEnglish, setIsEnglish] = useState(false)

  const filteredJobs = jobOffers.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || job.type === selectedType
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment

    return matchesSearch && matchesType && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Briefcase className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Job & Internship Opportunities" : "Offres d'Emploi et Stages"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {isEnglish
                ? "Join our team and make a difference in communities worldwide"
                : "Rejoignez notre équipe et faites la différence dans les communautés du monde entier"}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setIsEnglish(!isEnglish)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isEnglish ? "Français" : "English"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={isEnglish ? "Search positions..." : "Rechercher des postes..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder={isEnglish ? "Contract Type" : "Type de contrat"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Types" : "Tous les types"}</SelectItem>
                    <SelectItem value="CDI">{isEnglish ? "Full-time" : "CDI"}</SelectItem>
                    <SelectItem value="CDD">{isEnglish ? "Contract" : "CDD"}</SelectItem>
                    <SelectItem value="Stage">{isEnglish ? "Internship" : "Stage"}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={isEnglish ? "Department" : "Département"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Departments" : "Tous les départements"}</SelectItem>
                    <SelectItem value="Programmes">{isEnglish ? "Programs" : "Programmes"}</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Logistique">{isEnglish ? "Logistics" : "Logistique"}</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 hover:bg-blue-700">{isEnglish ? "Search" : "Rechercher"}</Button>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{isEnglish ? job.titleEn : job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{isEnglish ? job.typeEn : job.type}</Badge>
                          <Badge variant="outline">{isEnglish ? job.departmentEn : job.department}</Badge>
                        </div>
                      </div>
                      <Button>{isEnglish ? "Apply Now" : "Postuler"}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{isEnglish ? job.experienceEn : job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {isEnglish ? "Deadline:" : "Date limite:"} {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{isEnglish ? job.descriptionEn : job.description}</p>

                    <div>
                      <h4 className="font-semibold mb-2">{isEnglish ? "Requirements:" : "Exigences :"}</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {(isEnglish ? job.requirementsEn : job.requirements).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {isEnglish ? "No positions found" : "Aucun poste trouvé"}
                </h3>
                <p className="text-gray-500">
                  {isEnglish
                    ? "Try adjusting your search criteria or check back later for new opportunities."
                    : "Essayez d'ajuster vos critères de recherche ou revenez plus tard pour de nouvelles opportunités."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              {isEnglish ? "Why Work With BAOBAB HOPE?" : "Pourquoi Travailler avec BAOBAB HOPE ?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{isEnglish ? "Global Impact" : "Impact Mondial"}</h3>
                <p className="text-gray-600">
                  {isEnglish
                    ? "Work on projects that directly improve lives across multiple continents"
                    : "Travaillez sur des projets qui améliorent directement la vie sur plusieurs continents"}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isEnglish ? "Professional Growth" : "Développement Professionnel"}
                </h3>
                <p className="text-gray-600">
                  {isEnglish
                    ? "Continuous learning opportunities and career development programs"
                    : "Opportunités d'apprentissage continu et programmes de développement de carrière"}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{isEnglish ? "Meaningful Work" : "Travail Significatif"}</h3>
                <p className="text-gray-600">
                  {isEnglish
                    ? "Every day contributes to building a better, more sustainable world"
                    : "Chaque jour contribue à construire un monde meilleur et plus durable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isEnglish ? "Stay Updated on New Opportunities" : "Restez Informé des Nouvelles Opportunités"}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isEnglish
                ? "Subscribe to receive notifications about new job openings and internships"
                : "Abonnez-vous pour recevoir des notifications sur les nouvelles offres d'emploi et stages"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder={isEnglish ? "Your email address" : "Votre adresse email"}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                {isEnglish ? "Subscribe" : "S'abonner"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
