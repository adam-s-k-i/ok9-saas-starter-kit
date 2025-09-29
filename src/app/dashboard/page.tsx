'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BarChart3, Users, CreditCard, Activity, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
  })

  useEffect(() => {
    // Mock data - in production, fetch from API
    setStats({
      users: 142,
      revenue: 2840,
      activeSubscriptions: 89,
      monthlyGrowth: 12.5,
    })
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Übersicht Ihrer SaaS-Plattform
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/billing">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Abonnement
                </Link>
              </Button>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gesamt-Nutzer</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(stats.users * 0.15)} diesen Monat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monatlicher Umsatz</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.revenue}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.monthlyGrowth}% gegenüber Vormonat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktive Abonnements</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activeSubscriptions / stats.users) * 100)}% Konversion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wachstumsrate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyGrowth}%</div>
                <p className="text-xs text-muted-foreground">
                  Monatliches Wachstum
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitätsübersicht</CardTitle>
                  <CardDescription>Letzte Aktivitäten in Ihrer Plattform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: 'Max Mustermann', action: 'Neues Abonnement', time: 'Vor 2 Minuten', type: 'success' },
                      { user: 'Anna Schmidt', action: 'Profil aktualisiert', time: 'Vor 15 Minuten', type: 'info' },
                      { user: 'Tom Weber', action: 'Support-Ticket erstellt', time: 'Vor 1 Stunde', type: 'warning' },
                      { user: 'Lisa Fischer', action: 'Konto gekündigt', time: 'Vor 3 Stunden', type: 'error' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              activity.type === 'success' ? 'default' :
                              activity.type === 'warning' ? 'secondary' :
                              activity.type === 'error' ? 'destructive' : 'outline'
                            }
                          >
                            {activity.time}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Umsatzentwicklung</CardTitle>
                  <CardDescription>Monatliche Umsatzstatistiken</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Revenue Chart Placeholder</p>
                      <p className="text-sm text-muted-foreground">Hier würde ein echtes Chart angezeigt</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Schnellaktionen</CardTitle>
                  <CardDescription>Häufig verwendete Funktionen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/dashboard/users" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Benutzer verwalten
                      </Button>
                    </Link>
                    <Link href="/dashboard/billing" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Abonnements
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        Einstellungen
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Berichte
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System-Status</CardTitle>
                  <CardDescription>Aktueller Status aller Services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { service: 'Webserver', status: 'operational', uptime: '99.9%' },
                      { service: 'Datenbank', status: 'operational', uptime: '99.8%' },
                      { service: 'Payment Gateway', status: 'operational', uptime: '99.7%' },
                      { service: 'Email Service', status: 'degraded', uptime: '95.2%' },
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{service.service}</p>
                          <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                        </div>
                        <Badge
                          variant={service.status === 'operational' ? 'default' : 'destructive'}
                        >
                          {service.status === 'operational' ? '✅' : '⚠️'} {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Abonnement-Übersicht</CardTitle>
                  <CardDescription>Ihr aktueller Plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Plan</span>
                      <Badge variant="secondary">Professional</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status</span>
                      <Badge variant="default">Aktiv</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Nächste Zahlung</span>
                      <span>30. Oktober 2024</span>
                    </div>
                    <Button className="w-full mt-2" asChild>
                      <Link href="/dashboard/billing">
                        Abonnement verwalten
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}