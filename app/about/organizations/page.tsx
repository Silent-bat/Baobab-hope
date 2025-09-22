"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Building, Users, Globe, Award, Heart, Target } from "lucide-react"

export default function OrganizationsPage() {
  const { t } = useLanguage()

  const organizationalStructure = [
    {
      title: "Board of Directors",
      description: "Strategic oversight and governance of BAOBAB HOPE's mission and operations.",
      members: 7,
      icon: Building,
      responsibilities: ["Strategic planning", "Financial oversight", "Policy development", "Executive supervision"],
    },
    {
      title: "Executive Team",
      description: "Day-to-day leadership and management of programs and operations.",
      members: 5,
      icon: Users,
      responsibilities: ["Program management", "Operations oversight", "Staff leadership", "Stakeholder relations"],
    },
    {
      title: "Regional Coordinators",
      description: "Local leadership ensuring culturally appropriate and effective program implementation.",
      members: 18,
      icon: Globe,
      responsibilities: ["Local program oversight", "Community relations", "Cultural adaptation", "Regional reporting"],
    },
    {
      title: "Advisory Council",
      description: "Expert guidance on specialized areas including health, education, and environmental issues.",
      members: 12,
      icon: Award,
      responsibilities: ["Technical expertise", "Strategic advice", "Quality assurance", "Best practices"],
    },
  ]

  const departments = [
    {
      name: "Programs & Impact",
      description: "Designs, implements, and evaluates our core programs across education, health, and environment.",
      staff: 25,
      color: "from-blue-500 to-purple-600",
    },
    {
      name: "Operations & Finance",
      description: "Manages organizational operations, financial planning, and resource allocation.",
      staff: 12,
      color: "from-green-500 to-teal-600",
    },
    {
      name: "Communications & Outreach",
      description: "Handles public relations, marketing, donor communications, and community engagement.",
      staff: 8,
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Human Resources",
      description: "Manages staff development, recruitment, training, and organizational culture.",
      staff: 6,
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Our Organization</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              A dedicated team of professionals working together to create sustainable change worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Organizational Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">
            About Our Organization
          </h2>
          <p
            className="text-xl text-gray-600 leading-relaxed mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            BAOBAB HOPE is structured as a lean, efficient organization that maximizes impact while maintaining
            transparency and accountability. Our team combines global expertise with local knowledge to ensure
            culturally appropriate and sustainable solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">51</div>
              <div className="text-gray-600 font-medium">Total Staff Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">18</div>
              <div className="text-gray-600 font-medium">Countries with Staff</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Local Staff Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Organizational Structure
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Our governance structure ensures accountability, transparency, and effective decision-making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {organizationalStructure.map((structure, index) => {
              const Icon = structure.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Icon className="w-12 h-12 text-red-600 mr-4 transition-all duration-300 group-hover:scale-110" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                          {structure.title}
                        </h3>
                        <div className="text-sm text-gray-500">{structure.members} Members</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{structure.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Responsibilities:</h4>
                      {structure.responsibilities.map((responsibility, idx) => (
                        <div key={idx} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{responsibility}</span>
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

      {/* Departments */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Our Departments</h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Specialized teams working together to achieve our mission and maximize impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((department, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 relative">
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${department.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {department.name}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {department.staff} Staff
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{department.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Culture */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Culture & Values
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              The principles that unite our diverse team and guide our work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassion First",
                description: "We lead with empathy and understanding in all our interactions.",
              },
              {
                icon: Target,
                title: "Results Driven",
                description: "We focus on measurable impact and sustainable outcomes.",
              },
              {
                icon: Users,
                title: "Collaborative Spirit",
                description: "We believe in the power of teamwork and community partnership.",
              },
              {
                icon: Globe,
                title: "Cultural Sensitivity",
                description: "We respect and honor local traditions and knowledge.",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for the highest standards in everything we do.",
              },
              {
                icon: Building,
                title: "Integrity",
                description: "We maintain transparency and accountability in all our actions.",
              },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-4 transition-all duration-300 group-hover:scale-110" />
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
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
    </div>
  )
}
