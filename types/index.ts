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
  description?: string[]
  responsibilities?: string[]
  technologies?: string[]
  location?: string
}

export interface Skill {
  id?: string
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

// Testimonials
export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
  linkedinUrl?: string
  featured: boolean
  createdAt: string
}

// Achievements/Certifications
export interface Achievement {
  id: string
  title: string
  issuer: string
  description: string
  date: string
  credentialUrl?: string
  image?: string
  category: 'certification' | 'award' | 'badge' | 'recognition'
  featured: boolean
}

// Analytics
export interface Analytics {
  id: string
  date: string
  pageViews: number
  uniqueVisitors: number
  referrer?: string
  country?: string
  device?: string
}

// Newsletter
export interface Subscriber {
  id: string
  email: string
  name?: string
  subscribedAt: string
  status: 'active' | 'unsubscribed'
  source?: string
}

// Performance Metrics
export interface PerformanceMetric {
  id: string
  type: 'github' | 'leetcode' | 'codewars' | 'other'
  label: string
  value: number | string
  url?: string
  updatedAt: string
}

// Project Tags (extend Project)
export interface ProjectWithTags extends Project {
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

// Blog Enhancements
export interface BlogPostEnhanced extends BlogPost {
  category?: string
  relatedPosts?: string[]
  views?: number
  likes?: number
}

// Social Proof
export interface SocialProof {
  id: string
  platform: 'github' | 'linkedin' | 'twitter' | 'stackoverflow' | 'medium'
  username: string
  followers?: number
  contributions?: number
  url: string
  verified: boolean
}

