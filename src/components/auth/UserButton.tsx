'use client'

import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export function UserButton() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isValidClerkKey = publishableKey &&
    publishableKey.startsWith('pk_live_') &&
    publishableKey.length > 20

  if (isValidClerkKey) {
    return (
      <Button variant="outline" size="sm">
        <LogIn className="w-4 h-4 mr-2" />
        Anmelden (Clerk aktiv)
      </Button>
    )
  }

  return (
    <Button variant="outline" size="sm">
      <LogIn className="w-4 h-4 mr-2" />
      Anmelden (NextAuth.js)
    </Button>
  )
}