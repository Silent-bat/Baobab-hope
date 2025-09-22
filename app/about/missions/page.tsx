"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Target, Heart, Globe, Users, Leaf, BookOpen, Shield, Lightbulb } from "lucide-react"

export default function MissionsPage() {
  const { t } = useLanguage()

  const missions = [
    {
      icon: BookOpen,
      title: "Education & Literacy",
      description:
        "Providing quality education and literacy programs to empower communities with knowledge and skills for sustainable development.",
      goals: [
        "Establish community learning centers",
        "Train local educators",
        "Develop culturally relevant curricula",
        "Promote digital literacy",
      ],
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Leaf,
      title: "Environmental Conservation",
      description:
        "Protecting ecosystems and promoting sustainable practices to ensure a healthy planet for future generations.",
      goals: [
        "Reforestation and biodiversity protection",
        "Sustainable agriculture training",
        "Clean energy initiatives",
        "Environmental education",
      ],
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Heart,
      title: "Community Health",
      description: "Improving access to healthcare services and promoting health education in underserved communities.",
      goals: [
        "Mobile health clinics",
        "Community health worker training",
        "Preventive care programs",
        "Health education initiatives",
      ],
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Community Empowerment",
      description:
        "Building local capacity and leadership to create self-sustaining communities that can thrive independently.",
      goals: [
        "Leadership development programs",
        "Economic empowerment initiatives",
        "Community organizing",
        "Local governance support",
      ],
      color: "from-orange-500 to-red-600",
    },
  ]

  const coreValues = [
    {
      icon: Target,
      title: "Sustainability",
      description: "We focus on long-term solutions that create lasting positive change in communities.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "We maintain complete openness in our operations, finances, and impact measurement.",
    },
    {
      icon: Globe,
      title: "Cultural Respect",
      description: "We honor local traditions and work within cultural contexts to ensure appropriate solutions.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace creative approaches and new technologies to maximize our impact.",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Our Missions</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Dedicated to creating sustainable change through education, conservation, health, and community
              empowerment
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">Our Core Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            To nurture sustainable growth in communities through education, empowerment, and environmental stewardship,
            creating lasting positive change that spans generations. Like the mighty baobab tree, we believe in deep
            roots, strong growth, and enduring impact that benefits entire ecosystems of human development.
          </p>
        </div>
      </section>

      {/* Mission Areas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Mission Areas</h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Our comprehensive approach addresses multiple interconnected challenges facing communities worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {missions.map((mission, index) => {
              const Icon = mission.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${mission.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    ></div>
                    <Icon className="w-16 h-16 text-red-600 mb-6 transition-all duration-300 group-hover:scale-110" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {mission.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{mission.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Goals:</h4>
                      {mission.goals.map((goal, idx) => (
                        <div key={idx} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Our Core Values</h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              The principles that guide every decision we make and every action we take
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-6 transition-all duration-300 group-hover:scale-110" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in-up">Join Our Mission</h2>
          <p
            className="text-xl mb-8 text-red-100 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Together, we can create lasting change that transforms communities and builds a better future for all.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="/donate"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Support Our Mission
            </a>
            <a
              href="/contact"
              className="border-2 border-red-300 text-red-300 hover:bg-red-300 hover:text-red-800 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
