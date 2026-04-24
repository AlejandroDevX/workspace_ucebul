import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationRoleDto,
  UpdateWorkspaceApplicationRoleDto,
  WorkspaceApplicationRole,
} from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceApplicationRoles() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationRole[]>>(
    '/workspace-application-roles',
  )
  return unwrapData<WorkspaceApplicationRole[]>(response.data)
}

export async function createWorkspaceApplicationRole(
  payload: CreateWorkspaceApplicationRoleDto,
) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceApplicationRole>>(
    '/workspace-application-roles',
    payload,
  )
  return unwrapData<WorkspaceApplicationRole>(response.data)
}

export async function getWorkspaceApplicationRoleById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationRole>>(
    `/workspace-application-roles/${id}`,
  )
  return unwrapData<WorkspaceApplicationRole>(response.data)
}

export async function updateWorkspaceApplicationRole(
  id: number | string,
  payload: UpdateWorkspaceApplicationRoleDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceApplicationRole>>(
    `/workspace-application-roles/${id}`,
    payload,
  )
  return unwrapData<WorkspaceApplicationRole>(response.data)
}

export async function deleteWorkspaceApplicationRole(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-application-roles/${id}`)
}

export const workspaceApplicationRolesService = {
  list: listWorkspaceApplicationRoles,
  create: createWorkspaceApplicationRole,
  getById: getWorkspaceApplicationRoleById,
  update: updateWorkspaceApplicationRole,
  remove: deleteWorkspaceApplicationRole,
}
