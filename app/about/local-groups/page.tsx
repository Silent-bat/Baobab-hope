"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Users, Calendar, Search, Mail, Phone } from "lucide-react"

const translations = {
  en: {
    title: "Local Groups",
    subtitle: "Connect with BAOBAB HOPE communities in your area",
    description:
      "Our local groups are the heart of our organization, bringing together passionate individuals who share our vision of creating positive change in their communities.",
    searchPlaceholder: "Search by city or region...",
    joinGroup: "Join Group",
    contactGroup: "Contact Group",
    createGroup: "Create New Group",
    noGroups: "No groups found in your search area",
    groupsFound: "groups found",
    members: "members",
    nextMeeting: "Next meeting",
    activities: "Recent Activities",
    howToJoin: "How to Join a Local Group",
    step1: "Find Your Group",
    step1Desc: "Search for groups in your area using our interactive map or search function.",
    step2: "Contact Coordinator",
    step2Desc: "Reach out to the local coordinator to learn about upcoming meetings and activities.",
    step3: "Attend Meeting",
    step3Desc: "Join your first meeting to meet fellow members and discover how you can contribute.",
    step4: "Get Involved",
    step4Desc: "Participate in local projects and help make a difference in your community.",
    benefits: "Benefits of Joining",
    benefit1: "Community Impact",
    benefit1Desc: "Work directly on projects that benefit your local community",
    benefit2: "Networking",
    benefit2Desc: "Connect with like-minded individuals who share your values",
    benefit3: "Skill Development",
    benefit3Desc: "Learn new skills through workshops and collaborative projects",
    benefit4: "Global Connection",
    benefit4Desc: "Be part of a worldwide movement for positive change",
  },
  fr: {
    title: "Groupes Locaux",
    subtitle: "Connectez-vous avec les communautés BAOBAB HOPE de votre région",
    description:
      "Nos groupes locaux sont le cœur de notre organisation, rassemblant des individus passionnés qui partagent notre vision de créer un changement positif dans leurs communautés.",
    searchPlaceholder: "Rechercher par ville ou région...",
    joinGroup: "Rejoindre le Groupe",
    contactGroup: "Contacter le Groupe",
    createGroup: "Créer un Nouveau Groupe",
    noGroups: "Aucun groupe trouvé dans votre zone de recherche",
    groupsFound: "groupes trouvés",
    members: "membres",
    nextMeeting: "Prochaine réunion",
    activities: "Activités Récentes",
    howToJoin: "Comment Rejoindre un Groupe Local",
    step1: "Trouvez Votre Groupe",
    step1Desc:
      "Recherchez des groupes dans votre région en utilisant notre carte interactive ou fonction de recherche.",
    step2: "Contactez le Coordinateur",
    step2Desc: "Contactez le coordinateur local pour en savoir plus sur les prochaines réunions et activités.",
    step3: "Assistez à une Réunion",
    step3Desc: "Rejoignez votre première réunion pour rencontrer les autres membres et découvrir comment contribuer.",
    step4: "Impliquez-vous",
    step4Desc: "Participez aux projets locaux et aidez à faire la différence dans votre communauté.",
    benefits: "Avantages de Rejoindre",
    benefit1: "Impact Communautaire",
    benefit1Desc: "Travaillez directement sur des projets qui bénéficient à votre communauté locale",
    benefit2: "Réseautage",
    benefit2Desc: "Connectez-vous avec des personnes partageant les mêmes idées et valeurs",
    benefit3: "Développement des Compétences",
    benefit3Desc: "Apprenez de nouvelles compétences grâce aux ateliers et projets collaboratifs",
    benefit4: "Connexion Mondiale",
    benefit4Desc: "Faites partie d'un mouvement mondial pour le changement positif",
  },
}

const localGroups = [
  {
    id: 1,
    name: "BAOBAB HOPE Paris",
    city: "Paris",
    country: "France",
    members: 45,
    coordinator: "Marie Dubois",
    email: "paris@baobabhope.org",
    phone: "+33 1 23 45 67 89",
    nextMeeting: "2024-01-15",
    activities: ["Collecte de fonds", "Sensibilisation", "Événements communautaires"],
    description:
      "Notre groupe parisien organise des événements de sensibilisation et des collectes de fonds pour soutenir nos projets en Afrique.",
  },
  {
    id: 2,
    name: "BAOBAB HOPE London",
    city: "London",
    country: "United Kingdom",
    members: 32,
    coordinator: "James Wilson",
    email: "london@baobabhope.org",
    phone: "+44 20 7123 4567",
    nextMeeting: "2024-01-18",
    activities: ["Fundraising", "Awareness campaigns", "Volunteer training"],
    description: "The London group focuses on fundraising activities and volunteer training programs.",
  },
  {
    id: 3,
    name: "BAOBAB HOPE Berlin",
    city: "Berlin",
    country: "Germany",
    members: 28,
    coordinator: "Anna Schmidt",
    email: "berlin@baobabhope.org",
    phone: "+49 30 12345678",
    nextMeeting: "2024-01-20",
    activities: ["Educational workshops", "Cultural events", "Partnership building"],
    description: "Our Berlin group organizes educational workshops and builds partnerships with local organizations.",
  },
  {
    id: 4,
    name: "BAOBAB HOPE New York",
    city: "New York",
    country: "United States",
    members: 67,
    coordinator: "Sarah Johnson",
    email: "newyork@baobabhope.org",
    phone: "+1 212 555 0123",
    nextMeeting: "2024-01-22",
    activities: ["Corporate partnerships", "Gala events", "Youth programs"],
    description: "The New York group focuses on corporate partnerships and organizing major fundraising events.",
  },
]

export default function LocalGroupsPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGroups = localGroups.filter(
    (group) =>
      group.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
            <p className="text-center mt-4 text-gray-600">
              {filteredGroups.length} {t.groupsFound}
            </p>
          </div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredGroups.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <Badge variant="secondary">
                        <Users className="h-4 w-4 mr-1" />
                        {group.members} {t.members}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {group.city}, {group.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">{t.nextMeeting}:</span>
                        <span className="ml-1">{new Date(group.nextMeeting).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-green-600" />
                        <span>{group.email}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <span>{group.phone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">{t.activities}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {group.activities.map((activity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        {t.joinGroup}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t.contactGroup}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.noGroups}</p>
              <Button className="mt-4">{t.createGroup}</Button>
            </div>
          )}
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.howToJoin}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.step1}</h3>
              <p className="text-gray-600">{t.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.step2}</h3>
              <p className="text-gray-600">{t.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.step3}</h3>
              <p className="text-gray-600">{t.step3Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.step4}</h3>
              <p className="text-gray-600">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.benefits}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.benefit1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.benefit1Desc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.benefit2}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.benefit2Desc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.benefit3}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.benefit3Desc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{t.benefit4}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.benefit4Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">Join a local group today and be part of the change you want to see.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Find Your Local Group
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
            >
              Create New Group
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
