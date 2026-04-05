import { useQuery } from '@tanstack/react-query'
import { workspaceApplicationsService } from '@/modules/workspace-applications/api/workspace-applications.service'
import type { WorkspaceApplicationFilters } from '@/modules/workspace-applications/types/workspace-application.types'

export function useWorkspaceApplicationsQuery(filters?: WorkspaceApplicationFilters) {
  return useQuery({
    queryKey: ['workspace-applications', filters],
    queryFn: () => workspaceApplicationsService.list(filters),
  })
}
