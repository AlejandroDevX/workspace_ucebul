import type { WorkspaceApplicationPermission } from '@/modules/workspace-permissions/types/workspace-permission.types'
import type { GroupedPermissions } from '@/types/permissions'

const WITHOUT_MODULE_KEY = 'without_module'

function getPermissionModule(permission: WorkspaceApplicationPermission) {
  return permission.application_module ?? null
}

export function groupFlatPermissionsByModule(
  permissions: WorkspaceApplicationPermission[],
): GroupedPermissions {
  const grouped: GroupedPermissions = {}

  for (const permission of permissions) {
    const module = getPermissionModule(permission)
    const key = module?.workspace_application_module_slug ?? WITHOUT_MODULE_KEY

    grouped[key] ??= {
      module_name: module?.workspace_application_module_name ?? 'Sin módulo',
      module_slug: module?.workspace_application_module_slug ?? null,
      permissions: [],
    }

    grouped[key].permissions.push(permission)
  }

  return sortGroupedPermissions(grouped)
}

export function sortGroupedPermissions(grouped: GroupedPermissions): GroupedPermissions {
  return Object.fromEntries(
    Object.entries(grouped).sort(([leftKey, left], [rightKey, right]) => {
      if (leftKey === WITHOUT_MODULE_KEY) {
        return 1
      }

      if (rightKey === WITHOUT_MODULE_KEY) {
        return -1
      }

      return left.module_name.localeCompare(right.module_name, 'es')
    }),
  )
}

export function groupedPermissionsToFlatPermissions(
  groupedPermissions?: GroupedPermissions | null,
): WorkspaceApplicationPermission[] {
  if (!groupedPermissions) {
    return []
  }

  return Object.values(groupedPermissions).flatMap((group) => group.permissions)
}

export function hasPermission(
  groupedPermissions: GroupedPermissions | null | undefined,
  permissionSlug: string,
) {
  return groupedPermissionsToFlatPermissions(groupedPermissions).some(
    (permission) =>
      permission.workspace_application_permission_slug === permissionSlug,
  )
}

export function hasAnyPermission(
  groupedPermissions: GroupedPermissions | null | undefined,
  permissionSlugs: string[],
) {
  return permissionSlugs.some((permissionSlug) =>
    hasPermission(groupedPermissions, permissionSlug),
  )
}

export function hasAllPermissions(
  groupedPermissions: GroupedPermissions | null | undefined,
  permissionSlugs: string[],
) {
  return permissionSlugs.every((permissionSlug) =>
    hasPermission(groupedPermissions, permissionSlug),
  )
}
