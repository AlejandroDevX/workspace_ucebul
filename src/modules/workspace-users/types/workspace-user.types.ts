import type { PaginationFilters } from '@/types/api'
import type { WorkspaceRole } from '@/types/auth'
import type { EntityId } from '@/types/common'

export interface WorkspaceUserItem {
  id: EntityId
  name: string
  email: string
  status?: 'active' | 'inactive'
  roles: WorkspaceRole[]
  createdAt?: string
}

export interface WorkspaceUserFilters extends PaginationFilters {
  role?: WorkspaceRole
  status?: 'active' | 'inactive'
}

export interface CreateWorkspaceUserDto {
  name: string
  email: string
  password?: string
}

export interface UpdateWorkspaceUserDto extends Partial<CreateWorkspaceUserDto> {
  status?: 'active' | 'inactive'
}
