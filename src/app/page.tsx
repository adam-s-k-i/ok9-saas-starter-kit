'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

import dynamic from 'next/dynamic'
import { ClerkProvider } from "@clerk/nextjs"
import { SessionProvider } from "next-auth/react"
import { Settings, LogOut, Download, Copy, Check } from 'lucide-react'
import { useClipboard } from '@/hooks/use-clipboard'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import Link from 'next/link'

const ClerkUserButton = dynamic(() => import('@/components/auth/ClerkUserButton'), { ssr: false })
const NextAuthUserButton = dynamic(() => import('@/components/auth/NextAuthUserButton'), { ssr: false })
const InteractiveDemo = dynamic(() => import('@/components/InteractiveDemo'), { ssr: false })

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

// Dynamically import auth components based on configuration to avoid SSR issues
const AuthComponents = dynamic(() => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isValidClerkKey = publishableKey &&
    publishableKey.startsWith('pk_live_') &&
    publishableKey.length > 20

  return isValidClerkKey
    ? import('@/components/auth/ClerkAuthDemo')
    : import('@/components/auth/NextAuthDemo')
}, {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Authentication wird geladen...</div>
})



// Code Snippet Component with Copy functionality
function CodeSnippet({ code, language = 'tsx' }: { code: string; language?: string }) {
  const { copyToClipboard, copied } = useClipboard()

  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={() => copyToClipboard(code)}
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}

function HomeContent() {
  const isValidClerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_') &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 20

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [checkboxItems, setCheckboxItems] = useState({
    status: true,
    comments: false,
    notifications: true
  })
  const [radioValue, setRadioValue] = useState('default')

  const componentCategories = [
    { id: 'all', name: 'Alle Komponenten' },
    { id: 'buttons', name: 'Buttons' },
    { id: 'forms', name: 'Formulare' },
    { id: 'cards', name: 'Cards' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'avatars', name: 'Avatare' },
    { id: 'dropdowns', name: 'Dropdown-Menüs' }
  ]

  // Filter components based on search and category
  const filteredComponents = componentCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false
    if (searchTerm && !category.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

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
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-bold">OK9 SaaS Starter Kit</h1>
              <p className="text-muted-foreground">UI Components Showcase</p>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/">Home</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/dashboard/billing">Billing</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/dashboard/settings">Settings</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/dashboard/users">Users</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/demo">Demo</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                   {filteredComponents.map((category) => (
                     <SelectItem key={category.id} value={category.id}>
                       {category.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
                <ThemeToggle />
                {isValidClerkKey ? <ClerkUserButton /> : <NextAuthUserButton />}
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

          {/* Buttons - Enhanced */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Buttons</h3>

            {/* Button Variants */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Varianten</h4>
              <div className="flex flex-wrap gap-4 mb-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <CodeSnippet code={`<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`} />
            </div>

            {/* Button Sizes */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Größen</h4>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
              <CodeSnippet code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>`} />
            </div>

            {/* Button States */}
            <div>
              <h4 className="text-lg font-medium mb-4">Zustände</h4>
              <div className="flex flex-wrap gap-4 mb-4">
                <Button disabled>Disabled</Button>
                <Button disabled className="opacity-50">Loading</Button>
              </div>
              <CodeSnippet code={`<Button disabled>Disabled</Button>
<Button disabled className="opacity-50">Loading</Button>`} />
            </div>
          </div>

          {/* Forms - Enhanced */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Form Elements</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Form */}
              <Card>
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
                  <div className="space-y-2">
                    <Label htmlFor="select">Auswahl</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie eine Option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Anmelden</Button>
                </CardContent>
              </Card>

              {/* Input Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Input Varianten</CardTitle>
                  <CardDescription>Verschiedene Input-Typen und Zustände</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Text Input</Label>
                    <Input id="text" placeholder="Einfacher Text" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Number Input</Label>
                    <Input id="number" type="number" placeholder="Zahl eingeben" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled">Disabled Input</Label>
                    <Input id="disabled" disabled placeholder="Deaktiviert" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error">Error State</Label>
                    <Input id="error" className="border-red-500" placeholder="Fehlerzustand" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cards - Enhanced */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Eine einfache Card-Komponente</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Dies ist der Inhalt der Card mit grundlegenden Informationen.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card mit Aktionen</CardTitle>
                  <CardDescription>Card mit Buttons im Footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card-Inhalt mit zusätzlichen Aktionen im Footer-Bereich.</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm">Abbrechen</Button>
                  <Button size="sm">Speichern</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card mit Bild</CardTitle>
                  <CardDescription>Visuell ansprechende Card</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white font-semibold">Bild Platzhalter</span>
                  </div>
                  <p>Card mit integriertem visuellen Element.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Avatars */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Avatare</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Avatar Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar Varianten</CardTitle>
                  <CardDescription>Verschiedene Avatar-Typen und Größen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Small</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Default</span>
                        <Avatar>
                          <AvatarImage src="/avatars/02.png" alt="@shadcn" />
                          <AvatarFallback>SN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Large</span>
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                          <AvatarFallback>LN</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Fallback States</h4>
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-800">AB</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-800">CD</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarFallback className="bg-red-100 text-red-800">EF</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avatar with Text */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar in Context</CardTitle>
                  <CardDescription>Avatare in typischen Anwendungsfällen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src="/avatars/04.png" alt="@user" />
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Max Mustermann</p>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Team Members</h4>
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-background">
                          <AvatarFallback className="bg-blue-100">MM</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback className="bg-green-100">AS</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback className="bg-yellow-100">JK</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback className="bg-purple-100">+3</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

           {/* Dropdown Menus */}
           <div className="mb-12">
             <h3 className="text-xl font-semibold mb-6">Dropdown-Menüs</h3>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card>
                 <CardHeader>
                   <CardTitle>Standard Dropdown</CardTitle>
                   <CardDescription>Einfaches Dropdown-Menü mit verschiedenen Items</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                     <DropdownMenuTrigger asChild>
                       <Button variant="outline">Dropdown öffnen</Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-56">
                       <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuGroup>
                         <DropdownMenuItem>
                           <Settings className="mr-2 h-4 w-4" />
                           <span>Profil</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Settings className="mr-2 h-4 w-4" />
                           <span>Einstellungen</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Settings className="mr-2 h-4 w-4" />
                           <span>Team verwalten</span>
                         </DropdownMenuItem>
                       </DropdownMenuGroup>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem>
                         <LogOut className="mr-2 h-4 w-4" />
                         <span>Abmelden</span>
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>Erweitertes Dropdown</CardTitle>
                   <CardDescription>Mit Checkboxen, Radio-Buttons und Sub-Menüs</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="outline">Erweitertes Menü</Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-56">
                       <DropdownMenuLabel>Einstellungen</DropdownMenuLabel>
                       <DropdownMenuSeparator />

                       <DropdownMenuGroup>
                         <DropdownMenuCheckboxItem
                           checked={checkboxItems.status}
                           onCheckedChange={(checked) => setCheckboxItems({...checkboxItems, status: !!checked})}
                         >
                           Online-Status
                         </DropdownMenuCheckboxItem>
                         <DropdownMenuCheckboxItem
                           checked={checkboxItems.comments}
                           onCheckedChange={(checked) => setCheckboxItems({...checkboxItems, comments: !!checked})}
                         >
                           Kommentare
                         </DropdownMenuCheckboxItem>
                         <DropdownMenuCheckboxItem
                           checked={checkboxItems.notifications}
                           onCheckedChange={(checked) => setCheckboxItems({...checkboxItems, notifications: !!checked})}
                         >
                           Benachrichtigungen
                         </DropdownMenuCheckboxItem>
                       </DropdownMenuGroup>

                       <DropdownMenuSeparator />

                       <DropdownMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
                         <DropdownMenuLabel>Theme</DropdownMenuLabel>
                         <DropdownMenuRadioItem value="light">Hell</DropdownMenuRadioItem>
                         <DropdownMenuRadioItem value="dark">Dunkel</DropdownMenuRadioItem>
                         <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                       </DropdownMenuRadioGroup>

                       <DropdownMenuSeparator />

                       <DropdownMenuSub>
                         <DropdownMenuSubTrigger>
                           <Settings className="mr-2 h-4 w-4" />
                           <span>Weitere Optionen</span>
                         </DropdownMenuSubTrigger>
                         <DropdownMenuSubContent>
                           <DropdownMenuItem>
                             <Download className="mr-2 h-4 w-4" />
                             <span>Import</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                             <Download className="mr-2 h-4 w-4" />
                             <span>Export</span>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>
                             <Settings className="mr-2 h-4 w-4" />
                             <span>Hilfe</span>
                           </DropdownMenuItem>
                         </DropdownMenuSubContent>
                       </DropdownMenuSub>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </CardContent>
               </Card>
             </div>
           </div>

          {/* Select Component */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Select Komponente</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Select</CardTitle>
                  <CardDescription>Einfache Auswahlkomponente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategorie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategorie wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Entwicklung</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Status wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktiv</SelectItem>
                          <SelectItem value="inactive">Inaktiv</SelectItem>
                          <SelectItem value="pending">Ausstehend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select mit verschiedenen Größen</CardTitle>
                  <CardDescription>Angepasste Select-Komponenten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Small" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s">Small</SelectItem>
                        <SelectItem value="m">Medium</SelectItem>
                        <SelectItem value="l">Large</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Medium Width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Längere Option 1</SelectItem>
                        <SelectItem value="option2">Längere Option 2</SelectItem>
                        <SelectItem value="option3">Längere Option 3</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Full Width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full1">Vollständige Breite Option 1</SelectItem>
                        <SelectItem value="full2">Vollständige Breite Option 2</SelectItem>
                        <SelectItem value="full3">Vollständige Breite Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Component Overview Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Komponenten-Übersicht</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Button Component */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Button
                </CardTitle>
                <CardDescription>Interaktive Schaltflächen mit verschiedenen Varianten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">Beispiel</Button>
                  <Button size="sm">Primary</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">6 Varianten, 4 Größen</p>
              </CardContent>
            </Card>

            {/* Input Component */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Input
                </CardTitle>
                <CardDescription>Eingabefelder für Formulare und Daten</CardDescription>
              </CardHeader>
              <CardContent>
                <Input placeholder="Beispiel Input" />
                <p className="text-sm text-muted-foreground mt-2">Verschiedene Typen und Zustände</p>
              </CardContent>
            </Card>

            {/* Card Component */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Card
                </CardTitle>
                <CardDescription>Container für zusammengehörige Inhalte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="text-sm">Card-Inhalt Beispiel</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Header, Content, Footer</p>
              </CardContent>
            </Card>

            {/* Avatar Component */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Avatar
                </CardTitle>
                <CardDescription>Benutzerbilder und Platzhalter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Bilder, Fallbacks, Größen</p>
              </CardContent>
            </Card>

             {/* Dropdown Menu Component */}
             <Card className="hover:shadow-lg transition-shadow">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                   Dropdown Menu
                 </CardTitle>
                 <CardDescription>Kontextmenüs und Auswahloptionen</CardDescription>
               </CardHeader>
               <CardContent>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="sm">Menü öffnen</Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                     <DropdownMenuItem>Option 1</DropdownMenuItem>
                     <DropdownMenuItem>Option 2</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <p className="text-sm text-muted-foreground mt-2">Checkboxen, Radio, Sub-Menüs</p>
               </CardContent>
             </Card>

            {/* Select Component */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  Select
                </CardTitle>
                <CardDescription>Auswahllisten für Formulare</CardDescription>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">Angepasste Auswahllisten</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <InteractiveDemo />

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
        <Button asChild variant="outline" size="sm">
          <a href="https://github.com/bytefer/awesome-shadcn-ui" target="_blank" rel="noopener noreferrer">Awesome Shadcn</a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href="https://ui.aceternity.com/components" target="_blank" rel="noopener noreferrer">Aceternity</a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener noreferrer">Shadcn</a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href="https://tailwindcss.com/plus/ui-blocks?ref=sidebar" target="_blank" rel="noopener noreferrer">TailwindCSS</a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href="https://opencode.ai" target="_blank" rel="noopener noreferrer">Opencode</a>
        </Button>
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