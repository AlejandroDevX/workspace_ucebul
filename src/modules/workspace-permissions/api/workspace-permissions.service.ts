import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceApplicationPermissionDto,
  CreateWorkspaceUserApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceUserApplicationPermissionDto,
  WorkspaceApplicationPermissionItem,
  WorkspacePermissionFilters,
  WorkspaceUserApplicationPermissionAssignment,
} from '@/modules/workspace-permissions/types/workspace-permission.types'

export const workspaceApplicationPermissionsService = createCrudService<
  WorkspaceApplicationPermissionItem,
  CreateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  WorkspacePermissionFilters
>('/workspace-application-permissions')

export const workspaceUserApplicationPermissionsService = createCrudService<
  WorkspaceUserApplicationPermissionAssignment,
  CreateWorkspaceUserApplicationPermissionDto,
  UpdateWorkspaceUserApplicationPermissionDto,
  WorkspacePermissionFilters
>('/workspace-user-application-permissions')
