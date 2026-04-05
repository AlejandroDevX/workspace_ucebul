import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceApplication,
  deleteWorkspaceApplication,
  getWorkspaceApplicationById,
  listWorkspaceApplications,
  updateWorkspaceApplication,
} from '@/modules/workspace-applications/api/workspace-applications.service'
import type {
  CreateWorkspaceApplicationDto,
  UpdateWorkspaceApplicationDto,
} from '@/modules/workspace-applications/types/workspace-application.types'
import type { EntityId } from '@/types/common'

export const workspaceApplicationsQueryKey = ['workspace-applications'] as const

export function useWorkspaceApplicationsQuery() {
  return useQuery({
    queryKey: workspaceApplicationsQueryKey,
    queryFn: listWorkspaceApplications,
  })
}

export function useWorkspaceApplicationQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceApplicationsQueryKey, id],
    queryFn: () => getWorkspaceApplicationById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceApplicationDto) =>
      createWorkspaceApplication(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceApplicationsQueryKey })
    },
  })
}

export function useUpdateWorkspaceApplicationMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceApplicationDto) =>
      updateWorkspaceApplication(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceApplicationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceApplicationsQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceApplication(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceApplicationsQueryKey }),
        queryClient.removeQueries({ queryKey: [...workspaceApplicationsQueryKey, id] }),
      ])
    },
  })
}
