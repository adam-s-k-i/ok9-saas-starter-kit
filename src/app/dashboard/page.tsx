import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Willkommen zurück!
              </p>
            </div>
            <Button variant="outline">
              Abmelden
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Benutzerprofil</CardTitle>
                <CardDescription>Verwalten Sie Ihre Kontoinformationen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> Angemeldet</p>
                  <p><strong>Name:</strong> Benutzer</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiken</CardTitle>
                <CardDescription>Übersicht Ihrer Aktivitäten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>📊 <strong>Anmeldungen:</strong> 42</p>
                  <p>📈 <strong>Aktivität:</strong> Hoch</p>
                  <p>🔒 <strong>Konto:</strong> Aktiv</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schnellaktionen</CardTitle>
                <CardDescription>Häufig verwendete Funktionen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/dashboard/settings" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      🔧 Einstellungen
                    </Button>
                  </Link>
                  <Link href="/dashboard/users" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      👥 Benutzer verwalten
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    📋 Projekte anzeigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Authentifizierungs-Status</CardTitle>
              <CardDescription>Details zur aktuellen Sitzung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Benutzer-ID:</p>
                    <code className="text-sm bg-muted p-1 rounded">
                      Authentifiziert
                    </code>
                  </div>
                  <div>
                    <p className="font-semibold">Provider:</p>
                    <p>NextAuth.js (Self-Hosting)</p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✅ Sie sind erfolgreich authentifiziert. Diese Seite ist durch die AuthGuard-Komponente geschützt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}