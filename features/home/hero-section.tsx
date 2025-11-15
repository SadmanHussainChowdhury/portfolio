'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

/**
 * Hero Section Component
 * Main landing section with introduction and CTA - Dynamic Resume
 */
export function HeroSection() {
  const [resumeUrl, setResumeUrl] = useState(SITE_CONFIG.resumeUrl)
  
  useEffect(() => {
    // Fetch dynamic config for resume URL
    fetch('/api/portfolio/config')
      .then(res => res.json())
      .then(data => {
        if (data.config?.resumeUrl) {
          setResumeUrl(data.config.resumeUrl)
        }
      })
      .catch(() => {
        // Fallback to default if API fails
        setResumeUrl(SITE_CONFIG.resumeUrl)
      })
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Ultra Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground mb-6 font-medium tracking-wide"
            >
              <span className="inline-block float-animation">👋</span> Hello, I'm
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 gradient-text leading-tight"
            >
              {SITE_CONFIG.name}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-foreground/90"
            >
              {SITE_CONFIG.title}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {SITE_CONFIG.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={scrollToContact}
                className="group relative overflow-hidden glow-effect-hover shine-effect px-8 py-6 text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center">
                  Get In Touch
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group border-2 hover:border-primary/50 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
              >
                <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer group"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors" />
            <ArrowDown className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

