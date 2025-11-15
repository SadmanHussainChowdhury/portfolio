# Setup Instructions

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

## Detailed Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 2. Customize Content

#### Update Personal Information
Edit `lib/constants.ts`:
- Change `SITE_CONFIG` values
- Update social media links
- Modify contact information

#### Add Your Projects
Edit `data/projects.ts`:
- Add your project details
- Update images (use Unsplash or your own)
- Add GitHub and live URLs

#### Update Skills
Edit `data/skills.ts`:
- Modify skill levels
- Add/remove skills
- Update categories

#### Add Experience
Edit `data/experience.ts`:
- Add your work experience
- Update descriptions
- Add technologies used

### 3. Contact Form Setup

The contact form is ready but needs email service integration:

**Option 1: Resend (Recommended)**
```bash
npm install resend
```

Update `app/api/contact/route.ts`:
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
// Add email sending logic
```

**Option 2: SendGrid**
```bash
npm install @sendgrid/mail
```

**Option 3: Nodemailer**
```bash
npm install nodemailer
```

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Deploy

**Vercel (Easiest)**
1. Push to GitHub
2. Import on Vercel
3. Deploy automatically

**Other Platforms**
- Follow Next.js deployment guides
- Ensure Node.js 18+ is available

## Customization Guide

### Change Colors
Edit `app/globals.css` CSS variables:
```css
:root {
  --primary: 262.1 83.3% 57.8%; /* Change this */
}
```

### Modify Animations
Edit Framer Motion props in feature components:
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### Add New Sections
1. Create new feature folder in `features/`
2. Create section component
3. Import and add to `app/page.tsx`

## Troubleshooting

### Theme not working?
- Ensure `next-themes` is installed
- Check `ThemeProvider` is in layout

### Images not loading?
- Update `next.config.js` image domains
- Use absolute URLs or Next.js Image component

### Build errors?
- Check TypeScript errors: `npm run lint`
- Ensure all dependencies are installed
- Clear `.next` folder and rebuild

## Need Help?

Check the main README.md for more information or open an issue on GitHub.

