import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { 
  renderWithProviders, 
  fillForm, 
  submitForm, 
  toggleTheme,
  getCurrentTheme,
  createMockUser,
  generateMockNotifications,
  mockFetch,
  mockFetchError
} from '../test-helpers'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import { LoginForm } from '@/components/forms/login-form'

// Test the custom render function
describe('Test Helpers', () => {
  describe('renderWithProviders', () => {
    it('renders component with theme provider', () => {
      renderWithProviders(<div data-testid="test">Test</div>)
      expect(screen.getByTestId('test')).toBeInTheDocument()
    })

    it('renders with custom theme', () => {
      renderWithProviders(
        <div data-testid="test">Test</div>,
        { theme: 'dark' }
      )
      expect(screen.getByTestId('test')).toBeInTheDocument()
    })
  })

  describe('form utilities', () => {
    it('fills form fields correctly', async () => {
      renderWithProviders(<LoginForm />)
      
      await fillForm({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
    })

    it('submits form successfully', async () => {
      renderWithProviders(<LoginForm />)
      
      await fillForm({
        email: 'test@example.com',
        password: 'password123'
      })

      await submitForm('Anmelden')
      
      expect(screen.getByRole('button', { name: /wird angemeldet/i })).toBeInTheDocument()
    })
  })

  describe('theme utilities', () => {
    it('toggles theme correctly', async () => {
      renderWithProviders(<ThemeToggle />)
      
      const themeButton = screen.getByRole('button')
      await userEvent.click(themeButton)
      
      expect(themeButton).toBeInTheDocument()
    })

    it('gets current theme', () => {
      renderWithProviders(<div>Test</div>)
      const theme = getCurrentTheme()
      expect(['light', 'dark']).toContain(theme)
    })
  })

  describe('mock data generators', () => {
    it('creates mock user', () => {
      const user = createMockUser()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user.id).toBe('1')
      expect(user.name).toBe('Test User')
    })

    it('generates mock notifications', () => {
      const notifications = generateMockNotifications(3)
      expect(notifications).toHaveLength(3)
      expect(notifications[0]).toHaveProperty('id')
      expect(notifications[0]).toHaveProperty('title')
      expect(notifications[0]).toHaveProperty('type')
    })
  })

  describe('mock fetch functions', () => {
    it('mocks successful fetch', async () => {
      const mockFn = mockFetch({ data: 'test' })
      const response = await mockFn()
      expect(response.ok).toBe(true)
    })

    it('mocks fetch error', async () => {
      const mockFn = mockFetchError('Test error')
      await expect(mockFn()).rejects.toThrow('Test error')
    })
  })
})


