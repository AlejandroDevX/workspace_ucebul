import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceUserApplication,
  deleteWorkspaceUserApplication,
  getUserEffectivePermissionsTree,
  getWorkspaceUserApplicationById,
  listWorkspaceUserApplications,
  updateUserPermissionOverrides,
  updateWorkspaceUserApplication,
} from '@/modules/workspace-user-applications/api/workspace-user-applications.service'
import type {
  CreateWorkspaceUserApplicationDto,
  UpdateUserPermissionOverridesPayload,
  UpdateWorkspaceUserApplicationDto,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import type { EntityId } from '@/types/common'

export const workspaceUserApplicationsQueryKey = ['workspace-user-applications'] as const

export function useWorkspaceUserApplicationsQuery() {
  return useQuery({
    queryKey: workspaceUserApplicationsQueryKey,
    queryFn: listWorkspaceUserApplications,
  })
}

export function useWorkspaceUserApplicationQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceUserApplicationsQueryKey, id],
    queryFn: () => getWorkspaceUserApplicationById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useUserEffectivePermissionsTreeQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceUserApplicationsQueryKey, id, 'effective-permissions-tree'],
    queryFn: () => getUserEffectivePermissionsTree(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useUpdateUserPermissionOverridesMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPermissionOverridesPayload) =>
      updateUserPermissionOverrides(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUserApplicationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceUserApplicationsQueryKey, id],
        }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceUserApplicationsQueryKey, id, 'effective-permissions-tree'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['workspace-user-application-permissions'],
        }),
      ])
    },
  })
}

export function useCreateWorkspaceUserApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceUserApplicationDto) =>
      createWorkspaceUserApplication(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceUserApplicationsQueryKey })
    },
  })
}

export function useUpdateWorkspaceUserApplicationMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceUserApplicationDto) =>
      updateWorkspaceUserApplication(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUserApplicationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceUserApplicationsQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceUserApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceUserApplication(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUserApplicationsQueryKey }),
        queryClient.removeQueries({
          queryKey: [...workspaceUserApplicationsQueryKey, id],
        }),
      ])
    },
  })
}
