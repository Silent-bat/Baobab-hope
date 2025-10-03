"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { Play, Pause, Download, Calendar, Clock, Mic, Users, Search } from "lucide-react"

export default function PodcastPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  const content = {
    fr: {
      title: "Podcast BAOBAB HOPE",
      subtitle: "Écoutez nos histoires d'impact et rencontrez nos équipes sur le terrain",
      hero: {
        title: "Voix d'Espoir",
        description:
          "Le podcast officiel de BAOBAB HOPE - Découvrez les histoires inspirantes de nos bénéficiaires et l'expertise de nos équipes",
      },
      sections: {
        latest: "Derniers Épisodes",
        categories: "Catégories",
        subscribe: "S'abonner",
        about: "À propos du Podcast",
      },
      episodes: [
        {
          id: 1,
          title: "L'éducation transforme des vies : Témoignage d'Amina",
          description:
            "Rencontre avec Amina, 16 ans, qui a pu retourner à l'école grâce à nos programmes éducatifs au Mali",
          category: "education",
          duration: "28:45",
          date: "2024-01-20",
          guests: ["Amina Traoré", "Dr. Sarah Johnson"],
          audioUrl: "/podcast/episode-1.mp3",
          transcript: "/podcast/transcript-1.pdf",
        },
        {
          id: 2,
          title: "Innovation en santé rurale : Les cliniques mobiles",
          description:
            "Comment nos cliniques mobiles révolutionnent l'accès aux soins dans les zones reculées d'Afrique",
          category: "health",
          duration: "35:12",
          date: "2024-01-15",
          guests: ["Dr. Mamadou Diallo", "Infirmière Marie Kone"],
          audioUrl: "/podcast/episode-2.mp3",
          transcript: "/podcast/transcript-2.pdf",
        },
        {
          id: 3,
          title: "Agriculture durable : Nourrir l'avenir",
          description: "Découvrez nos programmes d'agriculture durable qui transforment les communautés rurales",
          category: "environment",
          duration: "42:18",
          date: "2024-01-10",
          guests: ["Agronome Pierre Dubois", "Fermier local Kofi Asante"],
          audioUrl: "/podcast/episode-3.mp3",
          transcript: "/podcast/transcript-3.pdf",
        },
        {
          id: 4,
          title: "Partenariats stratégiques : Ensemble plus forts",
          description: "Comment nos partenariats avec les gouvernements locaux amplifient notre impact",
          category: "partnership",
          duration: "31:55",
          date: "2024-01-05",
          guests: ["Ministre de la Santé", "Directeur BAOBAB HOPE"],
          audioUrl: "/podcast/episode-4.mp3",
          transcript: "/podcast/transcript-4.pdf",
        },
      ],
      categories: {
        all: "Tous les épisodes",
        education: "Éducation",
        health: "Santé",
        environment: "Environnement",
        partnership: "Partenariats",
        testimonial: "Témoignages",
      },
      platforms: [
        { name: "Spotify", url: "https://spotify.com/baobabhope" },
        { name: "Apple Podcasts", url: "https://podcasts.apple.com/baobabhope" },
        { name: "Google Podcasts", url: "https://podcasts.google.com/baobabhope" },
        { name: "Deezer", url: "https://deezer.com/baobabhope" },
      ],
      about: {
        title: "À propos de Voix d'Espoir",
        description:
          "Voix d'Espoir est le podcast officiel de BAOBAB HOPE, où nous partageons les histoires inspirantes de nos bénéficiaires, l'expertise de nos équipes terrain, et les innovations qui transforment des vies à travers l'Afrique et l'Amérique Centrale.",
        host: "Animé par Marie Dubois, journaliste et responsable communication de BAOBAB HOPE",
        frequency: "Nouvel épisode chaque mercredi",
      },
    },
    en: {
      title: "BAOBAB HOPE Podcast",
      subtitle: "Listen to our impact stories and meet our field teams",
      hero: {
        title: "Voices of Hope",
        description:
          "The official BAOBAB HOPE podcast - Discover inspiring stories from our beneficiaries and expertise from our teams",
      },
      sections: {
        latest: "Latest Episodes",
        categories: "Categories",
        subscribe: "Subscribe",
        about: "About the Podcast",
      },
      episodes: [
        {
          id: 1,
          title: "Education transforms lives: Amina's testimony",
          description: "Meet Amina, 16, who was able to return to school thanks to our educational programs in Mali",
          category: "education",
          duration: "28:45",
          date: "2024-01-20",
          guests: ["Amina Traoré", "Dr. Sarah Johnson"],
          audioUrl: "/podcast/episode-1.mp3",
          transcript: "/podcast/transcript-1.pdf",
        },
        {
          id: 2,
          title: "Innovation in rural health: Mobile clinics",
          description: "How our mobile clinics are revolutionizing access to care in remote areas of Africa",
          category: "health",
          duration: "35:12",
          date: "2024-01-15",
          guests: ["Dr. Mamadou Diallo", "Nurse Marie Kone"],
          audioUrl: "/podcast/episode-2.mp3",
          transcript: "/podcast/transcript-2.pdf",
        },
        {
          id: 3,
          title: "Sustainable agriculture: Feeding the future",
          description: "Discover our sustainable agriculture programs that are transforming rural communities",
          category: "environment",
          duration: "42:18",
          date: "2024-01-10",
          guests: ["Agronomist Pierre Dubois", "Local Farmer Kofi Asante"],
          audioUrl: "/podcast/episode-3.mp3",
          transcript: "/podcast/transcript-3.pdf",
        },
        {
          id: 4,
          title: "Strategic partnerships: Stronger together",
          description: "How our partnerships with local governments amplify our impact",
          category: "partnership",
          duration: "31:55",
          date: "2024-01-05",
          guests: ["Minister of Health", "BAOBAB HOPE Director"],
          audioUrl: "/podcast/episode-4.mp3",
          transcript: "/podcast/transcript-4.pdf",
        },
      ],
      categories: {
        all: "All episodes",
        education: "Education",
        health: "Health",
        environment: "Environment",
        partnership: "Partnerships",
        testimonial: "Testimonials",
      },
      platforms: [
        { name: "Spotify", url: "https://spotify.com/baobabhope" },
        { name: "Apple Podcasts", url: "https://podcasts.apple.com/baobabhope" },
        { name: "Google Podcasts", url: "https://podcasts.google.com/baobabhope" },
        { name: "Deezer", url: "https://deezer.com/baobabhope" },
      ],
      about: {
        title: "About Voices of Hope",
        description:
          "Voices of Hope is BAOBAB HOPE's official podcast, where we share inspiring stories from our beneficiaries, expertise from our field teams, and innovations that transform lives across Africa and Central America.",
        host: "Hosted by Marie Dubois, journalist and communication manager at BAOBAB HOPE",
        frequency: "New episode every Wednesday",
      },
    },
  }

  const t = content[language] || content.en // Fallback to English

  const filteredEpisodes = t.episodes.filter((episode) => {
    const matchesCategory = selectedCategory === "all" || episode.category === selectedCategory
    const matchesSearch =
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const togglePlay = (episodeId: number) => {
    setCurrentlyPlaying(currentlyPlaying === episodeId ? null : episodeId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Mic className="w-10 h-10" />
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
                placeholder="Rechercher un épisode..."
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

      {/* Episodes List */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">{t.sections.latest}</h2>

          <div className="space-y-6">
            {filteredEpisodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Episode Artwork */}
                    <div className="w-full md:w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mic className="w-16 h-16 text-white" />
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
                          <p className="text-gray-600 mb-4">{episode.description}</p>
                        </div>
                        <Badge variant="outline">{t.categories[episode.category]}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(episode.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {episode.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {episode.guests.join(", ")}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => togglePlay(episode.id)} className="flex items-center gap-2">
                          {currentlyPlaying === episode.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {currentlyPlaying === episode.id ? "Pause" : "Écouter"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm">
                          Transcript
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">{t.sections.subscribe}</h2>
          <p className="text-gray-600 mb-8">Abonnez-vous sur votre plateforme préférée pour ne manquer aucun épisode</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.platforms.map((platform) => (
              <Button key={platform.name} variant="outline" className="h-16 bg-transparent" asChild>
                <a href={platform.url} target="_blank" rel="noopener noreferrer">
                  {platform.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t.about.title}</h2>
              <p className="text-gray-600 mb-6">{t.about.description}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-purple-600" />
                  <span>{t.about.host}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>{t.about.frequency}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter Podcast</CardTitle>
                <CardDescription>Recevez les nouveaux épisodes directement dans votre boîte mail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Votre adresse email" type="email" />
                <Button className="w-full">S'abonner à la newsletter</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
