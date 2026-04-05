import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { Modal } from '@/components/base/Modal'
import { ResourceTable } from '@/components/base/ResourceTable'
import { AccessStatusBadge } from '@/components/feedback/AccessStatusBadge'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AssignmentSummaryCard } from '@/components/layout/AssignmentSummaryCard'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { SectionCard } from '@/components/layout/SectionCard'
import { FormActions } from '@/components/forms/FormActions'
import { ResourceForm } from '@/components/forms/ResourceForm'
import {
  useCreateWorkspaceApplicationPermissionMutation,
  useDeleteWorkspaceApplicationPermissionMutation,
  useDeleteWorkspaceUserApplicationPermissionMutation,
  useUpdateWorkspaceApplicationPermissionMutation,
  useWorkspaceApplicationPermissionQuery,
  useWorkspaceApplicationPermissionsQuery,
  useWorkspaceUserApplicationPermissionQuery,
  useWorkspaceUserApplicationPermissionsQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import type {
  CreateWorkspaceApplicationPermissionDto,
  UpdateWorkspaceApplicationPermissionDto,
  WorkspaceApplicationPermission,
  WorkspaceUserApplicationPermission,
} from '@/modules/workspace-permissions/types/workspace-permission.types'
import { getWorkspaceUserApplicationSummary } from '@/modules/workspace-user-applications/utils/access-display'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const applicationPermissionSchema = z.object({
  workspace_application_permission_workspace_application_id: z
    .string()
    .trim()
    .min(1, 'El ID de aplicación es obligatorio'),
  workspace_application_permission_name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio'),
  workspace_application_permission_slug: z
    .string()
    .trim()
    .min(1, 'El slug es obligatorio'),
  workspace_application_permission_description: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
})

const applicationPermissionDefaults: CreateWorkspaceApplicationPermissionDto = {
  workspace_application_permission_workspace_application_id: '',
  workspace_application_permission_name: '',
  workspace_application_permission_slug: '',
  workspace_application_permission_description: '',
}

const applicationPermissionFields = [
  {
    name: 'workspace_application_permission_workspace_application_id',
    label: 'ID de aplicación',
    placeholder: '5',
  },
  {
    name: 'workspace_application_permission_name',
    label: 'Nombre',
    placeholder: 'Read',
  },
  {
    name: 'workspace_application_permission_slug',
    label: 'Slug',
    placeholder: 'read',
  },
  {
    name: 'workspace_application_permission_description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Can read records',
  },
] as const

export function WorkspaceApplicationPermissionsPage() {
  const query = useWorkspaceApplicationPermissionsQuery()
  const createMutation = useCreateWorkspaceApplicationPermissionMutation()
  const deleteMutation = useDeleteWorkspaceApplicationPermissionMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<WorkspaceApplicationPermission | null>(null)
  const form = useForm<CreateWorkspaceApplicationPermissionDto>({
    resolver: zodResolver(applicationPermissionSchema),
    defaultValues: applicationPermissionDefaults,
  })

  async function handleCreate(values: CreateWorkspaceApplicationPermissionDto) {
    await createMutation.mutateAsync({
      ...values,
      workspace_application_permission_description:
        values.workspace_application_permission_description || undefined,
    })
    form.reset(applicationPermissionDefaults)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_application_permission_id)
    setItemToDelete(null)
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando permisos por aplicación..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Permisos por aplicación"
      description="Permisos disponibles dentro de cada aplicación registrada."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo permiso
        </Button>
      }
    >
      <SectionCard title="Listado" description="Permisos globales disponibles por aplicación.">
        <ResourceTable
          caption="Workspace application permissions"
          columns={[
            {
              key: 'name',
              header: 'Permiso',
              cell: (row) => row.workspace_application_permission_name,
            },
            {
              key: 'slug',
              header: 'Slug',
              cell: (row) => row.workspace_application_permission_slug,
            },
            {
              key: 'application',
              header: 'Aplicación',
              cell: (row) =>
                row.workspace_application?.workspace_application_name ??
                `Aplicación #${row.workspace_application_permission_workspace_application_id}`,
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.applicationPermission(
                      row.workspace_application_permission_id,
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
          getRowId={(row) => row.workspace_application_permission_id}
          emptyTitle="Sin permisos"
          emptyDescription="Todavía no hay permisos registrados."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear permiso"
        description="Usa IDs explícitos mientras el backend mantenga el catálogo de aplicaciones restringido por rol."
      >
        <ResourceForm
          form={form}
          fields={applicationPermissionFields}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear permiso"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar permiso"
        description="Se eliminará el permiso seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceApplicationPermissionDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceApplicationPermissionId = params.workspaceApplicationPermissionId ?? ''
  const query = useWorkspaceApplicationPermissionQuery(workspaceApplicationPermissionId)
  const updateMutation =
    useUpdateWorkspaceApplicationPermissionMutation(workspaceApplicationPermissionId)
  const deleteMutation = useDeleteWorkspaceApplicationPermissionMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const form = useForm<UpdateWorkspaceApplicationPermissionDto>({
    resolver: zodResolver(applicationPermissionSchema),
    defaultValues: applicationPermissionDefaults,
  })

  useEffect(() => {
    if (!query.data) {
      return
    }

    form.reset({
      workspace_application_permission_workspace_application_id: String(
        query.data.workspace_application_permission_workspace_application_id,
      ),
      workspace_application_permission_name:
        query.data.workspace_application_permission_name,
      workspace_application_permission_slug:
        query.data.workspace_application_permission_slug,
      workspace_application_permission_description:
        query.data.workspace_application_permission_description ?? '',
    })
  }, [form, query.data])

  async function handleSubmit(values: UpdateWorkspaceApplicationPermissionDto) {
    await updateMutation.mutateAsync({
      ...values,
      workspace_application_permission_description:
        values.workspace_application_permission_description || undefined,
    })
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceApplicationPermissionId)
    navigate(APP_ROUTES.applicationPermissions, { replace: true })
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando permiso..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de permiso"
      description="Edición del recurso `workspace-application-permissions`."
    >
      <SectionCard title="Editar permiso" description={`ID ${workspaceApplicationPermissionId}`}>
        <ResourceForm
          form={form}
          fields={applicationPermissionFields}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.applicationPermissions)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Eliminar este permiso requiere permisos de super admin."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar permiso
            </Button>
          }
        >
          <p className="text-muted">Esta acción removerá el permiso del catálogo global.</p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar permiso"
        description="Esta acción eliminará el permiso seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceUserApplicationPermissionsPage() {
  const query = useWorkspaceUserApplicationPermissionsQuery()
  const deleteMutation = useDeleteWorkspaceUserApplicationPermissionMutation()
  const [itemToDelete, setItemToDelete] = useState<WorkspaceUserApplicationPermission | null>(
    null,
  )

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_user_application_permission_id)
    setItemToDelete(null)
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando permisos asignados al usuario..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Permisos asignados al usuario"
      description="Vista de consulta de asignaciones. La edición real ahora se hace desde el acceso usuario-app."
    >
      <SectionCard
        title="Listado"
        description="Usa el acceso usuario-app como contexto principal para asignar o revocar permisos."
      >
        <ResourceTable
          caption="Workspace user application permissions"
          columns={[
            {
              key: 'user',
              header: 'Usuario',
              cell: (row) =>
                row.workspace_user_application
                  ? getWorkspaceUserApplicationSummary(row.workspace_user_application).userName
                  : `Acceso #${row.workspace_user_application_permission_wua_id}`,
            },
            {
              key: 'email',
              header: 'Email',
              cell: (row) =>
                row.workspace_user_application
                  ? getWorkspaceUserApplicationSummary(row.workspace_user_application).userEmail ??
                    'Sin email disponible'
                  : 'Sin contexto disponible',
            },
            {
              key: 'application',
              header: 'Aplicación',
              cell: (row) =>
                row.workspace_user_application
                  ? getWorkspaceUserApplicationSummary(row.workspace_user_application)
                      .applicationName
                  : `Acceso #${row.workspace_user_application_permission_wua_id}`,
            },
            {
              key: 'permission',
              header: 'Permiso',
              cell: (row) =>
                row.workspace_application_permission?.workspace_application_permission_name ??
                `Permiso #${row.workspace_user_application_permission_wap_id}`,
            },
            {
              key: 'status',
              header: 'Estado acceso',
              cell: (row) =>
                row.workspace_user_application ? (
                  <AccessStatusBadge
                    isActive={row.workspace_user_application.workspace_user_application_is_active}
                  />
                ) : (
                  'Sin estado'
                ),
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  {row.workspace_user_application ? (
                    <Link
                      className="button button--secondary"
                      to={detailRoutes.userApplication(
                        row.workspace_user_application.workspace_user_application_id,
                      )}
                    >
                      Gestionar acceso
                    </Link>
                  ) : null}
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.userApplicationPermission(
                      row.workspace_user_application_permission_id,
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
          getRowId={(row) => row.workspace_user_application_permission_id}
          emptyTitle="Sin asignaciones"
          emptyDescription="Todavía no hay permisos asignados a usuarios dentro de apps."
        />
      </SectionCard>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar asignación"
        description="Se eliminará la relación entre acceso y permiso."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceUserApplicationPermissionDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceUserApplicationPermissionId =
    params.workspaceUserApplicationPermissionId ?? ''
  const query = useWorkspaceUserApplicationPermissionQuery(
    workspaceUserApplicationPermissionId,
  )
  const deleteMutation = useDeleteWorkspaceUserApplicationPermissionMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceUserApplicationPermissionId)
    navigate(APP_ROUTES.userApplicationPermissions, { replace: true })
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando asignación de permiso..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  if (!query.data) {
    return <ErrorState description="No se encontró la asignación solicitada." />
  }

  const accessSummary = query.data.workspace_user_application
    ? getWorkspaceUserApplicationSummary(query.data.workspace_user_application)
    : null

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de permiso asignado"
      description="Esta vista es de consulta. Para editar la asignación usa el acceso usuario-app correspondiente."
    >
      <SectionCard title="Resumen de asignación" description={`ID ${workspaceUserApplicationPermissionId}`}>
        <div className="crud-grid">
          {accessSummary ? (
            <AssignmentSummaryCard
              userName={accessSummary.userName}
              userEmail={accessSummary.userEmail}
              applicationName={accessSummary.applicationName}
              isActive={accessSummary.isActive}
              permissionsCount={1}
            />
          ) : (
            <p className="text-muted">
              No llegó contexto expandido del acceso en la respuesta del backend.
            </p>
          )}
          <div className="permission-detail-card">
            <p className="permission-detail-card__label">Permiso asignado</p>
            <div className="permission-badge-list">
              <PermissionBadge
                label={
                  query.data.workspace_application_permission?.workspace_application_permission_name ??
                  `Permiso #${query.data.workspace_user_application_permission_wap_id}`
                }
              />
              {query.data.workspace_application_permission?.workspace_application_permission_slug ? (
                <PermissionBadge
                  label={
                    query.data.workspace_application_permission
                      .workspace_application_permission_slug
                  }
                />
              ) : null}
            </div>
          </div>
          <div className="resource-table__actions">
            <Link
              className="button button--secondary"
              to={detailRoutes.userApplication(
                query.data.workspace_user_application_permission_wua_id,
              )}
            >
              Gestionar desde el acceso
            </Link>
            <Button variant="ghost" onClick={() => navigate(APP_ROUTES.userApplicationPermissions)}>
              Volver al listado
            </Button>
          </div>
        </div>
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Eliminar esta relación requiere permisos de super admin."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar asignación
            </Button>
          }
        >
          <p className="text-muted">Esta acción removerá el permiso específico del usuario en la app.</p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar asignación"
        description="Esta acción eliminará la relación entre acceso y permiso."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
