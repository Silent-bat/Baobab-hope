"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Calendar, ArrowLeft, Share2, Heart, Tag, Clock, ArrowRight } from "lucide-react"

export default function BlogDetailPage() {
  const params = useParams()
  const { t } = useLanguage()

  // Mock blog data - in real app, this would come from API
  const posts = {
    "1": {
      id: 1,
      title: "Clean Water Project Reaches 1,000 Families in Bangladesh",
      excerpt:
        "Our latest water initiative has successfully provided clean, safe drinking water to over 1,000 families in rural Bangladesh communities.",
      content: `
        <p>In the remote villages of rural Bangladesh, access to clean water has been a persistent challenge for generations. Our Clean Water Project, launched in early 2023, has achieved a significant milestone by successfully providing clean, safe drinking water to over 1,000 families across 15 villages.</p>

        <h3>The Challenge</h3>
        <p>Before our intervention, families in these communities were forced to walk miles to collect water from contaminated sources. This not only posed serious health risks but also prevented children, especially girls, from attending school regularly. Women and children spent hours each day collecting water, time that could have been used for education and income-generating activities.</p>

        <h3>Our Solution</h3>
        <p>Working closely with local communities, we implemented a comprehensive water access program that includes:</p>
        <ul>
          <li>Construction of 12 deep-water wells with solar-powered pumps</li>
          <li>Installation of water purification systems in each village</li>
          <li>Training of local technicians for maintenance and repairs</li>
          <li>Establishment of water management committees</li>
          <li>Hygiene and sanitation education programs</li>
        </ul>

        <h3>Impact and Results</h3>
        <p>The results have been transformative. School attendance has increased by 40%, particularly among girls. Cases of waterborne diseases have dropped by 75% in the participating villages. Women now have more time to engage in income-generating activities, leading to improved household economics.</p>

        <p>Local community leader Rashida Begum shares: "Before the well was built, my daughters missed school three days a week to help collect water. Now they attend every day and are among the top students in their class. This project has changed our entire community."</p>

        <h3>Sustainability and Future Plans</h3>
        <p>Sustainability is at the heart of our approach. Each community has been trained to maintain their water systems independently. We've established a local fund for repairs and maintenance, ensuring the long-term success of the project.</p>

        <p>Building on this success, we're expanding the program to reach an additional 2,000 families by the end of 2024. We're also introducing innovative water conservation techniques and exploring renewable energy solutions for water pumping systems.</p>

        <h3>How You Can Help</h3>
        <p>This project's success is made possible by the generous support of donors like you. A donation of just $50 can provide clean water access to one family for an entire year. Together, we can ensure that no family has to choose between education and water, between health and survival.</p>
      `,
      author: "Sarah Johnson",
      authorBio:
        "Sarah is our Water Projects Coordinator with over 8 years of experience in community development and water access initiatives across South Asia.",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-05-15",
      readTime: "5",
      category: "Project Update",
      tags: ["Water Access", "Bangladesh", "Community Development", "Health"],
      image: "/images/blog-water.svg",
      featured: true,
    },
    "2": {
      id: 2,
      title: "Volunteer Spotlight: Meet Maria Rodriguez",
      excerpt:
        "Learn about Maria's incredible journey from volunteer to project coordinator and how she's making a difference in Guatemala.",
      content: `
        <p>Maria Rodriguez's journey with BAOBAB HOPE began three years ago as a weekend volunteer. Today, she serves as our Project Coordinator for Central America, overseeing healthcare initiatives that have transformed the lives of thousands of families across Guatemala, Honduras, and Nicaragua.</p>

        <h3>From Volunteer to Leader</h3>
        <p>"I never imagined that helping out on weekends would become my life's calling," Maria reflects. "But once I saw the impact we could make together, there was no turning back."</p>

        <p>Maria's transformation from volunteer to leader exemplifies the power of grassroots engagement. Starting with simple tasks like organizing medical supplies, she quickly demonstrated exceptional organizational skills and deep empathy for the communities we serve.</p>

        <h3>Breaking Down Barriers</h3>
        <p>Growing up in a bilingual household, Maria understood firsthand the challenges faced by Spanish-speaking communities in accessing healthcare services. Her ability to communicate effectively in both Spanish and English, combined with her cultural sensitivity, made her an invaluable bridge between our organization and the communities we serve.</p>

        <p>"Language is just the beginning," Maria explains. "Understanding cultural nuances, building trust, and respecting local traditions are equally important. You can't just arrive with solutions – you have to listen first."</p>

        <h3>Innovative Approaches</h3>
        <p>Under Maria's leadership, our Central America program has pioneered several innovative approaches:</p>
        <ul>
          <li>Mobile health clinics that follow seasonal migration patterns</li>
          <li>Community health promoter training programs</li>
          <li>Integration of traditional healing practices with modern medicine</li>
          <li>Youth leadership development initiatives</li>
        </ul>

        <h3>Measuring Success</h3>
        <p>The numbers speak for themselves: under Maria's coordination, the program has provided healthcare services to over 8,000 people, trained 80 community health workers, and established 5 permanent health centers. But for Maria, success is measured in individual stories.</p>

        <p>"Last month, I met a young mother whose child we treated for malnutrition two years ago. That child is now healthy, attending school, and dreams of becoming a doctor. That's the impact that keeps me going every day."</p>

        <h3>Looking Forward</h3>
        <p>Maria's vision for the future is ambitious yet grounded in community needs. She's currently developing a telemedicine program that will connect remote communities with specialist doctors in urban centers, and planning a maternal health initiative that addresses the region's high maternal mortality rates.</p>

        <p>"Every challenge is an opportunity to innovate," she says. "Our communities are resilient and resourceful. Our job is to support their existing strengths and help remove barriers to their success."</p>

        <h3>A Message to Future Volunteers</h3>
        <p>"Don't underestimate the power of showing up," Maria advises potential volunteers. "Every hour you contribute, every skill you share, every connection you make has the potential to create ripple effects that extend far beyond what you can imagine. Start where you are, with what you have. The communities we serve will teach you the rest."</p>
      `,
      author: "David Chen",
      authorBio:
        "David is our Communications Manager, specializing in volunteer stories and community impact documentation.",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-05-10",
      readTime: "7",
      category: "Volunteer Stories",
      tags: ["Volunteer Spotlight", "Guatemala", "Healthcare", "Leadership"],
      image: "/images/blog-volunteer.svg",
      featured: false,
    },
    "3": {
      id: 3,
      title: "Education Program Shows Remarkable Results",
      excerpt:
        "After one year of implementation, our education program in Kenya has achieved a 95% literacy improvement rate among participants.",
      content: `
        <p>One year ago, we launched an ambitious education program in rural Kenya with a simple yet powerful goal: to dramatically improve literacy rates in underserved communities. Today, we're thrilled to share the remarkable results that have exceeded even our most optimistic projections.</p>

        <h3>The Starting Point</h3>
        <p>When we began this program in March 2023, literacy rates in our target communities averaged just 35%. Many children had never held a book, and adult literacy was even lower. The challenges were significant: lack of educational materials, untrained teachers, and economic pressures that forced children to work instead of attending school.</p>

        <h3>A Comprehensive Approach</h3>
        <p>Our program took a holistic approach to education, addressing multiple barriers simultaneously:</p>
        
        <h4>Infrastructure Development</h4>
        <ul>
          <li>Built 8 new classrooms in existing schools</li>
          <li>Established 15 community libraries</li>
          <li>Installed solar panels for reliable electricity</li>
          <li>Provided clean water and sanitation facilities</li>
        </ul>

        <h4>Teacher Training and Support</h4>
        <ul>
          <li>Trained 45 local teachers in modern pedagogical methods</li>
          <li>Provided ongoing mentorship and support</li>
          <li>Introduced technology-enhanced learning tools</li>
          <li>Established teacher resource centers</li>
        </ul>

        <h4>Community Engagement</h4>
        <ul>
          <li>Launched adult literacy programs for parents</li>
          <li>Created school feeding programs to improve attendance</li>
          <li>Established parent-teacher committees</li>
          <li>Implemented income-generating activities for families</li>
        </ul>

        <h3>Remarkable Results</h3>
        <p>After 12 months of implementation, the results have been extraordinary:</p>
        
        <ul>
          <li><strong>95% literacy improvement rate</strong> among program participants</li>
          <li><strong>School attendance increased by 78%</strong></li>
          <li><strong>Zero dropout rate</strong> in participating schools</li>
          <li><strong>85% of parents</strong> now actively support their children's education</li>
          <li><strong>Community libraries</strong> see an average of 200 visitors per week</li>
        </ul>

        <h3>Student Success Stories</h3>
        <p>Behind these statistics are individual stories of transformation. Take Amina, a 12-year-old who couldn't read a single word when the program began. Today, she's reading at grade level and dreams of becoming a teacher. Or consider James, whose parents initially resisted his school attendance but now proudly support his education after seeing his progress.</p>

        <p>"Education has opened a new world for my children," says Grace Wanjiku, a parent and participant in our adult literacy program. "Now I can help them with homework, and together we're building a better future."</p>

        <h3>The Ripple Effect</h3>
        <p>The impact extends far beyond literacy rates. Improved education has led to:</p>
        <ul>
          <li>Better health outcomes as families make informed decisions</li>
          <li>Increased agricultural productivity through improved farming techniques</li>
          <li>Enhanced civic participation and community leadership</li>
          <li>Greater gender equality as girls' education is prioritized</li>
        </ul>

        <h3>Sustainability and Expansion</h3>
        <p>From the beginning, sustainability was central to our approach. Local teachers now lead the program, community members maintain the facilities, and parent committees ensure continued support. The program has become truly community-owned.</p>

        <p>Based on this success, we're expanding to 10 additional communities in 2024, with the goal of reaching 5,000 more children and 2,000 adults. We're also developing a teacher training institute that will serve the entire region.</p>

        <h3>Lessons Learned</h3>
        <p>This program's success offers valuable lessons for education initiatives worldwide:</p>
        <ul>
          <li>Community ownership is essential for sustainability</li>
          <li>Addressing basic needs (nutrition, health) improves educational outcomes</li>
          <li>Teacher training and support are critical investments</li>
          <li>Technology can enhance but not replace quality teaching</li>
          <li>Parent engagement multiplies program impact</li>
        </ul>

        <p>As we celebrate these remarkable results, we're reminded that education is not just about literacy rates or test scores. It's about unlocking human potential, building stronger communities, and creating pathways to a more equitable future. The children and families in Kenya have shown us what's possible when communities, educators, and supporters work together toward a common goal.</p>
      `,
      author: "Emily Watson",
      authorBio:
        "Emily leads our Education Programs across East Africa, bringing 12 years of experience in international development and education policy.",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-05-05",
      readTime: "8",
      category: "Impact Report",
      tags: ["Education", "Kenya", "Literacy", "Impact Report"],
      image: "/images/blog-education.svg",
      featured: false,
    },
  }

  const post = posts[params.id as keyof typeof posts]

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button>{t("blog.back")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Related posts (mock data)
  const relatedPosts = Object.values(posts)
    .filter((p) => p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link
              href="/blog"
              className="inline-flex items-center text-white mb-6 hover:text-red-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("blog.back")}
            </Link>

            <Badge className="bg-red-600 hover:bg-red-700 mb-4">{post.category}</Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-poppins leading-tight">{post.title}</h1>

            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl">{post.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Image
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-500">{t("blog.author")}</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime} {t("blog.read.time")}
                </div>
              </div>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-poppins prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-600 prose-li:text-gray-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{t("blog.tags")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-red-600 border-red-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Image
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("blog.about.author")} {post.author}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{post.authorBio}</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Share */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("blog.share.title")}
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      {t("blog.share.facebook")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      {t("blog.share.twitter")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      {t("blog.share.copy")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support CTA */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-red-800 mb-2">{t("blog.support.title")}</h3>
                  <p className="text-red-700 text-sm mb-4">{t("blog.support.subtitle")}</p>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/donate">{t("blog.support.donate")}</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t("blog.newsletter.stay")}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t("blog.newsletter.get")}</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder={t("blog.newsletter.email")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button className="w-full bg-red-600 hover:bg-red-700">{t("blog.newsletter.subscribe")}</Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t("blog.related")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src={relatedPost.image || "/placeholder.svg"}
                  alt={relatedPost.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {relatedPost.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{relatedPost.excerpt}</p>
                  <Link
                    href={`/blog/${relatedPost.id}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
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
    </div>
  )
}
