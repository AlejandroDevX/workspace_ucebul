import { useAuthStore } from '@/store/auth.store'
import type { WorkspaceRole } from '@/types/auth'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const status = useAuthStore((state) => state.status)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)

  return {
    user,
    token,
    status,
    isBootstrapping,
    isAuthenticated: status === 'authenticated' && Boolean(token),
    hasRole(role: WorkspaceRole) {
      return user?.roles.includes(role) ?? false
    },
  }
}
