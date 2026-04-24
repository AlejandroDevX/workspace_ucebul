import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationRole {
  workspace_application_role_id: EntityId
  workspace_application_role_workspace_application_id: EntityId
  workspace_application_role_name: string
  workspace_application_role_slug: string
  workspace_application_role_description?: string | null
  workspace_application_role_is_active: boolean
  workspace_application?: WorkspaceApplication
  application_permissions?: WorkspaceApplicationPermission[]
  workspace_application_role_created_at?: string
  workspace_application_role_updated_at?: string
}

export type WorkspaceApplicationRoleFilters = Record<string, never>

export interface CreateWorkspaceApplicationRoleDto {
  workspace_application_role_workspace_application_id: string
  workspace_application_role_name: string
  workspace_application_role_slug: string
  workspace_application_role_description?: string
  workspace_application_role_is_active: boolean
}

export type UpdateWorkspaceApplicationRoleDto = CreateWorkspaceApplicationRoleDto
