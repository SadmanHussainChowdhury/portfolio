'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, ExternalLink, Calendar } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Achievement } from "@/types"

export function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAchievements = React.useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio/achievements')
      const data = await response.json()
      setAchievements(data.achievements || [])
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAchievements()
      }
    }
    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', fetchAchievements)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', fetchAchievements)
    }
  }, [fetchAchievements])

  if (loading) {
    return (
      <section id="achievements" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Achievements</h2>
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      </section>
    )
  }

  if (achievements.length === 0) {
    return null
  }

  const featured = achievements.filter(a => a.featured)
  const displayAchievements = featured.length > 0 ? featured : achievements

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certification':
        return '🏆'
      case 'award':
        return '🎖️'
      case 'badge':
        return '🏅'
      default:
        return '⭐'
    }
  }

  return (
    <section id="achievements" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Achievements & Certifications
          </h2>
          <p className="text-muted-foreground text-lg">
            Recognitions and certifications I've earned
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <GlassCard className="h-full p-6" glow shine>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl flex-shrink-0">
                    {getCategoryIcon(achievement.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.issuer}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{achievement.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(achievement.date).toLocaleDateString()}</span>
                  </div>
                  {achievement.credentialUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={achievement.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

