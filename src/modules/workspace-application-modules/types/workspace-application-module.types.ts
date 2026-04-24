import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationModule {
  workspace_application_module_id: EntityId
  workspace_application_module_workspace_application_id: EntityId
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_description?: string | null
  workspace_application_module_icon?: string | null
  workspace_application_module_order: number
  workspace_application_module_is_active: boolean
  workspace_application?: WorkspaceApplication
  permissions?: WorkspaceApplicationPermission[]
  workspace_application_module_created_at?: string
  workspace_application_module_updated_at?: string
}

export interface WorkspaceApplicationModuleFilters {
  workspace_application_id?: EntityId
  application_slug?: string
}

export interface CreateWorkspaceApplicationModuleDto {
  workspace_application_module_workspace_application_id: string
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_description?: string
  workspace_application_module_icon?: string
  workspace_application_module_order?: string
  workspace_application_module_is_active: boolean
}

export interface UpdateWorkspaceApplicationModuleDto {
  workspace_application_module_name: string
  workspace_application_module_slug: string
  workspace_application_module_description?: string
  workspace_application_module_icon?: string
  workspace_application_module_order?: string
  workspace_application_module_is_active: boolean
}
