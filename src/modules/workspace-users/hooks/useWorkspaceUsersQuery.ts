import { useQuery } from '@tanstack/react-query'
import { workspaceUsersService } from '@/modules/workspace-users/api/workspace-users.service'
import type { WorkspaceUserFilters } from '@/modules/workspace-users/types/workspace-user.types'

export function useWorkspaceUsersQuery(filters?: WorkspaceUserFilters) {
  return useQuery({
    queryKey: ['workspace-users', filters],
    queryFn: () => workspaceUsersService.list(filters),
  })
}
