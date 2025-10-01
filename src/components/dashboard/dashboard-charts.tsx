"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileImage, FileText, Calendar, Filter } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardOverview } from "@/lib/dashboard"

interface DashboardChartsProps {
  overview: DashboardOverview
}

export function DashboardCharts({ overview }: DashboardChartsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [timeRange, setTimeRange] = useState<string>('6months')
  const mrrChartRef = useRef<HTMLDivElement>(null)
  const userGrowthChartRef = useRef<HTMLDivElement>(null)
  const subscriptionChartRef = useRef<HTMLDivElement>(null)
  const correlationChartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const exportToPNG = async (chartRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!chartRef.current) return

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error exporting chart to PNG:', error)
    }
  }

  const exportToPDF = async (chartRef: React.RefObject<HTMLDivElement | null>, filename: string, title: string) => {
    if (!chartRef.current) return

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 20

      // Add title
      pdf.setFontSize(16)
      pdf.text(title, 20, 15)

      // Add image
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 20
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${filename}.pdf`)
    } catch (error) {
      console.error('Error exporting chart to PDF:', error)
    }
  }

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  )

  // MRR Trend Chart Data
  const mrrTrendData = useMemo(() => {
    let filteredData = overview.revenueTrend

    // Filter based on time range
    if (timeRange !== 'all') {
      const monthsToShow = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12

      filteredData = overview.revenueTrend.slice(-monthsToShow)
    }

    return filteredData.map((entry) => ({
      month: entry.month,
      revenue: entry.revenue / 100, // Convert cents to euros
      formattedMonth: new Date(entry.month + '-01').toLocaleDateString('de-DE', {
        month: 'short',
        year: '2-digit'
      })
    }))
  }, [overview.revenueTrend, timeRange])

  // User Growth Chart Data
  const userGrowthData = useMemo(() => {
    const monthlyUsers = new Map<string, number>()

    // Initialize with zero for the selected time range
    const now = new Date()
    const monthsToShow = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : timeRange === '12months' ? 12 : 6

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyUsers.set(key, 0)
    }

    // Count users by month
    overview.recentUsers.forEach((user) => {
      const date = new Date(user.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthlyUsers.has(key)) {
        monthlyUsers.set(key, monthlyUsers.get(key)! + 1)
      }
    })

    return Array.from(monthlyUsers.entries()).map(([month, count]) => ({
      month,
      users: count,
      formattedMonth: new Date(month + '-01').toLocaleDateString('de-DE', {
        month: 'short',
        year: '2-digit'
      })
    }))
  }, [overview.recentUsers, timeRange])

  // Subscription Status Pie Chart Data
  const subscriptionData = useMemo(() => [
    { name: 'Aktiv', value: overview.stats.activeSubscriptions, color: '#00C49F' },
    { name: 'Testphase', value: overview.stats.trialingSubscriptions, color: '#FFBB28' },
    { name: 'Gekündigt', value: overview.stats.canceledSubscriptionsThisMonth, color: '#FF8042' },
  ], [overview.stats])

  // Revenue vs Users Correlation Chart
  const correlationData = useMemo(() => {
    return mrrTrendData.map((revenueEntry, index) => {
      const userEntry = userGrowthData[index]
      return {
        month: revenueEntry.formattedMonth,
        revenue: revenueEntry.revenue,
        users: userEntry?.users || 0,
      }
    })
  }, [mrrTrendData, userGrowthData])

  return (
    <div className="space-y-6">
      {/* Chart Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Chart-Filter</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Letzte 3 Monate</SelectItem>
                    <SelectItem value="6months">Letzte 6 Monate</SelectItem>
                    <SelectItem value="12months">Letzte 12 Monate</SelectItem>
                    <SelectItem value="all">Alle Daten</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* MRR Trend Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">MRR-Entwicklung (6 Monate)</CardTitle>
            <CardDescription className="text-sm">
              Monatliche wiederkehrende Einnahmen über die letzten 6 Monate
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportToPNG(mrrChartRef, 'mrr-trend-chart')}>
                <FileImage className="h-4 w-4 mr-2" />
                Als PNG exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(mrrChartRef, 'mrr-trend-chart', 'MRR-Entwicklung (6 Monate)')}>
                <FileText className="h-4 w-4 mr-2" />
                Als PDF exportieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div ref={mrrChartRef}>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <AreaChart data={mrrTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedMonth"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(value) => currencyFormatter.format(value)}
                width={isMobile ? 60 : 80}
              />
              <Tooltip
                formatter={(value: number) => [currencyFormatter.format(value), 'MRR']}
                labelStyle={{ color: '#000', fontSize: '12px' }}
                contentStyle={{ fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Benutzerwachstum</CardTitle>
            <CardDescription>
              Neue Registrierungen pro Monat
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportToPNG(userGrowthChartRef, 'user-growth-chart')}>
                <FileImage className="h-4 w-4 mr-2" />
                Als PNG exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(userGrowthChartRef, 'user-growth-chart', 'Benutzerwachstum')}>
                <FileText className="h-4 w-4 mr-2" />
                Als PDF exportieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div ref={userGrowthChartRef}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
            <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedMonth"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip
                formatter={(value: number) => [value, 'Neue Benutzer']}
                labelStyle={{ color: '#000', fontSize: '12px' }}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="users" fill="#00C49F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status Pie Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Abonnement-Status</CardTitle>
            <CardDescription>
              Verteilung der Abonnement-Zustände
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportToPNG(subscriptionChartRef, 'subscription-status-chart')}>
                <FileImage className="h-4 w-4 mr-2" />
                Als PNG exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(subscriptionChartRef, 'subscription-status-chart', 'Abonnement-Status')}>
                <FileText className="h-4 w-4 mr-2" />
                Als PDF exportieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div ref={subscriptionChartRef}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={isMobile ? false : ({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue vs Users Correlation */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Umsatz vs. Benutzerwachstum</CardTitle>
            <CardDescription>
              Korrelation zwischen MRR und neuen Benutzern
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportToPNG(correlationChartRef, 'revenue-users-correlation-chart')}>
                <FileImage className="h-4 w-4 mr-2" />
                Als PNG exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF(correlationChartRef, 'revenue-users-correlation-chart', 'Umsatz vs. Benutzerwachstum')}>
                <FileText className="h-4 w-4 mr-2" />
                Als PDF exportieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div ref={correlationChartRef}>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <LineChart data={correlationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(value) => currencyFormatter.format(value)}
                width={isMobile ? 60 : 80}
              />
              <YAxis
                yAxisId="users"
                orientation="right"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') {
                    return [currencyFormatter.format(value), 'MRR']
                  }
                  return [value, 'Neue Benutzer']
                }}
                labelStyle={{ color: '#000', fontSize: '12px' }}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend
                wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={isMobile ? 2 : 3}
                name="MRR"
                dot={{ fill: '#8884d8', strokeWidth: 2, r: isMobile ? 3 : 4 }}
              />
              <Line
                yAxisId="users"
                type="monotone"
                dataKey="users"
                stroke="#00C49F"
                strokeWidth={isMobile ? 2 : 3}
                name="Neue Benutzer"
                dot={{ fill: '#00C49F', strokeWidth: 2, r: isMobile ? 3 : 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}