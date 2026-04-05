import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceRoleDto,
  UpdateWorkspaceRoleDto,
  WorkspaceRoleFilters,
  WorkspaceRoleItem,
} from '@/modules/workspace-roles/types/workspace-role.types'

export const workspaceRolesService = createCrudService<
  WorkspaceRoleItem,
  CreateWorkspaceRoleDto,
  UpdateWorkspaceRoleDto,
  WorkspaceRoleFilters
>('/workspace-roles')
