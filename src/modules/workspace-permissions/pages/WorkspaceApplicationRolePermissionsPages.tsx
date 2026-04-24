import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { Modal } from '@/components/base/Modal'
import { ResourceTable } from '@/components/base/ResourceTable'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { FormActions } from '@/components/forms/FormActions'
import { ResourceForm, type ResourceFormField } from '@/components/forms/ResourceForm'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import { useWorkspaceApplicationRolesQuery } from '@/modules/workspace-application-roles/hooks/useWorkspaceApplicationRolesQuery'
import {
  useCreateWorkspaceApplicationRolePermissionMutation,
  useDeleteWorkspaceApplicationRolePermissionMutation,
  useUpdateWorkspaceApplicationRolePermissionMutation,
  useWorkspaceApplicationPermissionsQuery,
  useWorkspaceApplicationRolePermissionQuery,
  useWorkspaceApplicationRolePermissionsQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import type {
  CreateWorkspaceApplicationRolePermissionDto,
  UpdateWorkspaceApplicationRolePermissionDto,
  WorkspaceApplicationRolePermission,
} from '@/modules/workspace-permissions/types/workspace-permission.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
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

function buildRoleLabel(item: WorkspaceApplicationRolePermission) {
  const role = item.workspace_application_role
  const applicationName =
    role?.workspace_application?.workspace_application_name ??
    `Aplicación #${role?.workspace_application_role_workspace_application_id ?? 'N/A'}`

  return role
    ? `${applicationName} / ${role.workspace_application_role_name}`
    : `Rol #${item.workspace_application_role_permission_war_id}`
}

function buildPermissionLabel(item: WorkspaceApplicationRolePermission) {
  const permission = item.workspace_application_permission
  const applicationName =
    permission?.workspace_application?.workspace_application_name ??
    `Aplicación #${permission?.workspace_application_permission_workspace_application_id ?? 'N/A'}`

  return permission
    ? `${applicationName} / ${permission.workspace_application_permission_name}`
    : `Permiso #${item.workspace_application_role_permission_wap_id}`
}

export function WorkspaceApplicationRolePermissionsPage() {
  const query = useWorkspaceApplicationRolePermissionsQuery()
  const rolesQuery = useWorkspaceApplicationRolesQuery()
  const permissionsQuery = useWorkspaceApplicationPermissionsQuery()
  const createMutation = useCreateWorkspaceApplicationRolePermissionMutation()
  const deleteMutation = useDeleteWorkspaceApplicationRolePermissionMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [itemToDelete, setItemToDelete] =
    useState<WorkspaceApplicationRolePermission | null>(null)
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
  const form = useForm<CreateWorkspaceApplicationRolePermissionDto>({
    resolver: zodResolver(workspaceApplicationRolePermissionSchema),
    defaultValues,
  })

  async function handleCreate(values: CreateWorkspaceApplicationRolePermissionDto) {
    await createMutation.mutateAsync(values)
    form.reset(defaultValues)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_application_role_permission_id)
    setItemToDelete(null)
  }

  if (query.isLoading || rolesQuery.isLoading || permissionsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando permisos por rol interno..." />
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
      title="Permisos de rol interno"
      description="Relaciona cada rol interno con los permisos que hereda dentro de su aplicación."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nueva relación
        </Button>
      }
    >
      <SectionCard
        title="Listado"
        description="Cada fila vincula un rol interno con un permiso del mismo contexto de aplicación."
      >
        <ResourceTable
          caption="Workspace application role permissions"
          columns={[
            {
              key: 'role',
              header: 'Rol interno',
              cell: (row) => buildRoleLabel(row),
            },
            {
              key: 'permission',
              header: 'Permiso',
              cell: (row) => buildPermissionLabel(row),
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.applicationRolePermission(
                      row.workspace_application_role_permission_id,
                    )}
                  >
                    Abrir
                  </Link>
                  <AccessGuard allowedRoles={['super_admin']}>
                    <Button
                      variant="danger"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => setItemToDelete(row)}
                    >
                      Eliminar
                    </Button>
                  </AccessGuard>
                </div>
              ),
            },
          ]}
          data={query.data ?? []}
          getRowId={(row) => row.workspace_application_role_permission_id}
          emptyTitle="Sin relaciones"
          emptyDescription="Todavía no hay permisos heredados asignados a roles internos."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear relación rol-permiso"
        description="El backend valida que ambos registros pertenezcan a la misma aplicación."
      >
        <ResourceForm
          form={form}
          fields={buildFields(roleOptions, permissionOptions)}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear relación"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar relación"
        description="Se eliminará la herencia de este permiso dentro del rol interno."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
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
