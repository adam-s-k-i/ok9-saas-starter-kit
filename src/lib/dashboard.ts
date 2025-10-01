import { prisma } from '@/lib/prisma'

export interface DashboardOverview {
  stats: {
    totalUsers: number
    newUsersThisMonth: number
    newUsersPreviousMonth: number
    activeSubscriptions: number
    trialingSubscriptions: number
    canceledSubscriptionsThisMonth: number
    paidInvoicesThisMonth: number
    monthlyRecurringRevenue: number
    previousMonthlyRecurringRevenue: number
    monthlyGrowthPercent: number
    averageInvoiceValue: number
  }
  revenueTrend: Array<{
    month: string
    revenue: number
  }>
  recentInvoices: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    paidAt: string | null
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  recentUsers: Array<{
    id: string
    name: string | null
    email: string
    createdAt: string
  }>
  apiKeys: Array<{
    id: string
    name: string
    lastUsed: string | null
    createdAt: string
    expiresAt: string | null
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  recentActivity: Array<{
    id: string
    type: 'invoice' | 'user' | 'subscription'
    title: string
    description: string
    timestamp: string
  }>
}

function startOfMonth(monthOffset = 0) {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
}

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const currentMonthStart = startOfMonth(0)
  const previousMonthStart = startOfMonth(-1)
  const sixMonthsAgoStart = startOfMonth(-5)

  const [
    totalUsers,
    newUsersCurrent,
    newUsersPrevious,
    activeSubscriptions,
    trialingSubscriptions,
    canceledSubscriptionsThisMonth,
    paidInvoicesCurrent,
    paidInvoicesPrevious,
    revenueCurrentAgg,
    revenuePreviousAgg,
    averageInvoiceAgg,
    invoicesForTrend,
    recentInvoicesRaw,
    recentUsersRaw,
    apiKeysRaw,
    recentSubscriptionsRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: currentMonthStart } },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.subscription.count({ where: { status: 'trialing' } }),
    prisma.subscription.count({
      where: {
        status: 'canceled',
        updatedAt: { gte: currentMonthStart },
      },
    }),
    prisma.invoice.count({
      where: {
        status: 'paid',
        createdAt: { gte: currentMonthStart },
      },
    }),
    prisma.invoice.count({
      where: {
        status: 'paid',
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    }),
    prisma.invoice.aggregate({
      where: {
        status: 'paid',
        createdAt: { gte: currentMonthStart },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        status: 'paid',
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: 'paid' },
      _avg: { amount: true },
    }),
    prisma.invoice.findMany({
      where: {
        status: 'paid',
        createdAt: { gte: sixMonthsAgoStart },
      },
      select: {
        amount: true,
        currency: true,
        createdAt: true,
      },
    }),
    prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ])

  const revenueCurrent = revenueCurrentAgg._sum.amount ?? 0
  const revenuePrevious = revenuePreviousAgg._sum.amount ?? 0
  const averageInvoiceValue = averageInvoiceAgg._avg.amount ?? 0

  const monthlyGrowthPercent = revenuePrevious === 0
    ? (revenueCurrent > 0 ? 100 : 0)
    : ((revenueCurrent - revenuePrevious) / revenuePrevious) * 100

  const revenueTrendMap = new Map<string, number>()
  const cursorDate = new Date(sixMonthsAgoStart)
  for (let i = 0; i < 6; i += 1) {
    const key = formatMonthKey(new Date(cursorDate.getFullYear(), cursorDate.getMonth() + i, 1))
    revenueTrendMap.set(key, 0)
  }

  invoicesForTrend.forEach((invoice) => {
    const key = formatMonthKey(invoice.createdAt)
    if (revenueTrendMap.has(key)) {
      revenueTrendMap.set(key, (revenueTrendMap.get(key) ?? 0) + invoice.amount)
    }
  })

  const revenueTrend = Array.from(revenueTrendMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }))

  const recentInvoices = recentInvoicesRaw.map((invoice) => ({
    id: invoice.id,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    createdAt: invoice.createdAt.toISOString(),
    paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
    user: {
      id: invoice.user.id,
      name: invoice.user.name,
      email: invoice.user.email,
    },
  }))

  const recentUsers = recentUsersRaw.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }))

  const apiKeys = apiKeysRaw.map((key) => ({
    id: key.id,
    name: key.name,
    lastUsed: key.lastUsed ? key.lastUsed.toISOString() : null,
    createdAt: key.createdAt.toISOString(),
    expiresAt: key.expiresAt ? key.expiresAt.toISOString() : null,
    user: {
      id: key.user.id,
      name: key.user.name,
      email: key.user.email,
    },
  }))

  const activity = [
    ...recentUsers.map((user) => ({
      id: `user-${user.id}`,
      type: 'user' as const,
      title: user.name ?? user.email,
      description: 'Neuer Benutzer registriert',
      timestamp: user.createdAt,
    })),
    ...recentSubscriptionsRaw.map((subscription) => ({
      id: `subscription-${subscription.id}`,
      type: 'subscription' as const,
      title: subscription.user.name ?? subscription.user.email,
      description: `Abonnementstatus: ${subscription.status}`,
      timestamp: subscription.createdAt.toISOString(),
    })),
    ...recentInvoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      type: 'invoice' as const,
      title: invoice.user.name ?? invoice.user.email,
      description: `Rechnung ueber ${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
      timestamp: invoice.paidAt ?? invoice.createdAt,
    })),
  ].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, 12)

  return {
    stats: {
      totalUsers,
      newUsersThisMonth: newUsersCurrent,
      newUsersPreviousMonth: newUsersPrevious,
      activeSubscriptions,
      trialingSubscriptions,
      canceledSubscriptionsThisMonth,
      paidInvoicesThisMonth: paidInvoicesCurrent,
      monthlyRecurringRevenue: revenueCurrent,
      previousMonthlyRecurringRevenue: revenuePrevious,
      monthlyGrowthPercent,
      averageInvoiceValue,
    },
    revenueTrend,
    recentInvoices,
    recentUsers,
    apiKeys,
    recentActivity: activity,
  }
}

