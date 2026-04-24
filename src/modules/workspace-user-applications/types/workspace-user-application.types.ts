import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationRole } from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import type { EntityId } from '@/types/common'
import type { GroupedPermissions } from '@/types/permissions'

export interface WorkspaceUserApplication {
  workspace_user_application_id: EntityId
  workspace_user_application_workspace_user_id: EntityId
  workspace_user_application_workspace_application_id: EntityId
  workspace_user_application_workspace_application_role_id?: EntityId | null
  workspace_user_application_is_active: boolean
  workspace_user?: WorkspaceUser
  workspace_application?: WorkspaceApplication
  workspace_application_role?: WorkspaceApplicationRole | null
  permissions_by_module?: GroupedPermissions
  workspace_user_application_effective_permissions?: WorkspaceApplicationPermission[]
  workspace_user_application_created_at?: string
  workspace_user_application_updated_at?: string
}

export type WorkspaceUserApplicationFilters = Record<string, never>

export interface CreateWorkspaceUserApplicationDto {
  workspace_user_application_workspace_user_id: string
  workspace_user_application_workspace_application_id: string
  workspace_user_application_workspace_application_role_id?: string
  workspace_user_application_is_active: boolean
}

export type UpdateWorkspaceUserApplicationDto = CreateWorkspaceUserApplicationDto
