import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceApplicationRole,
  deleteWorkspaceApplicationRole,
  getWorkspaceApplicationRoleById,
  listWorkspaceApplicationRoles,
  updateWorkspaceApplicationRole,
} from '@/modules/workspace-application-roles/api/workspace-application-roles.service'
import type {
  CreateWorkspaceApplicationRoleDto,
  UpdateWorkspaceApplicationRoleDto,
} from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import type { EntityId } from '@/types/common'

export const workspaceApplicationRolesQueryKey = ['workspace-application-roles'] as const

export function useWorkspaceApplicationRolesQuery() {
  return useQuery({
    queryKey: workspaceApplicationRolesQueryKey,
    queryFn: listWorkspaceApplicationRoles,
  })
}

export function useWorkspaceApplicationRolesByApplicationQuery(
  workspaceApplicationId?: EntityId,
) {
  return useQuery({
    queryKey: [
      ...workspaceApplicationRolesQueryKey,
      'by-application',
      workspaceApplicationId,
    ],
    queryFn: listWorkspaceApplicationRoles,
    enabled:
      workspaceApplicationId !== undefined &&
      workspaceApplicationId !== null &&
      workspaceApplicationId !== '',
    select: (items) =>
      items.filter(
        (item) =>
          String(item.workspace_application_role_workspace_application_id) ===
          String(workspaceApplicationId),
      ),
  })
}

export function useWorkspaceApplicationRoleQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceApplicationRolesQueryKey, id],
    queryFn: () => getWorkspaceApplicationRoleById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceApplicationRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceApplicationRoleDto) =>
      createWorkspaceApplicationRole(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceApplicationRolesQueryKey,
      })
    },
  })
}

export function useUpdateWorkspaceApplicationRoleMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceApplicationRoleDto) =>
      updateWorkspaceApplicationRole(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationRolesQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceApplicationRolesQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceApplicationRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceApplicationRole(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationRolesQueryKey,
        }),
        queryClient.removeQueries({
          queryKey: [...workspaceApplicationRolesQueryKey, id],
        }),
      ])
    },
  })
}
