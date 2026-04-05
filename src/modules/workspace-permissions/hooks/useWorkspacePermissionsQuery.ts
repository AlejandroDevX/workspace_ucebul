import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceApplicationPermission,
  createWorkspaceUserApplicationPermission,
  deleteWorkspaceApplicationPermission,
  deleteWorkspaceUserApplicationPermission,
  getWorkspaceApplicationPermissionById,
  getWorkspaceUserApplicationPermissionById,
  workspaceApplicationPermissionsService,
  workspaceUserApplicationPermissionsService,
  updateWorkspaceApplicationPermission,
  updateWorkspaceUserApplicationPermission,
} from '@/modules/workspace-permissions/api/workspace-permissions.service'
import type {
  CreateWorkspaceApplicationPermissionDto,
  CreateWorkspaceUserApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceUserApplicationPermissionDto,
  WorkspaceUserApplicationPermission,
} from '@/modules/workspace-permissions/types/workspace-permission.types'
import { workspaceUserApplicationsQueryKey } from '@/modules/workspace-user-applications/hooks/useWorkspaceUserApplicationsQuery'
import type { EntityId } from '@/types/common'

export const workspaceApplicationPermissionsQueryKey = [
  'workspace-application-permissions',
] as const
export const workspaceUserApplicationPermissionsQueryKey = [
  'workspace-user-application-permissions',
] as const

export function useWorkspaceApplicationPermissionsQuery() {
  return useQuery({
    queryKey: workspaceApplicationPermissionsQueryKey,
    queryFn: workspaceApplicationPermissionsService.list,
  })
}

export function useWorkspaceApplicationPermissionQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceApplicationPermissionsQueryKey, id],
    queryFn: () => getWorkspaceApplicationPermissionById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceApplicationPermissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceApplicationPermissionDto) =>
      createWorkspaceApplicationPermission(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceApplicationPermissionsQueryKey,
      })
    },
  })
}

export function useUpdateWorkspaceApplicationPermissionMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceApplicationPermissionDto) =>
      updateWorkspaceApplicationPermission(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationPermissionsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceApplicationPermissionsQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceApplicationPermissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceApplicationPermission(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceApplicationPermissionsQueryKey,
        }),
        queryClient.removeQueries({
          queryKey: [...workspaceApplicationPermissionsQueryKey, id],
        }),
      ])
    },
  })
}

export function useWorkspaceUserApplicationPermissionsQuery() {
  return useQuery({
    queryKey: workspaceUserApplicationPermissionsQueryKey,
    queryFn: workspaceUserApplicationPermissionsService.list,
  })
}

export function useWorkspaceApplicationPermissionsByApplicationQuery(
  workspaceApplicationId?: EntityId,
) {
  return useQuery({
    queryKey: [
      ...workspaceApplicationPermissionsQueryKey,
      'by-application',
      workspaceApplicationId,
    ],
    queryFn: workspaceApplicationPermissionsService.list,
    enabled:
      workspaceApplicationId !== undefined &&
      workspaceApplicationId !== null &&
      workspaceApplicationId !== '',
    select: (items) =>
      items.filter(
        (item) =>
          String(item.workspace_application_permission_workspace_application_id) ===
          String(workspaceApplicationId),
      ),
  })
}

export function useWorkspaceUserApplicationPermissionsByAccessQuery(
  workspaceUserApplicationId?: EntityId,
) {
  return useQuery({
    queryKey: [
      ...workspaceUserApplicationPermissionsQueryKey,
      'by-access',
      workspaceUserApplicationId,
    ],
    queryFn: workspaceUserApplicationPermissionsService.list,
    enabled:
      workspaceUserApplicationId !== undefined &&
      workspaceUserApplicationId !== null &&
      workspaceUserApplicationId !== '',
    select: (items) =>
      items.filter(
        (item) =>
          String(item.workspace_user_application_permission_wua_id) ===
          String(workspaceUserApplicationId),
      ),
  })
}

export function useWorkspaceUserApplicationPermissionQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceUserApplicationPermissionsQueryKey, id],
    queryFn: () => getWorkspaceUserApplicationPermissionById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceUserApplicationPermissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceUserApplicationPermissionDto) =>
      createWorkspaceUserApplicationPermission(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceUserApplicationPermissionsQueryKey,
      })
    },
  })
}

export function useUpdateWorkspaceUserApplicationPermissionMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceUserApplicationPermissionDto) =>
      updateWorkspaceUserApplicationPermission(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceUserApplicationPermissionsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [...workspaceUserApplicationPermissionsQueryKey, id],
        }),
      ])
    },
  })
}

export function useDeleteWorkspaceUserApplicationPermissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceUserApplicationPermission(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceUserApplicationPermissionsQueryKey,
        }),
        queryClient.removeQueries({
          queryKey: [...workspaceUserApplicationPermissionsQueryKey, id],
        }),
      ])
    },
  })
}

interface SyncWorkspaceUserApplicationPermissionsPayload {
  workspaceUserApplicationId: EntityId
  currentAssignments: WorkspaceUserApplicationPermission[]
  selectedPermissionIds: string[]
}

export function useSyncWorkspaceUserApplicationPermissionsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceUserApplicationId,
      currentAssignments,
      selectedPermissionIds,
    }: SyncWorkspaceUserApplicationPermissionsPayload) => {
      const selectedIds = new Set(selectedPermissionIds.map((item) => String(item)))
      const currentMap = new Map(
        currentAssignments.map((assignment) => [
          String(assignment.workspace_user_application_permission_wap_id),
          assignment,
        ]),
      )

      const assignmentsToCreate = [...selectedIds].filter((permissionId) => !currentMap.has(permissionId))
      const assignmentsToDelete = currentAssignments.filter(
        (assignment) =>
          !selectedIds.has(String(assignment.workspace_user_application_permission_wap_id)),
      )

      await Promise.all([
        ...assignmentsToCreate.map((permissionId) =>
          createWorkspaceUserApplicationPermission({
            workspace_user_application_permission_wua_id: String(
              workspaceUserApplicationId,
            ),
            workspace_user_application_permission_wap_id: permissionId,
          }),
        ),
        ...assignmentsToDelete.map((assignment) =>
          deleteWorkspaceUserApplicationPermission(
            assignment.workspace_user_application_permission_id,
          ),
        ),
      ])
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceUserApplicationPermissionsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: workspaceUserApplicationsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [
            ...workspaceUserApplicationPermissionsQueryKey,
            'by-access',
            variables.workspaceUserApplicationId,
          ],
        }),
      ])
    },
  })
}
