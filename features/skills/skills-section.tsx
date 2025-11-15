'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { Skill } from "@/types"

/**
 * Skills Section Component
 * Displays technical skills organized by category - Dynamic from API
 */
export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading skills...</div>
        </div>
      </section>
    )
  }

  const skillCategories = {
    language: skills.filter(s => s.category === 'language'),
    framework: skills.filter(s => s.category === 'framework'),
    database: skills.filter(s => s.category === 'database'),
    tool: skills.filter(s => s.category === 'tool'),
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-500'
      case 'advanced': return 'bg-blue-500'
      case 'intermediate': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
      {/* Premium background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            Skills & Technologies
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Technologies and tools I work with to build amazing applications
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skillCategories).map(([category, categorySkills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 h-full glow shine">
                  <h3 className="text-lg font-bold mb-6 capitalize text-primary">
                    {category === 'language' ? '💻 Languages' : 
                     category === 'framework' ? '🌐 Frameworks' :
                     category === 'database' ? '🗄️ Databases' : '⚙️ Tools'}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                        className="space-y-2 group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize font-medium px-2 py-0.5 bg-muted/50 rounded-md">
                            {skill.level}
                          </span>
                        </div>
                        <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: (index * 0.1) + (skillIndex * 0.05) + 0.3, ease: "easeOut" }}
                            className={cn('h-full rounded-full', getLevelColor(skill.level))}
                            style={{
                              width: skill.level === 'expert' ? '100%' :
                                     skill.level === 'advanced' ? '85%' :
                                     skill.level === 'intermediate' ? '65%' : '45%'
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

