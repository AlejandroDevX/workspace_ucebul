import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceUserDto,
  UpdateWorkspaceUserDto,
  WorkspaceUserFilters,
  WorkspaceUserItem,
} from '@/modules/workspace-users/types/workspace-user.types'

export const workspaceUsersService = createCrudService<
  WorkspaceUserItem,
  CreateWorkspaceUserDto,
  UpdateWorkspaceUserDto,
  WorkspaceUserFilters
>('/workspace-users')
