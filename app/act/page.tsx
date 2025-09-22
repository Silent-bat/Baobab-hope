"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import {
  Users,
  Megaphone,
  GraduationCap,
  Briefcase,
  Handshake,
  Heart,
  Shield,
  ArrowRight,
  Clock,
  Globe,
  Award,
} from "lucide-react"

export default function ActPage() {
  const { t } = useLanguage()

  const actionSections = [
    {
      title: t("nav.act.volunteering"),
      description: "Join our global community of volunteers making a difference in communities worldwide",
      icon: Users,
      href: "/act/volunteering",
      color: "from-blue-500 to-blue-600",
      stats: "850+ active volunteers",
      features: ["Remote & field opportunities", "Flexible scheduling", "Training provided", "Global community"],
    },
    {
      title: t("nav.act.campaigns"),
      description: "Support our targeted campaigns to create specific, measurable impact",
      icon: Megaphone,
      href: "/act/campaigns",
      color: "from-green-500 to-green-600",
      stats: "15 active campaigns",
      features: ["Transparent goals", "Real-time updates", "Direct impact", "Community-driven"],
    },
    {
      title: t("nav.act.training"),
      description: "Build your skills and knowledge to maximize your impact in development work",
      icon: GraduationCap,
      href: "/act/training",
      color: "from-purple-500 to-purple-600",
      stats: "50+ courses available",
      features: ["Online & in-person", "Certification programs", "Expert instructors", "Practical skills"],
    },
    {
      title: t("nav.act.jobs"),
      description: "Join our team and make a career out of making a difference",
      icon: Briefcase,
      href: "/act/jobs",
      color: "from-orange-500 to-orange-600",
      stats: "12 open positions",
      features: ["Competitive benefits", "Global opportunities", "Professional growth", "Meaningful work"],
    },
    {
      title: t("nav.act.partners"),
      description: "Partner with us to amplify your impact and reach more communities",
      icon: Handshake,
      href: "/act/partners",
      color: "from-teal-500 to-teal-600",
      stats: "200+ active partners",
      features: ["Strategic partnerships", "Resource sharing", "Joint initiatives", "Global network"],
    },
    {
      title: t("nav.act.legacy"),
      description: "Create a lasting legacy through planned giving and estate donations",
      icon: Heart,
      href: "/act/legacy",
      color: "from-pink-500 to-pink-600",
      stats: "Legacy program available",
      features: ["Estate planning", "Tax benefits", "Lasting impact", "Professional guidance"],
    },
    {
      title: t("nav.act.lifeInsurance"),
      description: "Use life insurance as a tool for charitable giving and impact",
      icon: Shield,
      href: "/act/life-insurance",
      color: "from-indigo-500 to-indigo-600",
      stats: "Insurance giving options",
      features: ["Tax advantages", "Flexible options", "Professional advice", "Significant impact"],
    },
  ]

  const impactStats = [
    { icon: Users, number: "10,000+", label: "People Taking Action", color: "from-blue-400 to-blue-500" },
    { icon: Globe, number: "18", label: "Countries with Supporters", color: "from-green-400 to-green-500" },
    { icon: Award, number: "95%", label: "Satisfaction Rate", color: "from-purple-400 to-purple-500" },
    { icon: Clock, number: "24/7", label: "Support Available", color: "from-orange-400 to-orange-500" },
  ]

  const featuredOpportunities = [
    {
      title: "Emergency Response Volunteer",
      description: "Join our rapid response team for humanitarian emergencies",
      type: "Volunteer",
      urgency: "Urgent",
      location: "Remote/Field",
      href: "/act/volunteering",
    },
    {
      title: "Clean Water Campaign",
      description: "Help us provide clean water to 1,000 families in Bangladesh",
      type: "Campaign",
      urgency: "Active",
      location: "Global Support",
      href: "/act/campaigns",
    },
    {
      title: "Program Manager - East Africa",
      description: "Lead our education programs across Kenya, Tanzania, and Uganda",
      type: "Job",
      urgency: "New",
      location: "Nairobi, Kenya",
      href: "/act/jobs",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Take Action with Us</h1>
            <p
              className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Discover meaningful ways to get involved and create lasting change in communities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Action Community</h2>
            <p className="text-lg text-gray-600">Join thousands of people already making a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-lg text-gray-600">Urgent and high-impact ways to get involved right now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {opportunity.type}
                    </span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        opportunity.urgency === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : opportunity.urgency === "New"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {opportunity.urgency}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={opportunity.href} className="flex items-center justify-center">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Action Sections Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ways to Take Action</h2>
            <p className="text-lg text-gray-600">Choose the path that matches your interests and availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actionSections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    ></div>

                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} mr-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{section.stats}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {section.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button asChild className="w-full group-hover:scale-105 transition-transform duration-300">
                      <Link href={section.href} className="flex items-center justify-center">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Every action, no matter how small, contributes to creating lasting change in communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/donate" className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/contact" className="flex items-center">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
