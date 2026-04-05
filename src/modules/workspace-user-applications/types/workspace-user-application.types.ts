import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import type { EntityId } from '@/types/common'

export interface WorkspaceUserApplication {
  workspace_user_application_id: EntityId
  workspace_user_application_workspace_user_id: EntityId
  workspace_user_application_workspace_application_id: EntityId
  workspace_user_application_is_active: boolean
  workspace_user?: WorkspaceUser
  workspace_application?: WorkspaceApplication
  workspace_user_application_created_at?: string
  workspace_user_application_updated_at?: string
}

export interface WorkspaceUserApplicationFilters {}

export interface CreateWorkspaceUserApplicationDto {
  workspace_user_application_workspace_user_id: string
  workspace_user_application_workspace_application_id: string
  workspace_user_application_is_active: boolean
}

export interface UpdateWorkspaceUserApplicationDto
  extends CreateWorkspaceUserApplicationDto {}
