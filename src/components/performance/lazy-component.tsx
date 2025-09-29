'use client'

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LazyComponentProps {
  children: ReactNode
  fallback?: ReactNode
  loading?: ReactNode
}

// Default loading component
const DefaultLoading = () => (
  <Card className="w-full">
    <CardContent className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Lädt...</span>
      </div>
    </CardContent>
  </Card>
)

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  options?: {
    loading?: ReactNode
    ssr?: boolean
  }
) {
  return dynamic(() => Promise.resolve(Component), {
    loading: () => options?.loading || <DefaultLoading />,
    ssr: options?.ssr ?? true
  })
}

// Utility for creating lazy components
export function createLazyComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    loading?: ReactNode
    ssr?: boolean
  }
) {
  return dynamic(importFn, {
    loading: () => options?.loading || <DefaultLoading />,
    ssr: options?.ssr ?? true
  })
}

// Example usage components
export const LazyHeavyComponent = createLazyComponent(
  () => import('./heavy-component'),
  {
    loading: <DefaultLoading />,
    ssr: false
  }
)

export const LazyChart = createLazyComponent(
  () => import('./chart-component'),
  {
    loading: <div className="h-64 flex items-center justify-center">Chart wird geladen...</div>,
    ssr: false
  }
)


