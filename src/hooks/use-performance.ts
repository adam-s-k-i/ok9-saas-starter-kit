"use client"

import { useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  isSlowConnection: boolean
  timeToFirstByte?: number
  domContentLoaded?: number
  firstContentfulPaint?: number
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const loadStartTime = useRef<number>(Date.now())
  const renderStartTime = useRef<number>(Date.now())

  useEffect(() => {
    const measurePerformance = () => {
      const loadTime = Date.now() - loadStartTime.current
      const renderTime = Date.now() - renderStartTime.current

      const connection = (navigator as Navigator & {
        connection?: { effectiveType?: string }
        mozConnection?: { effectiveType?: string }
        webkitConnection?: { effectiveType?: string }
      }).connection ||
        (navigator as Navigator & { mozConnection?: { effectiveType?: string } }).mozConnection ||
        (navigator as Navigator & { webkitConnection?: { effectiveType?: string } }).webkitConnection

      const isSlowConnection = connection
        ? connection.effectiveType === "slow-2g" || connection.effectiveType === "2g"
        : false

      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined

      const paintEntries = performance.getEntriesByType("paint") as PerformanceEntry[]
      const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint")

      const metricsPayload: PerformanceMetrics = {
        loadTime,
        renderTime,
        isSlowConnection,
        memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize,
        timeToFirstByte: navigationEntry
          ? Math.round(navigationEntry.responseStart - navigationEntry.requestStart)
          : undefined,
        domContentLoaded: navigationEntry
          ? Math.round(navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime)
          : undefined,
        firstContentfulPaint: fcpEntry ? Math.round(fcpEntry.startTime) : undefined,
      }

      setMetrics(metricsPayload)
    }

    const timeoutId = window.setTimeout(measurePerformance, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const markRenderStart = () => {
    renderStartTime.current = Date.now()
  }

  const markRenderEnd = () => {
    const renderTime = Date.now() - renderStartTime.current
    setMetrics((previous) =>
      previous
        ? { ...previous, renderTime }
        : {
            loadTime: renderTime,
            renderTime,
            isSlowConnection: false,
          }
    )
  }

  return {
    metrics,
    markRenderStart,
    markRenderEnd,
  }
}

export function useComponentPerformance(componentName: string) {
  const { metrics, markRenderStart, markRenderEnd } = usePerformance()

  useEffect(() => {
    markRenderStart()
    return () => markRenderEnd()
  }, [componentName])

  useEffect(() => {
    if (metrics && process.env.NODE_ENV === "development") {
      console.log(`Performance metrics for ${componentName}:`, metrics)
    }
  }, [metrics, componentName])

  return metrics
}

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
    load,
  }
}
