import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceUserApplicationDto,
  EffectivePermissionsTree,
  UpdateWorkspaceUserApplicationDto,
  UpdateUserPermissionOverridesPayload,
  WorkspaceUserApplication,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceUserApplications() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUserApplication[]>>(
    '/workspace-user-applications',
  )
  return unwrapData<WorkspaceUserApplication[]>(response.data)
}

export async function createWorkspaceUserApplication(
  payload: CreateWorkspaceUserApplicationDto,
) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceUserApplication>>(
    '/workspace-user-applications',
    payload,
  )
  return unwrapData<WorkspaceUserApplication>(response.data)
}

export async function getWorkspaceUserApplicationById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceUserApplication>>(
    `/workspace-user-applications/${id}`,
  )
  return unwrapData<WorkspaceUserApplication>(response.data)
}

export async function updateWorkspaceUserApplication(
  id: number | string,
  payload: UpdateWorkspaceUserApplicationDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceUserApplication>>(
    `/workspace-user-applications/${id}`,
    payload,
  )
  return unwrapData<WorkspaceUserApplication>(response.data)
}

export async function deleteWorkspaceUserApplication(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-user-applications/${id}`)
}

export async function getUserEffectivePermissionsTree(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<EffectivePermissionsTree>>(
    `/workspace-user-applications/${id}/effective-permissions-tree`,
  )

  return unwrapData<EffectivePermissionsTree>(response.data)
}

export async function updateUserPermissionOverrides(
  id: number | string,
  payload: UpdateUserPermissionOverridesPayload,
) {
  const response = await httpClient.put<
    ApiSuccessResponse<UpdateUserPermissionOverridesPayload>
  >(`/workspace-user-applications/${id}/permission-overrides`, payload)

  return unwrapData<UpdateUserPermissionOverridesPayload>(response.data)
}

export const workspaceUserApplicationsService = {
  list: listWorkspaceUserApplications,
  create: createWorkspaceUserApplication,
  getById: getWorkspaceUserApplicationById,
  update: updateWorkspaceUserApplication,
  remove: deleteWorkspaceUserApplication,
  getEffectivePermissionsTree: getUserEffectivePermissionsTree,
  updatePermissionOverrides: updateUserPermissionOverrides,
}
