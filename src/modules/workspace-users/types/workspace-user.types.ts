import type { EntityId } from '@/types/common'

export interface WorkspaceUser {
  workspace_user_id: EntityId
  workspace_user_email: string
  workspace_user_name: string
  workspace_user_last_name: string
  workspace_user_created_at?: string
  workspace_user_updated_at?: string
}

export interface WorkspaceUserFilters {}

export interface CreateWorkspaceUserDto {
  workspace_user_email: string
  workspace_user_password: string
  workspace_user_name: string
  workspace_user_last_name: string
}

export interface UpdateWorkspaceUserDto {
  workspace_user_email: string
  workspace_user_password?: string
  workspace_user_name: string
  workspace_user_last_name: string
}
