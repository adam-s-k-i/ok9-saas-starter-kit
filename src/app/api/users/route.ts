import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission, permissions } from "@/lib/rbac"
import { logAuditEvent } from "@/lib/audit"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions - only moderators and admins can view users
    const hasViewPermission = await hasPermission(permissions.viewUsers)
    if (!hasViewPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      OR?: { name?: { contains: string; mode: 'insensitive' } | undefined; email?: { contains: string; mode: 'insensitive' } | undefined }[]
      role?: string
      status?: string
    } = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    }

    if (role !== 'all') {
      where.role = role
    }

    if (status !== 'all') {
      where.status = status
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            invoices: true,
            apiKeys: true,
          }
        },
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit,
    })

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'moderator' | 'user',
      status: user.status as 'active' | 'inactive' | 'pending',
      lastLogin: user.lastLogin?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      stats: {
        totalInvoices: user._count.invoices,
        totalApiKeys: user._count.apiKeys,
        subscriptionStatus: user.subscription?.status || null,
        subscriptionEnd: user.subscription?.currentPeriodEnd?.toISOString() || null,
      }
    }))

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions - only admins can create users
    const hasCreatePermission = await hasPermission(permissions.createUser)
    if (!hasCreatePermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, role = 'user', status = 'active' } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        status,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      }
    })

    // Log audit event
    await logAuditEvent({
      action: 'user_create',
      resource: 'users',
      resourceId: newUser.id,
      details: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    })

    return NextResponse.json(newUser, { status: 201 })

  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}