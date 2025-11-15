'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Github, Mail, Phone, Linkedin } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

/**
 * Footer Component
 * Site footer with links and social media - Dynamic from API
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  const [config, setConfig] = useState({
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    links: SITE_CONFIG.links,
  })

  useEffect(() => {
    // Fetch dynamic config
    fetch('/api/portfolio/config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setConfig({
            name: data.config.name || SITE_CONFIG.name,
            description: data.config.description || SITE_CONFIG.description,
            links: {
              github: data.config.links?.github || SITE_CONFIG.links.github,
              linkedin: data.config.links?.linkedin || SITE_CONFIG.links.linkedin,
              email: data.config.links?.email || SITE_CONFIG.links.email,
              phone: data.config.links?.phone || SITE_CONFIG.links.phone,
            },
          })
        }
      })
      .catch(() => {
        // Fallback to default if API fails
      })
  }, [])

  return (
    <footer className="border-t border-border/50 bg-background/80 premium-blur relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{config.name}</h3>
            <p className="text-muted-foreground text-sm">
              {config.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Connect</h3>
            <div className="flex space-x-4">
              <a
                href={config.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={config.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={`mailto:${config.links.email}`}
                className="group relative p-3 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={`tel:${config.links.phone}`}
                className="group relative p-3 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            &copy; {currentYear} {config.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

