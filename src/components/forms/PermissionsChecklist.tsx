import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import { groupFlatPermissionsByModule } from '@/utils/permissions'

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
  const groupedPermissions = groupFlatPermissionsByModule(permissions)
  const selectedIds = new Set(selectedPermissionIds)

  return (
    <div className="permissions-checklist permissions-checklist--grouped">
      {Object.entries(groupedPermissions).map(([groupKey, group]) => (
        <section className="permission-group" key={groupKey}>
          <div className="permission-group__header">
            <h3>{group.module_name}</h3>
            {group.module_slug ? <span>{group.module_slug}</span> : null}
          </div>
          <div className="permission-group__items">
            {group.permissions.map((permission) => {
              const permissionId = String(permission.workspace_application_permission_id)

              return (
                <label className="permissions-checklist__item" key={permissionId}>
                  <input
                    checked={selectedIds.has(permissionId)}
                    disabled={disabled}
                    type="checkbox"
                    onChange={() => onToggle(permissionId)}
                  />
                  <div className="permissions-checklist__content">
                    <strong>{permission.workspace_application_permission_name}</strong>
                    <p>{permission.workspace_application_permission_slug}</p>
                    {permission.workspace_application_permission_description ? (
                      <p>{permission.workspace_application_permission_description}</p>
                    ) : null}
                  </div>
                </label>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
