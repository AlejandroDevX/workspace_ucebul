import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'

export type GroupedPermissions = Record<
  string,
  {
    module_name: string
    module_slug: string | null
    permissions: WorkspaceApplicationPermission[]
  }
>
