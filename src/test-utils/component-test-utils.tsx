import { ReactElement } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/contexts/theme-context'
import { useAppStore } from '@/stores/app-store'

// Component test utilities
export const renderWithProviders = (
  ui: ReactElement,
  options?: {
    theme?: 'light' | 'dark'
    initialState?: Partial<ReturnType<typeof useAppStore.getState>>
  }
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // Set initial store state if provided
    if (options?.initialState) {
      useAppStore.setState(options.initialState)
    }
    
    return (
      <ThemeProvider>
        <div data-theme={options?.theme || 'light'}>
          {children}
        </div>
      </ThemeProvider>
    )
  }
  
  return render(ui, { wrapper: Wrapper })
}

// Form testing utilities
export const fillForm = async (formData: Record<string, string | boolean>) => {
  const user = userEvent.setup()
  
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
    
    if (typeof value === 'boolean') {
      if (value) {
        await user.click(field)
      }
    } else {
      await user.clear(field)
      await user.type(field, value)
    }
  }
}

export const submitForm = async (buttonText?: string) => {
  const user = userEvent.setup()
  const submitButton = buttonText 
    ? screen.getByRole('button', { name: new RegExp(buttonText, 'i') })
    : screen.getByRole('button', { name: /submit|send|login|sign in/i })
  
  await user.click(submitButton)
  return submitButton
}

// Theme testing utilities
export const toggleTheme = async () => {
  const user = userEvent.setup()
  const themeButton = screen.getByRole('button', { name: /theme|mode/i })
  await user.click(themeButton)
}

export const getCurrentTheme = () => {
  const html = document.documentElement
  return html.classList.contains('dark') ? 'dark' : 'light'
}

// Navigation testing utilities
export const clickNavigationItem = async (itemName: string) => {
  const user = userEvent.setup()
  const navItem = screen.getByRole('link', { name: new RegExp(itemName, 'i') })
  await user.click(navItem)
  return navItem
}

export const toggleMobileMenu = async () => {
  const user = userEvent.setup()
  const menuButton = screen.getByRole('button', { name: /menu|navigation/i })
  await user.click(menuButton)
  return menuButton
}

// Notification testing utilities
export const waitForNotification = async (title: string) => {
  return waitFor(() => {
    return screen.getByText(title)
  })
}

export const getNotifications = () => {
  return screen.queryAllByRole('alert')
}

export const closeNotification = async (index: number = 0) => {
  const user = userEvent.setup()
  const closeButtons = screen.getAllByRole('button', { name: /close/i })
  if (closeButtons[index]) {
    await user.click(closeButtons[index])
  }
}

// Error boundary testing utilities
export const triggerError = () => {
  throw new Error('Test error')
}

export const renderWithErrorBoundary = (ui: ReactElement) => {
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>
    } catch (error) {
      return <div data-testid="error-boundary">Error caught</div>
    }
  }
  
  return render(
    <ErrorBoundary>
      {ui}
    </ErrorBoundary>
  )
}

// Performance testing utilities
export const measureComponentRender = async (renderFn: () => void) => {
  const start = performance.now()
  await renderFn()
  const end = performance.now()
  return end - start
}

// Accessibility testing utilities
export const checkKeyboardNavigation = async () => {
  const user = userEvent.setup()
  
  // Test tab navigation
  await user.tab()
  const focusedElement = document.activeElement
  return focusedElement
}

export const checkARIALabels = (container: HTMLElement) => {
  const elements = container.querySelectorAll('[aria-label], [aria-labelledby]')
  return Array.from(elements).map(el => ({
    element: el,
    hasAriaLabel: el.hasAttribute('aria-label'),
    hasAriaLabelledBy: el.hasAttribute('aria-labelledby')
  }))
}

// Mock store utilities
export const mockStoreState = (state: Partial<ReturnType<typeof useAppStore.getState>>) => {
  useAppStore.setState(state)
}

export const resetStore = () => {
  useAppStore.setState({
    sidebarOpen: false,
    notifications: []
  })
}

// Custom matchers for testing - removed for build compatibility
// These utilities are only used in test environment where expect is available


