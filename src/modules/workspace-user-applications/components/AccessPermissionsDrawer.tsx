import { ChevronDown, ChevronRight, Folder, RotateCcw, Save } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/base/Button'
import { ContextDrawer } from '@/components/base/ContextDrawer'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { AssignmentSummaryCard } from '@/components/layout/AssignmentSummaryCard'
import {
  useUpdateUserPermissionOverridesMutation,
  useUserEffectivePermissionsTreeQuery,
} from '@/modules/workspace-user-applications/hooks/useWorkspaceUserApplicationsQuery'
import type {
  EffectivePermission,
  EffectivePermissionModule,
  EffectivePermissionsTree,
  WorkspaceUserApplication,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import { getWorkspaceUserApplicationSummary } from '@/modules/workspace-user-applications/utils/access-display'
import type { EntityId } from '@/types/common'
import { getErrorMessage } from '@/utils/error-message'

interface AccessPermissionsDrawerProps {
  access: WorkspaceUserApplication | null
  isOpen: boolean
  onClose: () => void
}

function getAllPermissions(tree: EffectivePermissionsTree) {
  return [
    ...tree.modules.flatMap((module) => module.permissions),
    ...tree.without_module,
  ]
}

function getEffectivePermissionIds(tree: EffectivePermissionsTree) {
  return getAllPermissions(tree)
    .filter((permission) => permission.is_effectively_allowed)
    .map((permission) => String(permission.workspace_application_permission_id))
}

function areSameIds(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false
  }

  const rightSet = new Set(right)

  return left.every((item) => rightSet.has(item))
}

export function AccessPermissionsDrawer({
  access,
  isOpen,
  onClose,
}: AccessPermissionsDrawerProps) {
  const accessId = access?.workspace_user_application_id
  const treeQuery = useUserEffectivePermissionsTreeQuery(isOpen ? accessId : undefined)
  const saveMutation = useUpdateUserPermissionOverridesMutation(accessId ?? '')
  const [originalSelectedPermissionIds, setOriginalSelectedPermissionIds] = useState<string[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(() => new Set())
  const [feedback, setFeedback] = useState<string | null>(null)
  const summary = access ? getWorkspaceUserApplicationSummary(access) : null

  useEffect(() => {
    if (!isOpen || !treeQuery.data) {
      return
    }

    queueMicrotask(() => {
      const permissionIds = getEffectivePermissionIds(treeQuery.data)
      setOriginalSelectedPermissionIds(permissionIds)
      setSelectedPermissionIds(permissionIds)
      setCollapsedModules(new Set())
      setFeedback(null)
    })
  }, [isOpen, treeQuery.data])

  const hasChanges = !areSameIds(originalSelectedPermissionIds, selectedPermissionIds)
  const payload = useMemo(() => {
    if (!treeQuery.data) {
      return {
        allowed_permission_ids: [],
        denied_permission_ids: [],
      }
    }

    const selectedIds = new Set(selectedPermissionIds)

    return getAllPermissions(treeQuery.data).reduce(
      (accumulator, permission) => {
        const permissionId = String(permission.workspace_application_permission_id)

        if (selectedIds.has(permissionId) && !permission.is_from_role) {
          accumulator.allowed_permission_ids.push(permission.workspace_application_permission_id)
        }

        if (!selectedIds.has(permissionId) && permission.is_from_role) {
          accumulator.denied_permission_ids.push(permission.workspace_application_permission_id)
        }

        return accumulator
      },
      {
        allowed_permission_ids: [] as EntityId[],
        denied_permission_ids: [] as EntityId[],
      },
    )
  }, [selectedPermissionIds, treeQuery.data])

  function togglePermission(permissionId: EntityId) {
    const normalizedPermissionId = String(permissionId)

    setSelectedPermissionIds((current) =>
      current.includes(normalizedPermissionId)
        ? current.filter((item) => item !== normalizedPermissionId)
        : [...current, normalizedPermissionId],
    )
  }

  function selectModule(module: EffectivePermissionModule) {
    const permissionIds = module.permissions.map((permission) =>
      String(permission.workspace_application_permission_id),
    )

    setSelectedPermissionIds((current) => [
      ...current.filter((permissionId) => !permissionIds.includes(permissionId)),
      ...permissionIds,
    ])
  }

  function clearModule(module: EffectivePermissionModule) {
    const permissionIds = module.permissions.map((permission) =>
      String(permission.workspace_application_permission_id),
    )

    setSelectedPermissionIds((current) =>
      current.filter((permissionId) => !permissionIds.includes(permissionId)),
    )
  }

  function toggleModule(module: EffectivePermissionModule) {
    const selectedCount = getSelectedCount(module.permissions, selectedPermissionIds)

    if (selectedCount === module.permissions.length) {
      clearModule(module)
      return
    }

    selectModule(module)
  }

  function toggleCollapsedModule(moduleKey: string) {
    setCollapsedModules((current) => {
      const next = new Set(current)

      if (next.has(moduleKey)) {
        next.delete(moduleKey)
      } else {
        next.add(moduleKey)
      }

      return next
    })
  }

  function resetChanges() {
    setSelectedPermissionIds(originalSelectedPermissionIds)
    setFeedback(null)
  }

  async function handleSave() {
    if (!accessId || !treeQuery.data || !hasChanges) {
      return
    }

    if (
      payload.denied_permission_ids.length > 0 &&
      !window.confirm('Hay permisos heredados por rol que serán revocados manualmente. ¿Guardar cambios?')
    ) {
      return
    }

    await saveMutation.mutateAsync(payload)
    setOriginalSelectedPermissionIds(selectedPermissionIds)
    setFeedback('Permisos del usuario actualizados correctamente.')
  }

  return (
    <ContextDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar permisos"
      description="Administra permisos efectivos: rol interno, permisos agregados y revocaciones manuales."
      footer={
        <div className="form-actions form-actions--end">
          <Button
            disabled={!hasChanges || saveMutation.isPending}
            leftIcon={<RotateCcw size={16} />}
            variant="ghost"
            onClick={resetChanges}
          >
            Cancelar
          </Button>
          <Button
            disabled={!hasChanges}
            isLoading={saveMutation.isPending}
            leftIcon={<Save size={16} />}
            onClick={() => void handleSave()}
          >
            Guardar cambios
          </Button>
        </div>
      }
    >
      {!access || !summary ? null : (
        <div className="crud-grid">
          <AssignmentSummaryCard
            userName={summary.userName}
            userEmail={summary.userEmail}
            applicationName={summary.applicationName}
            isActive={summary.isActive}
            permissionsCount={treeQuery.data?.summary.effective_permission_count ?? 0}
          />

          {treeQuery.isLoading ? (
            <LoadingState message="Cargando permisos efectivos..." />
          ) : null}

          {treeQuery.error ? (
            <ErrorState description={getErrorMessage(treeQuery.error)} />
          ) : null}

          {feedback ? <p className="text-muted">{feedback}</p> : null}

          {treeQuery.data && !treeQuery.isLoading && !treeQuery.error ? (
            <EffectivePermissionsTreeView
              collapsedModules={collapsedModules}
              selectedPermissionIds={selectedPermissionIds}
              tree={treeQuery.data}
              onClearModule={clearModule}
              onSelectModule={selectModule}
              onToggleCollapsedModule={toggleCollapsedModule}
              onToggleModule={toggleModule}
              onTogglePermission={togglePermission}
            />
          ) : null}

          {!hasChanges && treeQuery.data ? (
            <p className="text-muted">No hay cambios pendientes por guardar.</p>
          ) : null}
        </div>
      )}
    </ContextDrawer>
  )
}

interface EffectivePermissionsTreeViewProps {
  tree: EffectivePermissionsTree
  selectedPermissionIds: string[]
  collapsedModules: Set<string>
  onTogglePermission: (permissionId: EntityId) => void
  onToggleModule: (module: EffectivePermissionModule) => void
  onSelectModule: (module: EffectivePermissionModule) => void
  onClearModule: (module: EffectivePermissionModule) => void
  onToggleCollapsedModule: (moduleKey: string) => void
}

function EffectivePermissionsTreeView({
  tree,
  selectedPermissionIds,
  collapsedModules,
  onTogglePermission,
  onToggleModule,
  onSelectModule,
  onClearModule,
  onToggleCollapsedModule,
}: EffectivePermissionsTreeViewProps) {
  const groups = [
    ...tree.modules,
    ...(tree.without_module.length
      ? [
          {
            workspace_application_module_id: 'without_module',
            workspace_application_module_name: 'Sin módulo',
            workspace_application_module_slug: 'without_module',
            permissions: tree.without_module,
          },
        ]
      : []),
  ]

  if (groups.length === 0 || getAllPermissions(tree).length === 0) {
    return (
      <p className="text-muted">
        Esta aplicación aún no tiene permisos registrados.
      </p>
    )
  }

  return (
    <div className="role-permissions-tree">
      <div className="role-permissions-tree__summary">
        <div>
          <p className="permission-detail-card__label">Rol asignado</p>
          <h3>
            {tree.access.workspace_application_role?.workspace_application_role_name ?? 'Sin rol'}
          </h3>
        </div>
        <div className="effective-summary">
          <StatusBadge
            label={`${tree.summary.role_permission_count} por rol`}
            tone="default"
          />
          <StatusBadge
            label={`${tree.summary.direct_allow_count} agregados`}
            tone="success"
          />
          <StatusBadge
            label={`${tree.summary.direct_deny_count} revocados`}
            tone="danger"
          />
          <StatusBadge
            label={`${tree.summary.effective_permission_count} efectivos`}
            tone="default"
          />
        </div>
      </div>

      {groups.map((module) => {
        const moduleKey = String(module.workspace_application_module_id)

        return (
          <EffectivePermissionsModule
            isCollapsed={collapsedModules.has(moduleKey)}
            key={moduleKey}
            module={module}
            selectedPermissionIds={selectedPermissionIds}
            onClearModule={onClearModule}
            onSelectModule={onSelectModule}
            onToggleCollapsed={() => onToggleCollapsedModule(moduleKey)}
            onToggleModule={onToggleModule}
            onTogglePermission={onTogglePermission}
          />
        )
      })}
    </div>
  )
}

interface EffectivePermissionsModuleProps {
  module: EffectivePermissionModule
  selectedPermissionIds: string[]
  isCollapsed: boolean
  onToggleCollapsed: () => void
  onToggleModule: (module: EffectivePermissionModule) => void
  onSelectModule: (module: EffectivePermissionModule) => void
  onClearModule: (module: EffectivePermissionModule) => void
  onTogglePermission: (permissionId: EntityId) => void
}

function EffectivePermissionsModule({
  module,
  selectedPermissionIds,
  isCollapsed,
  onToggleCollapsed,
  onToggleModule,
  onSelectModule,
  onClearModule,
  onTogglePermission,
}: EffectivePermissionsModuleProps) {
  const selectedCount = getSelectedCount(module.permissions, selectedPermissionIds)
  const isAllSelected =
    module.permissions.length > 0 && selectedCount === module.permissions.length
  const isPartiallySelected =
    selectedCount > 0 && selectedCount < module.permissions.length

  return (
    <section className="role-permissions-tree__module">
      <div className="role-permissions-tree__module-header">
        <label className="role-permissions-tree__module-check">
          <IndeterminateCheckbox
            checked={isAllSelected}
            indeterminate={isPartiallySelected}
            onChange={() => onToggleModule(module)}
          />
          <Folder size={16} />
          <span>{module.workspace_application_module_name}</span>
        </label>
        <button
          className="role-permissions-tree__collapse"
          type="button"
          onClick={onToggleCollapsed}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          <span>
            {selectedCount} / {module.permissions.length} seleccionados
          </span>
        </button>
      </div>

      {!isCollapsed ? (
        <div className="role-permissions-tree__module-body">
          <div className="role-permissions-tree__module-actions">
            <Button variant="ghost" onClick={() => onSelectModule(module)}>
              Seleccionar todo
            </Button>
            <Button variant="ghost" onClick={() => onClearModule(module)}>
              Limpiar módulo
            </Button>
          </div>

          {module.permissions.map((permission) => {
            const permissionId = String(permission.workspace_application_permission_id)

            return (
              <label
                className="role-permissions-tree__permission"
                key={permissionId}
              >
                <input
                  checked={selectedPermissionIds.includes(permissionId)}
                  type="checkbox"
                  onChange={() => onTogglePermission(permissionId)}
                />
                <span>{permission.workspace_application_permission_name}</span>
                <span className="permission-badge">
                  {permission.workspace_application_permission_slug}
                </span>
                <PermissionSourceBadges permission={permission} />
              </label>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

function PermissionSourceBadges({ permission }: { permission: EffectivePermission }) {
  if (permission.is_direct_deny) {
    return <StatusBadge label="Revocado manualmente" tone="danger" />
  }

  if (permission.is_direct_allow) {
    return <StatusBadge label="Agregado manualmente" tone="success" />
  }

  if (permission.is_from_role) {
    return <StatusBadge label="Por rol" tone="default" />
  }

  return <StatusBadge label="Sin acceso" tone="warning" />
}

function getSelectedCount(
  permissions: EffectivePermission[],
  selectedPermissionIds: string[],
) {
  const selectedIds = new Set(selectedPermissionIds)

  return permissions.filter((permission) =>
    selectedIds.has(String(permission.workspace_application_permission_id)),
  ).length
}

interface IndeterminateCheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: IndeterminateCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={inputRef}
      checked={checked}
      type="checkbox"
      onChange={onChange}
    />
  )
}
