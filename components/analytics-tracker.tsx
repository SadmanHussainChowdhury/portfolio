'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageViews: 1,
            uniqueVisitors: 1,
            referrer: document.referrer || 'direct',
            device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          }),
        })
      } catch (error) {
        console.error('Failed to track analytics:', error)
      }
    }

    trackPageView()
  }, [pathname])

  return null
}

