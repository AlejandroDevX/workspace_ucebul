import { useAuthStore } from '@/store/auth.store'
import type { WorkspaceRole } from '@/types/auth'
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission as hasGroupedPermission,
} from '@/utils/permissions'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const status = useAuthStore((state) => state.status)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)
  const currentApplication = useAuthStore((state) => state.currentApplication)
  const currentApplicationAccess = useAuthStore(
    (state) => state.currentApplicationAccess,
  )
  const currentApplicationPermissions = useAuthStore(
    (state) => state.currentApplicationPermissions,
  )
  const workspaceModules = useAuthStore((state) => state.workspaceModules)
  const activePermissions =
    currentApplication && currentApplicationAccess
      ? currentApplicationPermissions
      : workspaceModules

  return {
    user,
    token,
    status,
    isBootstrapping,
    currentApplication,
    currentApplicationAccess,
    currentApplicationPermissions,
    workspaceModules,
    isAuthenticated: status === 'authenticated' && Boolean(token),
    hasRole(role: WorkspaceRole) {
      return user?.roles.includes(role) ?? false
    },
    hasPermission(permissionSlug: string) {
      return hasGroupedPermission(activePermissions, permissionSlug)
    },
    hasAnyPermission(permissionSlugs: string[]) {
      return hasAnyPermission(activePermissions, permissionSlugs)
    },
    hasAllPermissions(permissionSlugs: string[]) {
      return hasAllPermissions(activePermissions, permissionSlugs)
    },
  }
}
