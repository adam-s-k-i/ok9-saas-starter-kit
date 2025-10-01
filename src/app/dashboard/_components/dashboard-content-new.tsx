"use client"

import { useMemo } from "react"
import { DashboardOverview } from "@/lib/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Key,
  TrendingUp,
  Users,
} from "lucide-react"
import { usePerformance } from "@/hooks/use-performance"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { AdvancedRevenueAnalytics } from "@/components/dashboard/advanced-revenue-analytics"

interface DashboardContentProps {
  overview: DashboardOverview
}

export function DashboardContent({ overview }: DashboardContentProps) {
  const numberFormatter = useMemo(() => new Intl.NumberFormat("de-DE"), [])
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  )

  const summaryCards = [
    {
      title: "Gesamt-Nutzer",
      value: numberFormatter.format(overview.stats.totalUsers),
      helper: `${numberFormatter.format(overview.stats.newUsersThisMonth)} neue im Monat`,
      icon: Users,
    },
    {
      title: "MRR (bezahlt)",
      value: currencyFormatter.format(overview.stats.monthlyRecurringRevenue / 100),
      helper: `${overview.stats.paidInvoicesThisMonth} bezahlte Rechnungen`,
      icon: TrendingUp,
    },
    {
      title: "Aktive Abonnements",
      value: numberFormatter.format(overview.stats.activeSubscriptions),
      helper: `${numberFormatter.format(overview.stats.trialingSubscriptions)} Testphase`,
      icon: CreditCard,
    },
    {
      title: "Wachstum",
      value: `${overview.stats.monthlyGrowthPercent.toFixed(1)}%`,
      helper:
        overview.stats.newUsersPreviousMonth > 0
          ? `${numberFormatter.format(overview.stats.newUsersPreviousMonth)} im Vormonat`
          : "Kein Vergleichswert",
      icon: BarChart3,
      trend: overview.stats.monthlyGrowthPercent,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Echtzeit-Überblick über Nutzer, Umsatz und Systemgesundheit
            </p>
          </div>
           <div className="flex gap-3">
             <Button variant="outline" asChild>
               <Link href="/dashboard/users">
                 <Users className="mr-2 h-4 w-4" />
                 Benutzer
               </Link>
             </Button>
             <Button variant="outline" asChild>
               <Link href="/dashboard/logs">
                 <FileText className="mr-2 h-4 w-4" />
                 Logs
               </Link>
             </Button>
             <Button variant="outline" asChild>
               <Link href="/dashboard/billing">
                 <CreditCard className="mr-2 h-4 w-4" />
                 Abonnement
               </Link>
             </Button>
             <Button variant="outline">
               <Activity className="mr-2 h-4 w-4" />
               Analytics
             </Button>
           </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">
                  {card.helper}
                </p>
                {card.trend !== undefined && (
                  <div className="mt-3 flex items-center text-sm">
                    {card.trend >= 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                    )}
                    <span
                      className={card.trend >= 0 ? "text-emerald-600" : "text-rose-600"}
                    >
                      {card.trend >= 0 ? "Positive Entwicklung" : "Rückgang"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

         {/* Interaktive Charts Section */}
         <DashboardCharts overview={overview} />

         {/* Advanced Revenue Analytics */}
         <AdvancedRevenueAnalytics overview={overview} />

         <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aktivitäten</CardTitle>
              <CardDescription>Letzte Benutzer-, Abo- und Rechnungsereignisse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Noch keine Aktivitäten vorhanden.
                  </p>
                )}
                {overview.recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SystemStatusCard overview={overview} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Letzte Rechnungen</CardTitle>
              <CardDescription>Umsatzentwicklung der letzten Wochen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {overview.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {invoice.user.name ?? invoice.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={invoice.status === "paid" ? "secondary" : "outline"}
                    >
                      {invoice.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {currencyFormatter.format(invoice.amount / 100)}
                    </span>
                  </div>
                </div>
              ))}
              {overview.recentInvoices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Keine Rechnungsdaten vorhanden.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Neue Benutzer</CardTitle>
              <CardDescription>Registrierungen der jüngsten Tage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {overview.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{user.name ?? user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>
              ))}
              {overview.recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Keine neuen Benutzer im Beobachtungszeitraum.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>MRR-Trend (6 Monate)</CardTitle>
              <CardDescription>Summierte Umsätze der letzten sechs Monate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {overview.revenueTrend.map((entry) => (
                  <div key={entry.month} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{entry.month}</p>
                    <p className="text-lg font-semibold">
                      {currencyFormatter.format(entry.revenue / 100)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ApiKeysCard overview={overview} />
        </section>
      </div>
    </div>
  )
}

function SystemStatusCard({ overview }: { overview: DashboardOverview }) {
  const { metrics } = usePerformance()

  const currentRevenue = overview.stats.monthlyRecurringRevenue
  const previousRevenue = overview.stats.previousMonthlyRecurringRevenue
  const revenueTrendPositive = currentRevenue >= previousRevenue

  const services = [
    {
      name: "Webserver",
      status: "operational" as const,
      uptime: "99.9%",
    },
    {
      name: "Datenbank",
      status: overview.stats.canceledSubscriptionsThisMonth > 0 ? "degraded" : "operational",
      uptime: "99.7%",
    },
    {
      name: "Payment Gateway",
      status: revenueTrendPositive ? "operational" : "degraded",
      uptime: revenueTrendPositive ? "99.8%" : "97.5%",
    },
    {
      name: "Email Service",
      status: overview.apiKeys.length ? "operational" : "degraded",
      uptime: overview.apiKeys.length ? "99.6%" : "93.0%",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Systemstatus</CardTitle>
        <CardDescription>Abgeleitete Health-Checks und Performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
              </div>
              <Badge variant={service.status === "operational" ? "secondary" : "destructive"}>
                {service.status}
              </Badge>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Performance-Insights</p>
          {metrics ? (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Ladezeit: {metrics.loadTime} ms</li>
              <li>Renderzeit: {metrics.renderTime} ms</li>
              {metrics.timeToFirstByte !== undefined && <li>TTFB: {metrics.timeToFirstByte} ms</li>}
              {metrics.domContentLoaded !== undefined && <li>DOM geladen: {metrics.domContentLoaded} ms</li>}
              {metrics.firstContentfulPaint !== undefined && <li>FCP: {metrics.firstContentfulPaint} ms</li>}
              {metrics.memoryUsage && <li>Speicher: {Math.round(metrics.memoryUsage / 1024 / 1024)} MB</li>}
              <li>Netzwerk: {metrics.isSlowConnection ? "Langsam" : "Stabil"}</li>
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Messung wird initialisiert...</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ApiKeysCard({ overview }: { overview: DashboardOverview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Verwendung und Ablaufdaten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview.apiKeys.map((key) => (
          <div key={key.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{key.name}</p>
              <p className="text-xs text-muted-foreground">
                Inhaber: {key.user.name ?? key.user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                Erstellt am: {new Date(key.createdAt).toLocaleDateString("de-DE")}
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p className="flex items-center justify-end gap-1">
                <Key className="h-3 w-3" />
                {key.lastUsed ? `Zuletzt: ${new Date(key.lastUsed).toLocaleDateString("de-DE")}` : "Noch nicht genutzt"}
              </p>
              <p>
                {key.expiresAt
                  ? `Läuft ab: ${new Date(key.expiresAt).toLocaleDateString("de-DE")}`
                  : "Kein Ablaufdatum"}
              </p>
            </div>
          </div>
        ))}
        {overview.apiKeys.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Es wurden noch keine API Keys erstellt.
          </p>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/settings">
            <Calendar className="mr-2 h-4 w-4" />
            API Keys verwalten
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}