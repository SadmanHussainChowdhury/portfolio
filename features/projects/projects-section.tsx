'use client'

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Search, X } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Project, ProjectWithTags } from "@/types"

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

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

  // Extract all unique tags and categories - MUST be before any early returns
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(p => {
      const projectWithTags = p as ProjectWithTags
      if (projectWithTags.tags) {
        projectWithTags.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [projects])

  const categories = ['all', 'web', 'mobile', 'fullstack', 'other'] as const

  // Filter projects - MUST be before any early returns
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false
      }

      // Tags filter
      if (selectedTags.size > 0) {
        const projectWithTags = project as ProjectWithTags
        const projectTags = projectWithTags.tags || []
        const hasSelectedTag = Array.from(selectedTags).some(tag => 
          projectTags.includes(tag)
        )
        if (!hasSelectedTag) return false
      }

      return true
    })
  }, [projects, searchQuery, selectedCategory, selectedTags])

  // Early returns AFTER all hooks
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

  // Calculate featured and other projects after early returns
  const featuredProjects = filteredProjects.filter(p => p.featured)
  const otherProjects = filteredProjects.filter(p => !p.featured)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tag)) {
        newSet.delete(tag)
      } else {
        newSet.add(tag)
      }
      return newSet
    })
  }

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
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            A selection of projects I've worked on, showcasing my skills and experience
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-12 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.has(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.has(tag) && (
                      <X className="w-3 h-3 ml-2" />
                    )}
                  </Button>
                ))}
              </div>
            )}

            {/* Active Filters Count */}
            {(searchQuery || selectedCategory !== 'all' || selectedTags.size > 0) && (
              <div className="text-center text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} projects
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedTags(new Set())
                  }}
                  className="ml-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

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

