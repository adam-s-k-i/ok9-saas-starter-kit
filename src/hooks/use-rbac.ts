import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/rbac"

export function useRBAC() {
  const { data: session } = useSession()

  const userRole = session?.user?.role || 'user'

  const hasRole = (requiredRole: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      moderator: 2,
      admin: 3
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  const canCreateUsers = hasRole('admin')
  const canEditUsers = hasRole('moderator')
  const canDeleteUsers = hasRole('admin')
  const canViewUsers = hasRole('moderator')

  const canEditUser = (targetUserId: string, targetUserRole?: UserRole): boolean => {
    // Users can edit themselves
    if (session?.user?.id === targetUserId) {
      return true
    }

    // Admins can edit everyone
    if (userRole === 'admin') {
      return true
    }

    // Moderators can edit users (but not other moderators/admins)
    if (userRole === 'moderator' && targetUserRole === 'user') {
      return true
    }

    return false
  }

  const canDeleteUser = (targetUserId: string): boolean => {
    // Cannot delete yourself
    if (session?.user?.id === targetUserId) {
      return false
    }

    // Only admins can delete users
    return userRole === 'admin'
  }

  return {
    userRole,
    hasRole,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canViewUsers,
    canEditUser,
    canDeleteUser,
  }
}