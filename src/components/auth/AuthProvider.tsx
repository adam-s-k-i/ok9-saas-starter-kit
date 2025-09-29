'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { email?: string | null; name?: string | null; image?: string | null } | null
  login: () => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [isClerkActive, setIsClerkActive] = useState(false)

  useEffect(() => {
    // Check if Clerk is properly configured
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    // Use Clerk only if we have a valid production publishable key
    const isValidClerkKey = publishableKey &&
      publishableKey.startsWith('pk_live_') &&
      publishableKey.length > 20;
    setIsClerkActive(!!isValidClerkKey)
  }, [])

  const isAuthenticated = isClerkActive ? false : !!session // For now, we'll use NextAuth when Clerk is not active
  const user = isClerkActive ? null : session?.user || null
  const isLoading = status === 'loading'

  const login = () => {
    if (isClerkActive) {
      // Clerk login would be handled by Clerk components
      console.log('Clerk login would be triggered')
    } else {
      signIn()
    }
  }

  const logout = () => {
    if (isClerkActive) {
      // Clerk logout would be handled by Clerk components
      console.log('Clerk logout would be triggered')
    } else {
      signOut()
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}