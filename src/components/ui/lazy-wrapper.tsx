"use client"

import { Suspense, lazy, ComponentType, useState, useEffect, useRef } from 'react'
import { Skeleton } from './skeleton'

interface LazyWrapperProps {
  fallback?: React.ReactNode
  className?: string
  children: React.ReactNode
}

// Generic lazy wrapper with intelligent fallback
export function LazyWrapper({ 
  fallback = <Skeleton className="h-32 w-full" />, 
  className,
  children 
}: LazyWrapperProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }))
  
  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <Skeleton className="h-32 w-full" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Intersection Observer based lazy loading
export function LazyOnVisible({ 
  children, 
  fallback = <Skeleton className="h-32 w-full" />,
  rootMargin = "50px",
  threshold = 0.1 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}


