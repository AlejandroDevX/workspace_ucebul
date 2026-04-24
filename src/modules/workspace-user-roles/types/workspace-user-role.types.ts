import type { WorkspaceRole } from '@/modules/workspace-roles/types/workspace-role.types'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceUserRole {
  workspace_user_role_id: EntityId
  workspace_user_role_workspace_user_id: EntityId
  workspace_user_role_workspace_role_id: EntityId
  workspace_user?: WorkspaceUser
  workspace_role?: WorkspaceRole
  workspace_user_role_created_at?: string
  workspace_user_role_updated_at?: string
}

export type WorkspaceUserRoleFilters = Record<string, never>

export interface CreateWorkspaceUserRoleDto {
  workspace_user_role_workspace_user_id: string
  workspace_user_role_workspace_role_id: string
}

export type UpdateWorkspaceUserRoleDto = CreateWorkspaceUserRoleDto
