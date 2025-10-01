'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn, LayoutDashboard, LogOut, User } from "lucide-react"
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function UserButton() {
  const { user: clerkUser } = useUser()

  if (clerkUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            {clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'Benutzer'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <SignOutButton>
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <SignInButton>
      <Button variant="outline" size="sm">
        <LogIn className="w-4 h-4 mr-2" />
        Anmelden
      </Button>
    </SignInButton>
  )
}