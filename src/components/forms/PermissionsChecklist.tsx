import { PermissionsChecklist as FoundationPermissionsChecklist } from 'foundation-ui'
import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'

interface PermissionsChecklistProps {
  permissions: WorkspaceApplicationPermission[]
  selectedPermissionIds: string[]
  onToggle: (permissionId: string) => void
  disabled?: boolean
}

export function PermissionsChecklist({
  permissions,
  selectedPermissionIds,
  onToggle,
  disabled = false,
}: PermissionsChecklistProps) {
  return (
    <FoundationPermissionsChecklist
      items={permissions.map((permission) => ({
        id: String(permission.workspace_application_permission_id),
        label: permission.workspace_application_permission_name,
        description: [
          permission.workspace_application_permission_slug,
          permission.workspace_application_permission_description,
        ]
          .filter(Boolean)
          .join(' • '),
        disabled,
      }))}
      value={selectedPermissionIds}
      onValueChange={(value) => {
        const current = new Set(selectedPermissionIds)
        const next = new Set(value)

        const changedId =
          value.find((item) => !current.has(item)) ??
          selectedPermissionIds.find((item) => !next.has(item))

        if (changedId) {
          onToggle(changedId)
        }
      }}
    />
  )
}
