import type { AuthUser } from '@/types/auth'
import type { EntityId } from '@/types/common'

export interface LoginDto {
  email: string
  password: string
  personalAccessTokenName?: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface VerifyOtpDto {
  email: string
  otp: string
}

export interface ResetPasswordDto {
  email: string
  otp: string
  password: string
  passwordConfirmation: string
}

export interface LoginResult {
  token: string
  tokenType?: string
  user?: AuthUser
}

export interface WorkspaceLoginRequest {
  workspace_user_email: string
  workspace_user_password: string
  workspace_personal_access_token_name?: string
}

export interface WorkspaceUserRoleResponse {
  id?: EntityId
  name?: string
  role_name?: string
  workspace_role_name?: string
}

export interface WorkspaceUserApplicationResponse {
  id?: EntityId
  name?: string
  slug?: string
  application_name?: string
  workspace_application_name?: string
}

export interface WorkspaceAuthUserResponse {
  workspace_user_id: EntityId
  workspace_user_email: string
  workspace_user_name: string
  workspace_user_last_name?: string
  user_roles?: WorkspaceUserRoleResponse[] | string[]
  user_applications?: WorkspaceUserApplicationResponse[]
}

export interface WorkspaceLoginResponseData {
  workspace_user: WorkspaceAuthUserResponse
  workspace_access_token: string
  workspace_access_token_type?: string
}

export interface WorkspaceLoginResponse {
  success: boolean
  message: string
  data: WorkspaceLoginResponseData
  meta?: unknown[]
}
