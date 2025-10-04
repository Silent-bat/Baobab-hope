"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/components/language-provider"
import {
  MapPin,
  Calendar,
  Users,
  Target,
  Heart,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Share2,
  BookOpen,
  Leaf,
  Droplets,
} from "lucide-react"

export default function ProjectDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [donationAmount, setDonationAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [isMonthly, setIsMonthly] = useState(false)

  const handleMonthlyChange = (checked: boolean | "indeterminate") => {
    setIsMonthly(checked === true)
  }

  // Mock project data - in real app, this would come from API
  const projects = {
    "1": {
      id: 1,
      title: t("projects.education.title"),
      description: t("projects.education.description"),
      location: "Kenya, Tanzania, Uganda",
      startDate: "2021",
      endDate: t("common.ongoing"),
      beneficiaries: "15,000+",
      progress: 85,
      goal: 120000,
      raised: 102000,
      image: "/images/projects/project-education.jpg",
      category: "Education",
      icon: BookOpen,
      color: "from-blue-500 to-purple-600",
      highlights: [
        "Built 25 community libraries",
        "Trained 150 local teachers",
        "Distributed 10,000 textbooks",
        "Established 12 computer labs",
        "Reached 15,000+ students",
      ],
      impact: {
        "Libraries Built": 25,
        "Teachers Trained": 150,
        "Students Reached": "15,000+",
        "Literacy Rate Improvement": "85%",
      },
      story:
        "In rural communities across East Africa, access to quality education has been a persistent challenge. Our Education & Literacy Program addresses this by building sustainable educational infrastructure and training local teachers. Since 2021, we've established 25 community libraries, each serving as a hub for learning and community engagement. Our teacher training program has equipped 150 educators with modern teaching methods and resources, directly impacting over 15,000 students. The program focuses on local language literacy while also introducing English and digital literacy skills essential for the modern world.",
      updates: [
        {
          date: "2024-05-15",
          title: "New Library Opens in Mombasa",
          content:
            "Our 25th community library opened its doors, featuring over 2,000 books and digital learning resources.",
        },
        {
          date: "2024-04-20",
          title: "Teacher Training Milestone",
          content: "We've successfully trained our 150th teacher, reaching our initial goal ahead of schedule.",
        },
        {
          date: "2024-03-10",
          title: "Digital Literacy Expansion",
          content: "Launched computer labs in 12 schools, bringing digital education to rural communities.",
        },
      ],
    },
    "2": {
      id: 2,
      title: t("projects.environment.title"),
      description: t("projects.environment.description"),
      location: "Madagascar, Senegal, Ghana",
      startDate: "2022",
      endDate: "2026",
      beneficiaries: "25,000+",
      progress: 70,
      goal: 200000,
      raised: 140000,
      image: "/images/projects/project-environment.jpg",
      category: "Environment",
      icon: Leaf,
      color: "from-green-500 to-teal-600",
      highlights: [
        "Planted 50,000 trees",
        "Protected 1,200 hectares",
        "Trained 300 eco-guardians",
        "Restored 15 watersheds",
        "Reduced deforestation by 40%",
      ],
      impact: {
        "Trees Planted": "50,000+",
        "Land Protected": "1,200 hectares",
        "Eco-guardians Trained": 300,
        "Carbon Offset": "2,500 tons",
      },
      story:
        "Climate change and deforestation threaten the livelihoods of millions across Africa. Our Environmental Conservation Initiative works directly with local communities to restore degraded landscapes and implement sustainable land management practices. We've planted over 50,000 native trees, creating green corridors that support biodiversity and provide economic opportunities through sustainable forestry. Our eco-guardian program trains community members in conservation techniques, creating local employment while protecting precious ecosystems.",
      updates: [
        {
          date: "2024-05-20",
          title: "Reforestation Milestone Reached",
          content: "Celebrated planting our 50,000th tree with community partners in Madagascar.",
        },
        {
          date: "2024-04-15",
          title: "Watershed Restoration Complete",
          content: "Successfully restored 15 critical watersheds, improving water security for thousands.",
        },
      ],
    },
    "3": {
      id: 3,
      title: t("projects.healthcare.title"),
      description: t("projects.healthcare.description"),
      location: "Guatemala, Honduras, Nicaragua",
      startDate: "2023",
      endDate: "2025",
      beneficiaries: "8,000+",
      progress: 60,
      goal: 80000,
      raised: 48000,
      image: "/images/projects/project-healthcare.jpg",
      category: "Healthcare",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      highlights: [
        "5 mobile health clinics",
        "Vaccinated 3,000 children",
        "Trained 80 health workers",
        "Provided 10,000 medical consultations",
        "Established 3 health centers",
      ],
      impact: {
        "Mobile Clinics": 5,
        "Children Vaccinated": "3,000+",
        "Health Workers Trained": 80,
        "Medical Consultations": "10,000+",
      },
      story:
        "In remote areas of Central America, healthcare access remains a critical challenge. Our Community Health Program brings medical services directly to underserved communities through mobile clinics and community health worker training. We've established 5 mobile health units that travel to remote villages, providing essential medical care, vaccinations, and health education. Our community health worker program trains local residents to provide basic healthcare services and health education, creating a sustainable healthcare network that serves long after our direct intervention ends.",
      updates: [
        {
          date: "2024-05-10",
          title: "Vaccination Campaign Success",
          content: "Completed vaccination campaign reaching 3,000 children across 50 remote villages.",
        },
        {
          date: "2024-04-05",
          title: "New Health Center Opens",
          content: "Opened our third permanent health center, expanding access to maternal and child health services.",
        },
      ],
    },
    "4": {
      id: 4,
      title: t("projects.water.title"),
      description: t("projects.water.description"),
      location: "Bangladesh, Nepal, Cambodia",
      startDate: "2024",
      endDate: "2026",
      beneficiaries: "12,000+",
      progress: 45,
      goal: 150000,
      raised: 67500,
      image: "/images/projects/project-water.jpg",
      category: "Water",
      icon: Droplets,
      color: "from-cyan-500 to-blue-600",
      highlights: [
        "15 water wells constructed",
        "Water filtration systems installed",
        "Community maintenance training",
        "Hygiene education programs",
        "Water quality monitoring",
      ],
      impact: {
        "Wells Constructed": 15,
        "People Served": "12,000+",
        "Filtration Systems": 25,
        "Communities Trained": 30,
      },
      story:
        "Access to clean water is fundamental to health and development. Our Clean Water Access Project addresses water scarcity in rural communities across South and Southeast Asia. We construct sustainable water wells and install filtration systems while training local communities in maintenance and water conservation. Our approach ensures long-term sustainability by building local capacity and establishing community-led water management systems.",
      updates: [
        {
          date: "2024-05-25",
          title: "15th Water Well Completed",
          content: "Completed construction of our 15th water well, now serving over 800 families in rural Bangladesh.",
        },
        {
          date: "2024-04-30",
          title: "Filtration System Expansion",
          content:
            "Installed 25 household water filtration systems, ensuring safe drinking water for vulnerable families.",
        },
      ],
    },
  }

  const project = projects[params.id as keyof typeof projects]

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = project.icon
  const predefinedAmounts = [25, 50, 100, 250, 500]

  const handleDonate = () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : donationAmount
    alert(`Processing donation of $${amount}${isMonthly ? " monthly" : ""} for ${project.title}...`)
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image src={project.image || "/images/projects/project-education.jpg"} alt={project.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link
              href="/projects"
              className="inline-flex items-center text-white mb-6 hover:text-red-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("project.back")}
            </Link>

            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <Icon className="w-8 h-8 text-red-400" />
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-poppins">{project.title}</h1>

              <p className="text-xl text-gray-200 leading-relaxed">{project.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Info */}
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <MapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">{t("project.location")}</div>
                      <div className="font-semibold">{project.location}</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">{t("project.duration")}</div>
                      <div className="font-semibold">
                        {project.startDate} - {project.endDate}
                      </div>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">{t("project.beneficiaries")}</div>
                      <div className="font-semibold">{project.beneficiaries}</div>
                    </div>
                    <div className="text-center">
                      <Target className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">{t("project.progress")}</div>
                      <div className="font-semibold">{project.progress}%</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{t("project.funding")}</span>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3 mb-4" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t("project.raised")}: ${project.raised.toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        {t("project.goal")}: ${project.goal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t("project.story")}</h3>
                    <p className="text-gray-600 leading-relaxed">{project.story}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("project.impact")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(project.impact).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">{value}</div>
                        <div className="text-sm text-gray-600">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("project.achievements")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("project.updates")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {project.updates.map((update, index) => (
                      <div key={index} className="border-l-4 border-red-600 pl-4">
                        <div className="text-sm text-gray-500 mb-1">{new Date(update.date).toLocaleDateString()}</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{update.title}</h4>
                        <p className="text-gray-600">{update.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span>{t("project.support.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t("project.amount")}</Label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={donationAmount === amount ? "default" : "outline"}
                          size="sm"
                          className={
                            donationAmount === amount
                              ? "bg-red-600 hover:bg-red-700"
                              : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          }
                          onClick={() => {
                            setDonationAmount(amount)
                            setCustomAmount("")
                          }}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>

                    <Input
                      type="number"
                      placeholder={t("project.custom")}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setDonationAmount(0)
                      }}
                      className="mb-4"
                    />
                  </div>

                  {/* Monthly Option */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="monthly"
                      checked={isMonthly}
                      onCheckedChange={handleMonthlyChange}
                    />
                    <Label htmlFor="monthly" className="text-sm">
                      {t("project.monthly")}
                    </Label>
                  </div>

                  {/* Donate Button */}
                  <Button onClick={handleDonate} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3" size="lg">
                    <DollarSign className="w-5 h-5 mr-2" />
                    {t("project.donate")} ${customAmount || donationAmount}
                    {isMonthly && "/month"}
                  </Button>

                  {/* Share */}
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      {t("project.share")}
                    </Button>
                  </div>

                  {/* Impact Info */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">{t("project.impact.info")}</h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <div>$25 - Provides educational materials for 5 students</div>
                      <div>$50 - Supports teacher training for 1 month</div>
                      <div>$100 - Builds classroom resources for 20 students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
