'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Skill } from "@/types"

interface SkillsVisualizationProps {
  skills: Skill[]
}

export function SkillsVisualization({ skills }: SkillsVisualizationProps) {
  const getLevelValue = (level: string) => {
    switch (level) {
      case 'expert': return 100
      case 'advanced': return 75
      case 'intermediate': return 50
      case 'beginner': return 25
      default: return 0
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'from-green-500 to-emerald-600'
      case 'advanced': return 'from-blue-500 to-cyan-600'
      case 'intermediate': return 'from-yellow-500 to-orange-600'
      case 'beginner': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const skillsByCategory = {
    language: skills.filter(s => s.category === 'language'),
    framework: skills.filter(s => s.category === 'framework'),
    database: skills.filter(s => s.category === 'database'),
    tool: skills.filter(s => s.category === 'tool'),
    other: skills.filter(s => s.category === 'other'),
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
        if (categorySkills.length === 0) return null
        
        return (
          <GlassCard key={category} className="p-6" glow>
            <h3 className="text-xl font-bold mb-4 capitalize">{category}</h3>
            <div className="space-y-4">
              {categorySkills.map((skill, index) => {
                const value = getLevelValue(skill.level)
                return (
                  <motion.div
                    key={skill.id || skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getLevelColor(skill.level)} rounded-full`}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}

