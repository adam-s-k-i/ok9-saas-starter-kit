"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Target } from "lucide-react"
import { DashboardOverview } from "@/lib/dashboard"

interface AdvancedRevenueAnalyticsProps {
  overview: DashboardOverview
}

export function AdvancedRevenueAnalytics({ overview }: AdvancedRevenueAnalyticsProps) {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  )

  const percentFormatter = useMemo(
    () => new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 }),
    []
  )

  // Calculate advanced metrics
  const analytics = useMemo(() => {
    const currentMRR = overview.stats.monthlyRecurringRevenue / 100
    const previousMRR = overview.stats.previousMonthlyRecurringRevenue / 100
    const mrrGrowth = previousMRR > 0 ? ((currentMRR - previousMRR) / previousMRR) * 100 : 0

    // Churn rate calculation (canceled subscriptions / total active subscriptions)
    const churnRate = overview.stats.activeSubscriptions > 0
      ? (overview.stats.canceledSubscriptionsThisMonth / overview.stats.activeSubscriptions) * 100
      : 0

    // Customer Acquisition Cost (CAC) - estimated
    const newCustomersThisMonth = overview.stats.newUsersThisMonth
    const marketingSpend = currentMRR * 0.1 // Assume 10% of MRR goes to marketing
    const cac = newCustomersThisMonth > 0 ? marketingSpend / newCustomersThisMonth : 0

    // Lifetime Value (LTV)
    const avgRevenuePerUser = overview.stats.activeSubscriptions > 0
      ? currentMRR / overview.stats.activeSubscriptions
      : 0
    const ltv = churnRate > 0 ? avgRevenuePerUser / (churnRate / 100) : avgRevenuePerUser * 12

    // Net Revenue Retention
    const expansionRevenue = currentMRR * 0.05 // Assume 5% expansion revenue
    const netRetention = ((currentMRR - (currentMRR * churnRate / 100) + expansionRevenue) / currentMRR) * 100

    // Payback Period
    const paybackPeriod = cac > 0 ? cac / avgRevenuePerUser : 0

    return {
      currentMRR,
      previousMRR,
      mrrGrowth,
      churnRate,
      cac,
      ltv,
      netRetention,
      paybackPeriod,
      avgRevenuePerUser,
      expansionRevenue
    }
  }, [overview.stats])

  const kpiCards = [
    {
      title: "MRR-Wachstum",
      value: `${analytics.mrrGrowth >= 0 ? '+' : ''}${analytics.mrrGrowth.toFixed(1)}%`,
      description: `${currencyFormatter.format(analytics.currentMRR)} vs. ${currencyFormatter.format(analytics.previousMRR)}`,
      icon: analytics.mrrGrowth >= 0 ? TrendingUp : TrendingDown,
      color: analytics.mrrGrowth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: analytics.mrrGrowth >= 0 ? "bg-green-50" : "bg-red-50"
    },
    {
      title: "Churn Rate",
      value: `${analytics.churnRate.toFixed(1)}%`,
      description: `${overview.stats.canceledSubscriptionsThisMonth} Abos gekündigt`,
      icon: AlertTriangle,
      color: analytics.churnRate > 5 ? "text-red-600" : analytics.churnRate > 2 ? "text-yellow-600" : "text-green-600",
      bgColor: analytics.churnRate > 5 ? "bg-red-50" : analytics.churnRate > 2 ? "bg-yellow-50" : "bg-green-50"
    },
    {
      title: "Customer LTV",
      value: currencyFormatter.format(analytics.ltv),
      description: `${(analytics.ltv / analytics.cac).toFixed(1)}x CAC`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Net Retention",
      value: `${analytics.netRetention.toFixed(1)}%`,
      description: "Umsatz-Retention Rate",
      icon: Users,
      color: analytics.netRetention >= 100 ? "text-green-600" : "text-yellow-600",
      bgColor: analytics.netRetention >= 100 ? "bg-green-50" : "bg-yellow-50"
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Umsatz-Aufschlüsselung</CardTitle>
            <CardDescription>Detaillierte Umsatzmetriken</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Grundumsatz (MRR)</span>
              <span className="font-semibold">{currencyFormatter.format(analytics.currentMRR)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Expansions-Umsatz</span>
              <span className="font-semibold text-green-600">+{currencyFormatter.format(analytics.expansionRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Churn-Verlust</span>
              <span className="font-semibold text-red-600">-{currencyFormatter.format(analytics.currentMRR * analytics.churnRate / 100)}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center font-bold">
              <span>Netto-Umsatz</span>
              <span>{currencyFormatter.format(analytics.currentMRR + analytics.expansionRevenue - (analytics.currentMRR * analytics.churnRate / 100))}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Kunden-Metriken</CardTitle>
            <CardDescription>Wichtige Kunden-Kennzahlen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ø Umsatz pro Kunde</span>
              <span className="font-semibold">{currencyFormatter.format(analytics.avgRevenuePerUser)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Customer Acquisition Cost</span>
              <span className="font-semibold">{currencyFormatter.format(analytics.cac)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">LTV/CAC Ratio</span>
              <Badge variant={analytics.ltv / analytics.cac >= 3 ? "default" : "secondary"}>
                {(analytics.ltv / analytics.cac).toFixed(1)}x
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payback Period</span>
              <span className="font-semibold">{analytics.paybackPeriod.toFixed(1)} Monate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Gesundheits-Score</CardTitle>
          <CardDescription>Überblick über die finanzielle Gesundheit Ihres SaaS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MRR-Wachstum</span>
              <Badge variant={analytics.mrrGrowth >= 0 ? "default" : "destructive"}>
                {analytics.mrrGrowth >= 0 ? "Gut" : "Schlecht"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Churn Rate</span>
              <Badge variant={analytics.churnRate <= 5 ? "default" : analytics.churnRate <= 10 ? "secondary" : "destructive"}>
                {analytics.churnRate <= 5 ? "Ausgezeichnet" : analytics.churnRate <= 10 ? "Akzeptabel" : "Kritisch"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">LTV/CAC Ratio</span>
              <Badge variant={analytics.ltv / analytics.cac >= 3 ? "default" : "secondary"}>
                {analytics.ltv / analytics.cac >= 3 ? "Sehr gut" : "Verbesserung nötig"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}