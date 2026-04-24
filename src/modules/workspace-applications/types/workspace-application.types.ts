import type { EntityId } from '@/types/common'

export interface WorkspaceApplication {
  workspace_application_id: EntityId
  workspace_application_name: string
  workspace_application_slug: string
  workspace_application_description?: string | null
  workspace_application_logo_url?: string | null
  workspace_application_url: string
  workspace_application_is_active: boolean
  workspace_application_created_at?: string
  workspace_application_updated_at?: string
}

export type WorkspaceApplicationFilters = Record<string, never>

export interface CreateWorkspaceApplicationDto {
  workspace_application_name: string
  workspace_application_slug: string
  workspace_application_description?: string
  workspace_application_logo_url?: string
  workspace_application_url: string
  workspace_application_is_active: boolean
}

export type UpdateWorkspaceApplicationDto = CreateWorkspaceApplicationDto
