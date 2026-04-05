import { createCrudService } from '@/services/crud-service'
import type {
  CreateWorkspaceOtpDto,
  UpdateWorkspaceOtpDto,
  WorkspaceOtpFilters,
  WorkspaceOtpItem,
} from '@/modules/workspace-otps/types/workspace-otp.types'

export const workspaceOtpsService = createCrudService<
  WorkspaceOtpItem,
  CreateWorkspaceOtpDto,
  UpdateWorkspaceOtpDto,
  WorkspaceOtpFilters
>('/workspace-otps')
