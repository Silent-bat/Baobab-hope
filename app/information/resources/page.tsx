"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search, FileText, Video, BookOpen, Users, Globe, Calendar } from "lucide-react"

const translations = {
  en: {
    title: "Resources",
    subtitle: "Educational materials, tools, and guides for creating positive impact",
    description:
      "Access our comprehensive library of resources designed to empower individuals, organizations, and communities to make a meaningful difference.",
    searchPlaceholder: "Search resources...",
    allResources: "All Resources",
    guides: "Guides & Toolkits",
    reports: "Reports & Research",
    videos: "Videos & Webinars",
    templates: "Templates & Forms",
    download: "Download",
    view: "View",
    watch: "Watch",
    free: "Free",
    premium: "Premium",
    new: "New",
    popular: "Popular",
    resourcesFound: "resources found",
    categories: "Categories",
    fundraising: "Fundraising",
    volunteer: "Volunteer Management",
    impact: "Impact Measurement",
    governance: "Governance",
    marketing: "Marketing & Communications",
    finance: "Financial Management",
    featured: "Featured Resources",
    recentlyAdded: "Recently Added",
    mostDownloaded: "Most Downloaded",
  },
  fr: {
    title: "Ressources",
    subtitle: "Matériels éducatifs, outils et guides pour créer un impact positif",
    description:
      "Accédez à notre bibliothèque complète de ressources conçues pour autonomiser les individus, organisations et communautés à faire une différence significative.",
    searchPlaceholder: "Rechercher des ressources...",
    allResources: "Toutes les Ressources",
    guides: "Guides et Boîtes à Outils",
    reports: "Rapports et Recherches",
    videos: "Vidéos et Webinaires",
    templates: "Modèles et Formulaires",
    download: "Télécharger",
    view: "Voir",
    watch: "Regarder",
    free: "Gratuit",
    premium: "Premium",
    new: "Nouveau",
    popular: "Populaire",
    resourcesFound: "ressources trouvées",
    categories: "Catégories",
    fundraising: "Collecte de Fonds",
    volunteer: "Gestion des Bénévoles",
    impact: "Mesure d'Impact",
    governance: "Gouvernance",
    marketing: "Marketing et Communications",
    finance: "Gestion Financière",
    featured: "Ressources en Vedette",
    recentlyAdded: "Récemment Ajoutées",
    mostDownloaded: "Les Plus Téléchargées",
  },
}

const resources = [
  {
    id: 1,
    title: "Complete Fundraising Toolkit",
    description: "Comprehensive guide to planning and executing successful fundraising campaigns",
    type: "guide",
    category: "fundraising",
    format: "PDF",
    size: "2.4 MB",
    pages: 45,
    downloads: 1250,
    isPremium: false,
    isNew: true,
    tags: ["fundraising", "campaigns", "strategy"],
    dateAdded: "2024-01-10",
  },
  {
    id: 2,
    title: "Volunteer Management Best Practices",
    description: "Essential strategies for recruiting, training, and retaining volunteers",
    type: "guide",
    category: "volunteer",
    format: "PDF",
    size: "1.8 MB",
    pages: 32,
    downloads: 890,
    isPremium: false,
    isNew: false,
    tags: ["volunteers", "management", "training"],
    dateAdded: "2023-12-15",
  },
  {
    id: 3,
    title: "Impact Measurement Framework",
    description: "Tools and methodologies for measuring and reporting social impact",
    type: "template",
    category: "impact",
    format: "Excel",
    size: "1.2 MB",
    pages: null,
    downloads: 675,
    isPremium: true,
    isNew: false,
    tags: ["impact", "measurement", "reporting"],
    dateAdded: "2023-11-20",
  },
  {
    id: 4,
    title: "Digital Marketing for Nonprofits",
    description: "Webinar series on effective digital marketing strategies for charitable organizations",
    type: "video",
    category: "marketing",
    format: "Video",
    size: "450 MB",
    pages: null,
    downloads: 1100,
    isPremium: false,
    isNew: true,
    tags: ["marketing", "digital", "social media"],
    dateAdded: "2024-01-05",
  },
  {
    id: 5,
    title: "Annual Report Template",
    description: "Professional template for creating compelling annual reports",
    type: "template",
    category: "governance",
    format: "InDesign",
    size: "15 MB",
    pages: null,
    downloads: 445,
    isPremium: true,
    isNew: false,
    tags: ["reporting", "template", "design"],
    dateAdded: "2023-10-30",
  },
  {
    id: 6,
    title: "Financial Management for Small Nonprofits",
    description: "Research report on financial best practices for emerging organizations",
    type: "report",
    category: "finance",
    format: "PDF",
    size: "3.1 MB",
    pages: 58,
    downloads: 720,
    isPremium: false,
    isNew: false,
    tags: ["finance", "management", "nonprofits"],
    dateAdded: "2023-09-12",
  },
]

const categories = [
  { id: "fundraising", name: "Fundraising", icon: "💰", count: 12 },
  { id: "volunteer", name: "Volunteer Management", icon: "👥", count: 8 },
  { id: "impact", name: "Impact Measurement", icon: "📊", count: 6 },
  { id: "governance", name: "Governance", icon: "⚖️", count: 10 },
  { id: "marketing", name: "Marketing & Communications", icon: "📢", count: 15 },
  { id: "finance", name: "Financial Management", icon: "💼", count: 9 },
]

export default function ResourcesPage() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en // Fallback to English
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "guide":
        return BookOpen
      case "report":
        return FileText
      case "video":
        return Video
      case "template":
        return Users
      default:
        return FileText
    }
  }

  const getActionButton = (resource: any) => {
    switch (resource.type) {
      case "video":
        return (
          <Button size="sm">
            <Video className="h-4 w-4 mr-1" />
            {t.watch}
          </Button>
        )
      case "template":
        return (
          <Button size="sm">
            <Download className="h-4 w-4 mr-1" />
            {t.download}
          </Button>
        )
      default:
        return (
          <Button size="sm">
            <Download className="h-4 w-4 mr-1" />
            {t.download}
          </Button>
        )
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{t.subtitle}</p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">{t.description}</p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">{t.categories}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="guide">Guides</option>
                <option value="report">Reports</option>
                <option value="video">Videos</option>
                <option value="template">Templates</option>
              </select>
            </div>

            <p className="text-center text-gray-600">
              {filteredResources.length} {t.resourcesFound}
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">{t.allResources}</TabsTrigger>
              <TabsTrigger value="guides">{t.guides}</TabsTrigger>
              <TabsTrigger value="reports">{t.reports}</TabsTrigger>
              <TabsTrigger value="videos">{t.videos}</TabsTrigger>
              <TabsTrigger value="templates">{t.templates}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource) => {
                  const IconComponent = getResourceIcon(resource.type)
                  return (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <IconComponent className="h-6 w-6 mr-2 text-blue-600" />
                            <div>
                              <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {resource.isNew && <Badge variant="secondary">{t.new}</Badge>}
                            {resource.isPremium && <Badge variant="outline">{t.premium}</Badge>}
                          </div>
                        </div>
                        <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{resource.format}</span>
                            <span>{resource.size}</span>
                            {resource.pages && <span>{resource.pages} pages</span>}
                          </div>

                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{resource.downloads} downloads</span>
                            <span>{new Date(resource.dateAdded).toLocaleDateString()}</span>
                          </div>

                          <div className="flex gap-2">
                            {getActionButton(resource)}
                            <Button size="sm" variant="outline">
                              {t.view}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Other tab contents would follow similar pattern */}
          </Tabs>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.featured}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-green-600" />
                  {t.recentlyAdded}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources
                    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
                    .slice(0, 3)
                    .map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between">
                        <span className="text-sm">{resource.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {t.new}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-6 w-6 mr-2 text-blue-600" />
                  {t.mostDownloaded}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 3)
                    .map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between">
                        <span className="text-sm">{resource.title}</span>
                        <span className="text-xs text-gray-600">{resource.downloads}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-purple-600" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 3).map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <span className="text-sm flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-600">{category.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Resources?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us to discuss creating tailored resources for your organization's specific needs.
          </p>
          <Button size="lg" variant="secondary">
            Request Custom Resources
          </Button>
        </div>
      </section>
    </div>
  )
}
