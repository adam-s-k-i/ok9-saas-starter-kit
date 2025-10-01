'use client'

import { Button } from "@/components/ui/button"
import { LogIn, LayoutDashboard } from "lucide-react"
import { useUser, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function UserButton() {
  const { user: clerkUser } = useUser()

  if (clerkUser) {
    return (
      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </Link>
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