import { Navigate, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'
import type { WorkspaceRole } from '@/types/auth'
import { hasAllowedRole } from '@/utils/roles'

interface RoleRouteProps {
  allowedRoles: WorkspaceRole[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!hasAllowedRole(user, allowedRoles)) {
    return <Navigate to={APP_ROUTES.unauthorized} replace />
  }

  return <Outlet />
}
