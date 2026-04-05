import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceApplicationPermissionItem {
  id: EntityId
  applicationId: EntityId
  code: string
  name: string
  description?: string
}

export interface WorkspaceUserApplicationPermissionAssignment {
  id: EntityId
  userId: EntityId
  applicationId: EntityId
  permissionId: EntityId
  userName?: string
  permissionCode?: string
}

export interface WorkspacePermissionFilters extends PaginationFilters {
  applicationId?: EntityId
  userId?: EntityId
}

export interface CreateWorkspaceApplicationPermissionDto {
  applicationId: EntityId
  code: string
  name: string
  description?: string
}

export interface UpdateWorkspaceApplicationPermissionDto
  extends Partial<CreateWorkspaceApplicationPermissionDto> {}

export interface CreateWorkspaceUserApplicationPermissionDto {
  userId: EntityId
  applicationId: EntityId
  permissionId: EntityId
}

export interface UpdateWorkspaceUserApplicationPermissionDto
  extends Partial<CreateWorkspaceUserApplicationPermissionDto> {}
