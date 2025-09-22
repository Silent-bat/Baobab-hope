"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { ArrowRight, Download, Eye, Users, Target, TrendingUp, LucideIcon } from "lucide-react"

interface Material {
  id: number
  title: string
  description: string
  category: string
  format: string
  size: string
  downloads: number
  preview: string
}

interface Guideline {
  title: string
  description: string
}

interface Stat {
  label: string
  value: string
  icon: LucideIcon
}

interface ContentData {
  title: string
  subtitle: string
  hero: {
    title: string
    description: string
  }
  sections: {
    materials: string
    request: string
    guidelines: string
    stats: string
  }
  materials: Material[]
  categories: Record<string, string>
  form: {
    title: string
    name: string
    email: string
    organization: string
    materials: string
    purpose: string
    quantity: string
    submit: string
  }
  guidelines: Guideline[]
  stats: Stat[]
}

interface Content {
  fr: ContentData
  en: ContentData
}

export default function AdvertisingPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const content: Content = {
    fr: {
      title: "Publicité et Communication",
      subtitle: "Découvrez nos supports de communication et demandez vos matériels publicitaires",
      hero: {
        title: "Matériels Publicitaires",
        description:
          "Accédez à nos ressources de communication pour promouvoir nos actions et sensibiliser votre communauté",
      },
      sections: {
        materials: "Matériels Disponibles",
        request: "Demander des Matériels",
        guidelines: "Directives de Communication",
        stats: "Impact de nos Communications",
      },
      materials: [
        {
          id: 1,
          title: "Affiches Campagne Éducation",
          description: "Affiches haute résolution pour promouvoir nos programmes éducatifs",
          category: "print",
          format: "PDF, PNG",
          size: "A3, A4",
          downloads: 1250,
          preview: "/images/poster-education.svg",
        },
        {
          id: 2,
          title: "Bannières Web",
          description: "Bannières digitales pour sites web et réseaux sociaux",
          category: "digital",
          format: "PNG, JPG",
          size: "Multiple",
          downloads: 890,
          preview: "/images/banner-web.svg",
        },
        {
          id: 3,
          title: "Brochures Institutionnelles",
          description: "Brochures de présentation de BAOBAB HOPE",
          category: "print",
          format: "PDF",
          size: "A4",
          downloads: 2100,
          preview: "/images/brochure-institutional.svg",
        },
        {
          id: 4,
          title: "Vidéos Promotionnelles",
          description: "Vidéos courtes pour réseaux sociaux et présentations",
          category: "video",
          format: "MP4",
          size: "HD, 4K",
          downloads: 650,
          preview: "/images/video-promo.svg",
        },
      ],
      categories: {
        all: "Tous",
        print: "Supports Imprimés",
        digital: "Supports Digitaux",
        video: "Vidéos",
      },
      form: {
        title: "Demande de Matériels",
        name: "Nom complet",
        email: "Email",
        organization: "Organisation",
        materials: "Matériels souhaités",
        purpose: "Objectif d'utilisation",
        quantity: "Quantité estimée",
        submit: "Envoyer la demande",
      },
      guidelines: [
        {
          title: "Utilisation du Logo",
          description: "Le logo BAOBAB HOPE doit être utilisé selon nos directives graphiques",
        },
        {
          title: "Couleurs Officielles",
          description: "Respectez notre charte graphique avec les couleurs officielles",
        },
        {
          title: "Messages Clés",
          description: "Utilisez nos messages approuvés pour garantir la cohérence",
        },
      ],
      stats: [
        { label: "Téléchargements", value: "15,000+", icon: Download },
        { label: "Partenaires Actifs", value: "250+", icon: Users },
        { label: "Campagnes Lancées", value: "45", icon: Target },
        { label: "Portée Mensuelle", value: "2M+", icon: TrendingUp },
      ],
    },
    en: {
      title: "Advertising and Communication",
      subtitle: "Discover our communication materials and request your advertising materials",
      hero: {
        title: "Advertising Materials",
        description: "Access our communication resources to promote our actions and raise awareness in your community",
      },
      sections: {
        materials: "Available Materials",
        request: "Request Materials",
        guidelines: "Communication Guidelines",
        stats: "Our Communication Impact",
      },
      materials: [
        {
          id: 1,
          title: "Education Campaign Posters",
          description: "High-resolution posters to promote our educational programs",
          category: "print",
          format: "PDF, PNG",
          size: "A3, A4",
          downloads: 1250,
          preview: "/images/poster-education.svg",
        },
        {
          id: 2,
          title: "Web Banners",
          description: "Digital banners for websites and social media",
          category: "digital",
          format: "PNG, JPG",
          size: "Multiple",
          downloads: 890,
          preview: "/images/banner-web.svg",
        },
        {
          id: 3,
          title: "Institutional Brochures",
          description: "BAOBAB HOPE presentation brochures",
          category: "print",
          format: "PDF",
          size: "A4",
          downloads: 2100,
          preview: "/images/brochure-institutional.svg",
        },
        {
          id: 4,
          title: "Promotional Videos",
          description: "Short videos for social media and presentations",
          category: "video",
          format: "MP4",
          size: "HD, 4K",
          downloads: 650,
          preview: "/images/video-promo.svg",
        },
      ],
      categories: {
        all: "All",
        print: "Print Materials",
        digital: "Digital Materials",
        video: "Videos",
      },
      form: {
        title: "Material Request",
        name: "Full Name",
        email: "Email",
        organization: "Organization",
        materials: "Desired Materials",
        purpose: "Purpose of Use",
        quantity: "Estimated Quantity",
        submit: "Send Request",
      },
      guidelines: [
        {
          title: "Logo Usage",
          description: "The BAOBAB HOPE logo must be used according to our graphic guidelines",
        },
        {
          title: "Official Colors",
          description: "Respect our graphic charter with official colors",
        },
        {
          title: "Key Messages",
          description: "Use our approved messages to ensure consistency",
        },
      ],
      stats: [
        { label: "Downloads", value: "15,000+", icon: Download },
        { label: "Active Partners", value: "250+", icon: Users },
        { label: "Campaigns Launched", value: "45", icon: Target },
        { label: "Monthly Reach", value: "2M+", icon: TrendingUp },
      ],
    },
  }

  const t = content[language as keyof Content]

  const filteredMaterials =
    selectedCategory === "all" ? t.materials : t.materials.filter((material: Material) => material.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">{t.hero.description}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((stat: Stat, index: number) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.sections.materials}</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(t.categories).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className="rounded-full"
              >
                {String(label)}
              </Button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material: Material) => (
              <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={material.preview || "/placeholder.svg"}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{material.format}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Taille: {material.size}</span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {material.downloads}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Aperçu
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t.sections.request}</h2>
              <p className="text-gray-600 mb-8">
                Besoin de matériels spécifiques ou en grande quantité ? Contactez-nous pour une demande personnalisée.
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{t.sections.guidelines}</h3>
                {t.guidelines.map((guideline: Guideline, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{guideline.title}</h4>
                      <p className="text-gray-600">{guideline.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.form.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.name}</label>
                    <Input placeholder="Votre nom complet" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.email}</label>
                    <Input type="email" placeholder="votre@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.organization}</label>
                  <Input placeholder="Nom de votre organisation" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.materials}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez les matériels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="posters">Affiches</SelectItem>
                      <SelectItem value="banners">Bannières</SelectItem>
                      <SelectItem value="brochures">Brochures</SelectItem>
                      <SelectItem value="videos">Vidéos</SelectItem>
                      <SelectItem value="custom">Matériels personnalisés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.purpose}</label>
                  <Textarea placeholder="Décrivez l'objectif d'utilisation des matériels" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.quantity}</label>
                  <Input placeholder="Quantité estimée" />
                </div>

                <Button className="w-full">
                  {t.form.submit}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
