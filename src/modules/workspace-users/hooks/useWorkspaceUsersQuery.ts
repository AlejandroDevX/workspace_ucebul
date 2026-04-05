import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspaceUser,
  deleteWorkspaceUser,
  getWorkspaceUserById,
  listWorkspaceUsers,
  updateWorkspaceUser,
} from '@/modules/workspace-users/api/workspace-users.service'
import type {
  CreateWorkspaceUserDto,
  UpdateWorkspaceUserDto,
} from '@/modules/workspace-users/types/workspace-user.types'
import type { EntityId } from '@/types/common'

export const workspaceUsersQueryKey = ['workspace-users'] as const

export function useWorkspaceUsersQuery() {
  return useQuery({
    queryKey: workspaceUsersQueryKey,
    queryFn: listWorkspaceUsers,
  })
}

export function useWorkspaceUserQuery(id?: EntityId) {
  return useQuery({
    queryKey: [...workspaceUsersQueryKey, id],
    queryFn: () => getWorkspaceUserById(id!),
    enabled: id !== undefined && id !== null && id !== '',
  })
}

export function useCreateWorkspaceUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspaceUserDto) => createWorkspaceUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceUsersQueryKey })
    },
  })
}

export function useUpdateWorkspaceUserMutation(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspaceUserDto) => updateWorkspaceUser(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUsersQueryKey }),
        queryClient.invalidateQueries({ queryKey: [...workspaceUsersQueryKey, id] }),
      ])
    },
  })
}

export function useDeleteWorkspaceUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => deleteWorkspaceUser(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceUsersQueryKey }),
        queryClient.removeQueries({ queryKey: [...workspaceUsersQueryKey, id] }),
      ])
    },
  })
}
