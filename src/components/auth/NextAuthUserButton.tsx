'use client'

import { Button } from "@/components/ui/button"
import { LogIn, LayoutDashboard } from "lucide-react"
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function UserButton() {
  const { data: session } = useSession()

  if (session) {
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
    <Button variant="outline" size="sm" onClick={() => signIn()}>
      <LogIn className="w-4 h-4 mr-2" />
      Anmelden
    </Button>
  )
}