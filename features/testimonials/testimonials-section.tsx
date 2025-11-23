'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Testimonial } from "@/types"

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTestimonials = React.useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio/testimonials')
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTestimonials()
      }
    }
    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', fetchTestimonials)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', fetchTestimonials)
    }
  }, [fetchTestimonials])

  if (loading) {
    return (
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Testimonials</h2>
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const featured = testimonials.filter(t => t.featured)
  const displayTestimonials = featured.length > 0 ? featured : testimonials

  return (
    <section id="testimonials" className="py-20 px-4 relative overflow-hidden">
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
            What People Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Testimonials from clients and colleagues
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <GlassCard className="h-full p-6" glow>
                <div className="flex items-start gap-4 mb-4">
                  <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-4">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  {testimonial.avatar && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

