'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'

export default function UsersPage() {
  // Mock-Daten für Benutzer
  const users = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com', role: 'Admin', status: 'Aktiv' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@example.com', role: 'User', status: 'Aktiv' },
    { id: 3, name: 'Tom Weber', email: 'tom@example.com', role: 'User', status: 'Inaktiv' },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
              <p className="text-muted-foreground">
                Verwalten Sie Benutzerkonten und Berechtigungen
              </p>
            </div>
            <Button>Neuen Benutzer erstellen</Button>
          </div>

          {/* Such- und Filterbereich */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Benutzer suchen</Label>
                  <Input id="search" placeholder="Name oder Email..." />
                </div>
                <div>
                  <Label htmlFor="role">Rolle</Label>
                  <select id="role" className="w-full p-2 border rounded">
                    <option value="">Alle Rollen</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="w-full p-2 border rounded">
                    <option value="">Alle Status</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benutzertabelle */}
          <Card>
            <CardHeader>
              <CardTitle>Benutzerliste</CardTitle>
              <CardDescription>
                {users.length} Benutzer gefunden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        user.status === 'Aktiv' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {user.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Bearbeiten</Button>
                        <Button variant="outline" size="sm">Löschen</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benutzerstatistiken */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gesamtbenutzer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Aktive Benutzer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Admin').length}
                </div>
                <p className="text-xs text-muted-foreground">Administratoren</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Aktivitätsrate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((users.filter(u => u.status === 'Aktiv').length / users.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Aktive Benutzer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}