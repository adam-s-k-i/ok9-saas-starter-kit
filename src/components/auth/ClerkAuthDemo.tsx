'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function ClerkAuthDemo() {
  const { user: clerkUser } = useUser()
  const isAuthenticated = !!clerkUser
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Authentication State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Anmelde-Status</CardTitle>
              <CardDescription>Clerk Authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm">Angemeldet als: <strong>{userEmail}</strong></p>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Nicht angemeldet</p>
                  <SignInButton>
                    <Button size="sm">Anmelden</Button>
                  </SignInButton>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication System</CardTitle>
              <CardDescription>Clerk (Produktion)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Diese App verwendet Clerk für professionelle Authentication.
              </p>
              <div className="space-y-2 text-xs">
                <p>✅ Produktion: Clerk Authentication</p>
                <p>🔐 Enterprise: Multi-Faktor Auth</p>
                <p>📊 Analytics: User Management</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}