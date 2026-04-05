import type { PropsWithChildren, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { WorkspaceRole } from '@/types/auth'

interface AccessGuardProps extends PropsWithChildren {
  allowedRoles: WorkspaceRole[]
  fallback?: ReactNode
}

export function AccessGuard({
  allowedRoles,
  fallback = null,
  children,
}: AccessGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return fallback
  }

  const hasAccess = allowedRoles.some((role) => user.roles.includes(role))

  return hasAccess ? children : fallback
}
