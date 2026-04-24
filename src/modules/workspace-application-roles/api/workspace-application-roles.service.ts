import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationRoleDto,
  RolePermissionsTreeResponse,
  UpdateWorkspaceApplicationRoleDto,
  UpdateWorkspaceApplicationRolePermissionsResult,
  WorkspaceApplicationRole,
} from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import type { EntityId } from '@/types/common'
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

export async function getWorkspaceApplicationRolePermissionsTree(id: EntityId) {
  const response = await httpClient.get<ApiSuccessResponse<RolePermissionsTreeResponse>>(
    `/workspace-application-roles/${id}/permissions-tree`,
  )

  return unwrapData<RolePermissionsTreeResponse>(response.data)
}

export async function updateWorkspaceApplicationRolePermissions(
  id: EntityId,
  permissionIds: EntityId[],
) {
  const response = await httpClient.put<
    ApiSuccessResponse<UpdateWorkspaceApplicationRolePermissionsResult>
  >(`/workspace-application-roles/${id}/permissions`, {
    permission_ids: permissionIds,
  })

  return unwrapData<UpdateWorkspaceApplicationRolePermissionsResult>(response.data)
}

export const workspaceApplicationRolesService = {
  list: listWorkspaceApplicationRoles,
  create: createWorkspaceApplicationRole,
  getById: getWorkspaceApplicationRoleById,
  update: updateWorkspaceApplicationRole,
  remove: deleteWorkspaceApplicationRole,
  getPermissionsTree: getWorkspaceApplicationRolePermissionsTree,
  updatePermissions: updateWorkspaceApplicationRolePermissions,
}
