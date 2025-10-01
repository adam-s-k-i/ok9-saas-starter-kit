import { prisma } from './prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'

export type AuditAction =
  | 'user_create'
  | 'user_update'
  | 'user_delete'
  | 'user_login'
  | 'user_logout'
  | 'bulk_user_delete'
  | 'bulk_user_activate'
  | 'bulk_user_deactivate'

export type AuditResource =
  | 'users'
  | 'subscriptions'
  | 'invoices'
  | 'api_keys'
  | 'system'

export interface AuditLogData {
  action: AuditAction
  resource: AuditResource
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

/**
 * Log an audit event
 */
export async function logAuditEvent(data: AuditLogData) {
  try {
    const session = await getServerSession(authOptions)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).auditLog.create({
      data: {
        userId: session?.user?.id,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    })
  } catch (error) {
    // Log audit errors to console but don't fail the operation
    console.error('Failed to log audit event:', error)
  }
}

/**
 * Get audit logs with pagination and filtering
 */
export async function getAuditLogs(options: {
  page?: number
  limit?: number
  userId?: string
  action?: AuditAction
  resource?: AuditResource
  startDate?: Date
  endDate?: Date
}) {
  const {
    page = 1,
    limit = 50,
    userId,
    action,
    resource,
    startDate,
    endDate,
  } = options

  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (userId) where.userId = userId
  if (action) where.action = action
  if (resource) where.resource = resource
  if (startDate || endDate) {
    where.createdAt = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (startDate) (where.createdAt as any).gte = startDate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (endDate) (where.createdAt as any).lte = endDate
  }

  const [logs, total] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).auditLog.count({ where }),
  ])

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}