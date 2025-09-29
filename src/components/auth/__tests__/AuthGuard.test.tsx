import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '../AuthGuard'
import { setMockSession, setMockLoading, setMockUnauthenticated, mockAuthenticatedSession, clearMocks } from '@/__mocks__/next-auth/react'

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

describe('AuthGuard', () => {
  beforeEach(() => {
    clearMocks()
    mockPush.mockClear()
    ;(useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter)
  })

  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>
  const FallbackComponent = () => <div data-testid="fallback-content">Fallback Content</div>

  describe('when authentication is required (requireAuth=true)', () => {
    it('should render children when user is authenticated', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('fallback-content')).not.toBeInTheDocument()
    })

    it('should show fallback when user is not authenticated (auth disabled)', async () => {
      setMockUnauthenticated()

      render(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Auth is temporarily disabled, so it shows fallback instead of redirecting
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should show fallback when user is not authenticated', async () => {
      setMockUnauthenticated()

      render(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Wait for useEffect to complete
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should show loading spinner during authentication check', async () => {
      setMockLoading()

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Should show loading spinner - check that protected content is not visible
      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      // Check for loading spinner using test-id
      const loadingContainer = screen.getByTestId('auth-loading')
      expect(loadingContainer).toBeInTheDocument()
    })

    it('should not redirect during SSR (auth disabled)', async () => {
      setMockUnauthenticated()

      render(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Should show loading spinner initially (SSR state)
      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      // Auth is disabled, no redirect expected
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('when authentication is not required (requireAuth=false)', () => {
    it('should show fallback when user is authenticated (auth disabled)', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(
        <AuthGuard requireAuth={false} fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Auth is disabled, no redirect - shows fallback
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should render children when user is not authenticated', async () => {
      setMockUnauthenticated()

      render(
        <AuthGuard requireAuth={false}>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should show fallback when user is authenticated (requireAuth=false)', async () => {
      setMockSession(mockAuthenticatedSession, 'authenticated')

      render(
        <AuthGuard requireAuth={false} fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null session gracefully (auth disabled)', async () => {
      setMockSession(null, 'unauthenticated')

      render(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Auth is disabled, shows fallback instead of redirect
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle undefined session gracefully (auth disabled)', async () => {
      setMockSession(undefined, 'unauthenticated')

      render(
        <AuthGuard fallback={<FallbackComponent />}>
          <TestComponent />
        </AuthGuard>
      )

      // Auth is disabled, shows fallback instead of redirect
      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument()
      }, { timeout: 2000 })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should not redirect when session status is loading', async () => {
      setMockLoading()

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      // Should show loading state
      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should show loading state properly', async () => {
      setMockLoading()

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      })

      // Check that loading state is visible using test-id
      const loadingContainer = screen.getByTestId('auth-loading')
      expect(loadingContainer).toBeInTheDocument()
    })
  })
})