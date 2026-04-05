import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceRole,
  deleteWorkspaceRole,
  getWorkspaceRoleById,
  listWorkspaceRoles,
  updateWorkspaceRole,
} from '@/modules/workspace-roles/api/workspace-roles.service'
import type {
  CreateWorkspaceRoleDto,
  UpdateWorkspaceRoleDto,
} from '@/modules/workspace-roles/types/workspace-role.types'
import type { EntityId } from '@/types/common'

export const workspaceRolesQueryKey = ['workspace-roles'] as const

export function useWorkspaceRolesQuery() {
  return useQuery({
    queryKey: workspaceRolesQueryKey,
    queryFn: listWorkspaceRoles,
  })
}

export function useWorkspaceRoleQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceRolesQueryKey, id],
    queryFn: () => getWorkspaceRoleById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceRoleDto) => createWorkspaceRole(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceRolesQueryKey })
    },
  })
}

export function useUpdateWorkspaceRoleMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceRoleDto) => updateWorkspaceRole(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceRolesQueryKey }),
        queryClient.invalidateQueries({ queryKey: [...workspaceRolesQueryKey, id] }),
      ])
    },
  })
}

export function useDeleteWorkspaceRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceRole(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceRolesQueryKey }),
        queryClient.removeQueries({ queryKey: [...workspaceRolesQueryKey, id] }),
      ])
    },
  })
}
