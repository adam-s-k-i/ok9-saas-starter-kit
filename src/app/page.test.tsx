import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'

// Mock the dynamic import to avoid SSR issues
vi.mock('@/components/auth/AuthDemo', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-demo">Authentication Demo</div>,
}))

describe('Home Page', () => {
  test('renders main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1, name: /ok9 saas starter kit/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders tailwind utilities section', () => {
    render(<Home />)
    const sectionHeading = screen.getByRole('heading', { level: 2, name: /tailwindcss utilities/i })
    expect(sectionHeading).toBeInTheDocument()
  })

  test('renders shadcn/ui components section', () => {
    render(<Home />)
    const sectionHeading = screen.getByRole('heading', { level: 2, name: /shadcn\/ui components/i })
    expect(sectionHeading).toBeInTheDocument()
  })

  test('renders authentication components section', () => {
    render(<Home />)
    const sectionHeading = screen.getByRole('heading', { level: 2, name: /authentication components/i })
    expect(sectionHeading).toBeInTheDocument()
  })

  test('renders responsive design section', () => {
    render(<Home />)
    const sectionHeading = screen.getByRole('heading', { level: 2, name: /responsive design/i })
    expect(sectionHeading).toBeInTheDocument()
  })

  test('renders various button variants', () => {
    render(<Home />)
    expect(screen.getAllByRole('button', { name: /primary/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /outline/i })).toBeInTheDocument()
  })

  test('renders form elements', () => {
    render(<Home />)
    const emailInputs = screen.getAllByLabelText(/email/i)
    expect(emailInputs.length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument()
    // Use getAllByRole and check for at least one button with this name
    const loginButtons = screen.getAllByRole('button', { name: /anmelden/i })
    expect(loginButtons.length).toBeGreaterThan(0)
  })

  test('renders card components', () => {
    render(<Home />)
    expect(screen.getByText(/standard card/i)).toBeInTheDocument()
    expect(screen.getByText(/card mit aktionen/i)).toBeInTheDocument()
  })

  test('handles search input changes', async () => {
    render(<Home />)
    const searchInput = screen.getByPlaceholderText(/komponenten suchen/i)

    await userEvent.type(searchInput, 'button')

    expect(searchInput).toHaveValue('button')
  })

  test('renders footer content', async () => {
    render(<Home />)
    expect(await screen.findByText(/dokumentation/i)).toBeInTheDocument()
    expect(screen.getByText(/github/i)).toBeInTheDocument()
  })

  test('renders authentication demo component', () => {
    render(<Home />)
    expect(screen.getByTestId('auth-demo')).toBeInTheDocument()
  })
})