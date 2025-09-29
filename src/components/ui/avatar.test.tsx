import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

describe('Avatar Component', () => {
  test('renders avatar with default styling', () => {
    const { container } = render(<Avatar />)
    const avatar = container.querySelector('[data-slot="avatar"]')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveClass('relative', 'flex', 'size-8', 'shrink-0', 'overflow-hidden', 'rounded-full')
  })

  test('applies custom className to avatar', () => {
    const { container } = render(<Avatar className="custom-avatar" />)
    const avatar = container.querySelector('[data-slot="avatar"]')
    expect(avatar).toHaveClass('custom-avatar')
  })

  test('renders avatar fallback correctly', () => {
    render(
      <Avatar>
        <AvatarFallback>TA</AvatarFallback>
      </Avatar>
    )

    const fallback = screen.getByText('TA')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('bg-muted', 'flex', 'size-full', 'items-center', 'justify-center', 'rounded-full')
  })

  test('applies custom className to avatar fallback', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">FB</AvatarFallback>
      </Avatar>
    )
    const fallback = screen.getByText('FB')
    expect(fallback).toHaveClass('custom-fallback')
  })

  test('handles avatar with only fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
    )
    const fallback = screen.getByText('User')
    expect(fallback).toBeInTheDocument()
  })

  test('renders basic avatar structure', () => {
    const { container } = render(
      <Avatar className="avatar-container">
        <AvatarFallback className="fallback-text">PP</AvatarFallback>
      </Avatar>
    )

    const avatar = container.querySelector('[data-slot="avatar"]')
    const fallback = container.querySelector('[data-slot="avatar-fallback"]')

    expect(avatar).toHaveClass('avatar-container')
    expect(fallback).toHaveClass('fallback-text')
  })

  test('avatar components forward props correctly', () => {
    const { container } = render(
      <Avatar data-testid="avatar-root">
        <AvatarFallback data-testid="avatar-fallback">Test</AvatarFallback>
      </Avatar>
    )

    const avatar = container.querySelector('[data-slot="avatar"]')
    const fallback = container.querySelector('[data-slot="avatar-fallback"]')

    expect(avatar).toBeInTheDocument()
    expect(fallback).toBeInTheDocument()
  })
})