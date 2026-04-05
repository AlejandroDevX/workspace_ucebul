import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationDto,
  UpdateWorkspaceApplicationDto,
  WorkspaceApplication,
} from '@/modules/workspace-applications/types/workspace-application.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceApplications() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplication[]>>(
    '/workspace-applications',
  )
  return unwrapData<WorkspaceApplication[]>(response.data)
}

export async function createWorkspaceApplication(payload: CreateWorkspaceApplicationDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceApplication>>(
    '/workspace-applications',
    payload,
  )
  return unwrapData<WorkspaceApplication>(response.data)
}

export async function getWorkspaceApplicationById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplication>>(
    `/workspace-applications/${id}`,
  )
  return unwrapData<WorkspaceApplication>(response.data)
}

export async function updateWorkspaceApplication(
  id: number | string,
  payload: UpdateWorkspaceApplicationDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceApplication>>(
    `/workspace-applications/${id}`,
    payload,
  )
  return unwrapData<WorkspaceApplication>(response.data)
}

export async function deleteWorkspaceApplication(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-applications/${id}`)
}

export const workspaceApplicationsService = {
  list: listWorkspaceApplications,
  create: createWorkspaceApplication,
  getById: getWorkspaceApplicationById,
  update: updateWorkspaceApplication,
  remove: deleteWorkspaceApplication,
}
