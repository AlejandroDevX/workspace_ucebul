import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createApplicationModule,
  deleteApplicationModule,
  getApplicationModuleById,
  getApplicationModules,
  updateApplicationModule,
} from '@/modules/workspace-application-modules/api/workspace-application-modules.service'
import type {
  CreateWorkspaceApplicationModuleDto,
  UpdateWorkspaceApplicationModuleDto,
  WorkspaceApplicationModuleFilters,
} from '@/modules/workspace-application-modules/types/workspace-application-module.types'
import type { EntityId } from '@/types/common'

export const workspaceApplicationModulesQueryKey = [
  'workspace-application-modules',
] as const

export function useWorkspaceApplicationModulesQuery(
  filters?: WorkspaceApplicationModuleFilters,
) {
  return useQuery({
    queryKey: [...workspaceApplicationModulesQueryKey, filters],
    queryFn: () => getApplicationModules(filters),
  })
}

export function useWorkspaceApplicationModuleQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceApplicationModulesQueryKey, id],
    queryFn: () => getApplicationModuleById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceApplicationModuleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceApplicationModuleDto) =>
      createApplicationModule(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceApplicationModulesQueryKey,
      })
    },
  })
}

export function useUpdateWorkspaceApplicationModuleMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceApplicationModuleDto) =>
      updateApplicationModule(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationModulesQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceApplicationModulesQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceApplicationModuleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteApplicationModule(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationModulesQueryKey,
        }),
        queryClient.removeQueries({
          queryKey: [...workspaceApplicationModulesQueryKey, id],
        }),
      ])
    },
  })
}
