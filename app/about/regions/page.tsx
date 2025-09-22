"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { MapPin, Users, Globe, Zap, TreePine, Heart } from "lucide-react"

export default function RegionsPage() {
  const { t } = useLanguage()

  const regions = [
    {
      name: "East Africa",
      countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia"],
      population: "25,000+",
      projects: 15,
      focus: ["Education & Literacy", "Water Access", "Healthcare"],
      coordinator: "Dr. Amara Okafor",
      established: "2021",
      image: "/images/education-project.svg",
      description:
        "Our flagship region where BAOBAB HOPE began its mission, focusing on education and community empowerment.",
      achievements: [
        "25 community libraries established",
        "15,000+ students reached",
        "150 teachers trained",
        "12 water wells constructed",
      ],
    },
    {
      name: "West Africa",
      countries: ["Ghana", "Senegal", "Mali", "Burkina Faso", "Niger"],
      population: "18,000+",
      projects: 12,
      focus: ["Environmental Conservation", "Agriculture", "Women's Empowerment"],
      coordinator: "Jean-Baptiste Dubois",
      established: "2022",
      image: "/images/environment-project.svg",
      description: "Focused on environmental restoration and sustainable agriculture practices in the Sahel region.",
      achievements: [
        "50,000+ trees planted",
        "1,200 hectares protected",
        "300 eco-guardians trained",
        "15 watersheds restored",
      ],
    },
    {
      name: "Central America",
      countries: ["Guatemala", "Honduras", "Nicaragua", "El Salvador"],
      population: "12,000+",
      projects: 8,
      focus: ["Healthcare", "Disaster Relief", "Youth Development"],
      coordinator: "Maria Rodriguez",
      established: "2023",
      image: "/images/healthcare-project.svg",
      description: "Providing essential healthcare services and building resilient communities in Central America.",
      achievements: [
        "5 mobile health clinics",
        "8,000+ patients treated",
        "80 health workers trained",
        "3 permanent health centers",
      ],
    },
    {
      name: "South Asia",
      countries: ["Bangladesh", "Nepal", "Cambodia", "Myanmar"],
      population: "20,000+",
      projects: 7,
      focus: ["Clean Water", "Disaster Preparedness", "Education"],
      coordinator: "Sarah Chen",
      established: "2024",
      image: "/images/water-project.svg",
      description: "Addressing water scarcity and building climate-resilient communities in South and Southeast Asia.",
      achievements: [
        "15 water wells constructed",
        "25 filtration systems installed",
        "30 communities trained",
        "12,000+ people served",
      ],
    },
  ]

  const regionalStats = [
    { icon: Globe, number: "18", label: "Countries" },
    { icon: Users, number: "75,000+", label: "People Reached" },
    { icon: MapPin, number: "42", label: "Active Projects" },
    { icon: Zap, number: "4", label: "Regional Offices" },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Our Regions</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Creating impact across four continents with locally-led, culturally-appropriate solutions
            </p>
          </div>
        </div>
      </section>

      {/* Regional Overview Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Global Reach</h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Our regional approach ensures deep community engagement and sustainable impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regionalStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-4 transition-all duration-300 group-hover:scale-110" />
                    <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Regional Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Regional Operations
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Each region is led by local coordinators who understand the unique challenges and opportunities
            </p>
          </div>

          <div className="space-y-12">
            {regions.map((region, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative overflow-hidden">
                    <Image
                      src={region.image || "/placeholder.svg"}
                      alt={region.name}
                      width={600}
                      height={400}
                      className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">{region.name}</div>
                      <div className="text-sm opacity-90">Established {region.established}</div>
                    </div>
                  </div>

                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500">Population Reached</div>
                        <div className="text-2xl font-bold text-red-600">{region.population}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Active Projects</div>
                        <div className="text-2xl font-bold text-red-600">{region.projects}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{region.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Countries:</h4>
                      <div className="flex flex-wrap gap-2">
                        {region.countries.map((country, idx) => (
                          <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Focus Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {region.focus.map((area, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                      <div className="space-y-2">
                        {region.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <strong>Regional Coordinator:</strong> {region.coordinator}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Approach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Regional Approach
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Why we organize our work regionally and how it maximizes our impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Local Leadership",
                description:
                  "Each region is led by coordinators from the local community who understand cultural nuances and needs.",
              },
              {
                icon: Globe,
                title: "Cultural Adaptation",
                description:
                  "Programs are adapted to local contexts, ensuring relevance and effectiveness in each region.",
              },
              {
                icon: TreePine,
                title: "Sustainable Growth",
                description: "Regional focus allows for deep, long-term relationships that create lasting change.",
              },
              {
                icon: Heart,
                title: "Community Ownership",
                description:
                  "Local communities take ownership of projects, ensuring sustainability beyond our involvement.",
              },
              {
                icon: Zap,
                title: "Efficient Operations",
                description: "Regional coordination reduces costs and improves response times for urgent needs.",
              },
              {
                icon: MapPin,
                title: "Strategic Expansion",
                description: "Thoughtful regional growth allows us to scale impact while maintaining quality.",
              },
            ].map((approach, index) => {
              const Icon = approach.icon
              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-4 transition-all duration-300 group-hover:scale-110" />
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                      {approach.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{approach.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
