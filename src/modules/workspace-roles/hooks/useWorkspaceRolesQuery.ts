import { useQuery } from '@tanstack/react-query'
import { workspaceRolesService } from '@/modules/workspace-roles/api/workspace-roles.service'
import type { WorkspaceRoleFilters } from '@/modules/workspace-roles/types/workspace-role.types'

export function useWorkspaceRolesQuery(filters?: WorkspaceRoleFilters) {
  return useQuery({
    queryKey: ['workspace-roles', filters],
    queryFn: () => workspaceRolesService.list(filters),
  })
}
