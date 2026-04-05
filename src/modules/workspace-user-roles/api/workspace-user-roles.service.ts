import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceUserRoleDto,
  UpdateWorkspaceUserRoleDto,
  WorkspaceUserRole,
} from '@/modules/workspace-user-roles/types/workspace-user-role.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceUserRoles() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUserRole[]>>(
    '/workspace-user-roles',
  )
  return unwrapData<WorkspaceUserRole[]>(response.data)
}

export async function createWorkspaceUserRole(payload: CreateWorkspaceUserRoleDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceUserRole>>(
    '/workspace-user-roles',
    payload,
  )
  return unwrapData<WorkspaceUserRole>(response.data)
}

export async function getWorkspaceUserRoleById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUserRole>>(
    `/workspace-user-roles/${id}`,
  )
  return unwrapData<WorkspaceUserRole>(response.data)
}

export async function updateWorkspaceUserRole(
  id: number | string,
  payload: UpdateWorkspaceUserRoleDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceUserRole>>(
    `/workspace-user-roles/${id}`,
    payload,
  )
  return unwrapData<WorkspaceUserRole>(response.data)
}

export async function deleteWorkspaceUserRole(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-user-roles/${id}`)
}

export const workspaceUserRolesService = {
  list: listWorkspaceUserRoles,
  create: createWorkspaceUserRole,
  getById: getWorkspaceUserRoleById,
  update: updateWorkspaceUserRole,
  remove: deleteWorkspaceUserRole,
}
