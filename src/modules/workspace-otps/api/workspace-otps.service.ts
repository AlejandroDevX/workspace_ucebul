import { httpClient } from '@/services/http-client'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  WorkspaceOtp,
} from '@/modules/workspace-otps/types/workspace-otp.types'
import { unwrapData } from '@/utils/api-response'

export async function listWorkspaceOtps() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceOtp[]>>('/workspace-otps')
  return unwrapData<WorkspaceOtp[]>(response.data)
}

export async function getWorkspaceOtpById(id: number | string) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceOtp>>(`/workspace-otps/${id}`)
  return unwrapData<WorkspaceOtp>(response.data)
}

export async function deleteWorkspaceOtp(id: number | string) {
  await httpClient.delete<ApiSuccessResponse<null>>(`/workspace-otps/${id}`)
}

export const workspaceOtpsService = {
  list: listWorkspaceOtps,
  getById: getWorkspaceOtpById,
  remove: deleteWorkspaceOtp,
}
