import type { EntityId } from '@/types/common'

export const ROLE_VALUES = ['user', 'admin', 'super_admin'] as const

export type WorkspaceRole = (typeof ROLE_VALUES)[number]

export interface AuthApplicationAccess {
  id?: EntityId
  name?: string
  slug?: string
}

export interface AuthUser {
  id: EntityId
  name: string
  lastName?: string
  email: string
  roles: WorkspaceRole[]
  applications?: AuthApplicationAccess[]
}
