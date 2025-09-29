// Mock for next-auth/react
import { vi } from 'vitest'

// Mock session data for different scenarios
export const mockAuthenticatedSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2025-12-31T23:59:59.999Z',
}

export const mockUnauthenticatedSession = {
  user: null,
  expires: null,
}

// Mock implementation of useSession
const mockUseSession = vi.fn()

// Mock signIn and signOut functions
const mockSignIn = vi.fn()
const mockSignOut = vi.fn()

// Setup default mocks
mockUseSession.mockReturnValue({
  data: mockUnauthenticatedSession,
  status: 'unauthenticated',
  update: vi.fn(),
})

mockSignIn.mockImplementation(() => Promise.resolve())
mockSignOut.mockImplementation(() => Promise.resolve())

// Export the mock functions
export const useSession = mockUseSession
export const signIn = mockSignIn
export const signOut = mockSignOut
export const getSession = vi.fn()
export const getCsrfToken = vi.fn()
export const getProviders = vi.fn()
export const SessionProvider = ({ children }: { children: React.ReactNode }) => children

// Helper functions to control the mock state
export const setMockSession = (session: unknown, status: 'authenticated' | 'unauthenticated' | 'loading' = 'authenticated') => {
  mockUseSession.mockReturnValue({
    data: session,
    status,
    update: vi.fn(),
  })
}

export const setMockLoading = () => {
  mockUseSession.mockReturnValue({
    data: null,
    status: 'loading',
    update: vi.fn(),
  })
}

export const setMockUnauthenticated = () => {
  mockUseSession.mockReturnValue({
    data: mockUnauthenticatedSession,
    status: 'unauthenticated',
    update: vi.fn(),
  })
}

export const clearMocks = () => {
  mockUseSession.mockClear()
  mockSignIn.mockClear()
  mockSignOut.mockClear()
}

const nextAuthMock = {
  useSession,
  signIn,
  signOut,
  getSession,
  getCsrfToken,
  getProviders,
  SessionProvider,
  setMockSession,
  setMockLoading,
  setMockUnauthenticated,
  clearMocks,
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
}

export default nextAuthMock