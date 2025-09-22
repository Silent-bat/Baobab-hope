"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Heart, Users, Calculator, CheckCircle, Phone, Mail, AlertCircle } from "lucide-react"

const insuranceTypes = [
  {
    id: "whole-life",
    title: "Assurance Vie Entière",
    titleEn: "Whole Life Insurance",
    description: "Protection permanente avec valeur de rachat",
    descriptionEn: "Permanent protection with cash value",
    icon: Shield,
    benefits: [
      "Couverture à vie garantie",
      "Accumulation de valeur de rachat",
      "Possibilité d'emprunt sur la police",
      "Dividendes potentiels",
    ],
    benefitsEn: [
      "Guaranteed lifetime coverage",
      "Cash value accumulation",
      "Policy loan options",
      "Potential dividends",
    ],
    minPremium: "100€/mois",
  },
  {
    id: "term-life",
    title: "Assurance Vie Temporaire",
    titleEn: "Term Life Insurance",
    description: "Protection abordable pour une période déterminée",
    descriptionEn: "Affordable protection for a specific period",
    icon: Heart,
    benefits: [
      "Primes plus abordables",
      "Couverture flexible",
      "Conversion possible en assurance permanente",
      "Idéal pour jeunes familles",
    ],
    benefitsEn: [
      "More affordable premiums",
      "Flexible coverage",
      "Convertible to permanent insurance",
      "Ideal for young families",
    ],
    minPremium: "25€/mois",
  },
  {
    id: "universal-life",
    title: "Assurance Vie Universelle",
    titleEn: "Universal Life Insurance",
    description: "Flexibilité maximale avec investissement",
    descriptionEn: "Maximum flexibility with investment",
    icon: Users,
    benefits: [
      "Primes flexibles",
      "Croissance liée aux investissements",
      "Ajustement du capital assuré",
      "Avantages fiscaux",
    ],
    benefitsEn: ["Flexible premiums", "Investment-linked growth", "Adjustable death benefit", "Tax advantages"],
    minPremium: "150€/mois",
  },
]

const steps = [
  {
    number: 1,
    title: "Évaluation Gratuite",
    titleEn: "Free Assessment",
    description: "Analyse de vos besoins et situation financière",
    descriptionEn: "Analysis of your needs and financial situation",
  },
  {
    number: 2,
    title: "Proposition Personnalisée",
    titleEn: "Personalized Proposal",
    description: "Recommandations adaptées à votre profil",
    descriptionEn: "Recommendations tailored to your profile",
  },
  {
    number: 3,
    title: "Souscription",
    titleEn: "Subscription",
    description: "Finalisation du contrat avec notre partenaire assureur",
    descriptionEn: "Contract finalization with our insurance partner",
  },
  {
    number: 4,
    title: "Suivi Continu",
    titleEn: "Ongoing Support",
    description: "Accompagnement et révisions périodiques",
    descriptionEn: "Support and periodic reviews",
  },
]

const faqs = [
  {
    question: "Pourquoi choisir BAOBAB HOPE comme bénéficiaire ?",
    questionEn: "Why choose BAOBAB HOPE as beneficiary?",
    answer:
      "En nous désignant comme bénéficiaire, vous garantissez que votre héritage continuera à faire une différence positive dans le monde, finançant nos programmes d'éducation, de santé et de développement durable.",
    answerEn:
      "By designating us as beneficiary, you ensure your legacy continues to make a positive difference in the world, funding our education, health, and sustainable development programs.",
  },
  {
    question: "Puis-je modifier le bénéficiaire plus tard ?",
    questionEn: "Can I change the beneficiary later?",
    answer:
      "Oui, vous pouvez modifier le bénéficiaire de votre assurance vie à tout moment, sauf si vous avez désigné un bénéficiaire irrévocable.",
    answerEn:
      "Yes, you can change your life insurance beneficiary at any time, unless you have designated an irrevocable beneficiary.",
  },
  {
    question: "Y a-t-il des avantages fiscaux ?",
    questionEn: "Are there tax advantages?",
    answer:
      "L'assurance vie offre plusieurs avantages fiscaux, notamment l'exonération des droits de succession jusqu'à certains montants et la fiscalité avantageuse des rachats.",
    answerEn:
      "Life insurance offers several tax advantages, including inheritance tax exemption up to certain amounts and favorable taxation of withdrawals.",
  },
]

export default function LifeInsurancePage() {
  const [isEnglish, setIsEnglish] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    coverage: "",
    type: "",
    message: "",
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Insurance inquiry:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Life Insurance for Good" : "Assurance Vie Solidaire"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {isEnglish
                ? "Protect your loved ones while supporting humanitarian causes"
                : "Protégez vos proches tout en soutenant des causes humanitaires"}
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
                {isEnglish ? "Get Quote" : "Obtenir un Devis"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Types of Life Insurance" : "Types d'Assurance Vie"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Choose the coverage that best fits your needs and values"
                  : "Choisissez la couverture qui correspond le mieux à vos besoins et valeurs"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {insuranceTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card
                    key={type.id}
                    className={`hover:shadow-lg transition-all cursor-pointer ${
                      selectedType === type.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{isEnglish ? type.titleEn : type.title}</CardTitle>
                      </div>
                      <p className="text-gray-600 text-sm">{isEnglish ? type.descriptionEn : type.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">{isEnglish ? "Benefits:" : "Avantages :"}</h4>
                          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                            {(isEnglish ? type.benefitsEn : type.benefits).map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {isEnglish ? "From" : "À partir de"} {type.minPremium}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedType(type.id)
                            }}
                          >
                            {isEnglish ? "Select" : "Choisir"}
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

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isEnglish ? "How It Works" : "Comment Ça Marche"}</h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "A simple process to secure your family's future"
                  : "Un processus simple pour sécuriser l'avenir de votre famille"}
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-start gap-6">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
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

      {/* Benefits of Choosing BAOBAB HOPE */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Why Choose BAOBAB HOPE?" : "Pourquoi Choisir BAOBAB HOPE ?"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "More than insurance - a commitment to positive impact"
                  : "Plus qu'une assurance - un engagement pour un impact positif"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>{isEnglish ? "Transparent Impact" : "Impact Transparent"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isEnglish
                      ? "Receive detailed reports on how your contributions are making a difference"
                      : "Recevez des rapports détaillés sur l'impact de vos contributions"}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>{isEnglish ? "Dual Purpose" : "Double Objectif"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isEnglish
                      ? "Protect your family while supporting humanitarian causes worldwide"
                      : "Protégez votre famille tout en soutenant des causes humanitaires mondiales"}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>{isEnglish ? "Expert Support" : "Support Expert"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isEnglish
                      ? "Dedicated advisors who understand both insurance and humanitarian work"
                      : "Conseillers dédiés qui comprennent l'assurance et le travail humanitaire"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Insurance Calculator" : "Calculateur d'Assurance"}
              </h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Estimate your coverage needs and premium costs"
                  : "Estimez vos besoins de couverture et coûts de prime"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {isEnglish ? "Coverage Calculator" : "Calculateur de Couverture"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{isEnglish ? "Your Age" : "Votre Âge"}</label>
                    <Input type="number" placeholder="35" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Annual Income (€)" : "Revenu Annuel (€)"}
                    </label>
                    <Input type="number" placeholder="50000" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Number of Dependents" : "Nombre de Personnes à Charge"}
                    </label>
                    <Input type="number" placeholder="2" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Insurance Type" : "Type d'Assurance"}
                    </label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">{isEnglish ? "Select type" : "Sélectionner le type"}</option>
                      <option value="term">{isEnglish ? "Term Life" : "Vie Temporaire"}</option>
                      <option value="whole">{isEnglish ? "Whole Life" : "Vie Entière"}</option>
                      <option value="universal">{isEnglish ? "Universal Life" : "Vie Universelle"}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {isEnglish ? "Recommended Coverage:" : "Couverture Recommandée :"}
                  </h4>
                  <p className="text-blue-700">
                    {isEnglish
                      ? "Fill in the fields above to get personalized recommendations"
                      : "Remplissez les champs ci-dessus pour obtenir des recommandations personnalisées"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? "Frequently Asked Questions" : "Questions Fréquemment Posées"}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{isEnglish ? faq.questionEn : faq.question}</CardTitle>
                      <div className={`transform transition-transform ${openFaq === index ? "rotate-180" : ""}`}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </CardHeader>
                  {openFaq === index && (
                    <CardContent>
                      <p className="text-gray-600">{isEnglish ? faq.answerEn : faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{isEnglish ? "Get Your Quote" : "Obtenez Votre Devis"}</h2>
              <p className="text-xl text-gray-600">
                {isEnglish
                  ? "Start your journey towards secure and meaningful protection"
                  : "Commencez votre parcours vers une protection sécurisée et significative"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Insurance Quote Request" : "Demande de Devis d'Assurance"}</CardTitle>
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
                        required
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Desired Coverage (€)" : "Couverture Souhaitée (€)"}
                      </label>
                      <Input
                        type="number"
                        value={formData.coverage}
                        onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isEnglish ? "Insurance Type" : "Type d'Assurance"}
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="">{isEnglish ? "Select type" : "Sélectionner le type"}</option>
                        <option value="term">{isEnglish ? "Term Life" : "Vie Temporaire"}</option>
                        <option value="whole">{isEnglish ? "Whole Life" : "Vie Entière"}</option>
                        <option value="universal">{isEnglish ? "Universal Life" : "Vie Universelle"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEnglish ? "Additional Information" : "Informations Supplémentaires"}
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isEnglish
                          ? "Tell us about your specific needs or questions..."
                          : "Parlez-nous de vos besoins spécifiques ou questions..."
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {isEnglish ? "Get Quote" : "Obtenir un Devis"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{isEnglish ? "Insurance Contact" : "Contact Assurance"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center gap-4">
                <Mail className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="opacity-90">assurance@baobabhope.org</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Phone className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{isEnglish ? "Phone" : "Téléphone"}</p>
                  <p className="opacity-90">+33 1 23 45 67 91</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-lg opacity-90">
                {isEnglish
                  ? "Licensed insurance advisors available Monday to Friday, 9 AM to 6 PM"
                  : "Conseillers en assurance agréés disponibles du lundi au vendredi, 9h à 18h"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
