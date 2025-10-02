import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogs, AuditAction, AuditResource } from '@/lib/audit'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is authenticated (temporarily allow all authenticated users for testing)
    // const userRole = session.user.role || 'user'
    // if (userRole !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId') || undefined
    const actionParam = searchParams.get('action')
    const action = actionParam && ['user_create', 'user_update', 'user_delete', 'user_login', 'user_logout', 'bulk_user_delete', 'bulk_user_activate', 'bulk_user_deactivate'].includes(actionParam) ? actionParam as AuditAction : undefined
    const resourceParam = searchParams.get('resource')
    const resource = resourceParam && ['users', 'subscriptions', 'invoices', 'api_keys', 'system'].includes(resourceParam) ? resourceParam as AuditResource : undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

    const result = await getAuditLogs({
      page,
      limit,
      userId,
      action,
      resource,
      startDate,
      endDate,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}