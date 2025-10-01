"use client"

import { useState, useEffect, useCallback } from 'react'
import { DashboardOverview } from '@/lib/dashboard'

interface UseDashboardRealtimeOptions {
  refreshInterval?: number // in milliseconds
  enabled?: boolean
}

export function useDashboardRealtime(options: UseDashboardRealtimeOptions = {}) {
  const { refreshInterval = 30000, enabled = true } = options // 30 seconds default

  const [data, setData] = useState<DashboardOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/overview', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const overviewData: DashboardOverview = await response.json()
      setData(overviewData)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('Dashboard data fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchData()

    // Set up interval for periodic updates
    const interval = setInterval(fetchData, refreshInterval)

    return () => {
      clearInterval(interval)
    }
  }, [fetchData, refreshInterval, enabled])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
  }
}