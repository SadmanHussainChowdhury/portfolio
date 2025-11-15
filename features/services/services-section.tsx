'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Service } from "@/types"

/**
 * Services Section Component
 * Displays services offered - Dynamic from API
 */
export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = React.useCallback(() => {
    fetch('/api/portfolio/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchServices()
      }
    }

    const handleFocus = () => {
      fetchServices()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchServices])

  if (loading) {
    return (
      <section id="services" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">Loading services...</div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">No services available at the moment.</div>
        </div>
      </section>
    )
  }
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
          >
            Services
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            What I can help you with
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-8 h-full glow shine group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-5xl mb-6 inline-block"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                        className="flex items-start text-sm text-muted-foreground group/item"
                      >
                        <span className="mr-3 text-primary font-bold text-lg group-hover/item:scale-110 transition-transform">✓</span>
                        <span className="group-hover/item:text-foreground transition-colors">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

