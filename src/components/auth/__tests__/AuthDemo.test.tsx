import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import AuthDemo from '../AuthDemo'
import { renderWithAuth } from '@/test-utils/component-test-utils'
import { setMockSession, setMockUnauthenticated } from '@/__mocks__/next-auth/react'

// Mock session data
const mockAuthenticatedSession = {
  user: { id: '1', email: 'test@example.com', name: 'Test User' },
  expires: '2024-12-31T23:59:59.999Z',
}

const mockUnauthenticatedSession = null

describe('AuthDemo', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_publishable_key'
    process.env.NEXT_PUBLIC_DEV_MODE = 'false'
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    // Reset environment
    process.env.NEXT_PUBLIC_DEV_MODE = undefined
    process.env.NODE_ENV = 'development'
  })

  describe('when Clerk is not active (development mode)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_development_key'
    })

    it('should show loading state during authentication check', () => {
      renderWithAuth(<AuthDemo />, { session: undefined })

      expect(screen.getByText('Lade Authentifizierungsstatus...')).toBeInTheDocument()
      expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
    })

    it('should show authenticated state with user information', async () => {
      renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })

      await waitFor(() => {
        expect(screen.getByText('Angemeldet als:')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
        expect(screen.getByText('Abmelden')).toBeInTheDocument()
      })
    })

    it('should show unauthenticated state with signin button', async () => {
      renderWithAuth(<AuthDemo />, { session: mockUnauthenticatedSession })

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
        expect(screen.getByText('Anmelden')).toBeInTheDocument()
      })
    })

    it('should render component without crashing', () => {
      expect(() => renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })).not.toThrow()
    })

  })

  describe('when Clerk is active (production mode)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_production_key'
    })

    it('should render component without crashing', () => {
      expect(() => renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })).not.toThrow()
    })
  })

  describe('environment variable validation', () => {
    it('should handle missing Clerk publishable key', () => {
      const originalKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

      expect(() => renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })).not.toThrow()

      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalKey
    })
   })

   it('should call signOut when signout button is clicked', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })

      await waitFor(() => {
        const signOutButton = screen.getByText('Abmelden')
        fireEvent.click(signOutButton)
        expect(signOut).toHaveBeenCalledTimes(1)
      })
    })

    it('should show NextAuth.js information in development mode', async () => {
      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        expect(screen.getByText('NextAuth.js (Entwicklung)')).toBeInTheDocument()
        expect(screen.getByText('Diese App verwendet NextAuth.js als Fallback für Self-Hosting.')).toBeInTheDocument()
        expect(screen.getByText('✅ Entwicklung: Credentials Login')).toBeInTheDocument()
        expect(screen.getByText('🔧 Produktion: GitHub, Google OAuth')).toBeInTheDocument()
        expect(screen.getByText('📊 Database: Prisma Integration')).toBeInTheDocument()
      })
    })

   describe('when Clerk is active (production mode)', () => {
     beforeEach(() => {
       process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_valid_key_1234567890'
     })

     it('should show Clerk authentication system information', async () => {
       setMockUnauthenticated()

       renderWithAuth(<AuthDemo />, { session: null })

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

       renderWithAuth(<AuthDemo />, { session: mockAuthenticatedSession })

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

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        // Should fall back to NextAuth when key is missing
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })

    it('should handle invalid Clerk key format', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_key_format'

      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        // Should fall back to NextAuth with invalid key format
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })

    it('should handle very short Clerk key', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_short'

      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        // Should fall back to NextAuth with short key
        expect(screen.getByText('NextAuth.js Self-Hosting')).toBeInTheDocument()
      })
    })
  })

  describe('UI components and accessibility', () => {
    it('should render proper card structure', async () => {
      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        expect(screen.getByText('Authentication State')).toBeInTheDocument()
        expect(screen.getByText('Anmelde-Status')).toBeInTheDocument()
        expect(screen.getByText('Authentication System')).toBeInTheDocument()
      })
    })

    it('should have proper button variants and sizes', async () => {
      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        const signInButton = screen.getByText('Anmelden')
        expect(signInButton).toHaveAttribute('type', 'button')
      })
    })

    it('should handle responsive grid layout', async () => {
      setMockUnauthenticated()

      renderWithAuth(<AuthDemo />, { session: null })

      await waitFor(() => {
        const gridContainer = screen.getByText('Authentication State').closest('div')
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null session user gracefully', async () => {
      setMockSession({ user: null, expires: null }, 'unauthenticated')

      renderWithAuth(<AuthDemo />, { session: { user: null, expires: null } })

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
      })
    })

    it('should handle undefined session gracefully', async () => {
      setMockSession(undefined, 'unauthenticated')

      renderWithAuth(<AuthDemo />, { session: undefined })

      await waitFor(() => {
        expect(screen.getByText('Nicht angemeldet')).toBeInTheDocument()
      })
    })

    it('should handle session with missing user properties', async () => {
      setMockSession({ user: { id: '1' }, expires: '2025-12-31' }, 'authenticated')

      renderWithAuth(<AuthDemo />, { session: { user: { id: '1' }, expires: '2025-12-31' } })

      await waitFor(() => {
        // Should handle missing email gracefully
        expect(screen.getByText('Angemeldet als:')).toBeInTheDocument()
      })
    })
  })
})
