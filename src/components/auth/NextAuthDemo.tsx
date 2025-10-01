'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function NextAuthDemo() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = !!session
  const userEmail = session?.user?.email

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Authentication State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Anmelde-Status</CardTitle>
              <CardDescription>NextAuth.js Self-Hosting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Lade Authentifizierungsstatus...</p>
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm">Angemeldet als: <strong>{userEmail}</strong></p>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Nicht angemeldet</p>
                  <Button onClick={() => signIn()} size="sm">
                    Anmelden
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication System</CardTitle>
              <CardDescription>NextAuth.js (Entwicklung)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Diese App verwendet NextAuth.js als Fallback für Self-Hosting.
              </p>
              <div className="space-y-2 text-xs">
                <p>✅ Entwicklung: Credentials Login</p>
                <p>🔧 Produktion: GitHub, Google OAuth</p>
                <p>📊 Database: Prisma Integration</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}