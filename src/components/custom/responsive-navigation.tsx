'use client'

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface ResponsiveNavigationProps {
  items: NavigationItem[]
  className?: string
}

export function ResponsiveNavigation({ items, className }: ResponsiveNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const toggleMenu = () => setIsOpen(!isOpen)

  if (isMobile) {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        
        {isOpen && (
          <div className="absolute top-12 right-0 bg-background border rounded-md shadow-lg p-2 min-w-48 z-50">
            <nav className="space-y-1">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {item.icon}
          {item.label}
        </a>
      ))}
    </nav>
  )
}


