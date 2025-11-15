import { HeroSection } from '@/features/home/hero-section'
import { AboutSection } from '@/features/about/about-section'
import { SkillsSection } from '@/features/skills/skills-section'
import { ProjectsSection } from '@/features/projects/projects-section'
import { ExperienceSection } from '@/features/experience/experience-section'
import { ServicesSection } from '@/features/services/services-section'
import { BlogSection } from '@/features/blog/blog-section'
import { ContactSection } from '@/features/contact/contact-section'

/**
 * Home Page
 * Main landing page with all sections
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ServicesSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}

