'use client'

import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Phone, MapPin, MessageCircle, Download } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SITE_CONFIG } from "@/lib/constants"

/**
 * Contact Section Component
 * Contact form and information
 */
export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || data.details || 'Failed to send message. Please try again.')
        console.error('Contact form error:', data)
      }
    } catch (error) {
      setSubmitStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Network error. Please check your connection.'
      setErrorMessage(errorMsg)
      console.error('Contact form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
          >
            Get In Touch
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Have a project in mind? Let's work together to bring your ideas to life
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-8 glow">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  {submitStatus === 'success' && (
                    <p className="text-green-500 text-sm">Message sent successfully!</p>
                  )}
                  {submitStatus === 'error' && (
                    <div className="text-red-500 text-sm">
                      <p>{errorMessage || 'Failed to send message. Please try again.'}</p>
                      {process.env.NODE_ENV === 'development' && (
                        <p className="text-xs mt-1 opacity-75">Check console for details</p>
                      )}
                    </div>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <GlassCard className="p-8 glow shine">
                <h3 className="text-2xl font-bold mb-8 text-primary">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${SITE_CONFIG.links.email}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {SITE_CONFIG.links.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${SITE_CONFIG.links.phone}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {SITE_CONFIG.links.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground">Faridpur, Bangladesh</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border/50">
                  <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/resume.pdf" download onClick={async () => {
                        try {
                          await fetch('/api/resume/download', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              ip: 'client',
                              userAgent: navigator.userAgent,
                              referrer: document.referrer,
                            }),
                          })
                        } catch (error) {
                          console.error('Failed to track download:', error)
                        }
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={`https://wa.me/${SITE_CONFIG.links.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

