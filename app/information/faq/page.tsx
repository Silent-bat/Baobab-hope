"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"
import { Search, ChevronDown, ChevronUp, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react"

export default function FAQPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const content = {
    fr: {
      title: "Questions Fréquentes",
      subtitle: "Trouvez rapidement les réponses à vos questions sur BAOBAB HOPE",
      hero: {
        title: "FAQ - Foire Aux Questions",
        description:
          "Découvrez les réponses aux questions les plus fréquemment posées sur nos missions, programmes et façons de nous soutenir",
      },
      sections: {
        search: "Rechercher une question",
        categories: "Catégories",
        contact: "Besoin d'aide supplémentaire ?",
        ask: "Poser une question",
      },
      faqs: [
        {
          id: 1,
          question: "Qu'est-ce que BAOBAB HOPE et quelle est sa mission ?",
          answer:
            "BAOBAB HOPE est une organisation humanitaire internationale fondée en 2010, dédiée à l'amélioration des conditions de vie des populations vulnérables en Afrique et en Amérique Centrale. Notre mission est de fournir un accès équitable à l'éducation, aux soins de santé, à l'eau potable et aux opportunités économiques durables.",
          category: "general",
          popular: true,
        },
        {
          id: 2,
          question: "Dans quels pays BAOBAB HOPE intervient-elle ?",
          answer:
            "Nous intervenons actuellement dans 12 pays : Mali, Burkina Faso, Niger, Sénégal, Côte d'Ivoire, Ghana, Kenya, Tanzanie, Guatemala, Honduras, Nicaragua et El Salvador. Nos programmes s'adaptent aux besoins spécifiques de chaque région.",
          category: "general",
          popular: true,
        },
        {
          id: 3,
          question: "Comment puis-je faire un don à BAOBAB HOPE ?",
          answer:
            "Vous pouvez faire un don de plusieurs façons : en ligne sur notre site web, par virement bancaire, par chèque, ou en devenant donateur régulier. Nous acceptons les dons ponctuels et récurrents. Tous les dons sont déductibles fiscalement selon la législation en vigueur.",
          category: "donation",
          popular: true,
        },
        {
          id: 4,
          question: "Mes dons sont-ils déductibles fiscalement ?",
          answer:
            "Oui, BAOBAB HOPE est reconnue d'utilité publique. En France, vous bénéficiez d'une réduction d'impôt de 66% du montant de votre don (dans la limite de 20% de votre revenu imposable). Un reçu fiscal vous sera automatiquement envoyé.",
          category: "donation",
          popular: false,
        },
        {
          id: 5,
          question: "Comment devenir bénévole chez BAOBAB HOPE ?",
          answer:
            "Nous accueillons des bénévoles dans nos bureaux locaux et sur le terrain. Vous pouvez postuler via notre formulaire en ligne, participer à nos événements locaux, ou rejoindre nos groupes de bénévoles dans votre région. Aucune expérience préalable n'est requise, juste la motivation d'aider !",
          category: "volunteer",
          popular: true,
        },
        {
          id: 6,
          question: "Quelles sont les opportunités de carrière chez BAOBAB HOPE ?",
          answer:
            "Nous recrutons régulièrement des professionnels dans différents domaines : gestion de projet, logistique, santé, éducation, finance, communication. Consultez notre page 'Offres d'emploi' pour voir les postes disponibles. Nous valorisons la diversité et l'inclusion dans nos équipes.",
          category: "career",
          popular: false,
        },
        {
          id: 7,
          question: "Comment BAOBAB HOPE assure-t-elle la transparence financière ?",
          answer:
            "Nous publions annuellement nos comptes certifiés par un commissaire aux comptes indépendant. 85% de nos ressources sont directement affectées aux programmes terrain. Vous pouvez consulter nos rapports financiers dans la section 'Transparence financière' de notre site.",
          category: "transparency",
          popular: false,
        },
        {
          id: 8,
          question: "Puis-je visiter vos projets sur le terrain ?",
          answer:
            "Nous organisons régulièrement des voyages de découverte pour nos donateurs et partenaires. Ces visites permettent de voir concrètement l'impact de nos actions. Contactez-nous pour connaître les prochaines dates et modalités de participation.",
          category: "programs",
          popular: false,
        },
        {
          id: 9,
          question: "Comment puis-je recevoir des nouvelles de vos actions ?",
          answer:
            "Abonnez-vous à notre newsletter mensuelle, suivez-nous sur les réseaux sociaux (Facebook, Twitter, LinkedIn, Instagram), ou consultez régulièrement notre blog. Nous publions également un rapport annuel détaillé de nos activités.",
          category: "communication",
          popular: false,
        },
        {
          id: 10,
          question: "BAOBAB HOPE travaille-t-elle avec d'autres organisations ?",
          answer:
            "Oui, nous collaborons avec de nombreux partenaires : ONG locales, gouvernements, entreprises, fondations, et organisations internationales comme l'UNICEF et l'OMS. Ces partenariats nous permettent d'amplifier notre impact et d'éviter les doublons.",
          category: "partnerships",
          popular: false,
        },
      ],
      categories: {
        all: "Toutes les questions",
        general: "Informations générales",
        donation: "Dons et financement",
        volunteer: "Bénévolat",
        career: "Carrières",
        programs: "Nos programmes",
        transparency: "Transparence",
        communication: "Communication",
        partnerships: "Partenariats",
      },
      contact: {
        title: "Vous ne trouvez pas votre réponse ?",
        description:
          "Notre équipe est là pour vous aider. Contactez-nous par email, téléphone ou via notre formulaire.",
        email: "contact@baobabhope.org",
        phone: "+33 1 23 45 67 89",
        hours: "Lundi - Vendredi : 9h - 18h",
      },
      askForm: {
        title: "Poser une nouvelle question",
        name: "Nom complet",
        email: "Adresse email",
        subject: "Sujet",
        question: "Votre question",
        submit: "Envoyer la question",
      },
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Quickly find answers to your questions about BAOBAB HOPE",
      hero: {
        title: "FAQ - Frequently Asked Questions",
        description:
          "Discover answers to the most frequently asked questions about our missions, programs and ways to support us",
      },
      sections: {
        search: "Search for a question",
        categories: "Categories",
        contact: "Need additional help?",
        ask: "Ask a question",
      },
      faqs: [
        {
          id: 1,
          question: "What is BAOBAB HOPE and what is its mission?",
          answer:
            "BAOBAB HOPE is an international humanitarian organization founded in 2010, dedicated to improving the living conditions of vulnerable populations in Africa and Central America. Our mission is to provide equitable access to education, healthcare, clean water and sustainable economic opportunities.",
          category: "general",
          popular: true,
        },
        {
          id: 2,
          question: "In which countries does BAOBAB HOPE operate?",
          answer:
            "We currently operate in 12 countries: Mali, Burkina Faso, Niger, Senegal, Ivory Coast, Ghana, Kenya, Tanzania, Guatemala, Honduras, Nicaragua and El Salvador. Our programs adapt to the specific needs of each region.",
          category: "general",
          popular: true,
        },
        {
          id: 3,
          question: "How can I donate to BAOBAB HOPE?",
          answer:
            "You can donate in several ways: online on our website, by bank transfer, by check, or by becoming a regular donor. We accept one-time and recurring donations. All donations are tax deductible according to current legislation.",
          category: "donation",
          popular: true,
        },
        {
          id: 4,
          question: "Are my donations tax deductible?",
          answer:
            "Yes, BAOBAB HOPE is recognized as a public utility. In France, you benefit from a tax reduction of 66% of the amount of your donation (within the limit of 20% of your taxable income). A tax receipt will be automatically sent to you.",
          category: "donation",
          popular: false,
        },
        {
          id: 5,
          question: "How to become a volunteer at BAOBAB HOPE?",
          answer:
            "We welcome volunteers in our local offices and in the field. You can apply via our online form, participate in our local events, or join our volunteer groups in your region. No prior experience required, just the motivation to help!",
          category: "volunteer",
          popular: true,
        },
        {
          id: 6,
          question: "What are the career opportunities at BAOBAB HOPE?",
          answer:
            "We regularly recruit professionals in different fields: project management, logistics, health, education, finance, communication. Check our 'Job Offers' page to see available positions. We value diversity and inclusion in our teams.",
          category: "career",
          popular: false,
        },
        {
          id: 7,
          question: "How does BAOBAB HOPE ensure financial transparency?",
          answer:
            "We annually publish our accounts certified by an independent auditor. 85% of our resources are directly allocated to field programs. You can consult our financial reports in the 'Financial Transparency' section of our site.",
          category: "transparency",
          popular: false,
        },
        {
          id: 8,
          question: "Can I visit your field projects?",
          answer:
            "We regularly organize discovery trips for our donors and partners. These visits allow you to see concretely the impact of our actions. Contact us to know the next dates and participation modalities.",
          category: "programs",
          popular: false,
        },
        {
          id: 9,
          question: "How can I receive news about your actions?",
          answer:
            "Subscribe to our monthly newsletter, follow us on social media (Facebook, Twitter, LinkedIn, Instagram), or regularly check our blog. We also publish a detailed annual report of our activities.",
          category: "communication",
          popular: false,
        },
        {
          id: 10,
          question: "Does BAOBAB HOPE work with other organizations?",
          answer:
            "Yes, we collaborate with many partners: local NGOs, governments, companies, foundations, and international organizations like UNICEF and WHO. These partnerships allow us to amplify our impact and avoid duplications.",
          category: "partnerships",
          popular: false,
        },
      ],
      categories: {
        all: "All questions",
        general: "General information",
        donation: "Donations and funding",
        volunteer: "Volunteering",
        career: "Careers",
        programs: "Our programs",
        transparency: "Transparency",
        communication: "Communication",
        partnerships: "Partnerships",
      },
      contact: {
        title: "Can't find your answer?",
        description: "Our team is here to help you. Contact us by email, phone or via our form.",
        email: "contact@baobabhope.org",
        phone: "+33 1 23 45 67 89",
        hours: "Monday - Friday: 9am - 6pm",
      },
      askForm: {
        title: "Ask a new question",
        name: "Full name",
        email: "Email address",
        subject: "Subject",
        question: "Your question",
        submit: "Send question",
      },
    },
  }

  const t = content[language]

  const filteredFAQs = t.faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularFAQs = filteredFAQs.filter((faq) => faq.popular)
  const regularFAQs = filteredFAQs.filter((faq) => !faq.popular)

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const FAQItem = ({ faq }: { faq: (typeof t.faqs)[0] }) => {
    const isExpanded = expandedItems.includes(faq.id)

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(faq.id)}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg pr-4">{faq.question}</CardTitle>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <HelpCircle className="w-10 h-10" />
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
                placeholder={t.sections.search}
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

      {/* Popular FAQs */}
      {popularFAQs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Questions Populaires</h2>

            <div className="space-y-4">
              {popularFAQs.map((faq) => (
                <FAQItem key={faq.id} faq={faq} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All FAQs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Toutes les Questions</h2>

          <div className="space-y-4">
            {regularFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune question trouvée</h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche ou posez une nouvelle question.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact and Ask Question */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t.contact.title}</h2>
              <p className="text-gray-600 mb-8">{t.contact.description}</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href={`mailto:${t.contact.email}`} className="text-emerald-600 hover:underline">
                      {t.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Téléphone</h3>
                    <p className="text-gray-600">{t.contact.phone}</p>
                    <p className="text-sm text-gray-500">{t.contact.hours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat en direct</h3>
                    <p className="text-gray-600">Disponible sur notre site web</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ask Question Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t.askForm.title}</CardTitle>
                <CardDescription>
                  Votre question sera traitée par notre équipe et pourra être ajoutée à cette FAQ.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.askForm.name}</label>
                    <Input placeholder="Votre nom complet" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.askForm.email}</label>
                    <Input type="email" placeholder="votre@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.askForm.subject}</label>
                  <Input placeholder="Sujet de votre question" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.askForm.question}</label>
                  <Textarea placeholder="Décrivez votre question en détail..." rows={4} />
                </div>

                <Button className="w-full">{t.askForm.submit}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
