import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input Component', () => {
  test('renders input with default styling', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')

    expect(input).toBeInTheDocument()
    // Test only key classes that are definitely present
    expect(input).toHaveClass('h-9', 'w-full', 'rounded-md')
  })

  test('applies custom className to input', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')

    expect(input).toHaveClass('custom-input')
  })

  test('handles different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Enter email" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Enter password" />)
    input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Enter number" />)
    input = screen.getByPlaceholderText('Enter number')
    expect(input).toHaveAttribute('type', 'number')
  })

  test('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')

    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  test('handles readOnly state', () => {
    render(<Input readOnly placeholder="Read-only input" />)
    const input = screen.getByPlaceholderText('Read-only input')

    expect(input).toHaveAttribute('readOnly')
  })

  test('handles required attribute', () => {
    render(<Input required placeholder="Required input" />)
    const input = screen.getByPlaceholderText('Required input')

    expect(input).toBeRequired()
  })

  test('forwards all HTML input attributes', () => {
    render(
      <Input
        id="test-input"
        name="username"
        defaultValue="testuser"
        maxLength={20}
        minLength={3}
        pattern="[a-zA-Z0-9]+"
        autoComplete="username"
        data-testid="custom-input"
        aria-label="Username input"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('name', 'username')
    expect(input).toHaveValue('testuser')
    expect(input).toHaveAttribute('maxLength', '20')
    expect(input).toHaveAttribute('minLength', '3')
    expect(input).toHaveAttribute('pattern', '[a-zA-Z0-9]+')
    expect(input).toHaveAttribute('autoComplete', 'username')
    expect(input).toHaveAttribute('data-testid', 'custom-input')
    expect(input).toHaveAttribute('aria-label', 'Username input')
  })

  test('handles onChange events', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    await userEvent.type(input, 'hello')

    expect(handleChange).toHaveBeenCalledTimes(5)
  })

  test('handles onFocus and onBlur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test"
      />
    )

    const input = screen.getByPlaceholderText('Focus test')

    await userEvent.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    await userEvent.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  test('applies focus styles correctly', () => {
    render(<Input placeholder="Focus styles" />)
    const input = screen.getByPlaceholderText('Focus styles')

    expect(input).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]'
    )
  })

  test('handles invalid state with aria-invalid', () => {
    render(<Input aria-invalid="true" placeholder="Invalid input" />)
    const input = screen.getByPlaceholderText('Invalid input')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('aria-invalid:border-destructive', 'aria-invalid:ring-destructive/20')
  })

  test('supports file input type', () => {
    const { container } = render(<Input type="file" />)
    const input = container.querySelector('input[type="file"]')

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
  })

  test('renders with placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')

    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('placeholder:text-muted-foreground')
  })

  test('input is accessible with proper labels', () => {
    render(
      <>
        <label htmlFor="username">Username</label>
        <Input id="username" aria-describedby="username-help" />
        <span id="username-help">Enter your username</span>
      </>
    )

    const input = screen.getByLabelText('Username')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', 'username-help')
  })
})