import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationPermission {
  workspace_application_permission_id: EntityId
  workspace_application_permission_workspace_application_id: EntityId
  workspace_application_permission_name: string
  workspace_application_permission_slug: string
  workspace_application_permission_description?: string | null
  workspace_application?: WorkspaceApplication
  workspace_application_permission_created_at?: string
  workspace_application_permission_updated_at?: string
}

export interface WorkspaceUserApplicationPermission {
  workspace_user_application_permission_id: EntityId
  workspace_user_application_permission_wua_id: EntityId
  workspace_user_application_permission_wap_id: EntityId
  workspace_user_application?: WorkspaceUserApplication
  workspace_application_permission?: WorkspaceApplicationPermission
  workspace_user_application_permission_created_at?: string
  workspace_user_application_permission_updated_at?: string
}

export interface WorkspacePermissionFilters {}

export interface CreateWorkspaceApplicationPermissionDto {
  workspace_application_permission_workspace_application_id: string
  workspace_application_permission_name: string
  workspace_application_permission_slug: string
  workspace_application_permission_description?: string
}

export interface UpdateWorkspaceApplicationPermissionDto
  extends CreateWorkspaceApplicationPermissionDto {}

export interface CreateWorkspaceUserApplicationPermissionDto {
  workspace_user_application_permission_wua_id: string
  workspace_user_application_permission_wap_id: string
}

export interface UpdateWorkspaceUserApplicationPermissionDto
  extends CreateWorkspaceUserApplicationPermissionDto {}
