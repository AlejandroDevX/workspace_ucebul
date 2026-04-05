import { useQuery } from '@tanstack/react-query'
import {
  workspaceApplicationPermissionsService,
  workspaceUserApplicationPermissionsService,
} from '@/modules/workspace-permissions/api/workspace-permissions.service'
import type { WorkspacePermissionFilters } from '@/modules/workspace-permissions/types/workspace-permission.types'

export function useWorkspaceApplicationPermissionsQuery(
  filters?: WorkspacePermissionFilters,
) {
  return useQuery({
    queryKey: ['workspace-application-permissions', filters],
    queryFn: () => workspaceApplicationPermissionsService.list(filters),
  })
}

export function useWorkspaceUserApplicationPermissionsQuery(
  filters?: WorkspacePermissionFilters,
) {
  return useQuery({
    queryKey: ['workspace-user-application-permissions', filters],
    queryFn: () => workspaceUserApplicationPermissionsService.list(filters),
  })
}
