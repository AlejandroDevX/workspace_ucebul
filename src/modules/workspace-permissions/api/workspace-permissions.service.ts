import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationPermissionDto,
  CreateWorkspaceUserApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceUserApplicationPermissionDto,
  WorkspaceApplicationPermission,
  WorkspaceUserApplicationPermission,
} from '@/modules/workspace-permissions/types/workspace-permission.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceApplicationPermissions() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationPermission[]>>(
    '/workspace-application-permissions',
  )
  return unwrapData<WorkspaceApplicationPermission[]>(response.data)
}

export async function createWorkspaceApplicationPermission(
  payload: CreateWorkspaceApplicationPermissionDto,
) {
  const response = await httpClient.post<
    ApiSuccessResponse<WorkspaceApplicationPermission>
  >('/workspace-application-permissions', payload)
  return unwrapData<WorkspaceApplicationPermission>(response.data)
}

export async function getWorkspaceApplicationPermissionById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationPermission>>(
    `/workspace-application-permissions/${id}`,
  )
  return unwrapData<WorkspaceApplicationPermission>(response.data)
}

export async function updateWorkspaceApplicationPermission(
  id: number | string,
  payload: UpdateWorkspaceApplicationPermissionDto,
) {
  const response = await httpClient.put<
    ApiSuccessResponse<WorkspaceApplicationPermission>
  >(`/workspace-application-permissions/${id}`, payload)
  return unwrapData<WorkspaceApplicationPermission>(response.data)
}

export async function deleteWorkspaceApplicationPermission(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(
    `/workspace-application-permissions/${id}`,
  )
}

export async function listWorkspaceUserApplicationPermissions() {
  const response = await httpClient.get<
    ApiSuccessResponse<WorkspaceUserApplicationPermission[]>
  >('/workspace-user-application-permissions')
  return unwrapData<WorkspaceUserApplicationPermission[]>(response.data)
}

export async function createWorkspaceUserApplicationPermission(
  payload: CreateWorkspaceUserApplicationPermissionDto,
) {
  const response = await httpClient.post<
    ApiSuccessResponse<WorkspaceUserApplicationPermission>
  >('/workspace-user-application-permissions', payload)
  return unwrapData<WorkspaceUserApplicationPermission>(response.data)
}

export async function getWorkspaceUserApplicationPermissionById(id: number | string) {
  const response = await httpClient.get<
    ApiSuccessResponse<WorkspaceUserApplicationPermission>
  >(`/workspace-user-application-permissions/${id}`)
  return unwrapData<WorkspaceUserApplicationPermission>(response.data)
}

export async function updateWorkspaceUserApplicationPermission(
  id: number | string,
  payload: UpdateWorkspaceUserApplicationPermissionDto,
) {
  const response = await httpClient.put<
    ApiSuccessResponse<WorkspaceUserApplicationPermission>
  >(`/workspace-user-application-permissions/${id}`, payload)
  return unwrapData<WorkspaceUserApplicationPermission>(response.data)
}

export async function deleteWorkspaceUserApplicationPermission(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(
    `/workspace-user-application-permissions/${id}`,
  )
}

export const workspaceApplicationPermissionsService = {
  list: listWorkspaceApplicationPermissions,
  create: createWorkspaceApplicationPermission,
  getById: getWorkspaceApplicationPermissionById,
  update: updateWorkspaceApplicationPermission,
  remove: deleteWorkspaceApplicationPermission,
}

export const workspaceUserApplicationPermissionsService = {
  list: listWorkspaceUserApplicationPermissions,
  create: createWorkspaceUserApplicationPermission,
  getById: getWorkspaceUserApplicationPermissionById,
  update: updateWorkspaceUserApplicationPermission,
  remove: deleteWorkspaceUserApplicationPermission,
}
