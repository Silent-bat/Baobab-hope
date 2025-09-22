"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Calendar, Clock, MapPin, Users, Video, ArrowRight } from "lucide-react"

export default function AgendaPage() {
  const { t } = useLanguage()
  const [selectedMonth, setSelectedMonth] = useState("all")

  const events = [
    {
      id: 1,
      title: "Annual Impact Summit 2024",
      date: "2024-06-15",
      time: "09:00 - 17:00",
      location: "Virtual & In-Person",
      type: "Conference",
      category: "Annual Event",
      description:
        "Join us for our biggest event of the year as we share impact stories, celebrate achievements, and plan for the future.",
      attendees: "500+",
      registration: "Open",
      featured: true,
    },
    {
      id: 2,
      title: "Community Health Workshop - East Africa",
      date: "2024-06-08",
      time: "14:00 - 16:00",
      location: "Nairobi, Kenya",
      type: "Workshop",
      category: "Training",
      description: "Training session for community health workers on preventive care and health education techniques.",
      attendees: "50",
      registration: "Closed",
    },
    {
      id: 3,
      title: "Environmental Conservation Webinar",
      date: "2024-06-22",
      time: "15:00 - 16:30",
      location: "Online",
      type: "Webinar",
      category: "Education",
      description:
        "Learn about our reforestation efforts and how communities can participate in environmental conservation.",
      attendees: "200+",
      registration: "Open",
    },
    {
      id: 4,
      title: "Volunteer Orientation - Central America",
      date: "2024-07-05",
      time: "10:00 - 12:00",
      location: "Guatemala City, Guatemala",
      type: "Orientation",
      category: "Volunteer",
      description: "Orientation session for new volunteers joining our Central America programs.",
      attendees: "25",
      registration: "Open",
    },
    {
      id: 5,
      title: "Board of Directors Meeting",
      date: "2024-07-12",
      time: "09:00 - 11:00",
      location: "Virtual",
      type: "Meeting",
      category: "Governance",
      description: "Quarterly board meeting to review progress and strategic planning.",
      attendees: "15",
      registration: "Closed",
    },
    {
      id: 6,
      title: "Education Program Launch - South Asia",
      date: "2024-07-20",
      time: "11:00 - 13:00",
      location: "Dhaka, Bangladesh",
      type: "Launch Event",
      category: "Program",
      description: "Official launch of our new literacy program in rural Bangladesh communities.",
      attendees: "100+",
      registration: "Open",
    },
  ]

  const months = [
    { value: "all", label: "All Events" },
    { value: "2024-06", label: "June 2024" },
    { value: "2024-07", label: "July 2024" },
    { value: "2024-08", label: "August 2024" },
  ]

  const filteredEvents =
    selectedMonth === "all" ? events : events.filter((event) => event.date.startsWith(selectedMonth))

  const featuredEvent = events.find((event) => event.featured)
  const regularEvents = events.filter((event) => !event.featured)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Event Agenda</h1>
            <p
              className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Stay updated with our upcoming events, workshops, and community gatherings
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white sticky top-16 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {months.map((month) => (
              <Button
                key={month.value}
                variant={selectedMonth === month.value ? "default" : "outline"}
                onClick={() => setSelectedMonth(month.value)}
                className={`transition-all duration-300 ${
                  selectedMonth === month.value
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
              >
                {month.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Badge className="bg-red-600 hover:bg-red-700 mb-4">Featured Event</Badge>
            </div>
            <Card className="overflow-hidden border-2 border-red-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Badge variant="outline" className="mb-4">
                      {featuredEvent.category}
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredEvent.title}</h2>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredEvent.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-red-500" />
                        <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-red-500" />
                        <span>{featuredEvent.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-red-500" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-3 text-red-500" />
                        <span>{featuredEvent.attendees} Expected</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="bg-red-50 p-6 rounded-xl text-center">
                      <div className="text-sm text-red-600 font-medium mb-2">Registration Status</div>
                      <div
                        className={`text-lg font-bold mb-4 ${
                          featuredEvent.registration === "Open" ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {featuredEvent.registration}
                      </div>
                      {featuredEvent.registration === "Open" && (
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          Register Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Join us at these upcoming events and be part of our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents
              .filter((event) => !event.featured)
              .map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{event.category}</Badge>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.registration === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.registration}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-red-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-red-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                      {event.type === "Webinar" && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Video className="w-4 h-4 mr-2 text-red-500" />
                          <span>Online Event</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {event.attendees}
                      </div>
                      {event.registration === "Open" && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Register
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try selecting a different time period or check back later for new events.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Stay Updated on Events</h2>
          <p className="text-xl mb-8 text-red-100">
            Subscribe to our newsletter to receive notifications about upcoming events and registration openings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
