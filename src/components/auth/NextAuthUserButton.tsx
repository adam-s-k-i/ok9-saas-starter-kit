'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn, LayoutDashboard, LogOut, User } from "lucide-react"
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            {session.user?.name || session.user?.email || 'Benutzer'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={async () => {
            await signOut({ callbackUrl: '/' })
            window.location.href = '/'
          }}>
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link href="/auth/signin">
      <Button variant="outline" size="sm">
        <LogIn className="w-4 h-4 mr-2" />
        Anmelden
      </Button>
    </Link>
  )
}