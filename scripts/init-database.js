const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database initialization...')

  try {
    // Create Super Admin User
    console.log('👤 Creating super admin user...')

    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'SuperSecure2024!', 12)

    const superAdmin = await prisma.user.upsert({
      where: { email: process.env.SUPER_ADMIN_EMAIL || 'admin@baobabhope.org' },
      update: {},
      create: {
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@baobabhope.org',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true
      }
    })

    console.log(`✅ Super admin created: ${superAdmin.email}`)

    // Create additional users
    console.log('👥 Creating additional users...')

    const editorPassword = await bcrypt.hash('Editor123!', 12)
    const editor = await prisma.user.upsert({
      where: { email: 'editor@baobabhope.org' },
      update: {},
      create: {
        email: 'editor@baobabhope.org',
        name: 'Content Editor',
        password: editorPassword,
        role: 'EDITOR',
        isActive: true
      }
    })

    // Create Blog Categories
    console.log('📂 Creating blog categories...')

    const categories = [
      {
        name: 'Impact Stories',
        slug: 'impact-stories',
        description: 'Real stories from the communities we serve',
        color: '#EF4444'
      },
      {
        name: 'Project Updates',
        slug: 'project-updates',
        description: 'Latest updates from our ongoing projects',
        color: '#3B82F6'
      },
      {
        name: 'News & Announcements',
        slug: 'news-announcements',
        description: 'Organization news and important announcements',
        color: '#10B981'
      },
      {
        name: 'Education',
        slug: 'education',
        description: 'Educational initiatives and learning resources',
        color: '#8B5CF6'
      },
      {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Healthcare programs and medical outreach',
        color: '#F59E0B'
      },
      {
        name: 'Environment',
        slug: 'environment',
        description: 'Environmental conservation and sustainability',
        color: '#059669'
      }
    ]

    for (const category of categories) {
      await prisma.blogCategory.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
    }

    console.log(`✅ Created ${categories.length} blog categories`)

    // Create Blog Tags
    console.log('🏷️ Creating blog tags...')

    const tags = [
      { name: 'Community', slug: 'community' },
      { name: 'Volunteer', slug: 'volunteer' },
      { name: 'Donation', slug: 'donation' },
      { name: 'Sustainability', slug: 'sustainability' },
      { name: 'Children', slug: 'children' },
      { name: 'Women Empowerment', slug: 'women-empowerment' },
      { name: 'Water Access', slug: 'water-access' },
      { name: 'Clean Energy', slug: 'clean-energy' },
      { name: 'Food Security', slug: 'food-security' },
      { name: 'Literacy', slug: 'literacy' }
    ]

    for (const tag of tags) {
      await prisma.blogTag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      })
    }

    console.log(`✅ Created ${tags.length} blog tags`)

    // Create Sample Pages
    console.log('📄 Creating sample pages...')

    const pages = [
      {
        title: 'Home',
        slug: 'home',
        content: {
          sections: [
            {
              type: 'hero',
              title: 'Empowering Through Education',
              subtitle: 'Building Brighter Futures',
              description: 'Join us in creating sustainable change in communities worldwide through education, healthcare, and environmental conservation.',
              cta: {
                primary: { text: 'Donate Now', href: '/donate' },
                secondary: { text: 'Learn More', href: '/about' }
              }
            },
            {
              type: 'stats',
              title: 'Our Growing Impact',
              stats: [
                { label: 'Lives Transformed', value: '75,000+' },
                { label: 'Countries Reached', value: '18' },
                { label: 'Active Projects', value: '42' },
                { label: 'Volunteers', value: '850+' }
              ]
            }
          ]
        },
        metaTitle: 'BAOBAB HOPE - One Heart, One Hand | Empowering Communities',
        metaDescription: 'BAOBAB HOPE is a non-profit organization dedicated to sustainable development, education, and community empowerment across Africa and beyond.',
        keywords: ['charity', 'non-profit', 'education', 'healthcare', 'environment'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(),
        createdBy: superAdmin.id
      },
      {
        title: 'About Us',
        slug: 'about',
        content: {
          sections: [
            {
              type: 'hero',
              title: 'About BAOBAB HOPE',
              subtitle: 'Like the mighty baobab tree, we believe in deep roots, strong growth, and lasting impact.'
            },
            {
              type: 'mission',
              title: 'Our Mission',
              text: 'To nurture sustainable growth in communities through education, empowerment, and environmental stewardship, creating lasting positive change that spans generations.'
            }
          ]
        },
        metaTitle: 'About BAOBAB HOPE - Our Mission and Vision',
        metaDescription: 'Learn about BAOBAB HOPE\'s mission to create sustainable change in communities worldwide through education, healthcare, and environmental conservation.',
        keywords: ['about', 'mission', 'vision', 'non-profit'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(),
        createdBy: superAdmin.id
      },
      {
        title: 'Contact Us',
        slug: 'contact',
        content: {
          sections: [
            {
              type: 'hero',
              title: 'Contact Us',
              subtitle: 'Get in touch with us. We\'d love to hear from you.'
            },
            {
              type: 'contact_info',
              email: 'info@baobabhope.org',
              phone: '+1 (555) 123-4567',
              address: '123 Hope Street, City, State 12345'
            }
          ]
        },
        metaTitle: 'Contact BAOBAB HOPE - Get in Touch',
        metaDescription: 'Contact BAOBAB HOPE for partnerships, volunteer opportunities, or general inquiries.',
        keywords: ['contact', 'support', 'partnership'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(),
        createdBy: superAdmin.id
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: {
          sections: [
            {
              type: 'legal',
              title: 'Privacy Policy',
              content: 'This privacy policy outlines how we collect, use, and protect your personal information...'
            }
          ]
        },
        metaTitle: 'Privacy Policy - BAOBAB HOPE',
        metaDescription: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
        keywords: ['privacy', 'policy', 'legal'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(),
        createdBy: superAdmin.id
      }
    ]

    for (const page of pages) {
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: {},
        create: page
      })
    }

    console.log(`✅ Created ${pages.length} sample pages`)

    // Create Sample Projects
    console.log('🚀 Creating sample projects...')

    const projects = [
      {
        title: 'Education & Literacy Program',
        slug: 'education-literacy-program',
        description: 'Building educational foundations that empower communities to thrive and grow sustainably.',
        content: 'Our comprehensive education program focuses on literacy, numeracy, and practical skills training for children and adults in rural communities. We work with local educators to develop culturally appropriate curricula and provide resources for sustainable learning.',
        location: 'Kenya, Tanzania, Uganda',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        category: 'Education',
        goalAmount: 120000,
        raisedAmount: 102000,
        beneficiaries: 15000,
        volunteers: 85,
        metaTitle: 'Education & Literacy Program - BAOBAB HOPE',
        metaDescription: 'Supporting education and literacy in rural communities across East Africa.',
        keywords: ['education', 'literacy', 'africa', 'children'],
        publishedAt: new Date(),
        createdBy: superAdmin.id
      },
      {
        title: 'Clean Water Access Initiative',
        slug: 'clean-water-access-initiative',
        description: 'Building sustainable water systems and teaching water conservation practices.',
        content: 'This project aims to provide clean, safe water access to remote communities through the installation of wells, water purification systems, and comprehensive training on water management and conservation.',
        location: 'Bangladesh, Nepal, Cambodia',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'ACTIVE',
        category: 'Water',
        goalAmount: 150000,
        raisedAmount: 67500,
        beneficiaries: 12000,
        volunteers: 42,
        metaTitle: 'Clean Water Access Initiative - BAOBAB HOPE',
        metaDescription: 'Providing clean water access to communities in South and Southeast Asia.',
        keywords: ['water', 'access', 'clean', 'asia', 'community'],
        publishedAt: new Date(),
        createdBy: superAdmin.id
      },
      {
        title: 'Community Healthcare Program',
        slug: 'community-healthcare-program',
        description: 'Providing essential healthcare services and health education to underserved communities.',
        content: 'Our mobile healthcare program brings medical services directly to remote communities, providing preventive care, health education, and treatment for common conditions. We also train community health workers for sustainable impact.',
        location: 'Guatemala, Honduras, Nicaragua',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        category: 'Healthcare',
        goalAmount: 80000,
        raisedAmount: 48000,
        beneficiaries: 8000,
        volunteers: 28,
        metaTitle: 'Community Healthcare Program - BAOBAB HOPE',
        metaDescription: 'Mobile healthcare services for underserved communities in Central America.',
        keywords: ['healthcare', 'medical', 'community', 'central america'],
        publishedAt: new Date(),
        createdBy: superAdmin.id
      }
    ]

    for (const project of projects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: {},
        create: project
      })
    }

    console.log(`✅ Created ${projects.length} sample projects`)

    // Create Sample Blog Posts
    console.log('📝 Creating sample blog posts...')

    const impactStoriesCategory = await prisma.blogCategory.findUnique({
      where: { slug: 'impact-stories' }
    })

    const projectUpdatesCategory = await prisma.blogCategory.findUnique({
      where: { slug: 'project-updates' }
    })

    const communityTag = await prisma.blogTag.findUnique({
      where: { slug: 'community' }
    })

    const blogPosts = [
      {
        title: 'Clean Water Transforms Village Life in Rural Mali',
        slug: 'clean-water-transforms-village-life-mali',
        excerpt: 'How a new well system brought hope and health to 500 families in rural Mali',
        content: `# The Journey to Clean Water

When we first arrived in the village of Kati in rural Mali, the nearest clean water source was over 3 kilometers away. Women and children would wake up at dawn to make the long journey, carrying heavy containers back to their homes.

## The Challenge

The lack of clean water access affected every aspect of daily life:
- Children missed school to help fetch water
- Women had limited time for income-generating activities
- Water-borne diseases were common
- The community struggled to maintain proper hygiene

## Our Solution

Working with the local community, we implemented:
1. A solar-powered deep well system
2. Water storage and distribution infrastructure
3. Community training on maintenance and hygiene
4. Formation of a local water management committee

## The Impact

Six months after completion:
- 500 families now have access to clean water within 500 meters of their homes
- School attendance increased by 40%
- Cases of water-borne diseases dropped by 80%
- Women have started new businesses with their additional time
- The community has taken full ownership of maintenance

This project demonstrates the transformative power of basic infrastructure when combined with community empowerment and education.`,
        featuredImage: '/images/blog/mali-water-project.jpg',
        readTime: 5,
        metaTitle: 'Clean Water Success Story - Mali Village Transformation',
        metaDescription: 'Read how access to clean water transformed a rural Mali village, improving health, education, and economic opportunities for 500 families.',
        keywords: ['water', 'mali', 'africa', 'impact', 'community'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        createdBy: editor.id,
        categories: impactStoriesCategory ? [impactStoriesCategory] : [],
        tags: communityTag ? [communityTag] : []
      },
      {
        title: 'Education Opens New Doors: Amina\'s Success Story',
        slug: 'education-opens-doors-amina-success-story',
        excerpt: 'Meet Amina, whose literacy program participation led to starting her own business',
        content: `# From Illiteracy to Entrepreneurship

Amina Hassan, a 34-year-old mother of four from rural Kenya, never had the opportunity to attend school as a child. For years, she relied on others to read important documents and felt excluded from many aspects of community life.

## The Turning Point

When our Adult Literacy Program launched in her village, Amina was among the first to enroll. Despite initial hesitation and the challenge of balancing classes with her responsibilities at home, she persevered.

## The Learning Journey

Over 18 months, Amina:
- Learned to read and write in both Swahili and English
- Developed basic numeracy skills
- Participated in business training workshops
- Joined a women's savings group

## The Transformation

Today, Amina runs a successful tailoring business from her home. She can:
- Read and write contracts with customers
- Keep financial records
- Help her children with homework
- Participate actively in community meetings

"Education gave me wings," Amina says. "Now I can dream and make those dreams reality."

## Ripple Effects

Amina's success has inspired 15 other women in her village to join literacy classes. She now volunteers as a mentor, showing that education truly has the power to break cycles of poverty and create lasting change.`,
        featuredImage: '/images/blog/amina-success-story.jpg',
        readTime: 7,
        metaTitle: 'Amina\'s Success Story - Education Changes Everything',
        metaDescription: 'Discover how adult literacy education transformed Amina\'s life, leading her from illiteracy to successful entrepreneurship.',
        keywords: ['education', 'literacy', 'kenya', 'women', 'empowerment'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdBy: editor.id,
        categories: impactStoriesCategory ? [impactStoriesCategory] : [],
        tags: communityTag ? [communityTag] : []
      },
      {
        title: 'Healthcare Reaches Remote Communities Through Mobile Clinics',
        slug: 'healthcare-mobile-clinics-remote-communities',
        excerpt: 'Mobile clinics bring essential medical care to previously unreachable areas',
        content: `# Bringing Healthcare to the Hard-to-Reach

In the mountainous regions of Guatemala, many communities are hours away from the nearest health facility. Our mobile clinic program is changing that reality, one village at a time.

## The Challenge of Geographic Isolation

Remote communities face significant healthcare challenges:
- Nearest hospitals are 4-8 hours away by foot or donkey
- Many have never seen a doctor
- Preventable diseases go untreated
- Maternal and infant mortality rates are high
- Traditional medicine is the only available option

## Our Mobile Solution

Our specially equipped mobile clinics provide:
- General medical consultations
- Preventive care and vaccinations
- Maternal and child health services
- Health education workshops
- Basic medications and supplies
- Emergency stabilization and referral services

## Community Health Workers

We train local community members as health promoters who:
- Provide basic care between clinic visits
- Educate neighbors about prevention
- Identify cases needing urgent attention
- Maintain connection with our medical team

## Measuring Impact

In the past year:
- 12,000 consultations provided
- 3,500 children vaccinated
- 800 pregnant women received prenatal care
- 45 community health workers trained
- 15 communities now have regular access to healthcare

The program has not only saved lives but also built local capacity for ongoing health improvement.`,
        featuredImage: '/images/blog/mobile-healthcare-guatemala.jpg',
        readTime: 6,
        metaTitle: 'Mobile Healthcare Clinics Reach Remote Guatemala Communities',
        metaDescription: 'Learn how mobile medical clinics are bringing essential healthcare services to isolated mountain communities in Guatemala.',
        keywords: ['healthcare', 'mobile', 'guatemala', 'remote', 'medical'],
        status: 'PUBLISHED',
        language: 'en',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: editor.id,
        categories: projectUpdatesCategory ? [projectUpdatesCategory] : [],
        tags: communityTag ? [communityTag] : []
      }
    ]

    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          ...post,
          categories: {
            connect: post.categories.map(cat => ({ id: cat.id }))
          },
          tags: {
            connect: post.tags.map(tag => ({ id: tag.id }))
          }
        }
      })
    }

    console.log(`✅ Created ${blogPosts.length} sample blog posts`)

    // Create Sample Settings
    console.log('⚙️ Creating site settings...')

    const settings = [
      {
        key: 'site_title',
        value: JSON.stringify('BAOBAB HOPE - One Heart, One Hand'),
        type: 'STRING',
        category: 'general',
        description: 'Main site title',
        isPublic: true
      },
      {
        key: 'site_description',
        value: JSON.stringify('BAOBAB HOPE is a non-profit organization dedicated to sustainable development, education, and community empowerment across Africa and beyond.'),
        type: 'STRING',
        category: 'general',
        description: 'Site description for SEO',
        isPublic: true
      },
      {
        key: 'contact_email',
        value: JSON.stringify('info@baobabhope.org'),
        type: 'STRING',
        category: 'contact',
        description: 'Main contact email',
        isPublic: true
      },
      {
        key: 'contact_phone',
        value: JSON.stringify('+1 (555) 123-4567'),
        type: 'STRING',
        category: 'contact',
        description: 'Main contact phone',
        isPublic: true
      },
      {
        key: 'contact_address',
        value: JSON.stringify('123 Hope Street, City, State 12345'),
        type: 'STRING',
        category: 'contact',
        description: 'Physical address',
        isPublic: true
      },
      {
        key: 'social_facebook',
        value: JSON.stringify('https://facebook.com/baobabhope'),
        type: 'STRING',
        category: 'social',
        description: 'Facebook page URL',
        isPublic: true
      },
      {
        key: 'social_twitter',
        value: JSON.stringify('https://twitter.com/baobabhope'),
        type: 'STRING',
        category: 'social',
        description: 'Twitter profile URL',
        isPublic: true
      },
      {
        key: 'social_instagram',
        value: JSON.stringify('https://instagram.com/baobabhope'),
        type: 'STRING',
        category: 'social',
        description: 'Instagram profile URL',
        isPublic: true
      },
      {
        key: 'donations_enabled',
        value: JSON.stringify(true),
        type: 'BOOLEAN',
        category: 'donations',
        description: 'Enable donation functionality',
        isPublic: false
      },
      {
        key: 'default_currency',
        value: JSON.stringify('USD'),
        type: 'STRING',
        category: 'donations',
        description: 'Default currency for donations',
        isPublic: false
      },
      {
        key: 'analytics_enabled',
        value: JSON.stringify(true),
        type: 'BOOLEAN',
        category: 'analytics',
        description: 'Enable analytics tracking',
        isPublic: false
      },
      {
        key: 'maintenance_mode',
        value: JSON.stringify(false),
        type: 'BOOLEAN',
        category: 'system',
        description: 'Enable maintenance mode',
        isPublic: false
      }
    ]

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting
      })
    }

    console.log(`✅ Created ${settings.length} site settings`)

    // Create Sample Newsletter Subscribers
    console.log('📧 Creating sample newsletter subscribers...')

    const subscribers = [
      {
        email: 'john.smith@example.com',
        name: 'John Smith',
        status: 'ACTIVE',
        source: 'website',
        preferences: {
          frequency: 'monthly',
          topics: ['impact-stories', 'project-updates']
        }
      },
      {
        email: 'sarah.johnson@example.com',
        name: 'Sarah Johnson',
        status: 'ACTIVE',
        source: 'event',
        preferences: {
          frequency: 'weekly',
          topics: ['all']
        }
      },
      {
        email: 'marie.dubois@example.com',
        name: 'Marie Dubois',
        status: 'ACTIVE',
        source: 'social',
        preferences: {
          frequency: 'monthly',
          topics: ['project-updates', 'news']
        }
      }
    ]

    for (const subscriber of subscribers) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: subscriber.email },
        update: {},
        create: subscriber
      })
    }

    console.log(`✅ Created ${subscribers.length} newsletter subscribers`)

    // Create Sample Activity Logs
    console.log('📊 Creating sample activity logs...')

    const activityLogs = [
      {
        userId: superAdmin.id,
        action: 'LOGIN',
        details: { loginMethod: 'email', ip: '192.168.1.1' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        userId: editor.id,
        action: 'CREATE_BLOG_POST',
        entity: 'blog_post',
        entityId: 'sample-post-id',
        details: { title: 'Sample Blog Post', status: 'PUBLISHED' },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        userId: superAdmin.id,
        action: 'UPDATE_PROJECT',
        entity: 'project',
        entityId: 'sample-project-id',
        details: { field: 'raisedAmount', oldValue: 95000, newValue: 102000 },
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ]

    for (const log of activityLogs) {
      await prisma.activityLog.create({
        data: log
      })
    }

    console.log(`✅ Created ${activityLogs.length} activity logs`)

    console.log('🎉 Database initialization completed successfully!')
    console.log('')
    console.log('🔑 Admin Credentials:')
    console.log(`Email: ${process.env.SUPER_ADMIN_EMAIL || 'admin@baobabhope.org'}`)
    console.log(`Password: ${process.env.SUPER_ADMIN_PASSWORD || 'SuperSecure2024!'}`)
    console.log('')
    console.log('📝 Editor Credentials:')
    console.log('Email: editor@baobabhope.org')
    console.log('Password: Editor123!')
    console.log('')
    console.log('🚀 You can now access the admin dashboard at /admin')

  } catch (error) {
    console.error('❌ Error during database initialization:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
