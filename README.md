# Modern Portfolio Website

A fully modern, professional, and responsive personal portfolio website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **ShadCN UI**.

## ✨ Features

- 🎨 **Premium UI Design** - Minimal, clean, and ultra-modern interface
- 🌓 **Dark/Light Mode** - Seamless theme switching with system preference detection
- ✨ **Glassmorphism Effects** - Beautiful frosted glass card designs
- 🎭 **Smooth Animations** - Framer Motion powered animations throughout
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- ♿ **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🔍 **SEO Optimized** - Complete meta tags, Open Graph, and Twitter cards
- 🏗️ **Feature-Based Architecture** - Scalable and maintainable code structure
- 🎯 **TypeScript** - Full type safety across the application
- 🧩 **Reusable Components** - Modular component system

## 📋 Sections

- **Home** - Hero section with introduction
- **About** - Personal information and background
- **Skills** - Technical skills organized by category
- **Projects** - Portfolio projects showcase
- **Experience** - Professional work experience
- **Services** - Services offered
- **Blog** - Blog posts and articles
- **Contact** - Contact form and information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio-nextjs/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── contact/       # Contact form endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/                # ShadCN UI components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer component
│   ├── theme-provider.tsx # Theme context
│   ├── theme-toggle.tsx   # Theme switcher
│   └── glass-card.tsx     # Glassmorphism card
├── features/               # Feature-based sections
│   ├── home/              # Hero section
│   ├── about/             # About section
│   ├── skills/             # Skills section
│   ├── projects/           # Projects section
│   ├── experience/        # Experience section
│   ├── services/           # Services section
│   ├── blog/               # Blog section
│   └── contact/            # Contact section
├── data/                   # Data files
│   ├── projects.ts         # Projects data
│   ├── experience.ts       # Experience data
│   ├── skills.ts           # Skills data
│   ├── services.ts         # Services data
│   └── blog.ts             # Blog posts data
├── lib/                    # Utility functions
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # App constants
├── types/                  # TypeScript types
│   └── index.ts           # Type definitions
└── public/                 # Static assets
```

## 🎨 Customization

### Update Personal Information

Edit `lib/constants.ts` to update:
- Name, title, description
- Social media links
- Contact information

### Add Projects

Edit `data/projects.ts` to add your projects:

```typescript
export const projects: Project[] = [
  {
    id: '1',
    title: 'Your Project',
    description: 'Project description',
    // ... more fields
  },
]
```

### Update Skills

Edit `data/skills.ts` to modify your skills list.

### Customize Theme

Edit `app/globals.css` to change color scheme and theme variables.

## 📧 Contact Form Setup

The contact form API route is located at `app/api/contact/route.ts`. To enable email sending:

1. **Install an email service** (e.g., Resend, SendGrid, Nodemailer)
2. **Update the API route** with your email service integration
3. **Add environment variables** for API keys

Example with Resend:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'contact@yourdomain.com',
  to: 'your-email@example.com',
  subject: `Portfolio Contact: ${subject}`,
  html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Contact

**Sadman Hussain Chowdhury**
- Email: Sadman.hussain.96@outlook.com
- Phone: +8801938960844
- GitHub: [@SadmanHussainChowdhury](https://github.com/SadmanHussainChowdhury)

---

Made with ❤️ using Next.js and TypeScript

