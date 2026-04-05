import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'

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
  const selectedMap = new Set(selectedPermissionIds)

  return (
    <div className="permissions-checklist">
      {permissions.map((permission) => {
        const permissionId = String(permission.workspace_application_permission_id)
        const isChecked = selectedMap.has(permissionId)

        return (
          <label key={permissionId} className="permissions-checklist__item">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(permissionId)}
              disabled={disabled}
            />
            <div className="permissions-checklist__content">
              <div className="permissions-checklist__meta">
                <strong>{permission.workspace_application_permission_name}</strong>
                <PermissionBadge label={permission.workspace_application_permission_slug} />
              </div>
              <p>
                {permission.workspace_application_permission_description ||
                  'Sin descripción adicional.'}
              </p>
            </div>
          </label>
        )
      })}
    </div>
  )
}
