import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceUserApplicationDto,
  UpdateWorkspaceUserApplicationDto,
  WorkspaceUserApplicationAccess,
  WorkspaceUserApplicationFilters,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'

export const workspaceUserApplicationsService = createCrudService<
  WorkspaceUserApplicationAccess,
  CreateWorkspaceUserApplicationDto,
  UpdateWorkspaceUserApplicationDto,
  WorkspaceUserApplicationFilters
>('/workspace-user-applications')
