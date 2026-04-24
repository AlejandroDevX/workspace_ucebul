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

export type EffectivePermission = WorkspaceApplicationPermission & {
  is_from_role: boolean
  is_direct_allow: boolean
  is_direct_deny: boolean
  is_effectively_allowed: boolean
}

export interface EffectivePermissionModule {
  workspace_application_module_id: EntityId
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_order?: number
  permissions: EffectivePermission[]
}

export interface EffectivePermissionsTree {
  access: WorkspaceUserApplication
  summary: {
    role_permission_count: number
    direct_allow_count: number
    direct_deny_count: number
    effective_permission_count: number
  }
  modules: EffectivePermissionModule[]
  without_module: EffectivePermission[]
}

export interface UpdateUserPermissionOverridesPayload {
  allowed_permission_ids: EntityId[]
  denied_permission_ids: EntityId[]
}
