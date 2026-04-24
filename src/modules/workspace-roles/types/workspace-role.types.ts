import type { EntityId } from '@/types/common'

export interface WorkspaceRole {
  workspace_role_id: EntityId
  workspace_role_name: string
  workspace_role_slug: string
  workspace_role_description?: string | null
  workspace_role_created_at?: string
  workspace_role_updated_at?: string
}

export type WorkspaceRoleFilters = Record<string, never>

export interface CreateWorkspaceRoleDto {
  workspace_role_name: string
  workspace_role_slug: string
  workspace_role_description?: string
}

export type UpdateWorkspaceRoleDto = CreateWorkspaceRoleDto
