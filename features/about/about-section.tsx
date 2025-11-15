'use client'

import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import Image from "next/image"
import { User } from "lucide-react"

/**
 * About Section Component
 * Personal information and background
 */
export function AboutSection() {
  const [imageError, setImageError] = useState(false)

  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-4 gradient-text"
          >
            About Me
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Get to know more about my background, skills, and passion for technology
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 glow overflow-hidden group">
                <div className="aspect-square relative rounded-xl overflow-hidden bg-muted/50 backdrop-blur-sm">
                  {!imageError ? (
                    <>
                      <Image
                        src="/profile.jpg"
                        alt="Sadman Hussain Chowdhury - Full-Stack Developer"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        priority
                        onError={() => setImageError(true)}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <GlassCard className="p-8 glow shine">
                <h3 className="text-2xl font-bold mb-6 text-primary">Who I Am</h3>
                <p className="text-muted-foreground leading-relaxed mb-5 text-base">
                  I'm a passionate full-stack developer with a strong foundation in modern web technologies. 
                  I love building innovative solutions that solve real-world problems and create exceptional user experiences.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                  With experience in both frontend and backend development, I bring a comprehensive approach 
                  to software engineering. I'm always eager to learn new technologies and stay updated with 
                  industry best practices.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">📍 Location</p>
                    <p className="font-bold text-foreground">Faridpur, Bangladesh</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">💼 Available</p>
                    <p className="font-bold text-primary">Open to Opportunities</p>
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

