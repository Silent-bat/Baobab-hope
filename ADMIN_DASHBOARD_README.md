# BAOBAB HOPE Admin Dashboard

A comprehensive super admin dashboard built with Next.js, Prisma, and Neon PostgreSQL for managing all aspects of the BAOBAB HOPE charity website.

## 🚀 Features

### Content Management System
- **Pages Management**: Create, edit, and manage all website pages with rich content
- **Blog Management**: Full blog system with categories, tags, and SEO optimization
- **Project Management**: Track and manage charity projects with financial data and updates
- **Event Management**: Create and manage events with attendee tracking
- **Media Library**: Upload and organize images, documents, and other media files

### User & Communication Management
- **User Management**: Manage admin users, editors, and permissions
- **Volunteer Management**: Handle volunteer applications and approvals
- **Contact Management**: Manage contact form submissions and inquiries
- **Newsletter Management**: Handle email subscriptions and preferences
- **Partnership Inquiries**: Manage business partnership requests

### Financial & Analytics
- **Donation Management**: Track and manage donations with detailed reporting
- **Analytics Dashboard**: Monitor website traffic, engagement, and performance
- **Financial Reports**: Generate reports on fundraising and project financing

### Multi-language & SEO
- **Translation Management**: Manage translations across 22 supported languages
- **SEO Tools**: Optimize meta tags, descriptions, and keywords
- **Content Localization**: Handle culturally appropriate content for different regions

### System Administration
- **Site Settings**: Configure global site settings and preferences
- **Activity Logging**: Track all admin actions for security and auditing
- **Backup Management**: Database backup and restore functionality
- **Performance Monitoring**: Monitor system health and performance

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Neon PostgreSQL database (provided)
- Git for version control

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

The `.env` file is already configured with your Neon database URL:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_90HZqbtJKOap@ep-snowy-salad-adotb6vv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

Or run the complete setup in one command:
```bash
npm run admin:setup
```

### 4. Start Development Server

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:3000/admin`

## 🔐 Default Admin Credentials

After running the seed script, you can log in with:

**Super Admin:**
- Email: `admin@baobabhope.org`
- Password: `SuperSecure2024!`

**Content Editor:**
- Email: `editor@baobabhope.org`
- Password: `Editor123!`

## 📊 Database Schema

### Core Entities

#### Users & Authentication
- `User` - Admin users with role-based permissions
- `UserSession` - Session management
- `ActivityLog` - Audit trail of all admin actions

#### Content Management
- `Page` - Website pages with rich content
- `BlogPost` - Blog articles with categories and tags
- `BlogCategory` - Blog post categories
- `BlogTag` - Blog post tags
- `Project` - Charity projects with financial tracking
- `ProjectUpdate` - Project progress updates
- `Event` - Events and activities
- `EventAttendee` - Event registration tracking

#### User Interactions
- `ContactMessage` - Contact form submissions
- `VolunteerApplication` - Volunteer applications
- `NewsletterSubscriber` - Email subscribers
- `Donation` - Donation tracking and management

#### System & Configuration
- `Setting` - Site-wide configuration settings
- `Translation` - Multi-language content management
- `MediaFile` - File and image management
- `PageView` - Analytics and traffic tracking

## 🎯 Admin Dashboard Sections

### 1. Dashboard (`/admin`)
- Overview statistics and metrics
- Recent activity feed
- Quick actions panel
- System health monitoring
- Traffic analytics summary

### 2. Content Management

#### Pages (`/admin/pages`)
- List all website pages
- Create/edit/delete pages
- Manage page SEO settings
- Multi-language page variants
- Page status management (Draft/Published/Archived)

#### Blog (`/admin/blog`)
- Blog post management
- Category and tag organization
- Featured image handling
- SEO optimization
- Scheduling and publishing

#### Projects (`/admin/projects`)
- Project creation and management
- Financial tracking (goals, raised amounts)
- Progress updates and reporting
- Project gallery and media
- Beneficiary and volunteer tracking

#### Events (`/admin/events`)
- Event creation and management
- Attendee registration tracking
- Event location and timing
- Pricing and capacity management

### 3. User Management

#### Users (`/admin/users`)
- Admin user management
- Role assignment (Super Admin, Admin, Editor)
- Permission management
- User activity tracking

#### Volunteers (`/admin/volunteers`)
- Volunteer application review
- Approval/rejection workflow
- Volunteer database management
- Skills and availability tracking

#### Contacts (`/admin/contacts`)
- Contact form submission management
- Response tracking
- Priority assignment
- Contact categorization

### 4. Communication

#### Newsletter (`/admin/newsletter`)
- Subscriber management
- Email campaign creation
- Subscription preferences
- Analytics and engagement tracking

### 5. Financial Management

#### Donations (`/admin/donations`)
- Donation tracking and reporting
- Payment method management
- Donor information management
- Financial analytics and reporting
- Tax receipt generation

### 6. System Administration

#### Media (`/admin/media`)
- File upload and management
- Image optimization
- Media organization and tagging
- Storage usage monitoring

#### Translations (`/admin/translations`)
- Multi-language content management
- Translation status tracking
- Content localization tools
- Language-specific content variants

#### Analytics (`/admin/analytics`)
- Website traffic analysis
- User engagement metrics
- Content performance tracking
- Conversion rate monitoring

#### Settings (`/admin/settings`)
- Site configuration management
- Contact information
- Social media links
- Payment gateway settings
- Email configuration
- SEO settings

## 🔧 API Endpoints

### Pages API
- `GET /api/admin/pages` - List all pages with filtering
- `POST /api/admin/pages` - Create new page
- `GET /api/admin/pages/[id]` - Get specific page
- `PUT /api/admin/pages/[id]` - Update page
- `DELETE /api/admin/pages/[id]` - Delete page
- `PATCH /api/admin/pages/[id]` - Partial updates (publish, archive, duplicate)

### Projects API
- `GET /api/admin/projects` - List projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/[id]` - Get project details
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Blog API
- `GET /api/admin/blog` - List blog posts
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/blog/[id]` - Get blog post
- `PUT /api/admin/blog/[id]` - Update blog post
- `DELETE /api/admin/blog/[id]` - Delete blog post

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based session management
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session timeout and refresh

### Data Protection
- SQL injection prevention via Prisma
- XSS protection
- CSRF protection
- Rate limiting
- Input validation with Zod

### Audit Trail
- Complete activity logging
- User action tracking
- Change history for all entities
- IP address and timestamp logging

## 📱 Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🌐 Multi-language Support

The admin dashboard supports content management in 22 languages:
- English (en)
- French (fr)
- Spanish (es)
- German (de)
- Italian (it)
- Portuguese (pt)
- Dutch (nl)
- Swedish (sv)
- Danish (da)
- Norwegian (no)
- Polish (pl)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Hindi (hi)
- Bengali (bn)
- Turkish (tr)
- Arabic (ar)
- Urdu (ur)
- Hebrew (he)
- Persian (fa)

## 🔄 Database Commands

### Development Commands
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed

# Reset database and reseed
npm run db:reset
```

### Production Commands
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

## 📈 Performance Optimization

### Database Optimization
- Connection pooling with Neon
- Query optimization with Prisma
- Efficient indexing strategy
- Pagination for large datasets

### Frontend Optimization
- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Caching strategies

### Monitoring
- Performance metrics tracking
- Error logging and monitoring
- Database query analysis
- User experience monitoring

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- Unit tests for all API endpoints
- Integration tests for database operations
- End-to-end tests for critical user journeys
- Performance testing for database queries

## 🚀 Deployment

### Environment Variables for Production
```bash
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
SMTP_HOST="your-email-provider"
SMTP_USER="your-email-username"
SMTP_PASSWORD="your-email-password"
```

### Deployment Steps
1. Set up production environment variables
2. Run database migrations: `npx prisma migrate deploy`
3. Build the application: `npm run build`
4. Start the production server: `npm start`

## 📞 Support & Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify Neon database URL in `.env`
- Check network connectivity
- Ensure database is not suspended

#### Prisma Client Issues
- Run `npm run db:generate` after schema changes
- Clear node_modules and reinstall if needed

#### Permission Issues
- Check user roles in database
- Verify JWT token validity
- Review activity logs for authentication errors

### Getting Help
- Check the Activity Logs in admin panel for detailed error information
- Review Prisma logs for database issues
- Use browser developer tools for frontend debugging

## 🔮 Future Enhancements

### Planned Features
- Real-time notifications
- Advanced analytics dashboard
- Automated backup scheduling
- Advanced SEO tools
- Social media integration
- Email marketing automation
- Mobile app API
- Advanced reporting tools

### Contribution Guidelines
1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request with detailed description

## 📄 License

This admin dashboard is part of the BAOBAB HOPE website project and is licensed under the MIT License.

---

**Note**: This admin dashboard provides complete control over all website content and functionality. Always ensure proper backup procedures are in place before making significant changes to the production database.