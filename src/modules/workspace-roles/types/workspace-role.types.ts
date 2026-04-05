import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceRoleItem {
  id: EntityId
  name: string
  description?: string
  isSystem?: boolean
}

export interface WorkspaceRoleFilters extends PaginationFilters {
  isSystem?: boolean
}

export interface CreateWorkspaceRoleDto {
  name: string
  description?: string
}

export interface UpdateWorkspaceRoleDto extends Partial<CreateWorkspaceRoleDto> {
  isSystem?: boolean
}
