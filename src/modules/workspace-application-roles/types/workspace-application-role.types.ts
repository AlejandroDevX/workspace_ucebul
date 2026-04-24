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

export type WorkspaceApplicationPermissionWithAssigned =
  WorkspaceApplicationPermission & {
    is_assigned: boolean
  }

export interface ModulePermissionGroup {
  workspace_application_module_id: EntityId
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_order?: number
  permissions: WorkspaceApplicationPermissionWithAssigned[]
}

export interface RolePermissionsTreeResponse {
  role: Pick<
    WorkspaceApplicationRole,
    | 'workspace_application_role_id'
    | 'workspace_application_role_name'
    | 'workspace_application_role_slug'
    | 'workspace_application_role_workspace_application_id'
  >
  application: Pick<
    WorkspaceApplication,
    | 'workspace_application_id'
    | 'workspace_application_name'
    | 'workspace_application_slug'
  > | null
  modules: ModulePermissionGroup[]
  without_module: WorkspaceApplicationPermissionWithAssigned[]
}

export interface UpdateWorkspaceApplicationRolePermissionsResult {
  role: RolePermissionsTreeResponse['role']
  assigned_permission_ids: EntityId[]
}
