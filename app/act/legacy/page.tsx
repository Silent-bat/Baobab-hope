"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Gift, BookOpen, Home, Droplets, Calculator, Phone, Mail } from "lucide-react"

const legacyTypes = [
  {
    id: "education",
    title: "Legs Éducation",
    titleEn: "Education Legacy",
    description: "Financez la construction d'écoles et la formation d'enseignants",
    descriptionEn: "Fund school construction and teacher training",
    icon: BookOpen,
    impact: "1 école = 500 enfants scolarisés",
    impactEn: "1 school = 500 children educated",
    minAmount: "10,000€",
  },
  {
    id: "health",
    title: "Legs Santé",
    titleEn: "Health Legacy",
    description: "Soutenez nos centres de santé et programmes de prévention",
    descriptionEn: "Support our health centers and prevention programs",
    icon: Heart,
    impact: "1 centre = 10,000 consultations/an",
    impactEn: "1 center = 10,000 consultations/year",
    minAmount: "15,000€",
  },
  {
    id: "water",
    title: "Legs Accès à l'Eau",
    titleEn: "Water Access Legacy",
    description: "Construisez des puits et systèmes d'assainissement",
    descriptionEn: "Build wells and sanitation systems",
    icon: Droplets,
    impact: "1 puits = 2,000 personnes desservies",
    impactEn: "1 well = 2,000 people served",
    minAmount: "5,000€",
  },
  {
    id: "housing",
    title: "Legs Logement",
    titleEn: "Housing Legacy",
    description: "Aidez à construire des logements décents pour les familles",
    descriptionEn: "Help build decent housing for families",
    icon: Home,
    impact: "1 maison = 1 famille relogée",
    impactEn: "1 house = 1 family rehoused",
    minAmount: "8,000€",
  },
]

const testimonials = [
  {
    name: "Marie Dubois",
    age: "78 ans",
    legacy: "Legs Éducation - 50,000€",
    quote:
      "J'ai choisi de léguer une partie de mes biens à BAOBAB HOPE car l'éducation est la clé de l'avenir. Savoir que mon héritage permettra à des centaines d'enfants d'aller à l'école me remplit de joie.",
    quoteEn:
      "I chose to bequeath part of my assets to BAOBAB HOPE because education is the key to the future. Knowing that my legacy will allow hundreds of children to go to school fills me with joy.",
    impact: "2 écoles construites au Sénégal",
  },
  {
    name: "Jean-Pierre Martin",
    age: "82 ans",
    legacy: "Legs Santé - 30,000€",
    quote:
      "Ayant travaillé dans le secteur médical toute ma vie, je voulais que mon legs continue à soigner. Le centre de santé financé par mon don sauve des vies chaque jour.",
    quoteEn:
      "Having worked in the medical sector all my life, I wanted my legacy to continue healing. The health center funded by my donation saves lives every day.",
    impact: "1 centre de santé au Kenya",
  },
]

const steps = [
  {
    number: 1,
    title: "Consultation Gratuite",
    titleEn: "Free Consultation",
    description: "Rencontrez nos conseillers pour discuter de vos souhaits",
    descriptionEn: "Meet our advisors to discuss your wishes",
  },
  {
    number: 2,
    title: "Rédaction Testament",
    titleEn: "Will Drafting",
    description: "Nous vous accompagnons dans la rédaction avec un notaire",
    descriptionEn: "We assist you in drafting with a notary",
  },
  {
    number: 3,
    title: "Suivi Personnalisé",
    titleEn: "Personal Follow-up",
    description: "Nous restons en contact et vous informons de l'impact",
    descriptionEn: "We stay in touch and inform you of the impact",
  },
]

export default function LegacyPage() {
  const [isEnglish, setIsEnglish] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    type: "",
    amount: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Legacy inquiry:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Gift className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Legacy Donations" : "Legs et Donations"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {isEnglish
                ? "Create a lasting impact that will continue beyond your lifetime"
                : "Créez un impact durable qui perdurera au-delà de votre vie"}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setIsEnglish(!isEnglish)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isEnglish ? "Français" : "English"}
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                {isEnglish ? "Free Consultation" : "Consultation Gratuite"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isEnglish ? "Types of Legacy Donations" : "Types de Legs"}</h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Choose the cause that matters most to you"
                  : "Choisissez la cause qui vous tient le plus à cœur"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legacyTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card
                    key={type.id}
                    className={`hover:shadow-lg transition-all cursor-pointer ${
                      selectedType === type.id ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-100 rounded-full p-3">
                          <IconComponent className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl">{isEnglish ? type.titleEn : type.title}</CardTitle>
                      </div>
                      <p className="text-gray-600">{isEnglish ? type.descriptionEn : type.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-green-800 font-semibold text-sm">
                            {isEnglish ? "Impact:" : "Impact :"} {isEnglish ? type.impactEn : type.impact}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">
                            {isEnglish ? "From" : "À partir de"} {type.minAmount}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedType(type.id)
                            }}
                          >
                            {isEnglish ? "Learn More" : "En Savoir Plus"}
                          </Button>
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

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isEnglish ? "How It Works" : "Comment Ça Marche"}</h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "A simple and secure process with expert guidance"
                  : "Un processus simple et sécurisé avec un accompagnement expert"}
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-start gap-6">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{isEnglish ? step.titleEn : step.title}</h3>
                    <p className="text-gray-600">{isEnglish ? step.descriptionEn : step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isEnglish ? "Testimonials" : "Témoignages"}</h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Stories from those who chose to leave a lasting legacy"
                  : "Histoires de ceux qui ont choisi de laisser un héritage durable"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-purple-100 rounded-full p-3">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-gray-500">{testimonial.age}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {testimonial.legacy}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-gray-600 italic mb-4">
                      "{isEnglish ? testimonial.quoteEn : testimonial.quote}"
                    </blockquote>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 font-semibold text-sm">
                        {isEnglish ? "Impact:" : "Impact :"} {testimonial.impact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Calculator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Legacy Impact Calculator" : "Calculateur d'Impact de Legs"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "See the potential impact of your legacy donation"
                  : "Voyez l'impact potentiel de votre legs"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {isEnglish ? "Impact Calculator" : "Calculateur d'Impact"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Legacy Amount (€)" : "Montant du Legs (€)"}
                    </label>
                    <Input type="number" placeholder="50000" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isEnglish ? "Cause" : "Cause"}</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">{isEnglish ? "Select a cause" : "Sélectionner une cause"}</option>
                      <option value="education">{isEnglish ? "Education" : "Éducation"}</option>
                      <option value="health">{isEnglish ? "Health" : "Santé"}</option>
                      <option value="water">{isEnglish ? "Water Access" : "Accès à l'eau"}</option>
                      <option value="housing">{isEnglish ? "Housing" : "Logement"}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {isEnglish ? "Estimated Impact:" : "Impact Estimé :"}
                  </h4>
                  <p className="text-blue-700">
                    {isEnglish
                      ? "Enter an amount above to see the potential impact of your legacy"
                      : "Entrez un montant ci-dessus pour voir l'impact potentiel de votre legs"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Request Information" : "Demander des Informations"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Get in touch for a free, confidential consultation"
                  : "Contactez-nous pour une consultation gratuite et confidentielle"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Legacy Information Request" : "Demande d'Information sur les Legs"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Full Name" : "Nom Complet"}
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{isEnglish ? "Age" : "Âge"}</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Phone Number" : "Numéro de Téléphone"}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Area of Interest" : "Domaine d'Intérêt"}
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="">{isEnglish ? "Select an area" : "Sélectionner un domaine"}</option>
                      <option value="education">{isEnglish ? "Education" : "Éducation"}</option>
                      <option value="health">{isEnglish ? "Health" : "Santé"}</option>
                      <option value="water">{isEnglish ? "Water Access" : "Accès à l'eau"}</option>
                      <option value="housing">{isEnglish ? "Housing" : "Logement"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Message (Optional)" : "Message (Optionnel)"}
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isEnglish
                          ? "Tell us about your interests or questions..."
                          : "Parlez-nous de vos intérêts ou questions..."
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    {isEnglish ? "Request Information" : "Demander des Informations"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{isEnglish ? "Legacy Contact" : "Contact Legs"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center gap-4">
                <Mail className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="opacity-90">legs@baobabhope.org</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Phone className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{isEnglish ? "Phone" : "Téléphone"}</p>
                  <p className="opacity-90">+33 1 23 45 67 90</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-lg opacity-90">
                {isEnglish
                  ? "All consultations are free and confidential"
                  : "Toutes les consultations sont gratuites et confidentielles"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
