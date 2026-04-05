import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceUserDto,
  UpdateWorkspaceUserDto,
  WorkspaceUser,
} from '@/modules/workspace-users/types/workspace-user.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceUsers() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUser[]>>('/workspace-users')
  return unwrapData<WorkspaceUser[]>(response.data)
}

export async function createWorkspaceUser(payload: CreateWorkspaceUserDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceUser>>(
    '/workspace-users',
    payload,
  )
  return unwrapData<WorkspaceUser>(response.data)
}

export async function getWorkspaceUserById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUser>>(
    `/workspace-users/${id}`,
  )
  return unwrapData<WorkspaceUser>(response.data)
}

export async function updateWorkspaceUser(
  id: number | string,
  payload: UpdateWorkspaceUserDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceUser>>(
    `/workspace-users/${id}`,
    payload,
  )
  return unwrapData<WorkspaceUser>(response.data)
}

export async function deleteWorkspaceUser(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-users/${id}`)
}

export const workspaceUsersService = {
  list: listWorkspaceUsers,
  create: createWorkspaceUser,
  getById: getWorkspaceUserById,
  update: updateWorkspaceUser,
  remove: deleteWorkspaceUser,
}
