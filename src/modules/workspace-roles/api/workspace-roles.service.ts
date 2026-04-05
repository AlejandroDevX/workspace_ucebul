import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceRoleDto,
  UpdateWorkspaceRoleDto,
  WorkspaceRole,
} from '@/modules/workspace-roles/types/workspace-role.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceRoles() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceRole[]>>('/workspace-roles')
  return unwrapData<WorkspaceRole[]>(response.data)
}

export async function createWorkspaceRole(payload: CreateWorkspaceRoleDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceRole>>(
    '/workspace-roles',
    payload,
  )
  return unwrapData<WorkspaceRole>(response.data)
}

export async function getWorkspaceRoleById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceRole>>(
    `/workspace-roles/${id}`,
  )
  return unwrapData<WorkspaceRole>(response.data)
}

export async function updateWorkspaceRole(
  id: number | string,
  payload: UpdateWorkspaceRoleDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceRole>>(
    `/workspace-roles/${id}`,
    payload,
  )
  return unwrapData<WorkspaceRole>(response.data)
}

export async function deleteWorkspaceRole(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-roles/${id}`)
}

export const workspaceRolesService = {
  list: listWorkspaceRoles,
  create: createWorkspaceRole,
  getById: getWorkspaceRoleById,
  update: updateWorkspaceRole,
  remove: deleteWorkspaceRole,
}
