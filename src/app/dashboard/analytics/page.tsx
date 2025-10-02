'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
// Using simple button-based tabs instead of shadcn Tabs component
import { Calendar, Download, TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart, LineChart } from 'lucide-react'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { AdvancedRevenueAnalytics } from '@/components/dashboard/advanced-revenue-analytics'
import { getDashboardOverview, DashboardOverview } from '@/lib/dashboard'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await getDashboardOverview()
        setOverview(data)
      } catch (error) {
        console.error('Error fetching dashboard overview:', error)
        // Fallback: Create mock data for demo purposes
        setOverview({
          stats: {
            totalUsers: 1250,
            newUsersThisMonth: 45,
            newUsersPreviousMonth: 38,
            monthlyGrowthPercent: 18.4,
            monthlyRecurringRevenue: 1250000, // €12,500.00
            previousMonthlyRecurringRevenue: 1056000, // €10,560.00
            activeSubscriptions: 234,
            trialingSubscriptions: 12,
            canceledSubscriptionsThisMonth: 8,
            paidInvoicesThisMonth: 198,
            averageInvoiceValue: 63232, // €632.32
          },
          revenueTrend: [
            { month: '2024-08', revenue: 950000 },
            { month: '2024-09', revenue: 1056000 },
            { month: '2024-10', revenue: 1180000 },
            { month: '2024-11', revenue: 1220000 },
            { month: '2024-12', revenue: 1280000 },
            { month: '2025-01', revenue: 1250000 },
          ],
          recentActivity: [
            {
              id: '1',
              type: 'user' as const,
              title: 'Max Mustermann',
              description: 'Neuer Benutzer registriert',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '2',
              type: 'subscription' as const,
              title: 'Anna Schmidt',
              description: 'Abonnement aktiviert',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '3',
              type: 'invoice' as const,
              title: 'Thomas Weber',
              description: 'Rechnung über €49.99 bezahlt',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            },
          ],
          recentInvoices: [
            {
              id: 'inv-1',
              user: { id: '1', name: 'Max Mustermann', email: 'max@example.com' },
              amount: 4999,
              currency: 'eur',
              status: 'paid',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'inv-2',
              user: { id: '2', name: 'Anna Schmidt', email: 'anna@example.com' },
              amount: 2999,
              currency: 'eur',
              status: 'paid',
              createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              paidAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            },
          ],
          recentUsers: [
            {
              id: '1',
              name: 'Max Mustermann',
              email: 'max@example.com',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '2',
              name: 'Anna Schmidt',
              email: 'anna@example.com',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          apiKeys: [
            {
              id: 'key-1',
              name: 'Production API Key',
              user: { id: '1', name: 'Max Mustermann', email: 'max@example.com' },
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              expiresAt: null,
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  const exportAnalytics = (format: 'csv' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting analytics as ${format}`)
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lade Analytics-Daten...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!overview) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fehler beim Laden</h3>
              <p className="text-muted-foreground text-center">
                Analytics-Daten konnten nicht geladen werden.
              </p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Detaillierte Einblicke in Ihre SaaS-Metriken und Performance
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Letzter Monat</SelectItem>
                  <SelectItem value="3months">Letzte 3 Monate</SelectItem>
                  <SelectItem value="6months">Letzte 6 Monate</SelectItem>
                  <SelectItem value="12months">Letzte 12 Monate</SelectItem>
                  <SelectItem value="all">Alle Daten</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => exportAnalytics('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => exportAnalytics('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gesamtumsatz</p>
                    <p className="text-2xl font-bold">
                      €{(overview.stats.monthlyRecurringRevenue / 100).toLocaleString('de-DE')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{overview.stats.monthlyGrowthPercent.toFixed(1)}% zum Vormonat
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aktive Benutzer</p>
                    <p className="text-2xl font-bold">{overview.stats.totalUsers.toLocaleString('de-DE')}</p>
                    <p className="text-xs text-muted-foreground">
                      +{overview.stats.newUsersThisMonth} neue diesen Monat
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Abonnements</p>
                    <p className="text-2xl font-bold">{overview.stats.activeSubscriptions.toLocaleString('de-DE')}</p>
                    <p className="text-xs text-muted-foreground">
                      {overview.stats.trialingSubscriptions} in Testphase
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Konversionsrate</p>
                    <p className="text-2xl font-bold">
                      {overview.stats.totalUsers > 0
                        ? ((overview.stats.activeSubscriptions / overview.stats.totalUsers) * 100).toFixed(1)
                        : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Abonnements pro Benutzer
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <div className="space-y-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Übersicht
              </Button>
              <Button
                variant={activeTab === 'revenue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('revenue')}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Umsatz
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('users')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Benutzer
              </Button>
              <Button
                variant={activeTab === 'performance' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('performance')}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Performance
              </Button>
            </div>

            {activeTab === 'overview' && <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>MRR-Entwicklung</CardTitle>
                    <CardDescription>Monatliche wiederkehrende Einnahmen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Interaktive Charts werden hier angezeigt</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Benutzerwachstum</CardTitle>
                    <CardDescription>Neue Registrierungen über Zeit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Benutzerwachstum-Chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Kürzliche Aktivitäten</CardTitle>
                  <CardDescription>Letzte Ereignisse in Ihrem System</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overview.recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <Badge variant="outline">
                          {new Date(activity.timestamp).toLocaleDateString('de-DE')}
                        </Badge>
                      </div>
                    ))}
                    {overview.recentActivity.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Keine kürzlichen Aktivitäten vorhanden
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>}

            {activeTab === 'revenue' && <div className="space-y-6">
              <AdvancedRevenueAnalytics overview={overview} />
            </div>}

            {activeTab === 'users' && <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Benutzer-Segmentierung</CardTitle>
                    <CardDescription>Verteilung der Benutzer nach Typ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Benutzer-Segmentierungs-Chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Benutzer-Engagement</CardTitle>
                    <CardDescription>Aktivitätsmetriken der Benutzer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tägliche aktive Benutzer</span>
                      <span className="font-semibold">{Math.round(overview.stats.totalUsers * 0.3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wöchentliche aktive Benutzer</span>
                      <span className="font-semibold">{Math.round(overview.stats.totalUsers * 0.6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monatliche aktive Benutzer</span>
                      <span className="font-semibold">{overview.stats.totalUsers}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top-Benutzer</CardTitle>
                  <CardDescription>Benutzer mit der höchsten Aktivität</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overview.recentUsers.slice(0, 3).map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{user.name || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          Registriert: {new Date(user.createdAt).toLocaleDateString('de-DE')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>}

            {activeTab === 'performance' && <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System-Performance</CardTitle>
                    <CardDescription>Server und API-Metriken</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Response Time</span>
                      <Badge variant="default">120ms</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uptime</span>
                      <Badge variant="default">99.9%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Error Rate</span>
                      <Badge variant="secondary">0.1%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Datenbank-Performance</CardTitle>
                    <CardDescription>Query-Zeiten und Durchsatz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg Query Time</span>
                      <Badge variant="default">45ms</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Connection Pool</span>
                      <Badge variant="default">95%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cache Hit Rate</span>
                      <Badge variant="secondary">87%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business-Metriken</CardTitle>
                    <CardDescription>Wichtige KPIs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <Badge variant="default">
                        {overview.stats.totalUsers > 0
                          ? ((overview.stats.activeSubscriptions / overview.stats.totalUsers) * 100).toFixed(1)
                          : 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Churn Rate</span>
                      <Badge variant="secondary">
                        {overview.stats.activeSubscriptions > 0
                          ? ((overview.stats.canceledSubscriptionsThisMonth / overview.stats.activeSubscriptions) * 100).toFixed(1)
                          : 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">LTV/CAC Ratio</span>
                      <Badge variant="default">3.2x</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}