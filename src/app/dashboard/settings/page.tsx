'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    company: 'Beispiel GmbH',
    phone: '+49 123 456789',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile updated:', formData)
    // Hier würde die API-Integration erfolgen
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Einstellungen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hauptinhalt */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profilinformationen */}
              <Card>
                <CardHeader>
                  <CardTitle>Profilinformationen</CardTitle>
                  <CardDescription>
                    Aktualisieren Sie Ihre persönlichen Daten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Vollständiger Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email-Adresse</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="max@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Unternehmen</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Ihr Unternehmen"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefonnummer</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+49 123 456789"
                        />
                      </div>
                    </div>
                    <Button type="submit">Änderungen speichern</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Sicherheitseinstellungen */}
              <Card>
                <CardHeader>
                  <CardTitle>Sicherheit</CardTitle>
                  <CardDescription>
                    Verwalten Sie Ihre Sicherheitseinstellungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Passwort ändern</p>
                      <p className="text-sm text-muted-foreground">
                        Letzte Änderung: Vor 3 Monaten
                      </p>
                    </div>
                    <Button variant="outline">Ändern</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Zwei-Faktor-Authentifizierung</p>
                      <p className="text-sm text-muted-foreground">
                        Zurzeit deaktiviert
                      </p>
                    </div>
                    <Button variant="outline">Aktivieren</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seitenleiste */}
            <div className="space-y-6">
              {/* Kontostatus */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kontostatus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Plan:</span>
                      <span className="font-medium">Starter</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <span className="text-green-600 font-medium">Aktiv</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mitglied seit:</span>
                      <span className="text-sm">01.01.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schnellaktionen */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schnellaktionen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📧 Email-Benachrichtigungen
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🌙 Dark Mode
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🌍 Sprache
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}