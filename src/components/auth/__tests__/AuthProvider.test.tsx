import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthProvider'
import { useSession, signIn, signOut } from 'next-auth/react'

// Mock next-auth/react module
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Get the mocked functions
const mockUseSession = vi.mocked(useSession)
const mockSignIn = vi.mocked(signIn)
const mockSignOut = vi.mocked(signOut)

// Mock session data
const mockAuthenticatedSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2025-12-31T23:59:59.999Z',
}

// Test component that uses the auth context
const TestConsumer = () => {
  const auth = useAuth()
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user-email">{auth.user?.email || 'no-email'}</div>
      <div data-testid="isLoading">{auth.isLoading ? 'true' : 'false'}</div>
      <button data-testid="login-btn" onClick={auth.login}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={auth.logout}>
        Logout
      </button>
    </div>
  )
}

const TestComponent = () => (
  <AuthProvider>
    <TestConsumer />
  </AuthProvider>
)

// Helper functions for testing
const setMockSession = (session: unknown, status: string = 'authenticated') => {
  mockUseSession.mockReturnValue({
    data: session,
    status,
    update: vi.fn(),
  })
}

const setMockLoading = () => {
  mockUseSession.mockReturnValue({
    data: null,
    status: 'loading',
    update: vi.fn(),
  })
}

const setMockUnauthenticated = () => {
  mockUseSession.mockReturnValue({
    data: null,
    status: 'unauthenticated',
    update: vi.fn(),
  })
}

describe('AuthProvider', () => {
  beforeEach(() => {
    mockUseSession.mockClear()
    mockSignIn.mockClear()
    mockSignOut.mockClear()
    // Reset environment variables
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_publishable_key'
  })

  describe('when Clerk is not active (development mode)', () => {
    beforeEach(() => {
      // Set invalid Clerk key to simulate development mode
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_development_key'
    })

    it('should provide authentication context with authenticated user', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
      })
    })

    it('should provide authentication context with unauthenticated user', async () => {
      // Set session to null to simulate unauthenticated state
      setMockSession(null, 'unauthenticated')

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-email')
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
      })
    })

    it('should show loading state during authentication check', async () => {
      setMockLoading()

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('true')
      })
    })

    it('should call NextAuth signIn when login is triggered', async () => {
      setMockUnauthenticated()

      render(<TestComponent />)

      await waitFor(() => {
        const loginButton = screen.getByTestId('login-btn')
        loginButton.click()
        expect(mockSignIn).toHaveBeenCalledTimes(1)
      })
    })

    it('should call NextAuth signOut when logout is triggered', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        const logoutButton = screen.getByTestId('logout-btn')
        logoutButton.click()
        expect(mockSignOut).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle null session user gracefully', async () => {
      // Set session to null to properly test unauthenticated state
      setMockSession(null, 'unauthenticated')

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-email')
      })
    })
  })

  describe('when Clerk is active (production mode)', () => {
    beforeEach(() => {
      // Set valid Clerk key to simulate production mode
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_live_valid_key_1234567890'
    })

    it('should provide Clerk-based authentication context', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        // In Clerk mode, authentication should be false and user should be null
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-email')
      })
    })

    it('should log Clerk actions when login/logout are triggered', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      render(<TestComponent />)

      await waitFor(() => {
        const loginButton = screen.getByTestId('login-btn')
        loginButton.click()
        expect(consoleSpy).toHaveBeenCalledWith('Clerk login would be triggered')

        const logoutButton = screen.getByTestId('logout-btn')
        logoutButton.click()
        expect(consoleSpy).toHaveBeenCalledWith('Clerk logout would be triggered')
      })

      consoleSpy.mockRestore()
    })
  })

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestConsumer />)
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleSpy.mockRestore()
    })

    it('should provide consistent context values', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        // Test through the rendered component instead of calling useAuth directly
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
      })
    })
  })

  describe('environment variable handling', () => {
    it('should handle missing Clerk publishable key', async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        // Should fall back to NextAuth when Clerk key is missing
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
      })
    })

    it('should handle invalid Clerk key formats', async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_key_format'

      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(<TestComponent />)

      await waitFor(() => {
        // Should fall back to NextAuth with invalid key format
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
      })
    })
  })
})