import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceUserRoleAssignment {
  id: EntityId
  userId: EntityId
  roleId: EntityId
  userName?: string
  roleName?: string
}

export interface WorkspaceUserRoleFilters extends PaginationFilters {
  userId?: EntityId
  roleId?: EntityId
}

export interface CreateWorkspaceUserRoleDto {
  userId: EntityId
  roleId: EntityId
}

export interface UpdateWorkspaceUserRoleDto extends Partial<CreateWorkspaceUserRoleDto> {}
