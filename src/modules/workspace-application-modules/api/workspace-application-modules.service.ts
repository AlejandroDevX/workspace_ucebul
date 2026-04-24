import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  CreateWorkspaceApplicationModuleDto,
  UpdateWorkspaceApplicationModuleDto,
  WorkspaceApplicationModule,
  WorkspaceApplicationModuleFilters,
} from '@/modules/workspace-application-modules/types/workspace-application-module.types'
import { unwrapData } from '@/utils/api-response'
import { sanitizeQueryParams } from '@/utils/query-params'

const resourcePath = '/workspace-application-modules'

export async function getApplicationModules(filters?: WorkspaceApplicationModuleFilters) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationModule[]>>(
    resourcePath,
    {
      params: sanitizeQueryParams(filters),
    },
  )

  return unwrapData<WorkspaceApplicationModule[]>(response.data)
}

export async function getApplicationModuleById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceApplicationModule>>(
    `${resourcePath}/${id}`,
  )

  return unwrapData<WorkspaceApplicationModule>(response.data)
}

export async function createApplicationModule(payload: CreateWorkspaceApplicationModuleDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceApplicationModule>>(
    resourcePath,
    payload,
  )

  return unwrapData<WorkspaceApplicationModule>(response.data)
}

export async function updateApplicationModule(
  id: number | string,
  payload: UpdateWorkspaceApplicationModuleDto,
) {
  const response = await httpClient.put<ApiSuccessResponse<WorkspaceApplicationModule>>(
    `${resourcePath}/${id}`,
    payload,
  )

  return unwrapData<WorkspaceApplicationModule>(response.data)
}

export async function deleteApplicationModule(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`${resourcePath}/${id}`)
}

export const workspaceApplicationModulesService = {
  list: getApplicationModules,
  getById: getApplicationModuleById,
  create: createApplicationModule,
  update: updateApplicationModule,
  remove: deleteApplicationModule,
}
