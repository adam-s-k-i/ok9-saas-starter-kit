'use client'

import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  isSlowConnection: boolean
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const startTime = useRef<number>(Date.now())
  const renderStartTime = useRef<number>(Date.now())

  useEffect(() => {
    const measurePerformance = () => {
      const loadTime = Date.now() - startTime.current
      const renderTime = Date.now() - renderStartTime.current
      
      // Check connection speed
      const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection ||
                        (navigator as unknown as { mozConnection?: { effectiveType?: string } }).mozConnection ||
                        (navigator as unknown as { webkitConnection?: { effectiveType?: string } }).webkitConnection
      const isSlowConnection = connection ? connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : false

      // Memory usage (if available)
      const memoryUsage = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize
      
      setMetrics({
        loadTime,
        renderTime,
        memoryUsage,
        isSlowConnection
      })
    }

    // Measure after component mount
    const timeoutId = setTimeout(measurePerformance, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])

  const markRenderStart = () => {
    renderStartTime.current = Date.now()
  }

  const markRenderEnd = () => {
    const renderTime = Date.now() - renderStartTime.current
    setMetrics(prev => prev ? { ...prev, renderTime } : null)
  }

  return {
    metrics,
    markRenderStart,
    markRenderEnd
  }
}

// Hook for measuring component performance
export function useComponentPerformance(componentName: string) {
  const { metrics, markRenderStart, markRenderEnd } = usePerformance()
  
  useEffect(() => {
    markRenderStart()
    return () => markRenderEnd()
  }, [componentName])

  useEffect(() => {
    if (metrics && process.env.NODE_ENV === 'development') {
      console.log(`Performance metrics for ${componentName}:`, metrics)
    }
  }, [metrics, componentName])

  return metrics
}

// Hook for lazy loading with performance tracking
export function useLazyLoading<T>(
  importFn: () => Promise<T>,
  options?: {
    threshold?: number
    rootMargin?: string
  }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const load = async () => {
    if (isLoading || isLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await importFn()
      setData(result)
      setIsLoaded(true)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isLoaded,
    error,
    data,
    load
  }
}


