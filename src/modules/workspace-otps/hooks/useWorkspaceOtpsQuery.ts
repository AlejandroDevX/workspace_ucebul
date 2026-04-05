import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteWorkspaceOtp,
  getWorkspaceOtpById,
  listWorkspaceOtps,
} from '@/modules/workspace-otps/api/workspace-otps.service'
import type { EntityId } from '@/types/common'

export const workspaceOtpsQueryKey = ['workspace-otps'] as const

export function useWorkspaceOtpsQuery() {
  return useQuery({
    queryKey: workspaceOtpsQueryKey,
    queryFn: listWorkspaceOtps,
  })
}

export function useWorkspaceOtpQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceOtpsQueryKey, id],
    queryFn: () => getWorkspaceOtpById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useDeleteWorkspaceOtpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceOtp(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceOtpsQueryKey }),
        queryClient.removeQueries({ queryKey: [...workspaceOtpsQueryKey, id] }),
      ])
    },
  })
}
