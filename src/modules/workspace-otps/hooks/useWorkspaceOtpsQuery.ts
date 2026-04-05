import { useQuery } from '@tanstack/react-query'
import { workspaceOtpsService } from '@/modules/workspace-otps/api/workspace-otps.service'
import type { WorkspaceOtpFilters } from '@/modules/workspace-otps/types/workspace-otp.types'

export function useWorkspaceOtpsQuery(filters?: WorkspaceOtpFilters) {
  return useQuery({
    queryKey: ['workspace-otps', filters],
    queryFn: () => workspaceOtpsService.list(filters),
  })
}
