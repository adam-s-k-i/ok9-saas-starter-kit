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

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || status === 'loading') return

    if (requireAuth && !session) {
      // Redirect to signin if authentication is required but user is not authenticated
      router.push('/auth/signin')
    } else if (!requireAuth && session) {
      // Redirect away from auth pages if user is already authenticated
      router.push('/')
    }
  }, [session, status, requireAuth, router, isClient])

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
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