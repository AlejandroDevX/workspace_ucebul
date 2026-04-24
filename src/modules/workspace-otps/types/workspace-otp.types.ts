import type { EntityId } from '@/types/common'

export interface WorkspaceOtp {
  workspace_otp_id: EntityId
  workspace_otp_workspace_user_id?: EntityId | null
  workspace_otp_email: string
  workspace_otp_code: string
  workspace_otp_purpose: string
  workspace_otp_expires_at: string
  workspace_otp_used_at?: string | null
  workspace_otp_created_at?: string
  workspace_otp_updated_at?: string
}

export type WorkspaceOtpFilters = Record<string, never>

export interface CreateWorkspaceOtpDto {
  workspace_otp_workspace_user_id?: EntityId | null
  workspace_otp_email: string
  workspace_otp_code: string
  workspace_otp_purpose: string
  workspace_otp_expires_at: string
  workspace_otp_used_at?: string | null
}

export type UpdateWorkspaceOtpDto = CreateWorkspaceOtpDto
