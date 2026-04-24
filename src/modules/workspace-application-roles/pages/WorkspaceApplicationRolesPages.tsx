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
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { FormActions } from '@/components/forms/FormActions'
import { PermissionsChecklist } from '@/components/forms/PermissionsChecklist'
import { ResourceForm, type ResourceFormField } from '@/components/forms/ResourceForm'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import { useWorkspaceApplicationsQuery } from '@/modules/workspace-applications/hooks/useWorkspaceApplicationsQuery'
import {
  useCreateWorkspaceApplicationRoleMutation,
  useDeleteWorkspaceApplicationRoleMutation,
  useUpdateWorkspaceApplicationRoleMutation,
  useWorkspaceApplicationRoleQuery,
  useWorkspaceApplicationRolesQuery,
} from '@/modules/workspace-application-roles/hooks/useWorkspaceApplicationRolesQuery'
import {
  useSyncWorkspaceApplicationRolePermissionsMutation,
  useWorkspaceApplicationPermissionsByApplicationQuery,
  useWorkspaceApplicationRolePermissionsByRoleQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import type {
  CreateWorkspaceApplicationRoleDto,
  UpdateWorkspaceApplicationRoleDto,
  WorkspaceApplicationRole,
} from '@/modules/workspace-application-roles/types/workspace-application-role.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const workspaceApplicationRoleSchema = z.object({
  workspace_application_role_workspace_application_id: z
    .string()
    .trim()
    .min(1, 'Selecciona una aplicación.'),
  workspace_application_role_name: z.string().trim().min(1, 'El nombre es obligatorio'),
  workspace_application_role_slug: z.string().trim().min(1, 'El slug es obligatorio'),
  workspace_application_role_description: z.string().trim().optional().or(z.literal('')),
  workspace_application_role_is_active: z.boolean(),
})

const defaultValues: CreateWorkspaceApplicationRoleDto = {
  workspace_application_role_workspace_application_id: '',
  workspace_application_role_name: '',
  workspace_application_role_slug: '',
  workspace_application_role_description: '',
  workspace_application_role_is_active: true,
}

function buildFields(
  applicationOptions: Array<{ label: string; value: string }>,
): Array<ResourceFormField<CreateWorkspaceApplicationRoleDto>> {
  return [
    {
      name: 'workspace_application_role_workspace_application_id',
      label: 'Aplicación',
      type: 'select',
      options: applicationOptions,
    },
    {
      name: 'workspace_application_role_name',
      label: 'Nombre',
      placeholder: 'Coordinador',
    },
    {
      name: 'workspace_application_role_slug',
      label: 'Slug',
      placeholder: 'coordinador',
    },
    {
      name: 'workspace_application_role_description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Responsable de coordinar la operación dentro de la app.',
    },
    {
      name: 'workspace_application_role_is_active',
      label: 'Rol activo',
      type: 'checkbox',
    },
  ]
}

export function WorkspaceApplicationRolesPage() {
  const rolesQuery = useWorkspaceApplicationRolesQuery()
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const createMutation = useCreateWorkspaceApplicationRoleMutation()
  const deleteMutation = useDeleteWorkspaceApplicationRoleMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<WorkspaceApplicationRole | null>(null)
  const applicationOptions = useMemo(
    () =>
      (applicationsQuery.data ?? []).map((application) => ({
        label: application.workspace_application_name,
        value: String(application.workspace_application_id),
      })),
    [applicationsQuery.data],
  )
  const form = useForm<CreateWorkspaceApplicationRoleDto>({
    resolver: zodResolver(workspaceApplicationRoleSchema),
    defaultValues,
  })

  async function handleCreate(values: CreateWorkspaceApplicationRoleDto) {
    await createMutation.mutateAsync({
      ...values,
      workspace_application_role_description:
        values.workspace_application_role_description || undefined,
    })
    form.reset(defaultValues)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!roleToDelete) {
      return
    }

    await deleteMutation.mutateAsync(roleToDelete.workspace_application_role_id)
    setRoleToDelete(null)
  }

  if (rolesQuery.isLoading || applicationsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando roles internos por aplicación..." />
  }

  if (rolesQuery.error) {
    return <ErrorState description={getErrorMessage(rolesQuery.error)} />
  }

  if (applicationsQuery.error) {
    return <ErrorState description={getErrorMessage(applicationsQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Roles por aplicación"
      description="Cada aplicación define sus propios roles internos dentro del workspace."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo rol interno
        </Button>
      }
    >
      <SectionCard
        title="Listado"
        description="Catálogo de roles internos disponibles por aplicación."
      >
        <ResourceTable
          caption="Workspace application roles"
          columns={[
            {
              key: 'application',
              header: 'Aplicación',
              cell: (row) =>
                row.workspace_application?.workspace_application_name ??
                `Aplicación #${row.workspace_application_role_workspace_application_id}`,
            },
            {
              key: 'name',
              header: 'Rol',
              cell: (row) => row.workspace_application_role_name,
            },
            {
              key: 'slug',
              header: 'Slug',
              cell: (row) => row.workspace_application_role_slug,
            },
            {
              key: 'permissions',
              header: 'Permisos',
              cell: (row) => row.application_permissions?.length ?? 0,
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => (
                <StatusBadge
                  label={row.workspace_application_role_is_active ? 'Activo' : 'Inactivo'}
                  tone={row.workspace_application_role_is_active ? 'success' : 'warning'}
                />
              ),
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.applicationRole(row.workspace_application_role_id)}
                  >
                    Abrir
                  </Link>
                  <AccessGuard allowedRoles={['super_admin']}>
                    <Button
                      variant="danger"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => setRoleToDelete(row)}
                    >
                      Eliminar
                    </Button>
                  </AccessGuard>
                </div>
              ),
            },
          ]}
          data={rolesQuery.data ?? []}
          getRowId={(row) => row.workspace_application_role_id}
          emptyTitle="Sin roles internos"
          emptyDescription="Todavía no se han creado roles dentro de las aplicaciones."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear rol interno"
        description="Define el rol dentro de una aplicación específica y si queda activo."
      >
        <ResourceForm
          form={form}
          fields={buildFields(applicationOptions)}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear rol"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(roleToDelete)}
        title="Eliminar rol interno"
        description="Se eliminará el rol interno y sus relaciones de permisos."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceApplicationRoleDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceApplicationRoleId = params.workspaceApplicationRoleId ?? ''
  const roleQuery = useWorkspaceApplicationRoleQuery(workspaceApplicationRoleId)
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const rolePermissionsQuery =
    useWorkspaceApplicationRolePermissionsByRoleQuery(workspaceApplicationRoleId)
  const availablePermissionsQuery =
    useWorkspaceApplicationPermissionsByApplicationQuery(
      roleQuery.data?.workspace_application_role_workspace_application_id,
    )
  const updateMutation = useUpdateWorkspaceApplicationRoleMutation(workspaceApplicationRoleId)
  const syncPermissionsMutation =
    useSyncWorkspaceApplicationRolePermissionsMutation()
  const deleteMutation = useDeleteWorkspaceApplicationRoleMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const applicationOptions = useMemo(
    () =>
      (applicationsQuery.data ?? []).map((application) => ({
        label: application.workspace_application_name,
        value: String(application.workspace_application_id),
      })),
    [applicationsQuery.data],
  )
  const form = useForm<UpdateWorkspaceApplicationRoleDto>({
    resolver: zodResolver(workspaceApplicationRoleSchema),
    defaultValues,
  })
  const selectedPermissionIds = useMemo(
    () =>
      (rolePermissionsQuery.data ?? []).map((permission) =>
        String(permission.workspace_application_role_permission_wap_id),
      ),
    [rolePermissionsQuery.data],
  )

  useEffect(() => {
    if (!roleQuery.data) {
      return
    }

    form.reset({
      workspace_application_role_workspace_application_id: String(
        roleQuery.data.workspace_application_role_workspace_application_id,
      ),
      workspace_application_role_name: roleQuery.data.workspace_application_role_name,
      workspace_application_role_slug: roleQuery.data.workspace_application_role_slug,
      workspace_application_role_description:
        roleQuery.data.workspace_application_role_description ?? '',
      workspace_application_role_is_active:
        roleQuery.data.workspace_application_role_is_active,
    })
  }, [form, roleQuery.data])

  async function handleSubmit(values: UpdateWorkspaceApplicationRoleDto) {
    await updateMutation.mutateAsync({
      ...values,
      workspace_application_role_description:
        values.workspace_application_role_description || undefined,
    })
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceApplicationRoleId)
    navigate(APP_ROUTES.applicationRoles, { replace: true })
  }

  async function handleTogglePermission(permissionId: string) {
    const current = new Set(selectedPermissionIds)
    const nextPermissionIds = current.has(permissionId)
      ? selectedPermissionIds.filter((item) => item !== permissionId)
      : [...selectedPermissionIds, permissionId]

    await syncPermissionsMutation.mutateAsync({
      workspaceApplicationRoleId,
      currentAssignments: rolePermissionsQuery.data ?? [],
      selectedPermissionIds: nextPermissionIds,
    })
  }

  if (roleQuery.isLoading || applicationsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando rol interno..." />
  }

  if (roleQuery.error) {
    return <ErrorState description={getErrorMessage(roleQuery.error)} />
  }

  if (applicationsQuery.error) {
    return <ErrorState description={getErrorMessage(applicationsQuery.error)} />
  }

  if (rolePermissionsQuery.error) {
    return <ErrorState description={getErrorMessage(rolePermissionsQuery.error)} />
  }

  if (availablePermissionsQuery.error) {
    return <ErrorState description={getErrorMessage(availablePermissionsQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de rol interno"
      description="Edita el rol interno de una aplicación y su estado operativo."
    >
      <SectionCard title="Editar rol interno" description={`ID ${workspaceApplicationRoleId}`}>
        <ResourceForm
          form={form}
          fields={buildFields(applicationOptions)}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.applicationRoles)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <SectionCard
        title="Permisos del rol"
        description="Marca los permisos que hereda este rol interno agrupados por módulo."
      >
        {rolePermissionsQuery.isLoading || availablePermissionsQuery.isLoading ? (
          <LoadingState message="Cargando permisos del rol..." />
        ) : null}
        {!rolePermissionsQuery.isLoading && !availablePermissionsQuery.isLoading ? (
          (availablePermissionsQuery.data ?? []).length ? (
            <PermissionsChecklist
              permissions={availablePermissionsQuery.data ?? []}
              selectedPermissionIds={selectedPermissionIds}
              disabled={syncPermissionsMutation.isPending}
              onToggle={(permissionId) => void handleTogglePermission(permissionId)}
            />
          ) : (
            <p className="text-muted">
              Esta aplicación todavía no tiene permisos configurados.
            </p>
          )
        ) : null}
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Eliminar este rol afecta accesos de usuarios y permisos heredados."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar rol interno
            </Button>
          }
        >
          <p className="text-muted">
            Esta acción removerá también las relaciones del rol con permisos y accesos.
          </p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar rol interno"
        description="Esta acción eliminará el rol interno seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
