/**
 * TypeScript type definitions for the portfolio
 */

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  category: 'web' | 'mobile' | 'fullstack' | 'other'
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string[]
  technologies: string[]
  location?: string
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'language' | 'framework' | 'tool' | 'database' | 'other'
  icon?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  image?: string
  readTime?: number
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

