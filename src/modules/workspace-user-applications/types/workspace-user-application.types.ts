import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceUserApplicationAccess {
  id: EntityId
  userId: EntityId
  applicationId: EntityId
  userName?: string
  applicationName?: string
  status?: 'active' | 'inactive'
}

export interface WorkspaceUserApplicationFilters extends PaginationFilters {
  userId?: EntityId
  applicationId?: EntityId
}

export interface CreateWorkspaceUserApplicationDto {
  userId: EntityId
  applicationId: EntityId
}

export interface UpdateWorkspaceUserApplicationDto
  extends Partial<CreateWorkspaceUserApplicationDto> {
  status?: 'active' | 'inactive'
}
