"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Handshake, Building2, Globe, Users, Lightbulb, Target, Mail, Phone } from "lucide-react"

const partnerTypes = [
  {
    id: "corporate",
    title: "Partenaires Corporatifs",
    titleEn: "Corporate Partners",
    description: "Entreprises engagées dans la responsabilité sociale",
    descriptionEn: "Companies committed to social responsibility",
    icon: Building2,
    benefits: [
      "Visibilité sur nos supports de communication",
      "Participation à nos événements",
      "Rapports d'impact détaillés",
      "Opportunités de team building solidaire",
    ],
    benefitsEn: [
      "Visibility on our communication materials",
      "Participation in our events",
      "Detailed impact reports",
      "Solidarity team building opportunities",
    ],
    examples: ["Microsoft", "Orange", "Total Energies", "BNP Paribas"],
  },
  {
    id: "institutional",
    title: "Partenaires Institutionnels",
    titleEn: "Institutional Partners",
    description: "Organisations gouvernementales et institutions publiques",
    descriptionEn: "Government organizations and public institutions",
    icon: Globe,
    benefits: [
      "Collaboration sur les politiques publiques",
      "Accès aux financements institutionnels",
      "Expertise technique partagée",
      "Plaidoyer conjoint",
    ],
    benefitsEn: [
      "Collaboration on public policies",
      "Access to institutional funding",
      "Shared technical expertise",
      "Joint advocacy",
    ],
    examples: ["Union Européenne", "AFD", "USAID", "Banque Mondiale"],
  },
  {
    id: "ngo",
    title: "Partenaires ONG",
    titleEn: "NGO Partners",
    description: "Organisations non gouvernementales et associations",
    descriptionEn: "Non-governmental organizations and associations",
    icon: Users,
    benefits: [
      "Mutualisation des ressources",
      "Échange de bonnes pratiques",
      "Actions coordonnées sur le terrain",
      "Formation croisée des équipes",
    ],
    benefitsEn: ["Resource pooling", "Best practices exchange", "Coordinated field actions", "Cross-training of teams"],
    examples: ["Médecins Sans Frontières", "Oxfam", "Care International", "Action Contre la Faim"],
  },
  {
    id: "academic",
    title: "Partenaires Académiques",
    titleEn: "Academic Partners",
    description: "Universités et centres de recherche",
    descriptionEn: "Universities and research centers",
    icon: Lightbulb,
    benefits: ["Recherche appliquée", "Stages et formations", "Publications scientifiques", "Innovation sociale"],
    benefitsEn: ["Applied research", "Internships and training", "Scientific publications", "Social innovation"],
    examples: ["Sorbonne", "Sciences Po", "MIT", "Oxford University"],
  },
]

const currentPartners = [
  {
    name: "Microsoft",
    type: "corporate",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Partenariat technologique pour la digitalisation de nos programmes",
    descriptionEn: "Technology partnership for digitalization of our programs",
    since: "2020",
    impact: "50,000 bénéficiaires formés au numérique",
  },
  {
    name: "Union Européenne",
    type: "institutional",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Financement de projets éducatifs en Afrique",
    descriptionEn: "Funding for educational projects in Africa",
    since: "2018",
    impact: "200 écoles construites",
  },
  {
    name: "Médecins Sans Frontières",
    type: "ngo",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Collaboration sur les programmes de santé",
    descriptionEn: "Collaboration on health programs",
    since: "2019",
    impact: "100,000 consultations médicales",
  },
  {
    name: "Sciences Po",
    type: "academic",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Recherche sur l'impact des programmes de développement",
    descriptionEn: "Research on development program impact",
    since: "2021",
    impact: "15 études publiées",
  },
]

export default function PartnersPage() {
  const [isEnglish, setIsEnglish] = useState(false)
  const [selectedType, setSelectedType] = useState("all")
  const [formData, setFormData] = useState({
    organization: "",
    type: "",
    contact: "",
    email: "",
    message: "",
  })

  const filteredPartners = currentPartners.filter((partner) => selectedType === "all" || partner.type === selectedType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Partnership application:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Handshake className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{isEnglish ? "Our Partners" : "Nos Partenaires"}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {isEnglish
                ? "Building bridges for sustainable development through strategic partnerships"
                : "Construire des ponts pour le développement durable grâce à des partenariats stratégiques"}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setIsEnglish(!isEnglish)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isEnglish ? "Français" : "English"}
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                {isEnglish ? "Become a Partner" : "Devenir Partenaire"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Types of Partnerships" : "Types de Partenariats"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Discover how your organization can collaborate with us"
                  : "Découvrez comment votre organisation peut collaborer avec nous"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnerTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card key={type.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{isEnglish ? type.titleEn : type.title}</CardTitle>
                      </div>
                      <p className="text-gray-600">{isEnglish ? type.descriptionEn : type.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">{isEnglish ? "Benefits:" : "Avantages :"}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {(isEnglish ? type.benefitsEn : type.benefits).map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{isEnglish ? "Examples:" : "Exemples :"}</h4>
                        <div className="flex flex-wrap gap-2">
                          {type.examples.map((example, index) => (
                            <Badge key={index} variant="outline">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Our Current Partners" : "Nos Partenaires Actuels"}
              </h2>
              <div className="flex justify-center mb-8">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder={isEnglish ? "Filter by type" : "Filtrer par type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Partners" : "Tous les partenaires"}</SelectItem>
                    <SelectItem value="corporate">{isEnglish ? "Corporate" : "Corporatifs"}</SelectItem>
                    <SelectItem value="institutional">{isEnglish ? "Institutional" : "Institutionnels"}</SelectItem>
                    <SelectItem value="ngo">{isEnglish ? "NGO" : "ONG"}</SelectItem>
                    <SelectItem value="academic">{isEnglish ? "Academic" : "Académiques"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPartners.map((partner, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="h-12 object-contain"
                      />
                      <Badge variant="outline">
                        {isEnglish ? "Since" : "Depuis"} {partner.since}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{isEnglish ? partner.descriptionEn : partner.description}</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">{isEnglish ? "Impact:" : "Impact :"}</span>
                      </div>
                      <p className="text-green-700 text-sm">{partner.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Application Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Become Our Partner" : "Devenez Notre Partenaire"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Join us in creating positive impact worldwide"
                  : "Rejoignez-nous pour créer un impact positif dans le monde"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Partnership Application" : "Demande de Partenariat"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Organization Name" : "Nom de l'Organisation"}
                      </label>
                      <Input
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Partnership Type" : "Type de Partenariat"}
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isEnglish ? "Select type" : "Sélectionner le type"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">{isEnglish ? "Corporate" : "Corporatif"}</SelectItem>
                          <SelectItem value="institutional">
                            {isEnglish ? "Institutional" : "Institutionnel"}
                          </SelectItem>
                          <SelectItem value="ngo">{isEnglish ? "NGO" : "ONG"}</SelectItem>
                          <SelectItem value="academic">{isEnglish ? "Academic" : "Académique"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Contact Person" : "Personne de Contact"}
                      </label>
                      <Input
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Email Address" : "Adresse Email"}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Partnership Proposal" : "Proposition de Partenariat"}
                    </label>
                    <Textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isEnglish
                          ? "Describe your organization and how you'd like to partner with us..."
                          : "Décrivez votre organisation et comment vous aimeriez vous associer avec nous..."
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {isEnglish ? "Submit Application" : "Soumettre la Demande"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{isEnglish ? "Partnership Contact" : "Contact Partenariats"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center gap-4">
                <Mail className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="opacity-90">partnerships@baobabhope.org</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Phone className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{isEnglish ? "Phone" : "Téléphone"}</p>
                  <p className="opacity-90">+33 1 23 45 67 89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
