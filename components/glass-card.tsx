import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Ultra Premium Glass Card Component
 * Enhanced glassmorphism with premium effects
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glow?: boolean
  shine?: boolean
}

export function GlassCard({ children, className, glow = false, shine = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 dark:border-white/10",
        "bg-white/10 dark:bg-black/30",
        "premium-blur",
        "shadow-xl shadow-primary/5 dark:shadow-primary/10",
        "transition-all duration-500 ease-out",
        "hover:border-white/30 dark:hover:border-white/20",
        "hover:bg-white/15 dark:hover:bg-black/40",
        "hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20",
        "hover:scale-[1.02] hover:-translate-y-1",
        glow && "glow-effect-hover",
        shine && "shine-effect",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

