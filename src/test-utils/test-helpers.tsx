import { ReactElement } from 'react'
import { render, RenderOptions, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ThemeProvider } from '@/contexts/theme-context'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { customRender as renderWithProviders }

// Test utilities
export const createMockUser = () => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg'
})

export const createMockSession = () => ({
  user: createMockUser(),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
})

// Mock data generators
export const generateMockNotifications = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `notification-${index}`,
    title: `Test Notification ${index + 1}`,
    message: `This is a test notification message ${index + 1}`,
    type: ['success', 'error', 'warning', 'info'][index % 4] as 'success' | 'error' | 'warning' | 'info',
    duration: 5000
  }))
}

export const generateMockNavigationItems = () => [
  { label: 'Home', href: '/', icon: null },
  { label: 'Dashboard', href: '/dashboard', icon: null },
  { label: 'Settings', href: '/settings', icon: null },
  { label: 'Profile', href: '/profile', icon: null }
]

// Form test helpers
export const fillFormField = async (getByLabelText: (text: string | RegExp) => HTMLElement, label: string, value: string) => {
  const field = getByLabelText(label)
  await userEvent.type(field, value)
  return field
}

export const fillForm = async (fields: Record<string, string>) => {
  for (const [label, value] of Object.entries(fields)) {
    const field = screen.getByLabelText(new RegExp(label, 'i'))
    await userEvent.type(field, value)
  }
}

export const submitForm = async (buttonText: string) => {
  const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') })
  await userEvent.click(submitButton)
  return submitButton
}

export const toggleTheme = async () => {
  const themeButton = screen.getByRole('button')
  await userEvent.click(themeButton)
}

export const getCurrentTheme = () => {
  return 'light' // Simplified for testing
}

// Theme test helpers
export const renderWithTheme = (ui: ReactElement, theme: 'light' | 'dark' = 'light') => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div data-theme={theme}>
      {children}
    </div>
  )
  
  return render(ui, { wrapper: Wrapper })
}

// Accessibility test helpers
export const checkA11y = async (container: HTMLElement) => {
  // Basic accessibility checks
  const buttons = container.querySelectorAll('button')
  const links = container.querySelectorAll('a')
  const inputs = container.querySelectorAll('input')
  
  // Check for proper labeling
  inputs.forEach(input => {
    const id = input.getAttribute('id')
    const label = container.querySelector(`label[for="${id}"]`)
    if (!label && input.getAttribute('aria-label') === null) {
      throw new Error(`Input with id "${id}" is not properly labeled`)
    }
  })
  
  // Check for proper ARIA attributes
  buttons.forEach(button => {
    if (button.getAttribute('aria-label') === null && !button.textContent?.trim()) {
      throw new Error('Button without text content should have aria-label')
    }
  })
}

// Performance test helpers
export const measureRenderTime = (renderFn: () => void) => {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  return end - start
}

// Mock functions for common scenarios
export const mockFetch = (data: unknown, delay: number = 0) => {
  return vi.fn().mockImplementation(() =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve(data)
        })
      }, delay)
    })
  )
}

export const mockFetchError = (error: string = 'Network Error') => {
  return vi.fn().mockRejectedValue(new Error(error))
}


