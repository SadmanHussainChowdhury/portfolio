# Admin Panel Documentation

## Overview

The portfolio now includes a fully dynamic admin panel that allows you to manage all portfolio content through a beautiful, ultra-premium interface.

## Features

- 🔐 **Secure Authentication** - Password-protected admin access
- 📊 **Dashboard** - Overview of all content with statistics
- ✏️ **Content Management** - CRUD operations for all sections:
  - Projects
  - Experience
  - Skills
  - Services
  - Blog Posts
  - Site Configuration
- 🎨 **Ultra Premium UI** - Glassmorphism design with smooth animations
- 📱 **Responsive** - Works on all devices

## Setup

### 1. Set Admin Password

Create a `.env.local` file in the root directory:

```env
ADMIN_PASSWORD=your-secure-password-here
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### 2. Access Admin Panel

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/login`
3. Enter your admin password
4. You'll be redirected to the admin dashboard

## Admin Panel Sections

### Dashboard
- Overview of all content
- Statistics for each content type
- Quick access to all sections

### Projects
- Add, edit, and delete projects
- Set featured projects
- Manage project images, descriptions, and links

### Experience
- Manage work experience entries
- Add company details, dates, and responsibilities

### Skills
- Manage technical skills
- Set skill levels and categories

### Services
- Manage service offerings
- Add service descriptions and features

### Blog
- Create and manage blog posts
- Set publication dates and tags

### Settings
- Update site configuration
- Manage personal information and links

## API Endpoints

All API endpoints are protected and require authentication:

- `GET /api/portfolio/projects` - Fetch all projects
- `POST /api/portfolio/projects` - Create new project
- `PUT /api/portfolio/projects` - Update project
- `DELETE /api/portfolio/projects?id=xxx` - Delete project

Similar endpoints exist for:
- `/api/portfolio/experience`
- `/api/portfolio/skills`
- `/api/portfolio/services`
- `/api/portfolio/blog`
- `/api/portfolio/config`

## Data Storage

Currently using JSON file-based storage in `data/db/` directory. 

**For Production:**
- Consider migrating to MongoDB, PostgreSQL, or another database
- Update `lib/db.ts` with your database connection
- The API structure remains the same

## Security Notes

1. **Change Default Password**: Always set a strong `ADMIN_PASSWORD` in production
2. **HTTPS**: Use HTTPS in production for secure cookie transmission
3. **Rate Limiting**: Consider adding rate limiting for production
4. **Database**: For production, use a proper database instead of JSON files
5. **Authentication**: Consider upgrading to NextAuth.js or Clerk for production

## Frontend Integration

All frontend sections now fetch data from the API:

- Projects section loads from `/api/portfolio/projects`
- Skills section loads from `/api/portfolio/skills`
- Experience section loads from `/api/portfolio/experience`
- Services section loads from `/api/portfolio/services`
- Blog section loads from `/api/portfolio/blog`

The portfolio is now fully dynamic! 🚀

