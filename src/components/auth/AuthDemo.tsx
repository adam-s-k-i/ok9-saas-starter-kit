'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthDemo() {
  const { data: session, status } = useSession()
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isValidClerkKey = publishableKey &&
    publishableKey.startsWith('pk_live_') &&
    publishableKey.length > 20

  const isClerkActive = isValidClerkKey
  const isLoading = status === 'loading'

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Authentication State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Anmelde-Status</CardTitle>
              <CardDescription>
                {isClerkActive ? 'Clerk Authentication' : 'NextAuth.js Self-Hosting'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Lade Authentifizierungsstatus...</p>
              ) : session ? (
                <div className="space-y-2">
                  <p className="text-sm">Angemeldet als: <strong>{session.user?.email}</strong></p>
                   <Button
                     onClick={async () => {
                       await signOut({ redirect: false })
                       window.location.href = '/'
                     }}
                     variant="outline"
                     size="sm"
                   >
                     Abmelden
                   </Button>
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
              <CardDescription>
                {isClerkActive ? 'Clerk (Produktion)' : 'NextAuth.js (Entwicklung)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isClerkActive
                  ? 'Diese App verwendet Clerk für professionelle Authentication.'
                  : 'Diese App verwendet NextAuth.js als Fallback für Self-Hosting.'
                }
              </p>
              <div className="space-y-2 text-xs">
                {isClerkActive ? (
                  <>
                    <p>✅ Produktion: Clerk Authentication</p>
                    <p>🔐 Enterprise: Multi-Faktor Auth</p>
                    <p>📊 Analytics: User Management</p>
                  </>
                ) : (
                  <>
                    <p>✅ Entwicklung: Credentials Login</p>
                    <p>🔧 Produktion: GitHub, Google OAuth</p>
                    <p>📊 Database: Prisma Integration</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}