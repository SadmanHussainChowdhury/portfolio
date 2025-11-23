import { HeroSection } from '@/features/home/hero-section'
import { AboutSection } from '@/features/about/about-section'
import { SkillsSection } from '@/features/skills/skills-section'
import { ProjectsSection } from '@/features/projects/projects-section'
import { ExperienceSection } from '@/features/experience/experience-section'
import { ServicesSection } from '@/features/services/services-section'
import { BlogSection } from '@/features/blog/blog-section'
import { TestimonialsSection } from '@/features/testimonials/testimonials-section'
import { AchievementsSection } from '@/features/achievements/achievements-section'
import { NewsletterSection } from '@/features/newsletter/newsletter-section'
import { ContactSection } from '@/features/contact/contact-section'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { SocialProofSection } from '@/features/social-proof/social-proof-section'

/**
 * Home Page
 * Main landing page with all sections
 */
export default function Home() {
  return (
    <>
      <AnalyticsTracker />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ServicesSection />
      <TestimonialsSection />
      <AchievementsSection />
      <BlogSection />
      <SocialProofSection />
      <NewsletterSection />
      <ContactSection />
    </>
  )
}

