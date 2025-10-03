"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { Users, Calendar, Share2, Heart, ArrowRight, Megaphone } from "lucide-react"

export default function CampaignsPage() {
  const { t } = useLanguage()

  const campaigns = [
    {
      id: 1,
      title: "Clean Water for 1000 Families",
      description:
        "Help us provide clean, safe drinking water to 1000 families in rural Bangladesh through well construction and water purification systems.",
      goal: 150000,
      raised: 89500,
      supporters: 1247,
      daysLeft: 45,
      category: "Water Access",
      status: "Active",
      image: "/images/water-project.svg",
      featured: true,
      impact: "Each $150 provides clean water access for one family for an entire year",
    },
    {
      id: 2,
      title: "Plant 50,000 Trees Initiative",
      description:
        "Join our reforestation campaign to plant 50,000 native trees across West Africa, helping combat climate change and restore ecosystems.",
      goal: 75000,
      raised: 52300,
      supporters: 892,
      daysLeft: 30,
      category: "Environment",
      status: "Active",
      image: "/images/environment-project.svg",
      featured: false,
      impact: "Every $1.50 plants one tree and supports local communities",
    },
    {
      id: 3,
      title: "Mobile Health Clinics Expansion",
      description:
        "Expand our mobile health clinic program to reach 5,000 more people in remote areas of Central America with essential healthcare services.",
      goal: 120000,
      raised: 95600,
      supporters: 654,
      daysLeft: 20,
      category: "Healthcare",
      status: "Active",
      image: "/images/healthcare-project.svg",
      featured: false,
      impact: "$24 provides medical care for one person for a month",
    },
    {
      id: 4,
      title: "Education Emergency Fund",
      description:
        "Support children's education during emergencies and crises, ensuring learning continues even in the most challenging circumstances.",
      goal: 200000,
      raised: 156800,
      supporters: 2103,
      daysLeft: 60,
      category: "Education",
      status: "Active",
      image: "/images/education-project.svg",
      featured: false,
      impact: "$50 keeps one child in school for a full month during crisis",
    },
    {
      id: 5,
      title: "Women's Empowerment Program",
      description:
        "Completed campaign that provided business training and microloans to 500 women entrepreneurs across East Africa.",
      goal: 80000,
      raised: 85400,
      supporters: 743,
      daysLeft: 0,
      category: "Empowerment",
      status: "Completed",
      image: "/images/blog-volunteer.svg",
      featured: false,
      impact: "107% funded - exceeded our goal and reached 550 women!",
    },
  ]

  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Active")
  const completedCampaigns = campaigns.filter((campaign) => campaign.status === "Completed")
  const featuredCampaign = campaigns.find((campaign) => campaign.featured)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">{t("campaigns.title")}</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {t("campaigns.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      {featuredCampaign && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Badge className="bg-red-600 hover:bg-red-700 mb-4">{t("campaigns.featured")}</Badge>
            </div>
            <Card className="overflow-hidden border-2 border-red-200">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative overflow-hidden">
                  <Image
                    src={featuredCampaign.image || "/placeholder.svg"}
                    alt={featuredCampaign.title}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 hover:bg-green-700">{featuredCampaign.status}</Badge>
                  </div>
                </div>

                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredCampaign.category}
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredCampaign.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredCampaign.description}</p>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{t("campaigns.progress")}</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((featuredCampaign.raised / featuredCampaign.goal) * 100)}%
                      </span>
                    </div>
                    <Progress value={(featuredCampaign.raised / featuredCampaign.goal) * 100} className="h-3 mb-4" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          ${featuredCampaign.raised.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{t("campaigns.raised")}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{featuredCampaign.supporters}</div>
                        <div className="text-sm text-gray-500">{t("campaigns.supporters")}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{featuredCampaign.daysLeft}</div>
                        <div className="text-sm text-gray-500">{t("campaigns.daysLeft")}</div>
                      </div>
                    </div>
                  </div>

                    <div className="bg-red-50 p-4 rounded-lg mb-6">
                      <div className="text-sm font-medium text-red-800 mb-1">{t("campaigns.impact")}:</div>
                    <div className="text-red-700">{featuredCampaign.impact}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                      <Link href="/donate">
                        <Heart className="w-4 h-4 mr-2" />
                        {t("campaigns.supportCampaign")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t("campaigns.shareCampaign")}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Active Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("campaigns.active.title")}</h2>
            <p className="text-lg text-gray-600">{t("campaigns.active.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCampaigns
              .filter((campaign) => !campaign.featured)
              .map((campaign) => (
                <Card
                  key={campaign.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 hover:bg-green-700">{campaign.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        {campaign.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{campaign.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-500">
                          {Math.round((campaign.raised / campaign.goal) * 100)}%
                        </span>
                      </div>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 mb-3" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${campaign.raised.toLocaleString()} raised</span>
                        <span>${campaign.goal.toLocaleString()} goal</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {campaign.supporters} supporters
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {campaign.daysLeft} days left
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="text-xs font-medium text-gray-700 mb-1">Impact:</div>
                      <div className="text-xs text-gray-600">{campaign.impact}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                        <Link href="/donate">{t("campaigns.support")}</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Completed Campaigns */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("campaigns.completedCampaigns.title")}</h2>
            <p className="text-lg text-gray-600">{t("campaigns.completedCampaigns.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 hover:bg-blue-700">{campaign.status}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90">
                      {campaign.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

                  <div className="mb-4">
                    <Progress value={100} className="h-2 mb-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>${campaign.goal.toLocaleString()} goal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {campaign.supporters} supporters
                    </div>
                    <div className="text-green-600 font-medium">✓ {t("campaigns.completedStatus")}</div>
                  </div>

                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="text-xs font-medium text-green-700 mb-1">{t("campaigns.finalImpact")}:</div>
                    <div className="text-xs text-green-600">{campaign.impact}</div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Link href={`/campaigns/${campaign.id}`}>
                      {t("campaigns.viewResults")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Campaigns Work */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("campaigns.howItWorks.title")}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("campaigns.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: t("campaigns.howItWorks.steps.1.title"),
                description: t("campaigns.howItWorks.steps.1.description"),
              },
              {
                step: "2",
                title: t("campaigns.howItWorks.steps.2.title"),
                description: t("campaigns.howItWorks.steps.2.description"),
              },
              {
                step: "3",
                title: t("campaigns.howItWorks.steps.3.title"),
                description: t("campaigns.howItWorks.steps.3.description"),
              },
              {
                step: "4",
                title: t("campaigns.howItWorks.steps.4.title"),
                description: t("campaigns.howItWorks.steps.4.description"),
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Megaphone className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("campaigns.startCampaign.title")}</h2>
          <p className="text-xl mb-8 text-red-100 leading-relaxed">
            {t("campaigns.startCampaign.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/contact">
                {t("campaigns.startCampaign.proposeCampaign")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-red-300 text-red-300 hover:bg-red-300 hover:text-red-800 bg-transparent"
            >
              <Link href="/donate">{t("campaigns.startCampaign.supportExisting")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
