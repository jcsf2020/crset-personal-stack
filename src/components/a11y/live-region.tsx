"use client"

import { useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"

interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export function LiveRegion({
  message,
  politeness = 'polite',
  atomic = true,
  relevant = 'all',
  className
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current && message) {
      // Clear and set message to ensure screen readers announce it
      regionRef.current.textContent = ''
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn("sr-only", className)}
    />
  )
}

// Hook for managing live announcements
export function useLiveAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', politeness)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    
    document.body.appendChild(announcer)
    
    // Delay to ensure screen readers pick up the announcement
    setTimeout(() => {
      announcer.textContent = message
    }, 100)
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  return { announce }
}

// Status announcer for form submissions, loading states, etc.
export function StatusAnnouncer({ 
  status, 
  messages 
}: { 
  status: 'idle' | 'loading' | 'success' | 'error'
  messages: Record<string, string>
}) {
  const currentMessage = messages[status] || ''

  return (
    <LiveRegion 
      message={currentMessage}
      politeness={status === 'error' ? 'assertive' : 'polite'}
    />
  )
}
