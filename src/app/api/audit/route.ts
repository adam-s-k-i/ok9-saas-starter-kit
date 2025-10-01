import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission, permissions } from "@/lib/rbac"
import { getAuditLogs, AuditAction, AuditResource } from "@/lib/audit"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions - only admins can view audit logs
    const hasViewPermission = await hasPermission(permissions.viewUsers) // Same permission as viewing users
    if (!hasViewPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId') || undefined
    const action = searchParams.get('action') || undefined
    const resource = searchParams.get('resource') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

    const result = await getAuditLogs({
      page,
      limit,
      userId,
      action: action as AuditAction,
      resource: resource as AuditResource,
      startDate,
      endDate,
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error("Audit logs API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}