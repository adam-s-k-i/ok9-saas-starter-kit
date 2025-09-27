'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserButton } from "@/components/auth/UserButton"
import dynamic from 'next/dynamic'
import { ClerkProvider } from "@clerk/nextjs"
import { SessionProvider } from "next-auth/react"

// Conditional Auth provider for development
function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Use Clerk only if we have a valid production publishable key
  const isValidClerkKey = publishableKey &&
    publishableKey.startsWith('pk_live_') &&
    publishableKey.length > 20;

  if (isValidClerkKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {children}
      </ClerkProvider>
    );
  }

  // Fallback to NextAuth.js for development and self-hosting
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// Dynamically import Clerk components to avoid SSR issues
const AuthComponents = dynamic(() => import('@/components/auth/AuthDemo'), {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Authentication wird geladen...</div>
})

function HomeContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const componentCategories = [
    { id: 'all', name: 'Alle Komponenten' },
    { id: 'buttons', name: 'Buttons' },
    { id: 'forms', name: 'Formulare' },
    { id: 'cards', name: 'Cards' },
    { id: 'navigation', name: 'Navigation' }
  ]

  const tailwindUtilities = [
    { name: 'Flexbox', example: 'flex justify-center items-center', description: 'Flexbox Layout Utilities' },
    { name: 'Grid', example: 'grid grid-cols-3 gap-4', description: 'CSS Grid Layout' },
    { name: 'Spacing', example: 'p-4 m-2', description: 'Padding und Margin' },
    { name: 'Colors', example: 'bg-blue-500 text-white', description: 'Farben und Themes' },
    { name: 'Typography', example: 'text-lg font-bold', description: 'Text-Styling' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">OK9 SaaS Starter Kit</h1>
              <p className="text-muted-foreground">UI Components Showcase</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Komponenten suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  {componentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* TailwindCSS Utilities Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">TailwindCSS Utilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tailwindUtilities.map((utility) => (
              <Card key={utility.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{utility.name}</CardTitle>
                  <CardDescription>{utility.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted">
                      <code className="text-sm">{utility.example}</code>
                    </div>
                    <div className={`${utility.example} p-4 border rounded-lg`}>
                      Beispiel
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* shadcn/ui Components Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">shadcn/ui Components</h2>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          {/* Forms */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Beispiel Formular</CardTitle>
                <CardDescription>Formularelemente mit Label und Input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@beispiel.de" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <Input id="password" type="password" placeholder="Passwort" />
                </div>
                <Button type="submit" className="w-full">Anmelden</Button>
              </CardContent>
            </Card>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Eine einfache Card-Komponente</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Dies ist der Inhalt der Card.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card mit Aktionen</CardTitle>
                  <CardDescription>Card mit Buttons im Footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card-Inhalt mit zusätzlichen Aktionen.</p>
                </CardContent>
                <div className="flex gap-2 p-6 pt-0">
                  <Button variant="outline" size="sm">Abbrechen</Button>
                  <Button size="sm">Speichern</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Authentication Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Authentication Components</h2>
          <AuthComponents />
        </section>

        {/* Responsive Design Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Responsive Design</h2>
          <Card>
            <CardHeader>
              <CardTitle>Responsive Grid System</CardTitle>
              <CardDescription>Anpassung an verschiedene Bildschirmgrößen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-primary text-primary-foreground p-4 rounded-lg text-center">
                    Grid Item {item}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Diese Grid passt sich automatisch an: 1 Spalte auf Mobile, 2 auf Tablet, 4 auf Desktop.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold">OK9 SaaS Starter Kit</h3>
              <p className="text-sm text-muted-foreground">Modulares SaaS Starter Kit</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">Dokumentation</Button>
              <Button variant="outline" size="sm">GitHub</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}