import type { EntityId } from '@/types/common'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import type { GroupedPermissions } from '@/types/permissions'

export type WorkspaceRole = string

export interface AuthPermissionAccess {
  id?: EntityId
  name?: string
  slug?: string
  description?: string | null
}

export interface AuthApplicationRoleAccess {
  id?: EntityId
  name?: string
  slug?: string
  description?: string | null
  isActive?: boolean
  permissions?: AuthPermissionAccess[]
}

export interface AuthApplicationAccess {
  accessId?: EntityId
  id?: EntityId
  name?: string
  slug?: string
  description?: string | null
  logoUrl?: string | null
  url?: string
  isActive?: boolean
  accessIsActive?: boolean
  applicationRole?: AuthApplicationRoleAccess | null
  directPermissions?: AuthPermissionAccess[]
  effectivePermissions?: AuthPermissionAccess[]
  permissionsByModule?: GroupedPermissions
}

export interface AuthUser {
  id: EntityId
  workspace_user_id: EntityId
  name: string
  workspace_user_name: string
  lastName?: string
  workspace_user_last_name?: string
  email: string
  workspace_user_email: string
  roles: WorkspaceRole[]
  applications?: AuthApplicationAccess[]
}

export type CurrentApplication = WorkspaceApplication

export type CurrentApplicationAccess = WorkspaceUserApplication
