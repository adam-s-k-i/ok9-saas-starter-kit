import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthDemo from '../AuthDemo'
import { useSession, setMockSession, setMockLoading, setMockUnauthenticated, mockAuthenticatedSession, clearMocks, signIn, signOut } from '@/__mocks__/next-auth/react'

describe('AuthDemo', () => {
  beforeEach(() => {
    clearMocks()
    // Reset environment variables
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_publishable_key'
  })

  describe('when Clerk is not active (development mode)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_development_key'
    })

    it('should show loading state during authentication check', () => {
      setMockLoading()

      render(<AuthDemo />)

      expect(screen.getByText('Lade Authentifizierungsstatus...')).toBeInTheDocument()
      expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
    })

    it('should show authenticated state with user information', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Angemeldet als:')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
        expect(screen.getByText('Abmelden')).toBeInTheDocument()
      })
    })

    it('should show unauthenticated state with signin button', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
        expect(screen.getByText('Anmelden')).toBeInTheDocument()
      })
    })

    it('should call signIn when signin button is clicked', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        const signInButton = screen.getByText('Anmelden')
        fireEvent.click(signInButton)
        expect(signIn).toHaveBeenCalledTimes(1)
      })
    })

    it('should call signOut when signout button is clicked', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        const signOutButton = screen.getByText('Abmelden')
        fireEvent.click(signOutButton)
        expect(signOut).toHaveBeenCalledTimes(1)
      })
    })

    it('should show NextAuth.js information in development mode', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('NextAuth.js (Entwicklung)')).toBeInTheDocument()
        expect(screen.getByText('Diese App verwendet NextAuth.js als Fallback für Self-Hosting.')).toBeInTheDocument()
        expect(screen.getByText('✅ Entwicklung: Credentials Login')).toBeInTheDocument()
        expect(screen.getByText('🔧 Produktion: GitHub, Google OAuth')).toBeInTheDocument()
        expect(screen.getByText('📊 Database: Prisma Integration')).toBeInTheDocument()
      })
    })
  })

  describe('when Clerk is active (production mode)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_valid_key_1234567890'
    })

    it('should show Clerk authentication system information', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Clerk Authentication')).toBeInTheDocument()
        expect(screen.getByText('Clerk (Produktion)')).toBeInTheDocument()
        expect(screen.getByText('Diese App verwendet Clerk für professionelle Authentication.')).toBeInTheDocument()
        expect(screen.getByText('✅ Produktion: Clerk Authentication')).toBeInTheDocument()
        expect(screen.getByText('🔐 Enterprise: Multi-Faktor Auth')).toBeInTheDocument()
        expect(screen.getByText('📊 Analytics: User Management')).toBeInTheDocument()
      })
    })

    it('should handle authentication state correctly in Clerk mode', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        // In Clerk mode, the component should still show the authentication state
        // but the actual authentication logic would be handled by Clerk
        expect(screen.getByText('Clerk Authentication')).toBeInTheDocument()
      })
    })
  })

  describe('environment variable validation', () => {
    it('should handle missing Clerk publishable key', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        // Should fall back to NextAuth when key is missing
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })

    it('should handle invalid Clerk key format', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_key_format'

      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        // Should fall back to NextAuth with invalid key format
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })

    it('should handle very short Clerk key', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_short'

      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        // Should fall back to NextAuth with short key
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })
  })

  describe('UI components and accessibility', () => {
    it('should render proper card structure', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Authentication State')).toBeInTheDocument()
        expect(screen.getByText('Anmelde-Status')).toBeInTheDocument()
        expect(screen.getByText('Authentication System')).toBeInTheDocument()
      })
    })

    it('should have proper button variants and sizes', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        const signInButton = screen.getByText('Anmelden')
        expect(signInButton).toHaveAttribute('type', 'button')
      })
    })

    it('should handle responsive grid layout', async () => {
      setMockUnauthenticated()

      render(<AuthDemo />)

      await waitFor(() => {
        const gridContainer = screen.getByText('Authentication State').closest('div')
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null session user gracefully', async () => {
      setMockSession({ user: null, expires: null }, 'unauthenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
      })
    })

    it('should handle undefined session gracefully', async () => {
      setMockSession(undefined, 'unauthenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
      })
    })

    it('should handle session with missing user properties', async () => {
      setMockSession({ user: { id: '1' }, expires: '2025-12-31' }, 'authenticated')

      render(<AuthDemo />)

      await waitFor(() => {
        // Should handle missing email gracefully
        expect(screen.getByText('Angemeldet als:')).toBeInTheDocument()
      })
    })
  })
})