import { useQuery } from '@tanstack/react-query'
import { workspaceUserRolesService } from '@/modules/workspace-user-roles/api/workspace-user-roles.service'
import type { WorkspaceUserRoleFilters } from '@/modules/workspace-user-roles/types/workspace-user-role.types'

export function useWorkspaceUserRolesQuery(filters?: WorkspaceUserRoleFilters) {
  return useQuery({
    queryKey: ['workspace-user-roles', filters],
    queryFn: () => workspaceUserRolesService.list(filters),
  })
}
