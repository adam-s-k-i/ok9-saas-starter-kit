import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu'

describe('DropdownMenu Component', () => {
  test('renders dropdown menu trigger and content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByText('Open Menu')
    expect(trigger).toBeInTheDocument()
  })

  test('applies custom className to dropdown menu content', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const content = document.querySelector('[data-slot="dropdown-menu-content"]')
    expect(content).toHaveClass('custom-content')
  })

  test('renders dropdown menu items with different variants', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Default Item</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Destructive Item</DropdownMenuItem>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const defaultItem = screen.getByText('Default Item')
    const destructiveItem = screen.getByText('Destructive Item')
    const insetItem = screen.getByText('Inset Item')

    expect(defaultItem).toBeInTheDocument()
    expect(destructiveItem).toBeInTheDocument()
    expect(insetItem).toBeInTheDocument()
  })

  test('renders dropdown menu label and separator', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const label = screen.getByText('Menu Label')
    const separator = document.querySelector('[data-slot="dropdown-menu-separator"]')

    expect(label).toBeInTheDocument()
    expect(separator).toBeInTheDocument()
  })

  test('renders dropdown menu checkbox item', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Checked Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Unchecked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const checkedItem = screen.getByText('Checked Item')
    const uncheckedItem = screen.getByText('Unchecked Item')

    expect(checkedItem).toBeInTheDocument()
    expect(uncheckedItem).toBeInTheDocument()
  })

  test('renders dropdown menu radio items', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const option1 = screen.getByText('Option 1')
    const option2 = screen.getByText('Option 2')

    expect(option1).toBeInTheDocument()
    expect(option2).toBeInTheDocument()
  })

  test('renders dropdown menu group', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Group Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const item1 = screen.getByText('Group Item 1')
    const item2 = screen.getByText('Group Item 2')

    expect(item1).toBeInTheDocument()
    expect(item2).toBeInTheDocument()
  })

  test('renders dropdown submenu structure', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu Trigger</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Submenu Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const subTrigger = screen.getByText('Submenu Trigger')
    expect(subTrigger).toBeInTheDocument()
  })

  test('dropdown menu items are accessible', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Accessible Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const item = screen.getByText('Accessible Item')
    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('role', 'menuitem')
  })

  test('handles disabled menu items', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const disabledItem = screen.getByText('Disabled Item')
    expect(disabledItem).toBeInTheDocument()
    expect(disabledItem).toHaveAttribute('data-disabled')
  })

  test('applies custom styling to menu components', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger className="custom-trigger">Trigger</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          <DropdownMenuLabel className="custom-label">Label</DropdownMenuLabel>
          <DropdownMenuSeparator className="custom-separator" />
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByText('Trigger')
    const item = screen.getByText('Item')
    const label = screen.getByText('Label')
    const separator = document.querySelector('[data-slot="dropdown-menu-separator"]')

    expect(trigger).toHaveClass('custom-trigger')
    expect(item).toHaveClass('custom-item')
    expect(label).toHaveClass('custom-label')
    expect(separator).toHaveClass('custom-separator')
  })

  test('renders complex dropdown menu structure', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Complex Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="light">
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Show notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Menu Label')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Show notifications')).toBeInTheDocument()
  })
})