import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceUserRole,
  deleteWorkspaceUserRole,
  getWorkspaceUserRoleById,
  listWorkspaceUserRoles,
  updateWorkspaceUserRole,
} from '@/modules/workspace-user-roles/api/workspace-user-roles.service'
import type {
  CreateWorkspaceUserRoleDto,
  UpdateWorkspaceUserRoleDto,
} from '@/modules/workspace-user-roles/types/workspace-user-role.types'
import type { EntityId } from '@/types/common'

export const workspaceUserRolesQueryKey = ['workspace-user-roles'] as const

export function useWorkspaceUserRolesQuery() {
  return useQuery({
    queryKey: workspaceUserRolesQueryKey,
    queryFn: listWorkspaceUserRoles,
  })
}

export function useWorkspaceUserRoleQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceUserRolesQueryKey, id],
    queryFn: () => getWorkspaceUserRoleById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceUserRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceUserRoleDto) => createWorkspaceUserRole(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceUserRolesQueryKey })
    },
  })
}

export function useUpdateWorkspaceUserRoleMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceUserRoleDto) => updateWorkspaceUserRole(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUserRolesQueryKey }),
        queryClient.invalidateQueries({ queryKey: [...workspaceUserRolesQueryKey, id] }),
      ])
    },
  })
}

export function useDeleteWorkspaceUserRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceUserRole(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUserRolesQueryKey }),
        queryClient.removeQueries({ queryKey: [...workspaceUserRolesQueryKey, id] }),
      ])
    },
  })
}
