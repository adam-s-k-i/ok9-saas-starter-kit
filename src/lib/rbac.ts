import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export type UserRole = 'admin' | 'moderator' | 'user'

export interface PermissionCheck {
  userId?: string
  requiredRole?: UserRole
  allowSelf?: boolean
}

/**
 * Check if the current user has permission for an action
 */
export async function hasPermission(check: PermissionCheck): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return false
    }

    const userRole = session.user.role || 'user'
    const userId = session.user.id

    // Admins have all permissions
    if (userRole === 'admin') {
      return true
    }

    // Check required role
    if (check.requiredRole) {
      if (userRole === 'user' && check.requiredRole !== 'user') {
        return false
      }
      if (userRole === 'moderator' && check.requiredRole === 'admin') {
        return false
      }
    }

    // Allow self-operation if specified
    if (check.allowSelf && check.userId && check.userId === userId) {
      return true
    }

    return false
  } catch (error) {
    console.error('Permission check error:', error)
    return false
  }
}

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export function getRoleLevel(role: UserRole): number {
  switch (role) {
    case 'admin': return 3
    case 'moderator': return 2
    case 'user': return 1
    default: return 0
  }
}

/**
 * Check if user can perform action on another user
 */
export async function canManageUser(targetUserId: string, targetUserRole?: UserRole): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return false
  }

  const currentUserRole = session.user.role || 'user'
  const currentUserId = session.user.id

  // Users can manage themselves (but limited actions)
  if (currentUserId === targetUserId) {
    return true
  }

  // Admins can manage everyone
  if (currentUserRole === 'admin') {
    return true
  }

  // Moderators can manage users (but not other moderators or admins)
  if (currentUserRole === 'moderator') {
    return targetUserRole === 'user'
  }

  // Users can only manage themselves
  return false
}

/**
 * Permission presets for common operations
 */
export const permissions = {
  // User management
  createUser: { requiredRole: 'admin' as UserRole },
  editUser: { requiredRole: 'moderator' as UserRole, allowSelf: true },
  deleteUser: { requiredRole: 'admin' as UserRole },
  viewUsers: { requiredRole: 'moderator' as UserRole },

  // Self operations (users can edit their own profile)
  editOwnProfile: { allowSelf: true },
  deleteOwnAccount: { allowSelf: true },
}