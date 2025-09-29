'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/theme-context'
import { NotificationToast } from '@/components/custom/notification-toast'
import { ErrorBoundary } from '@/components/error/error-boundary'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ErrorBoundary>
          {children}
          <NotificationToast />
        </ErrorBoundary>
      </ThemeProvider>
    </SessionProvider>
  )
}