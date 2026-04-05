import type { PaginationFilters } from '@/types/api'
import type { EntityId } from '@/types/common'

export interface WorkspaceOtpItem {
  id: EntityId
  email: string
  purpose?: string
  status?: 'pending' | 'verified' | 'expired'
  expiresAt?: string
  verifiedAt?: string
}

export interface WorkspaceOtpFilters extends PaginationFilters {
  email?: string
  status?: 'pending' | 'verified' | 'expired'
}

export interface CreateWorkspaceOtpDto {
  email: string
  purpose?: string
}

export interface UpdateWorkspaceOtpDto extends Partial<CreateWorkspaceOtpDto> {
  status?: 'pending' | 'verified' | 'expired'
}
