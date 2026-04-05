import type { EntityId } from '@/types/common'

export interface WorkspaceRole {
  workspace_role_id: EntityId
  workspace_role_name: string
  workspace_role_created_at?: string
  workspace_role_updated_at?: string
}

export interface WorkspaceRoleFilters {}

export interface CreateWorkspaceRoleDto {
  workspace_role_name: string
}

export interface UpdateWorkspaceRoleDto extends CreateWorkspaceRoleDto {}
