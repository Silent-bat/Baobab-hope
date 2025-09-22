"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"
import { Heart, Users, Globe, Clock, Award, ArrowRight, CheckCircle } from "lucide-react"

export default function VolunteeringPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    interests: "",
    availability: "",
    experience: "",
    message: "",
  })

  const volunteerOpportunities = [
    {
      title: "Education Support Volunteer",
      location: "East Africa",
      duration: "3-6 months",
      commitment: "Full-time",
      description:
        "Support literacy programs and teacher training in rural communities across Kenya, Tanzania, and Uganda.",
      requirements: [
        "Teaching or education background preferred",
        "Fluent in English",
        "Cultural sensitivity",
        "Minimum 3-month commitment",
      ],
      benefits: ["Accommodation provided", "Local transportation", "Cultural immersion", "Professional development"],
      image: "/images/education-project.svg",
    },
    {
      title: "Healthcare Program Assistant",
      location: "Central America",
      duration: "2-4 months",
      commitment: "Full-time",
      description:
        "Assist with mobile health clinics and community health education programs in Guatemala and Honduras.",
      requirements: [
        "Healthcare or medical background",
        "Spanish language skills preferred",
        "Physical fitness for field work",
        "Minimum 2-month commitment",
      ],
      benefits: [
        "Medical training opportunities",
        "Accommodation provided",
        "Language learning support",
        "Certificate of completion",
      ],
      image: "/images/healthcare-project.svg",
    },
    {
      title: "Environmental Conservation Volunteer",
      location: "West Africa",
      duration: "1-3 months",
      commitment: "Full-time",
      description: "Participate in reforestation efforts and environmental education programs in Ghana and Senegal.",
      requirements: [
        "Environmental science background helpful",
        "Physical fitness for outdoor work",
        "Team collaboration skills",
        "Minimum 1-month commitment",
      ],
      benefits: [
        "Hands-on conservation experience",
        "Accommodation and meals",
        "Environmental certification",
        "Networking opportunities",
      ],
      image: "/images/environment-project.svg",
    },
    {
      title: "Remote Digital Support",
      location: "Remote",
      duration: "Ongoing",
      commitment: "Part-time",
      description: "Provide digital marketing, web development, or administrative support from anywhere in the world.",
      requirements: [
        "Relevant digital skills",
        "Reliable internet connection",
        "Self-motivated",
        "Minimum 10 hours/week",
      ],
      benefits: ["Flexible schedule", "Skill development", "Global team collaboration", "Portfolio building"],
      image: "/images/blog-volunteer.svg",
    },
  ]

  const volunteerBenefits = [
    {
      icon: Heart,
      title: "Make Real Impact",
      description: "See the direct results of your work in transformed communities and changed lives.",
    },
    {
      icon: Globe,
      title: "Cultural Immersion",
      description: "Experience new cultures, learn languages, and build global perspectives.",
    },
    {
      icon: Users,
      title: "Build Networks",
      description: "Connect with like-minded individuals and build lasting professional relationships.",
    },
    {
      icon: Award,
      title: "Develop Skills",
      description: "Gain valuable experience and develop new skills that enhance your career.",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your interest in volunteering! We'll contact you within 48 hours.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      interests: "",
      availability: "",
      experience: "",
      message: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Volunteer With Us</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Join our global community of changemakers and help create lasting impact in communities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Why Volunteer with BAOBAB HOPE?
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Volunteering with us means being part of sustainable change that lasts long after your service ends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-4 transition-all duration-300 group-hover:scale-110" />
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Current Opportunities
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Find the perfect volunteer opportunity that matches your skills, interests, and availability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={opportunity.image || "/placeholder.svg"}
                    alt={opportunity.title}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {opportunity.commitment}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {opportunity.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-red-500" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-red-500" />
                      {opportunity.duration}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{opportunity.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                    <div className="space-y-2">
                      {opportunity.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What We Provide:</h4>
                    <div className="space-y-2">
                      {opportunity.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-600">
                          <Heart className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105">
                    Apply for This Position
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Apply to Volunteer</h2>
            <p className="text-lg text-gray-600 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Fill out this form to start your volunteer journey with BAOBAB HOPE
            </p>
          </div>

          <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Current Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="interests">Areas of Interest *</Label>
                  <Input
                    id="interests"
                    name="interests"
                    type="text"
                    required
                    placeholder="e.g., Education, Healthcare, Environment, Digital Support"
                    value={formData.interests}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Input
                    id="availability"
                    name="availability"
                    type="text"
                    required
                    placeholder="e.g., 3 months starting June 2024, Part-time weekends"
                    value={formData.availability}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Tell us about your relevant experience, skills, and qualifications"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Why do you want to volunteer with BAOBAB HOPE? Any questions or additional information?"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                  Submit Application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Volunteer Stories</h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Hear from our volunteers about their transformative experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Education Volunteer",
                location: "Kenya",
                quote:
                  "Volunteering with BAOBAB HOPE changed my perspective on education and community development. The impact we made together was incredible.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Miguel Rodriguez",
                role: "Healthcare Assistant",
                location: "Guatemala",
                quote:
                  "Working with the mobile health clinics taught me so much about community healthcare. It was the most rewarding experience of my life.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Emma Chen",
                role: "Digital Support",
                location: "Remote",
                quote:
                  "Being able to contribute my digital skills remotely while supporting such important work has been incredibly fulfilling.",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{story.name}</h3>
                  <div className="text-sm text-red-600 font-medium mb-2">{story.role}</div>
                  <div className="text-sm text-gray-500 mb-4">{story.location}</div>
                  <p className="text-gray-600 italic leading-relaxed">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
