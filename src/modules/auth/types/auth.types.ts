import type { WorkspaceOtp } from '@/modules/workspace-otps/types/workspace-otp.types'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationRole } from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import type { WorkspaceRole } from '@/modules/workspace-roles/types/workspace-role.types'
import type { WorkspaceApplicationPermission, WorkspaceUserApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import type { WorkspaceUserRole } from '@/modules/workspace-user-roles/types/workspace-user-role.types'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import type { ApiSuccessResponse } from '@/types/api'
import type { AuthUser, CurrentApplication, CurrentApplicationAccess } from '@/types/auth'
import type { GroupedPermissions } from '@/types/permissions'
import type { EntityId } from '@/types/common'

export interface LoginDto {
  workspace_user_email: string
  workspace_user_password: string
  workspace_personal_access_token_name?: string
}

export interface ForgotPasswordDto {
  workspace_user_email: string
}

export interface VerifyOtpDto {
  workspace_otp_email: string
  workspace_otp_code: string
  workspace_otp_purpose: string
}

export interface ResetPasswordDto {
  workspace_otp_email: string
  workspace_otp_code: string
  workspace_user_password: string
  workspace_otp_purpose?: string
}

export interface LoginResult {
  token: string
  tokenType?: string
  user?: AuthUser
}

export interface AuthMeParams {
  application_slug?: string
  application_id?: EntityId
}

export interface WorkspaceLoginRequest {
  workspace_user_email: string
  workspace_user_password: string
  workspace_personal_access_token_name?: string
}

export interface WorkspaceAuthUserRole extends WorkspaceUserRole {
  workspace_role?: WorkspaceRole
}

export interface WorkspaceAuthUserApplication extends WorkspaceUserApplication {
  workspace_application?: WorkspaceApplication
  workspace_application_role?: WorkspaceApplicationRole | null
  user_application_permissions?: WorkspaceUserApplicationPermission[]
  workspace_user_application_effective_permissions?: WorkspaceApplicationPermission[]
}

export interface WorkspaceAuthUserResponse extends WorkspaceUser {
  user_roles?: WorkspaceAuthUserRole[]
  user_applications?: WorkspaceAuthUserApplication[]
  current_application?: CurrentApplication | null
  current_application_access?: CurrentApplicationAccess | null
  current_application_permissions?: GroupedPermissions
  workspace_modules?: GroupedPermissions
  otps?: WorkspaceOtp[]
}

export interface AuthSession {
  user: AuthUser
  workspaceRoles: WorkspaceAuthUserRole[]
  userApplications: WorkspaceAuthUserApplication[]
  currentApplication: CurrentApplication | null
  currentApplicationAccess: CurrentApplicationAccess | null
  currentApplicationPermissions: GroupedPermissions
  workspaceModules: GroupedPermissions
  otps: WorkspaceOtp[]
}

export interface WorkspaceLoginResponseData {
  workspace_user: WorkspaceAuthUserResponse
  workspace_access_token: string
  workspace_access_token_type?: string
}

export type WorkspaceLoginResponse = ApiSuccessResponse<WorkspaceLoginResponseData>

export interface WorkspaceValidateTokenData {
  is_valid: boolean
  workspace_user: WorkspaceUser | null
}

export interface WorkspaceForgotPasswordResponseData {
  workspace_otp: WorkspaceOtp
  workspace_user: WorkspaceUser
}

export interface WorkspaceVerifyOtpResponseData {
  is_valid: boolean
  workspace_otp: WorkspaceOtp
}

export interface WorkspaceResetPasswordResponseData {
  workspace_user: WorkspaceUser
}
