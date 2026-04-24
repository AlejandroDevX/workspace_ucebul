import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationPermissionDto,
  CreateWorkspaceApplicationRolePermissionDto,
  CreateWorkspaceUserApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceApplicationRolePermissionDto,
  UpdateWorkspaceUserApplicationPermissionDto,
  WorkspaceApplicationPermission,
  WorkspaceApplicationRolePermission,
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

export async function listWorkspaceApplicationRolePermissions() {
  const response = await httpClient.get<
    ApiSuccessResponse<WorkspaceApplicationRolePermission[]>
  >('/workspace-application-role-permissions')
  return unwrapData<WorkspaceApplicationRolePermission[]>(response.data)
}

export async function createWorkspaceApplicationRolePermission(
  payload: CreateWorkspaceApplicationRolePermissionDto,
) {
  const response = await httpClient.post<
    ApiSuccessResponse<WorkspaceApplicationRolePermission>
  >('/workspace-application-role-permissions', payload)
  return unwrapData<WorkspaceApplicationRolePermission>(response.data)
}

export async function getWorkspaceApplicationRolePermissionById(id: number | string) {
  const response = await httpClient.get<
    ApiSuccessResponse<WorkspaceApplicationRolePermission>
  >(`/workspace-application-role-permissions/${id}`)
  return unwrapData<WorkspaceApplicationRolePermission>(response.data)
}

export async function updateWorkspaceApplicationRolePermission(
  id: number | string,
  payload: UpdateWorkspaceApplicationRolePermissionDto,
) {
  const response = await httpClient.put<
    ApiSuccessResponse<WorkspaceApplicationRolePermission>
  >(`/workspace-application-role-permissions/${id}`, payload)
  return unwrapData<WorkspaceApplicationRolePermission>(response.data)
}

export async function deleteWorkspaceApplicationRolePermission(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(
    `/workspace-application-role-permissions/${id}`,
  )
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

export const workspaceApplicationRolePermissionsService = {
  list: listWorkspaceApplicationRolePermissions,
  create: createWorkspaceApplicationRolePermission,
  getById: getWorkspaceApplicationRolePermissionById,
  update: updateWorkspaceApplicationRolePermission,
  remove: deleteWorkspaceApplicationRolePermission,
}
