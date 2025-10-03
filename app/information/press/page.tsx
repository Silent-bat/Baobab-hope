"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"
import { Download, Calendar, User, Mail, Phone, ImageIcon, Video, Mic } from "lucide-react"

export default function PressPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const content = {
    fr: {
      title: "Espace Presse",
      subtitle: "Ressources et contacts pour les journalistes et médias",
      hero: {
        title: "Espace Presse",
        description: "Accédez aux dernières actualités, communiqués de presse et ressources médias de BAOBAB HOPE",
      },
      sections: {
        releases: "Communiqués de Presse",
        media: "Kit Média",
        contacts: "Contacts Presse",
        request: "Demande d'Interview",
      },
      pressReleases: [
        {
          id: 1,
          title: "BAOBAB HOPE lance une nouvelle campagne pour l'éducation en Afrique",
          date: "2024-01-15",
          category: "education",
          excerpt: "Une initiative ambitieuse pour scolariser 10 000 enfants supplémentaires d'ici 2025",
          downloadUrl: "/press/release-education-2024.pdf",
        },
        {
          id: 2,
          title: "Partenariat stratégique avec l'Union Africaine",
          date: "2024-01-10",
          category: "partnership",
          excerpt: "Signature d'un accord de coopération pour renforcer les actions humanitaires",
          downloadUrl: "/press/release-ua-partnership.pdf",
        },
        {
          id: 3,
          title: "Rapport annuel 2023 : 50 000 bénéficiaires touchés",
          date: "2024-01-05",
          category: "impact",
          excerpt: "Bilan des actions menées et impact mesurable sur les communautés",
          downloadUrl: "/press/annual-report-2023.pdf",
        },
      ],
      mediaKit: [
        {
          type: "logo",
          title: "Logos Officiels",
          description: "Logos BAOBAB HOPE en différents formats",
          files: ["PNG", "SVG", "EPS"],
          icon: ImageIcon,
        },
        {
          type: "photos",
          title: "Banque d'Images",
          description: "Photos haute résolution de nos actions",
          files: ["JPG", "PNG"],
          icon: ImageIcon,
        },
        {
          type: "videos",
          title: "Vidéos Institutionnelles",
          description: "Vidéos de présentation et témoignages",
          files: ["MP4", "MOV"],
          icon: Video,
        },
        {
          type: "audio",
          title: "Interviews Audio",
          description: "Interviews et déclarations audio",
          files: ["MP3", "WAV"],
          icon: Mic,
        },
      ],
      contacts: [
        {
          name: "Marie Dubois",
          role: "Responsable Communication",
          email: "presse@baobabhope.org",
          phone: "+33 1 23 45 67 89",
          languages: ["Français", "Anglais"],
        },
        {
          name: "John Smith",
          role: "International Press Officer",
          email: "press@baobabhope.org",
          phone: "+1 555 123 4567",
          languages: ["English", "Spanish"],
        },
      ],
      categories: {
        all: "Tous",
        education: "Éducation",
        health: "Santé",
        environment: "Environnement",
        partnership: "Partenariats",
        impact: "Impact",
      },
    },
    en: {
      title: "Press Area",
      subtitle: "Resources and contacts for journalists and media",
      hero: {
        title: "Press Area",
        description: "Access the latest news, press releases and media resources from BAOBAB HOPE",
      },
      sections: {
        releases: "Press Releases",
        media: "Media Kit",
        contacts: "Press Contacts",
        request: "Interview Request",
      },
      pressReleases: [
        {
          id: 1,
          title: "BAOBAB HOPE launches new education campaign in Africa",
          date: "2024-01-15",
          category: "education",
          excerpt: "An ambitious initiative to educate 10,000 additional children by 2025",
          downloadUrl: "/press/release-education-2024.pdf",
        },
        {
          id: 2,
          title: "Strategic partnership with the African Union",
          date: "2024-01-10",
          category: "partnership",
          excerpt: "Signing of a cooperation agreement to strengthen humanitarian actions",
          downloadUrl: "/press/release-ua-partnership.pdf",
        },
        {
          id: 3,
          title: "Annual Report 2023: 50,000 beneficiaries reached",
          date: "2024-01-05",
          category: "impact",
          excerpt: "Review of actions taken and measurable impact on communities",
          downloadUrl: "/press/annual-report-2023.pdf",
        },
      ],
      mediaKit: [
        {
          type: "logo",
          title: "Official Logos",
          description: "BAOBAB HOPE logos in different formats",
          files: ["PNG", "SVG", "EPS"],
          icon: ImageIcon,
        },
        {
          type: "photos",
          title: "Image Bank",
          description: "High resolution photos of our actions",
          files: ["JPG", "PNG"],
          icon: ImageIcon,
        },
        {
          type: "videos",
          title: "Institutional Videos",
          description: "Presentation videos and testimonials",
          files: ["MP4", "MOV"],
          icon: Video,
        },
        {
          type: "audio",
          title: "Audio Interviews",
          description: "Audio interviews and statements",
          files: ["MP3", "WAV"],
          icon: Mic,
        },
      ],
      contacts: [
        {
          name: "Marie Dubois",
          role: "Communication Manager",
          email: "presse@baobabhope.org",
          phone: "+33 1 23 45 67 89",
          languages: ["French", "English"],
        },
        {
          name: "John Smith",
          role: "International Press Officer",
          email: "press@baobabhope.org",
          phone: "+1 555 123 4567",
          languages: ["English", "Spanish"],
        },
      ],
      categories: {
        all: "All",
        education: "Education",
        health: "Health",
        environment: "Environment",
        partnership: "Partnerships",
        impact: "Impact",
      },
    },
  }

  const t = content[language] || content.en // Fallback to English

  const filteredReleases =
    selectedCategory === "all"
      ? t.pressReleases
      : t.pressReleases.filter((release) => release.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">{t.hero.description}</p>
        </div>
      </section>

      {/* Press Releases Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.sections.releases}</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(t.categories).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className="rounded-full"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Press Releases List */}
          <div className="space-y-6">
            {filteredReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <CardDescription className="text-base">{release.excerpt}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {t.categories[release.category]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(release.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t.sections.media}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.mediaKit.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {item.files.map((format) => (
                      <Badge key={format} variant="secondary">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts and Interview Request */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Press Contacts */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t.sections.contacts}</h2>
              <div className="space-y-6">
                {t.contacts.map((contact, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <CardDescription>{contact.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contact.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Interview Request Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t.sections.request}</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Demande d'Interview</CardTitle>
                  <CardDescription>Contactez-nous pour organiser une interview avec nos responsables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom du journaliste</label>
                      <Input placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Média</label>
                      <Input placeholder="Nom du média" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <Input placeholder="+33 1 23 45 67 89" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sujet de l'interview</label>
                    <Input placeholder="Thème principal de l'interview" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      placeholder="Décrivez votre demande, les questions principales, la date souhaitée..."
                      rows={4}
                    />
                  </div>

                  <Button className="w-full">Envoyer la demande</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
