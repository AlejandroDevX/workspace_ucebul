import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationModule } from '@/modules/workspace-application-modules/types/workspace-application-module.types'
import type { WorkspaceApplicationRole } from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationPermission {
  workspace_application_permission_id: EntityId
  workspace_application_permission_workspace_application_id: EntityId
  workspace_application_permission_workspace_application_module_id?: EntityId | null
  workspace_application_permission_name: string
  workspace_application_permission_slug: string
  workspace_application_permission_description?: string | null
  workspace_application?: WorkspaceApplication
  application_module?: WorkspaceApplicationModule | null
  workspace_application_permission_created_at?: string
  workspace_application_permission_updated_at?: string
}

export interface WorkspaceUserApplicationPermission {
  workspace_user_application_permission_id: EntityId
  workspace_user_application_permission_wua_id: EntityId
  workspace_user_application_permission_wap_id: EntityId
  workspace_user_application_permission_effect?: 'allow' | 'deny'
  workspace_user_application?: WorkspaceUserApplication
  workspace_application_permission?: WorkspaceApplicationPermission
  workspace_user_application_permission_created_at?: string
  workspace_user_application_permission_updated_at?: string
}

export interface WorkspaceApplicationRolePermission {
  workspace_application_role_permission_id: EntityId
  workspace_application_role_permission_war_id: EntityId
  workspace_application_role_permission_wap_id: EntityId
  workspace_application_role?: WorkspaceApplicationRole
  workspace_application_permission?: WorkspaceApplicationPermission
  workspace_application_role_permission_created_at?: string
  workspace_application_role_permission_updated_at?: string
}

export interface ApplicationModuleWithPermissions {
  workspace_application_module_id: EntityId
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_icon?: string | null
  workspace_application_module_order?: number
  permissions: WorkspaceApplicationPermission[]
}

export interface ApplicationPermissionsTree {
  workspace_application_id: EntityId
  workspace_application_name: string
  workspace_application_slug: string
  modules: ApplicationModuleWithPermissions[]
  without_module?: WorkspaceApplicationPermission[]
}

export type WorkspacePermissionFilters = Record<string, never>

export interface CreateWorkspaceApplicationPermissionDto {
  workspace_application_permission_workspace_application_id: string
  workspace_application_permission_workspace_application_module_id?: string
  workspace_application_permission_name: string
  workspace_application_permission_slug: string
  workspace_application_permission_description?: string
}

export type UpdateWorkspaceApplicationPermissionDto =
  CreateWorkspaceApplicationPermissionDto

export interface CreateWorkspaceUserApplicationPermissionDto {
  workspace_user_application_permission_wua_id: string
  workspace_user_application_permission_wap_id: string
  workspace_user_application_permission_effect?: 'allow' | 'deny'
}

export type UpdateWorkspaceUserApplicationPermissionDto =
  CreateWorkspaceUserApplicationPermissionDto

export interface CreateWorkspaceApplicationRolePermissionDto {
  workspace_application_role_permission_war_id: string
  workspace_application_role_permission_wap_id: string
}

export type UpdateWorkspaceApplicationRolePermissionDto =
  CreateWorkspaceApplicationRolePermissionDto
