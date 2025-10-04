"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const { t, locale } = useLanguage()

  const posts = [
    {
      id: 1,
      title: "Clean Water Project Reaches 1,000 Families in Bangladesh",
      excerpt:
        "Our latest water initiative has successfully provided clean, safe drinking water to over 1,000 families in rural Bangladesh communities.",
      author: "Sarah Johnson",
      date: "2024-05-15",
      category: "Project Update",
      image: "/images/blog/blog-water.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Volunteer Spotlight: Meet Maria Rodriguez",
      excerpt:
        "Learn about Maria's incredible journey from volunteer to project coordinator and how she's making a difference in Guatemala.",
      author: "David Chen",
      date: "2024-05-10",
      category: "Volunteer Stories",
      image: "/images/blog/blog-volunteer.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Education Program Shows Remarkable Results",
      excerpt:
        "After one year of implementation, our education program in Kenya has achieved a 95% literacy improvement rate among participants.",
      author: "Emily Watson",
      date: "2024-05-05",
      category: "Impact Report",
      image: "/images/blog/blog-education.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "New Healthcare Initiative Launches in Honduras",
      excerpt:
        "We're excited to announce the launch of our new mobile healthcare program serving remote communities in Honduras.",
      author: "Michael Brown",
      date: "2024-04-28",
      category: "Announcements",
      image: "/images/blog/blog-healthcare.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "Community Gardens Transform Lives in Tanzania",
      excerpt:
        "Discover how our sustainable agriculture program is helping families achieve food security and economic independence.",
      author: "Lisa Park",
      date: "2024-04-20",
      category: "Success Stories",
      image: "/images/blog/blog-agriculture.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "Annual Impact Report: 2023 Achievements",
      excerpt:
        "Take a look at our comprehensive impact report showcasing the incredible achievements made possible by your support.",
      author: "Hope Foundation Team",
      date: "2024-04-15",
      category: "Impact Report",
      image: "/images/blog/blog-impact.jpg",
      featured: false,
    },
  ]

  const featuredPost = posts.find((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">{t("blog.title")}</h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto">{t("blog.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Badge className="bg-red-600 hover:bg-red-700 mb-4">{t("blog.featured")}</Badge>
            </div>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-4">{featuredPost.author}</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(featuredPost.date).toLocaleDateString(locale)}</span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    {t("blog.read.full")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    {t("blog.read.more")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("blog.newsletter.title")}</h2>
          <p className="text-xl mb-8 text-red-100">{t("blog.newsletter.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("blog.newsletter.placeholder")}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {t("blog.newsletter.subscribe")}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
