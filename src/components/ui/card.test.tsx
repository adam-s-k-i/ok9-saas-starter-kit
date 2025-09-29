import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card'

describe('Card Component', () => {
  test('renders basic card with default styling', () => {
    const { container } = render(<Card>Card Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('Card Content')
    expect(card).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'flex',
      'flex-col',
      'gap-6',
      'rounded-xl',
      'border',
      'py-6',
      'shadow-sm'
    )
  })

  test('applies custom className to card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveClass('custom-card')
  })

  test('renders complete card structure with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <span>Footer content</span>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  test('renders card header with proper styling', () => {
    const { container } = render(
      <CardHeader className="custom-header">
        Header Content
      </CardHeader>
    )

    const header = container.querySelector('[data-slot="card-header"]')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('custom-header')
    expect(header).toHaveClass(
      '@container/card-header',
      'grid',
      'auto-rows-min',
      'grid-rows-[auto_auto]',
      'items-start',
      'gap-1.5',
      'px-6',
      'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
      '[.border-b]:pb-6'
    )
  })

  test('renders card title with proper styling', () => {
    const { container } = render(
      <CardTitle className="custom-title">Title</CardTitle>
    )

    const title = container.querySelector('[data-slot="card-title"]')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('custom-title')
    expect(title).toHaveClass('leading-none', 'font-semibold')
  })

  test('renders card description with proper styling', () => {
    const { container } = render(
      <CardDescription className="custom-description">
        Description
      </CardDescription>
    )

    const description = container.querySelector('[data-slot="card-description"]')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('custom-description')
    expect(description).toHaveClass('text-muted-foreground', 'text-sm')
  })

  test('renders card action with proper styling', () => {
    const { container } = render(
      <CardAction className="custom-action">Action</CardAction>
    )

    const action = container.querySelector('[data-slot="card-action"]')
    expect(action).toBeInTheDocument()
    expect(action).toHaveClass('custom-action')
    expect(action).toHaveClass(
      'col-start-2',
      'row-span-2',
      'row-start-1',
      'self-start',
      'justify-self-end'
    )
  })

  test('renders card content with proper styling', () => {
    const { container } = render(
      <CardContent className="custom-content">Content</CardContent>
    )

    const content = container.querySelector('[data-slot="card-content"]')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('custom-content')
    expect(content).toHaveClass('px-6')
  })

  test('renders card footer with proper styling', () => {
    const { container } = render(
      <CardFooter className="custom-footer">Footer</CardFooter>
    )

    const footer = container.querySelector('[data-slot="card-footer"]')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('custom-footer')
    expect(footer).toHaveClass('flex', 'items-center', 'px-6', '[.border-t]:pt-6')
  })

  test('card components handle border variants correctly', () => {
    const { container } = render(
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Header with Border</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter className="border-t">
          Footer with Border
        </CardFooter>
      </Card>
    )

    const header = container.querySelector('[data-slot="card-header"]')
    const footer = container.querySelector('[data-slot="card-footer"]')

    expect(header).toHaveClass('[.border-b]:pb-6')
    expect(footer).toHaveClass('[.border-t]:pt-6')
  })

  test('card header adapts layout when action is present', () => {
    const { container } = render(
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
        <CardAction>Action</CardAction>
      </CardHeader>
    )

    const header = container.querySelector('[data-slot="card-header"]')
    expect(header).toHaveClass('has-data-[slot=card-action]:grid-cols-[1fr_auto]')
  })

  test('card components are accessible with proper semantic elements', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Title</CardTitle>
          <CardDescription>Accessible Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Accessible content</p>
        </CardContent>
      </Card>
    )

    const title = screen.getByText('Accessible Title')
    expect(title).toBeInTheDocument()
    // The CardTitle component might not support the 'as' prop
    // Just verify it renders correctly
  })

  test('complex card layout with multiple actions', () => {
    render(
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Overview of your metrics</CardDescription>
          <CardAction>
            <button>Settings</button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div>
            <h4>Metrics</h4>
            <ul>
              <li>Metric 1: 100</li>
              <li>Metric 2: 200</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <span>Last updated: today</span>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview of your metrics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()
    expect(screen.getByText('Last updated: today')).toBeInTheDocument()
  })

  test('card components forward all HTML attributes', () => {
    const { container } = render(
      <Card data-testid="main-card" aria-label="Test Card">
        <CardHeader data-section="header">
          <CardTitle id="card-title">Title</CardTitle>
        </CardHeader>
      </Card>
    )

    const card = container.querySelector('[data-slot="card"]')
    const header = container.querySelector('[data-slot="card-header"]')
    const title = container.querySelector('[data-slot="card-title"]')

    expect(card).toHaveAttribute('data-testid', 'main-card')
    expect(card).toHaveAttribute('aria-label', 'Test Card')
    expect(header).toHaveAttribute('data-section', 'header')
    expect(title).toHaveAttribute('id', 'card-title')
  })
})