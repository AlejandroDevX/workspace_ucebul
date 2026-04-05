import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceUserRoleDto,
  UpdateWorkspaceUserRoleDto,
  WorkspaceUserRoleAssignment,
  WorkspaceUserRoleFilters,
} from '@/modules/workspace-user-roles/types/workspace-user-role.types'

export const workspaceUserRolesService = createCrudService<
  WorkspaceUserRoleAssignment,
  CreateWorkspaceUserRoleDto,
  UpdateWorkspaceUserRoleDto,
  WorkspaceUserRoleFilters
>('/workspace-user-roles')
