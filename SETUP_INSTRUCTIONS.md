# BAOBAB HOPE Admin Dashboard Setup Instructions

This guide will help you set up the complete admin dashboard for the BAOBAB HOPE charity website with Prisma ORM and Neon database.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn
- Git

### 1. Install Dependencies

```bash
npm install --force
```

**Note**: Use `--force` flag to resolve dependency conflicts during initial setup.

### 2. Setup Database

The database connection is already configured for Neon. Run:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

Or run all at once:
```bash
npm run admin:setup
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Dashboard

- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@baobabhope.org`
- **Password**: `SuperSecure2024!`

---

## 📋 Detailed Setup Process

### Environment Configuration

The `.env` file is pre-configured with:
- Neon database connection
- Authentication secrets
- Admin credentials

**Environment Variables:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_90HZqbtJKOap@ep-snowy-salad-adotb6vv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
SUPER_ADMIN_EMAIL="admin@baobabhope.org"
SUPER_ADMIN_PASSWORD="SuperSecure2024!"
```

### Database Schema Overview

The Prisma schema includes:
- **User Management**: Admin users with role-based permissions
- **Content Management**: Pages, Blog posts, Projects, Events
- **Communication**: Contacts, Volunteers, Newsletter subscribers
- **Financial**: Donation tracking and reporting
- **System**: Activity logs, Settings, Analytics

### Initial Data

After running `npm run db:seed`, you'll have:
- Super admin and editor accounts
- Sample pages (Home, About, Contact, Privacy Policy)
- Blog categories and sample posts
- Sample projects with financial tracking
- Site settings and configuration

---

## 🎯 Admin Dashboard Features

### Content Management
- **Pages**: Create/edit website pages with rich content
- **Blog**: Full blog system with categories and tags
- **Projects**: Manage charity projects with financial tracking
- **Events**: Event management with attendee tracking
- **Media Library**: File and image management

### User & Communication
- **Users**: Manage admin accounts and permissions
- **Volunteers**: Handle volunteer applications
- **Contacts**: Manage contact form submissions
- **Newsletter**: Email subscriber management

### Analytics & Reporting
- **Dashboard**: Overview statistics and recent activity
- **Analytics**: Traffic and engagement monitoring
- **Financial Reports**: Donation and project funding reports
- **Activity Logs**: Complete audit trail

### Multi-language Support
- **22 Languages Supported**: Including RTL languages
- **Translation Management**: Built-in translation interface
- **SEO Optimization**: Multi-language SEO features

---

## 🔧 Development Commands

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Apply schema changes
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open database GUI
npm run db:studio

# Seed with sample data
npm run db:seed

# Reset database completely
npm run db:reset
```

### Build Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Test build process
node scripts/test-build.js
```

### Testing Commands
```bash
# Run all tests
npm test

# End-to-end tests
npm run test:e2e

# Test with coverage
npm run test:coverage
```

---

## 🔐 Authentication System

### User Roles
- **Super Admin**: Full system access
- **Admin**: Content and user management
- **Editor**: Content creation and editing
- **User**: Read-only access

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for login attempts
- Session management
- Activity logging

### Default Accounts
```
Super Admin:
- Email: admin@baobabhope.org
- Password: SuperSecure2024!

Editor:
- Email: editor@baobabhope.org
- Password: Editor123!
```

---

## 📊 Database Management

### Neon Database
- **Provider**: Neon PostgreSQL
- **Connection**: Already configured
- **Features**: Connection pooling, automated backups

### Prisma ORM
- **Schema**: `prisma/schema.prisma`
- **Client**: Auto-generated based on schema
- **Migrations**: Version controlled schema changes

### Backup & Recovery
- Automatic Neon backups
- Manual backup via `pg_dump`
- Schema versioning with Prisma migrations

---

## 🌐 Multi-language Configuration

### Supported Languages (22 total)
- **European**: English, French, Spanish, German, Italian, Portuguese, Dutch, Swedish, Danish, Norwegian, Polish, Russian
- **Asian**: Chinese, Japanese, Korean, Hindi, Bengali, Turkish
- **RTL**: Arabic, Urdu, Hebrew, Persian

### Translation Management
- Namespace-based organization
- Fallback to English for missing translations
- Built-in translation interface
- Cultural formatting for dates, numbers

---

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --force

# Regenerate Prisma client
npm run db:generate
```

#### Database Connection Issues
1. Verify Neon database URL in `.env`
2. Check network connectivity
3. Ensure database isn't suspended
4. Try `npm run db:push` to reconnect

#### Authentication Issues
1. Clear browser cookies
2. Check JWT secret in `.env`
3. Verify user role in database
4. Check activity logs for errors

#### Missing Dependencies
```bash
# Install core dependencies
npm install @prisma/client prisma bcryptjs jose zod

# Install UI dependencies
npm install lucide-react @radix-ui/react-dialog

# Install development dependencies
npm install -D @types/bcryptjs typescript
```

### Build Process Issues

If you encounter build errors, run the diagnostic script:
```bash
node scripts/test-build.js
```

This will:
1. Check TypeScript compilation
2. Test Next.js build process
3. Provide specific error guidance

---

## 📁 Project Structure

```
charity-website/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── ...                # Public website pages
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Database client
│   └── auth/             # Authentication system
├── prisma/               # Database schema
├── public/               # Static assets
│   └── locales/          # Translation files
├── scripts/              # Setup and utility scripts
├── types/                # TypeScript declarations
└── ...                   # Configuration files
```

---

## 🔄 Production Deployment

### Environment Setup
1. Set production environment variables
2. Configure secure secrets
3. Setup SSL certificates
4. Configure domain and DNS

### Database Migration
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

### Build and Deploy
```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📞 Support

### Documentation
- **Admin Guide**: `ADMIN_DASHBOARD_README.md`
- **Translation Guide**: `TRANSLATION_ANALYSIS_SUMMARY.md`
- **Migration Guide**: `MIGRATION_SUMMARY.md`

### Getting Help
1. Check error logs in admin dashboard
2. Review activity logs for detailed information
3. Use browser developer tools for frontend issues
4. Check database connection and query logs

### Development Tips
- Use `npm run db:studio` to inspect database
- Check activity logs for user actions
- Monitor performance with Next.js built-in analytics
- Use TypeScript for better development experience

---

## ✅ Verification Checklist

After setup, verify these items work:

- [ ] Admin dashboard loads at `/admin`
- [ ] Can login with admin credentials
- [ ] Database connection established
- [ ] Sample data visible in dashboard
- [ ] Can create/edit pages
- [ ] Can manage blog posts
- [ ] Can track projects and donations
- [ ] Multi-language system functional
- [ ] File upload working
- [ ] Email notifications configured

---

**Congratulations!** Your BAOBAB HOPE admin dashboard is ready to use. You now have a complete content management system for your charity website.

For additional features or customization, refer to the detailed documentation files in the project root.