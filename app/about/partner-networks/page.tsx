"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Handshake, Target, Award, ExternalLink } from "lucide-react"
import Image from "next/image"

const translations = {
  en: {
    title: "Partner Networks",
    subtitle: "Building bridges for global impact through strategic partnerships",
    description:
      "Our partner networks enable us to amplify our impact through collaboration with organizations that share our vision of creating positive change worldwide.",
    ourPartners: "Our Partners",
    partnershipTypes: "Partnership Types",
    strategicPartners: "Strategic Partners",
    implementingPartners: "Implementing Partners",
    fundingPartners: "Funding Partners",
    technologyPartners: "Technology Partners",
    becomePartner: "Become a Partner",
    partnerBenefits: "Partnership Benefits",
    globalReach: "Global Reach",
    globalReachDesc: "Access to our worldwide network of communities and projects",
    sharedResources: "Shared Resources",
    sharedResourcesDesc: "Pool resources and expertise for maximum impact",
    brandAlignment: "Brand Alignment",
    brandAlignmentDesc: "Associate with a trusted organization committed to positive change",
    impactMeasurement: "Impact Measurement",
    impactMeasurementDesc: "Transparent reporting and measurement of collaborative outcomes",
    partnershipProcess: "Partnership Process",
    step1: "Initial Contact",
    step1Desc: "Reach out to discuss potential collaboration opportunities",
    step2: "Assessment",
    step2Desc: "We evaluate alignment of values, goals, and capabilities",
    step3: "Agreement",
    step3Desc: "Formalize partnership terms and collaboration framework",
    step4: "Implementation",
    step4Desc: "Launch collaborative projects and initiatives",
    contactUs: "Contact Us",
    learnMore: "Learn More",
    visitWebsite: "Visit Website",
  },
  fr: {
    title: "Réseaux Partenaires",
    subtitle: "Construire des ponts pour un impact mondial grâce à des partenariats stratégiques",
    description:
      "Nos réseaux de partenaires nous permettent d'amplifier notre impact grâce à la collaboration avec des organisations qui partagent notre vision de créer un changement positif dans le monde.",
    ourPartners: "Nos Partenaires",
    partnershipTypes: "Types de Partenariats",
    strategicPartners: "Partenaires Stratégiques",
    implementingPartners: "Partenaires d'Exécution",
    fundingPartners: "Partenaires Financiers",
    technologyPartners: "Partenaires Technologiques",
    becomePartner: "Devenir Partenaire",
    partnerBenefits: "Avantages du Partenariat",
    globalReach: "Portée Mondiale",
    globalReachDesc: "Accès à notre réseau mondial de communautés et de projets",
    sharedResources: "Ressources Partagées",
    sharedResourcesDesc: "Mutualiser les ressources et l'expertise pour un impact maximum",
    brandAlignment: "Alignement de Marque",
    brandAlignmentDesc: "S'associer à une organisation de confiance engagée pour le changement positif",
    impactMeasurement: "Mesure d'Impact",
    impactMeasurementDesc: "Rapports transparents et mesure des résultats collaboratifs",
    partnershipProcess: "Processus de Partenariat",
    step1: "Contact Initial",
    step1Desc: "Contactez-nous pour discuter des opportunités de collaboration potentielles",
    step2: "Évaluation",
    step2Desc: "Nous évaluons l'alignement des valeurs, objectifs et capacités",
    step3: "Accord",
    step3Desc: "Formaliser les termes du partenariat et le cadre de collaboration",
    step4: "Mise en Œuvre",
    step4Desc: "Lancer des projets et initiatives collaboratifs",
    contactUs: "Nous Contacter",
    learnMore: "En Savoir Plus",
    visitWebsite: "Visiter le Site Web",
  },
}

const partners = [
  {
    id: 1,
    name: "United Nations Foundation",
    type: "Strategic Partner",
    category: "strategic",
    description: "Collaborating on sustainable development goals and global health initiatives.",
    website: "https://unfoundation.org",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 15,
    since: 2019,
  },
  {
    id: 2,
    name: "Doctors Without Borders",
    type: "Implementing Partner",
    category: "implementing",
    description: "Joint healthcare delivery programs in underserved communities.",
    website: "https://msf.org",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 8,
    since: 2020,
  },
  {
    id: 3,
    name: "Gates Foundation",
    type: "Funding Partner",
    category: "funding",
    description: "Supporting education and healthcare initiatives across Africa.",
    website: "https://gatesfoundation.org",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 12,
    since: 2018,
  },
  {
    id: 4,
    name: "Microsoft for Nonprofits",
    type: "Technology Partner",
    category: "technology",
    description: "Providing technology solutions and digital transformation support.",
    website: "https://microsoft.com/nonprofits",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 6,
    since: 2021,
  },
  {
    id: 5,
    name: "World Health Organization",
    type: "Strategic Partner",
    category: "strategic",
    description: "Collaborative health programs and policy advocacy.",
    website: "https://who.int",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 20,
    since: 2017,
  },
  {
    id: 6,
    name: "UNICEF",
    type: "Implementing Partner",
    category: "implementing",
    description: "Child welfare and education programs in developing regions.",
    website: "https://unicef.org",
    logo: "/placeholder.svg?height=80&width=200",
    projects: 18,
    since: 2019,
  },
]

const partnershipTypes = [
  {
    type: "strategic",
    title: "Strategic Partners",
    description: "Long-term partnerships focused on policy advocacy and systemic change",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
  },
  {
    type: "implementing",
    title: "Implementing Partners",
    description: "Organizations that help deliver programs and services on the ground",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    type: "funding",
    title: "Funding Partners",
    description: "Financial supporters who enable our programs and initiatives",
    icon: Award,
    color: "bg-purple-100 text-purple-600",
  },
  {
    type: "technology",
    title: "Technology Partners",
    description: "Tech companies providing tools and platforms for digital transformation",
    icon: Globe,
    color: "bg-orange-100 text-orange-600",
  },
]

export default function PartnerNetworksPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.partnershipTypes}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnershipTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Card key={type.type} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.ourPartners}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                    <Badge variant="secondary">{partner.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <CardDescription>{partner.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{partner.projects} projects</span>
                    <span>Since {partner.since}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      {t.learnMore}
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t.visitWebsite}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.partnerBenefits}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{t.globalReach}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.globalReachDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Handshake className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{t.sharedResources}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.sharedResourcesDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{t.brandAlignment}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.brandAlignmentDesc}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{t.impactMeasurement}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.impactMeasurementDesc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.partnershipProcess}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.step1}</h3>
              <p className="text-gray-600">{t.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.becomePartner}</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network of partners and amplify your impact through collaboration.
          </p>
          <Button size="lg" variant="secondary">
            {t.contactUs}
          </Button>
        </div>
      </section>
    </div>
  )
}
