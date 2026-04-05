import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationItem {
  id: EntityId
  name: string
  slug: string
  description?: string
  url?: string
  isActive?: boolean
}

export interface WorkspaceApplicationFilters extends PaginationFilters {
  isActive?: boolean
}

export interface CreateWorkspaceApplicationDto {
  name: string
  slug: string
  description?: string
  url?: string
}

export interface UpdateWorkspaceApplicationDto
  extends Partial<CreateWorkspaceApplicationDto> {
  isActive?: boolean
}
