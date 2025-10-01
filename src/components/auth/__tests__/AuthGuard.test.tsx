import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '../AuthGuard'
import { renderWithAuth } from '@/test-utils/component-test-utils'

// Mock next/navigation (Vitest style)
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

const mockPush = vi.fn()
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
}

// Mock session data
const mockAuthenticatedSession = {
  user: { id: '1', email: 'test@example.com', name: 'Test User' },
  expires: '2024-12-31T23:59:59.999Z',
}

const mockUnauthenticatedSession = null

describe('AuthGuard', () => {
  beforeEach(() => {
    mockPush.mockClear()
    ;(useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter)
    // Disable dev mode for tests
    process.env.NEXT_PUBLIC_DEV_MODE = 'false'
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    // Reset environment
    process.env.NEXT_PUBLIC_DEV_MODE = undefined
    process.env.NODE_ENV = 'development'
  })

  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>
  const FallbackComponent = () => <div data-testid="fallback-content">Fallback Content</div>

  describe('when authentication is required (requireAuth=true)', () => {
    it('should render children when user is authenticated', async () => {
      renderWithAuth(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>,
        { session: mockAuthenticatedSession }
      )

      // Wait for client-side hydration
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('fallback-content')).not.toBeInTheDocument()
    })

    it('should show fallback when user is not authenticated', async () => {
      renderWithAuth(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>,
        { session: mockUnauthenticatedSession }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should show loading state when session is undefined', async () => {
      renderWithAuth(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>,
        { session: undefined }
      )

      // Should show loading state
      expect(screen.getByTestId('auth-loading')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('when authentication is not required (requireAuth=false)', () => {
    it('should render children when user is not authenticated', async () => {
      renderWithAuth(
        <AuthGuard requireAuth={false}>
          <TestComponent />
        </AuthGuard>,
        { session: mockUnauthenticatedSession }
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })

    it('should render children when user is authenticated', async () => {
      renderWithAuth(
        <AuthGuard requireAuth={false}>
          <TestComponent />
        </AuthGuard>,
        { session: mockAuthenticatedSession }
      )

      // Component should render children for requireAuth=false
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('should render children regardless of session when requireAuth is false', async () => {
      renderWithAuth(
        <AuthGuard requireAuth={false} fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>,
        { session: mockAuthenticatedSession }
      )

      // Should render children, not fallback, when requireAuth=false
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByTestId('fallback-content')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null session gracefully', async () => {
      renderWithAuth(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>,
        { session: null }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      })
    })

    it('should handle undefined session gracefully', async () => {
      renderWithAuth(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>,
        { session: undefined }
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      })
    })
  })
})