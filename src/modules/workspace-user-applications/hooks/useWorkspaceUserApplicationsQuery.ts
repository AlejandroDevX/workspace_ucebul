import { useQuery } from '@tanstack/react-query'
import { workspaceUserApplicationsService } from '@/modules/workspace-user-applications/api/workspace-user-applications.service'
import type { WorkspaceUserApplicationFilters } from '@/modules/workspace-user-applications/types/workspace-user-application.types'

export function useWorkspaceUserApplicationsQuery(
  filters?: WorkspaceUserApplicationFilters,
) {
  return useQuery({
    queryKey: ['workspace-user-applications', filters],
    queryFn: () => workspaceUserApplicationsService.list(filters),
  })
}
