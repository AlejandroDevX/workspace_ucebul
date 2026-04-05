import type { AuthUser, WorkspaceRole } from '@/types/auth'

export function hasAllowedRole(user: AuthUser | null, allowedRoles: WorkspaceRole[]) {
  if (!user) {
    return false
  }

  return allowedRoles.some((role) => user.roles.includes(role))
}
