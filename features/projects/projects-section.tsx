'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Project } from "@/types"

/**
 * Project Card Component
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8 }}
    >
      <GlassCard className="overflow-hidden group" glow shine>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {project.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-lg pulse-glow"
            >
              ⭐ Featured
            </motion.div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 bg-muted/80 backdrop-blur-sm text-xs rounded-lg font-medium border border-border/50 hover:border-primary/50 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild className="flex-1 group/btn">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="sm" asChild className="flex-1 group/btn">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Live
                </a>
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

/**
 * Projects Section Component
 * Showcases portfolio projects - Dynamic from API
 */
export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = React.useCallback(() => {
    fetch('/api/portfolio/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProjects()
      }
    }

    const handleFocus = () => {
      fetchProjects()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Periodic refresh every 30 seconds when page is visible (fallback)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchProjects()
      }
    }, 30000) // 30 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [fetchProjects])

  if (loading) {
    return (
      <section id="projects" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">Loading projects...</div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">No projects available at the moment.</div>
        </div>
      </section>
    )
  }

  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
          >
            Featured Projects
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            A selection of projects I've worked on, showcasing my skills and experience
          </p>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12 text-foreground/90"
              >
                Other Projects
              </motion.h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={featuredProjects.length + index} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}

