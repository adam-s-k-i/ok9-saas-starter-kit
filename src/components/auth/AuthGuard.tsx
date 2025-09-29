'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
}

export function AuthGuard({
  children,
  fallback = null,
  requireAuth = true
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Check if we're in development mode
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NODE_ENV === 'development'

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || status === 'loading' || isDevMode) return

    if (requireAuth && !session) {
      // Redirect to signin if authentication is required but user is not authenticated
      router.push('/auth/signin')
    } else if (!requireAuth && session) {
      // Redirect away from auth pages if user is already authenticated
      router.push('/')
    }
  }, [session, status, requireAuth, router, isClient, isDevMode])

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="auth-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // In development mode, always render children without authentication checks
  if (isDevMode) {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="auth-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show fallback if authentication requirements are not met
  if ((requireAuth && !session) || (!requireAuth && session)) {
    return <>{fallback}</>
  }

  // Render children if authentication requirements are met
  return <>{children}</>
}