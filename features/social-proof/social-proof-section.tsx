'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, ExternalLink, CheckCircle2 } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { SocialProof } from "@/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

export function SocialProofSection() {
  const [socialProof, setSocialProof] = useState<SocialProof[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSocialProof = React.useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio/social-proof')
      const data = await response.json()
      setSocialProof(data.socialProof || [])
    } catch (error) {
      console.error('Failed to fetch social proof:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSocialProof()
  }, [fetchSocialProof])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSocialProof()
      }
    }
    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', fetchSocialProof)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', fetchSocialProof)
    }
  }, [fetchSocialProof])

  if (loading || socialProof.length === 0) {
    return null
  }

  return (
    <section id="social-proof" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Connect With Me
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow my journey and connect on social platforms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {socialProof.map((social, index) => {
            const Icon = iconMap[social.platform] || ExternalLink
            return (
              <motion.div
                key={social.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <GlassCard className="p-6 text-center" glow>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 capitalize">{social.platform}</h3>
                  <p className="text-muted-foreground mb-4">@{social.username}</p>
                  {social.followers !== undefined && (
                    <p className="text-2xl font-bold text-primary mb-4">
                      {social.followers.toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal ml-1">
                        {social.platform === 'github' ? 'contributions' : 'followers'}
                      </span>
                    </p>
                  )}
                  {social.verified && (
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-4">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Profile <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

