/**
 * Application-wide constants
 */

export const SITE_CONFIG = {
  name: "Sadman Hussain Chowdhury",
  title: "Full-Stack Developer & Software Engineer",
  description: "Passionate software developer specializing in modern web technologies. Building innovative solutions with React, Next.js, Node.js, and more.",
  url: "https://sadman-portfolio.vercel.app",
  ogImage: "/og-image.jpg",
  resumeUrl: "/resume.pdf", // Default resume URL - can be updated via admin panel
  links: {
    github: "https://github.com/SadmanHussainChowdhury",
    linkedin: "https://linkedin.com/in/sadman-hussain",
    email: "Sadman.hussain.96@outlook.com",
    phone: "+8801938960844",
  },
} as const

export const NAVIGATION = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Services", href: "#services" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
] as const

