import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight, Folder, RotateCcw, Save, Trash2 } from 'lucide-react'
import { Select, type SelectOption } from 'foundation-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { FormActions } from '@/components/forms/FormActions'
import { ResourceForm, type ResourceFormField } from '@/components/forms/ResourceForm'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import {
  useUpdateWorkspaceApplicationRolePermissionsMutation,
  useWorkspaceApplicationRolePermissionsTreeQuery,
  useWorkspaceApplicationRolesQuery,
} from '@/modules/workspace-application-roles/hooks/useWorkspaceApplicationRolesQuery'
import type {
  ModulePermissionGroup,
  RolePermissionsTreeResponse,
  WorkspaceApplicationPermissionWithAssigned,
} from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import {
  useDeleteWorkspaceApplicationRolePermissionMutation,
  useUpdateWorkspaceApplicationRolePermissionMutation,
  useWorkspaceApplicationPermissionsQuery,
  useWorkspaceApplicationRolePermissionQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import type {
  CreateWorkspaceApplicationRolePermissionDto,
  UpdateWorkspaceApplicationRolePermissionDto,
} from '@/modules/workspace-permissions/types/workspace-permission.types'
import { APP_ROUTES } from '@/routes/paths'
import type { EntityId } from '@/types/common'
import { getErrorMessage } from '@/utils/error-message'

const workspaceApplicationRolePermissionSchema = z.object({
  workspace_application_role_permission_war_id: z
    .string()
    .trim()
    .min(1, 'Selecciona un rol interno.'),
  workspace_application_role_permission_wap_id: z
    .string()
    .trim()
    .min(1, 'Selecciona un permiso.'),
})

const defaultValues: CreateWorkspaceApplicationRolePermissionDto = {
  workspace_application_role_permission_war_id: '',
  workspace_application_role_permission_wap_id: '',
}

function buildFields(
  roleOptions: Array<{ label: string; value: string }>,
  permissionOptions: Array<{ label: string; value: string }>,
): Array<ResourceFormField<CreateWorkspaceApplicationRolePermissionDto>> {
  return [
    {
      name: 'workspace_application_role_permission_war_id',
      label: 'Rol interno',
      type: 'select',
      options: roleOptions,
    },
    {
      name: 'workspace_application_role_permission_wap_id',
      label: 'Permiso',
      type: 'select',
      options: permissionOptions,
    },
  ]
}

export function WorkspaceApplicationRolePermissionsPage() {
  const rolesQuery = useWorkspaceApplicationRolesQuery()
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const treeQuery = useWorkspaceApplicationRolePermissionsTreeQuery(selectedRoleId)
  const saveMutation =
    useUpdateWorkspaceApplicationRolePermissionsMutation(selectedRoleId)
  const [originalSelectedPermissionIds, setOriginalSelectedPermissionIds] =
    useState<string[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(
    () => new Set(),
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const roleOptions = useMemo<SelectOption[]>(
    () =>
      (rolesQuery.data ?? []).map((role) => ({
        label: `${
          role.workspace_application?.workspace_application_name ?? 'App'
        } / ${role.workspace_application_role_name}`,
        value: String(role.workspace_application_role_id),
      })),
    [rolesQuery.data],
  )

  useEffect(() => {
    if (!treeQuery.data) {
      return
    }

    queueMicrotask(() => {
      const assignedPermissionIds = getAssignedPermissionIds(treeQuery.data)
      setOriginalSelectedPermissionIds(assignedPermissionIds)
      setSelectedPermissionIds(assignedPermissionIds)
      setCollapsedModules(new Set())
      setFeedback(null)
    })
  }, [treeQuery.data])

  const hasChanges = !areSameIds(
    originalSelectedPermissionIds,
    selectedPermissionIds,
  )

  function handleSelectedRoleChange(roleId: string) {
    setSelectedRoleId(roleId)
    setOriginalSelectedPermissionIds([])
    setSelectedPermissionIds([])
    setCollapsedModules(new Set())
    setFeedback(null)
  }

  function togglePermission(permissionId: EntityId) {
    const normalizedPermissionId = String(permissionId)

    setSelectedPermissionIds((current) =>
      current.includes(normalizedPermissionId)
        ? current.filter((item) => item !== normalizedPermissionId)
        : [...current, normalizedPermissionId],
    )
  }

  function selectModule(module: ModulePermissionGroup) {
    const permissionIds = module.permissions.map((permission) =>
      String(permission.workspace_application_permission_id),
    )

    setSelectedPermissionIds((current) => [
      ...current.filter((permissionId) => !permissionIds.includes(permissionId)),
      ...permissionIds,
    ])
  }

  function clearModule(module: ModulePermissionGroup) {
    const permissionIds = module.permissions.map((permission) =>
      String(permission.workspace_application_permission_id),
    )

    setSelectedPermissionIds((current) =>
      current.filter((permissionId) => !permissionIds.includes(permissionId)),
    )
  }

  function toggleModule(module: ModulePermissionGroup) {
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

  async function saveChanges() {
    await saveMutation.mutateAsync(selectedPermissionIds)
    setOriginalSelectedPermissionIds(selectedPermissionIds)
    setFeedback('Permisos del rol actualizados correctamente.')
  }

  if (rolesQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando permisos por rol interno..." />
  }

  if (rolesQuery.error) {
    return <ErrorState description={getErrorMessage(rolesQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Permisos de rol interno"
      description="Selecciona un rol y asigna sus permisos por aplicación y módulo."
    >
      <SectionCard
        title="Rol interno"
        description="El árbol muestra solamente permisos de la aplicación a la que pertenece el rol."
      >
        <Select
          controlId="workspace-application-role-permissions-role"
          options={roleOptions}
          placeholder="Selecciona un rol interno"
          searchable
          value={selectedRoleId || null}
          onValueChange={(value) => handleSelectedRoleChange(value ?? '')}
        />
      </SectionCard>

      <SectionCard
        title="Permisos asignados"
        description={
          treeQuery.data
            ? `${treeQuery.data.application?.workspace_application_name ?? 'Aplicación'} / ${treeQuery.data.role.workspace_application_role_name}`
            : 'Selecciona un rol interno para administrar sus permisos.'
        }
        footer={
          selectedRoleId ? (
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
                onClick={() => void saveChanges()}
              >
                Guardar cambios
              </Button>
            </div>
          ) : null
        }
      >
        {!selectedRoleId ? (
          <p className="text-muted">
            Selecciona un rol interno para administrar sus permisos.
          </p>
        ) : null}

        {selectedRoleId && treeQuery.isLoading ? (
          <LoadingState message="Cargando árbol de permisos..." />
        ) : null}

        {treeQuery.error ? (
          <ErrorState description={getErrorMessage(treeQuery.error)} />
        ) : null}

        {feedback ? <p className="text-muted">{feedback}</p> : null}

        {treeQuery.data && !treeQuery.isLoading && !treeQuery.error ? (
          <RolePermissionsTree
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
      </SectionCard>
    </CrudPageLayout>
  )
}

function getAssignedPermissionIds(tree: RolePermissionsTreeResponse) {
  return getAllTreePermissions(tree)
    .filter((permission) => permission.is_assigned)
    .map((permission) => String(permission.workspace_application_permission_id))
}

function getAllTreePermissions(tree: RolePermissionsTreeResponse) {
  return [
    ...tree.modules.flatMap((module) => module.permissions),
    ...tree.without_module,
  ]
}

function areSameIds(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false
  }

  const rightSet = new Set(right)

  return left.every((item) => rightSet.has(item))
}

interface RolePermissionsTreeProps {
  tree: RolePermissionsTreeResponse
  selectedPermissionIds: string[]
  collapsedModules: Set<string>
  onTogglePermission: (permissionId: EntityId) => void
  onToggleModule: (module: ModulePermissionGroup) => void
  onSelectModule: (module: ModulePermissionGroup) => void
  onClearModule: (module: ModulePermissionGroup) => void
  onToggleCollapsedModule: (moduleKey: string) => void
}

function RolePermissionsTree({
  tree,
  selectedPermissionIds,
  collapsedModules,
  onTogglePermission,
  onToggleModule,
  onSelectModule,
  onClearModule,
  onToggleCollapsedModule,
}: RolePermissionsTreeProps) {
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

  if (groups.length === 0 || getAllTreePermissions(tree).length === 0) {
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
          <p className="permission-detail-card__label">Aplicación / Rol</p>
          <h3>
            {tree.application?.workspace_application_name ?? 'Aplicación'} /{' '}
            {tree.role.workspace_application_role_name}
          </h3>
        </div>
        <span className="permissions-tree__count">
          {selectedPermissionIds.length} / {getAllTreePermissions(tree).length} seleccionados
        </span>
      </div>

      {groups.map((module) => {
        const moduleKey = String(module.workspace_application_module_id)

        return (
          <RolePermissionsModule
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

interface RolePermissionsModuleProps {
  module: ModulePermissionGroup
  selectedPermissionIds: string[]
  isCollapsed: boolean
  onToggleCollapsed: () => void
  onToggleModule: (module: ModulePermissionGroup) => void
  onSelectModule: (module: ModulePermissionGroup) => void
  onClearModule: (module: ModulePermissionGroup) => void
  onTogglePermission: (permissionId: EntityId) => void
}

function RolePermissionsModule({
  module,
  selectedPermissionIds,
  isCollapsed,
  onToggleCollapsed,
  onToggleModule,
  onSelectModule,
  onClearModule,
  onTogglePermission,
}: RolePermissionsModuleProps) {
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
              </label>
            )
          })}

          {module.permissions.length === 0 ? (
            <p className="text-muted">Este módulo no tiene permisos.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function getSelectedCount(
  permissions: WorkspaceApplicationPermissionWithAssigned[],
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
export function WorkspaceApplicationRolePermissionDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceApplicationRolePermissionId =
    params.workspaceApplicationRolePermissionId ?? ''
  const query = useWorkspaceApplicationRolePermissionQuery(
    workspaceApplicationRolePermissionId,
  )
  const rolesQuery = useWorkspaceApplicationRolesQuery()
  const permissionsQuery = useWorkspaceApplicationPermissionsQuery()
  const updateMutation = useUpdateWorkspaceApplicationRolePermissionMutation(
    workspaceApplicationRolePermissionId,
  )
  const deleteMutation = useDeleteWorkspaceApplicationRolePermissionMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const roleOptions = useMemo(
    () =>
      (rolesQuery.data ?? []).map((role) => ({
        label: `${
          role.workspace_application?.workspace_application_name ?? 'App'
        } / ${role.workspace_application_role_name}`,
        value: String(role.workspace_application_role_id),
      })),
    [rolesQuery.data],
  )
  const permissionOptions = useMemo(
    () =>
      (permissionsQuery.data ?? []).map((permission) => ({
        label: `${
          permission.workspace_application?.workspace_application_name ?? 'App'
        } / ${permission.workspace_application_permission_name}`,
        value: String(permission.workspace_application_permission_id),
      })),
    [permissionsQuery.data],
  )
  const form = useForm<UpdateWorkspaceApplicationRolePermissionDto>({
    resolver: zodResolver(workspaceApplicationRolePermissionSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!query.data) {
      return
    }

    form.reset({
      workspace_application_role_permission_war_id: String(
        query.data.workspace_application_role_permission_war_id,
      ),
      workspace_application_role_permission_wap_id: String(
        query.data.workspace_application_role_permission_wap_id,
      ),
    })
  }, [form, query.data])

  async function handleSubmit(values: UpdateWorkspaceApplicationRolePermissionDto) {
    await updateMutation.mutateAsync(values)
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceApplicationRolePermissionId)
    navigate(APP_ROUTES.applicationRolePermissions, { replace: true })
  }

  if (query.isLoading || rolesQuery.isLoading || permissionsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando relación rol-permiso..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  if (rolesQuery.error) {
    return <ErrorState description={getErrorMessage(rolesQuery.error)} />
  }

  if (permissionsQuery.error) {
    return <ErrorState description={getErrorMessage(permissionsQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de permiso heredado"
      description="Edita la relación entre un rol interno y un permiso de aplicación."
    >
      <SectionCard
        title="Editar relación"
        description={`ID ${workspaceApplicationRolePermissionId}`}
      >
        <ResourceForm
          form={form}
          fields={buildFields(roleOptions, permissionOptions)}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.applicationRolePermissions)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Eliminar esta relación cambia los permisos efectivos del rol interno."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar relación
            </Button>
          }
        >
          <p className="text-muted">
            La eliminación dejará de heredar este permiso a los usuarios con ese rol interno.
          </p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar relación"
        description="Esta acción eliminará la relación entre rol interno y permiso."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
