import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { hasPermission, permissions, canManageUser, UserRole } from "@/lib/rbac"
import { logAuditEvent } from "@/lib/audit"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check permissions - moderators can edit users, but with restrictions
    const hasEditPermission = await hasPermission(permissions.editUser)
    if (!hasEditPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get target user info for permission check
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can manage this specific user
    const canManage = await canManageUser(id, targetUser.role as UserRole)
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, role, status } = body

    // Additional check: only admins can change roles
    if (role !== undefined) {
      const hasRoleChangePermission = await hasPermission(permissions.createUser) // Same as create user permission
      if (!hasRoleChangePermission) {
        return NextResponse.json({ error: "Forbidden: Cannot change user roles" }, { status: 403 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      }
    })

    // Log audit event
    await logAuditEvent({
      action: 'user_update',
      resource: 'users',
      resourceId: id,
      details: {
        changes: {
          ...(name !== undefined && { name }),
          ...(role !== undefined && { role }),
          ...(status !== undefined && { status }),
        },
        email: updatedUser.email,
      },
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check permissions - only admins can delete users
    const hasDeletePermission = await hasPermission(permissions.deleteUser)
    if (!hasDeletePermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user exists and is not trying to delete themselves
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    })

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userToDelete.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    // Store user info for audit log before deletion
    const userInfo = {
      email: userToDelete.email,
      name: userToDelete.name,
      role: userToDelete.role,
      status: userToDelete.status,
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id }
    })

    // Log audit event
    await logAuditEvent({
      action: 'user_delete',
      resource: 'users',
      resourceId: id,
      details: userInfo,
    })

    return NextResponse.json({ message: "User deleted successfully" })

  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}