import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceApplicationDto,
  UpdateWorkspaceApplicationDto,
  WorkspaceApplicationFilters,
  WorkspaceApplicationItem,
} from '@/modules/workspace-applications/types/workspace-application.types'

export const workspaceApplicationsService = createCrudService<
  WorkspaceApplicationItem,
  CreateWorkspaceApplicationDto,
  UpdateWorkspaceApplicationDto,
  WorkspaceApplicationFilters
>('/workspace-applications')
