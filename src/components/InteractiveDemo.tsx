'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, LogOut, Settings } from 'lucide-react'

export default function InteractiveDemo() {
  const [checkboxItems, setCheckboxItems] = useState({
    status: true,
    comments: false,
    notifications: true
  })

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Interaktive Demo</h2>
      <Card>
        <CardHeader>
          <CardTitle>Benutzerprofil Editor</CardTitle>
          <CardDescription>Eine praktische Demo, die mehrere Komponenten kombiniert</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatars/demo.png" alt="Demo User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    DU
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Demo Benutzer</h3>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2">
                        Profil bearbeiten
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Foto ändern</DropdownMenuItem>
                      <DropdownMenuItem>Profilinfo bearbeiten</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Privatsphäre</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-name">Name</Label>
                  <Input id="demo-name" placeholder="Vollständiger Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-email">Email</Label>
                  <Input id="demo-email" type="email" placeholder="email@beispiel.de" />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h4 className="font-medium">Einstellungen</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-theme">Theme</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Theme wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Hell</SelectItem>
                      <SelectItem value="dark">Dunkel</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demo-language">Sprache</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sprache wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="demo-notifications">Benachrichtigungen</Label>
                  <input
                    type="checkbox"
                    id="demo-notifications"
                    checked={checkboxItems.notifications}
                    onChange={(e) => setCheckboxItems({...checkboxItems, notifications: e.target.checked})}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <h4 className="font-medium">Aktionen</h4>

              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Daten exportieren
                </Button>

                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Erweiterte Einstellungen
                </Button>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Konto löschen
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Diese Aktion kann nicht rückgängig gemacht werden
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8 pt-6 border-t">
            <Button variant="outline">Abbrechen</Button>
            <Button>Änderungen speichern</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}