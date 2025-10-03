"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { Search, Calendar, User, TrendingUp, BarChart3, FileText, Eye, Share2 } from "lucide-react"

export default function AnalysisPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const content = {
    fr: {
      title: "Analyse & Décryptage",
      subtitle: "Analyses approfondies et décryptages des enjeux humanitaires contemporains",
      hero: {
        title: "Analyse & Décryptage",
        description:
          "Comprendre les enjeux complexes du développement international à travers nos analyses expertes et décryptages",
      },
      sections: {
        featured: "Analyses à la Une",
        latest: "Dernières Publications",
        topics: "Thématiques",
        experts: "Nos Experts",
      },
      analyses: [
        {
          id: 1,
          title: "L'impact du changement climatique sur l'éducation en Afrique subsaharienne",
          excerpt:
            "Une analyse approfondie des défis éducatifs liés aux bouleversements climatiques et des solutions innovantes mises en place",
          category: "climate",
          author: "Dr. Sarah Johnson",
          date: "2024-01-18",
          readTime: "12 min",
          views: 2450,
          featured: true,
          tags: ["Climat", "Éducation", "Afrique"],
        },
        {
          id: 2,
          title: "Financement innovant : Les obligations à impact social dans l'humanitaire",
          excerpt: "Décryptage des nouveaux mécanismes de financement qui révolutionnent le secteur humanitaire",
          category: "finance",
          author: "Pierre Dubois",
          date: "2024-01-15",
          readTime: "8 min",
          views: 1890,
          featured: true,
          tags: ["Finance", "Innovation", "Impact Social"],
        },
        {
          id: 3,
          title: "Technologie et santé rurale : Bilan de 5 ans d'innovations",
          excerpt: "Retour sur les technologies qui ont transformé l'accès aux soins dans les zones reculées",
          category: "technology",
          author: "Dr. Mamadou Diallo",
          date: "2024-01-12",
          readTime: "15 min",
          views: 3200,
          featured: false,
          tags: ["Technologie", "Santé", "Innovation"],
        },
        {
          id: 4,
          title: "Partenariats public-privé : Leçons apprises de nos collaborations",
          excerpt: "Analyse des facteurs de succès et d'échec dans les partenariats avec le secteur privé",
          category: "partnership",
          author: "Marie Kone",
          date: "2024-01-10",
          readTime: "10 min",
          views: 1650,
          featured: false,
          tags: ["Partenariats", "Secteur Privé", "Collaboration"],
        },
        {
          id: 5,
          title: "Genre et développement : Où en sommes-nous en 2024 ?",
          excerpt: "État des lieux des avancées en matière d'égalité des genres dans nos programmes",
          category: "gender",
          author: "Fatou Diop",
          date: "2024-01-08",
          readTime: "11 min",
          views: 2100,
          featured: false,
          tags: ["Genre", "Égalité", "Développement"],
        },
      ],
      categories: {
        all: "Toutes les analyses",
        climate: "Climat & Environnement",
        finance: "Finance & Innovation",
        technology: "Technologie",
        partnership: "Partenariats",
        gender: "Genre & Inclusion",
        policy: "Politiques Publiques",
      },
      experts: [
        {
          name: "Dr. Sarah Johnson",
          role: "Experte Climat & Éducation",
          expertise: ["Changement climatique", "Systèmes éducatifs", "Résilience"],
          articles: 15,
        },
        {
          name: "Pierre Dubois",
          role: "Spécialiste Finance Innovante",
          expertise: ["Finance sociale", "Impact investing", "Mécanismes innovants"],
          articles: 12,
        },
        {
          name: "Dr. Mamadou Diallo",
          role: "Expert Santé & Technologie",
          expertise: ["E-santé", "Télémédecine", "Innovation médicale"],
          articles: 18,
        },
      ],
    },
    en: {
      title: "Analysis & Insights",
      subtitle: "In-depth analyses and insights on contemporary humanitarian issues",
      hero: {
        title: "Analysis & Insights",
        description: "Understanding complex international development issues through our expert analyses and insights",
      },
      sections: {
        featured: "Featured Analyses",
        latest: "Latest Publications",
        topics: "Topics",
        experts: "Our Experts",
      },
      analyses: [
        {
          id: 1,
          title: "The impact of climate change on education in sub-Saharan Africa",
          excerpt:
            "An in-depth analysis of educational challenges related to climate disruption and innovative solutions implemented",
          category: "climate",
          author: "Dr. Sarah Johnson",
          date: "2024-01-18",
          readTime: "12 min",
          views: 2450,
          featured: true,
          tags: ["Climate", "Education", "Africa"],
        },
        {
          id: 2,
          title: "Innovative financing: Social impact bonds in humanitarian sector",
          excerpt: "Decoding new financing mechanisms that are revolutionizing the humanitarian sector",
          category: "finance",
          author: "Pierre Dubois",
          date: "2024-01-15",
          readTime: "8 min",
          views: 1890,
          featured: true,
          tags: ["Finance", "Innovation", "Social Impact"],
        },
        {
          id: 3,
          title: "Technology and rural health: 5 years of innovation review",
          excerpt: "Looking back at technologies that have transformed access to care in remote areas",
          category: "technology",
          author: "Dr. Mamadou Diallo",
          date: "2024-01-12",
          readTime: "15 min",
          views: 3200,
          featured: false,
          tags: ["Technology", "Health", "Innovation"],
        },
        {
          id: 4,
          title: "Public-private partnerships: Lessons learned from our collaborations",
          excerpt: "Analysis of success and failure factors in partnerships with the private sector",
          category: "partnership",
          author: "Marie Kone",
          date: "2024-01-10",
          readTime: "10 min",
          views: 1650,
          featured: false,
          tags: ["Partnerships", "Private Sector", "Collaboration"],
        },
        {
          id: 5,
          title: "Gender and development: Where do we stand in 2024?",
          excerpt: "State of progress in gender equality in our programs",
          category: "gender",
          author: "Fatou Diop",
          date: "2024-01-08",
          readTime: "11 min",
          views: 2100,
          featured: false,
          tags: ["Gender", "Equality", "Development"],
        },
      ],
      categories: {
        all: "All analyses",
        climate: "Climate & Environment",
        finance: "Finance & Innovation",
        technology: "Technology",
        partnership: "Partnerships",
        gender: "Gender & Inclusion",
        policy: "Public Policy",
      },
      experts: [
        {
          name: "Dr. Sarah Johnson",
          role: "Climate & Education Expert",
          expertise: ["Climate change", "Educational systems", "Resilience"],
          articles: 15,
        },
        {
          name: "Pierre Dubois",
          role: "Innovative Finance Specialist",
          expertise: ["Social finance", "Impact investing", "Innovative mechanisms"],
          articles: 12,
        },
        {
          name: "Dr. Mamadou Diallo",
          role: "Health & Technology Expert",
          expertise: ["E-health", "Telemedicine", "Medical innovation"],
          articles: 18,
        },
      ],
    },
  }

  const t = content[language] || content.en // Fallback to English

  const filteredAnalyses = t.analyses.filter((analysis) => {
    const matchesCategory = selectedCategory === "all" || analysis.category === selectedCategory
    const matchesSearch =
      analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredAnalyses = filteredAnalyses.filter((analysis) => analysis.featured)
  const regularAnalyses = filteredAnalyses.filter((analysis) => !analysis.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <BarChart3 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">{t.hero.description}</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une analyse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(t.categories).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(key)}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Analyses */}
      {featuredAnalyses.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">{t.sections.featured}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredAnalyses.map((analysis) => (
                <Card key={analysis.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-indigo-400 to-cyan-400 relative">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-indigo-600">À la Une</Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{analysis.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{t.categories[analysis.category]}</Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(analysis.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-3">{analysis.title}</CardTitle>
                    <CardDescription className="text-base">{analysis.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{analysis.author}</span>
                      </div>
                      <span className="text-sm text-gray-600">{analysis.readTime}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysis.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Lire l'analyse
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Analyses */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">{t.sections.latest}</h2>

          <div className="space-y-6">
            {regularAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-32 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-lg flex-shrink-0"></div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline">{t.categories[analysis.category]}</Badge>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(analysis.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {analysis.views.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{analysis.title}</h3>
                      <p className="text-gray-600 mb-4">{analysis.excerpt}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{analysis.author}</span>
                          </div>
                          <span className="text-sm text-gray-600">{analysis.readTime}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm">Lire l'analyse</Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.sections.experts}</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {t.experts.map((expert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <CardDescription>{expert.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{expert.articles} analyses publiées</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Newsletter Analyses</h2>
          <p className="text-xl mb-8 opacity-90">Recevez nos dernières analyses directement dans votre boîte mail</p>

          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Votre adresse email" type="email" className="bg-white text-gray-900" />
            <Button variant="secondary" className="whitespace-nowrap">
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
