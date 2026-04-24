import { Plus, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { Modal } from '@/components/base/Modal'
import { ResourceTable } from '@/components/base/ResourceTable'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AccessStatusBadge } from '@/components/feedback/AccessStatusBadge'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { SectionCard } from '@/components/layout/SectionCard'
import { useWorkspaceApplicationsQuery } from '@/modules/workspace-applications/hooks/useWorkspaceApplicationsQuery'
import { useWorkspaceApplicationRolesQuery } from '@/modules/workspace-application-roles/hooks/useWorkspaceApplicationRolesQuery'
import {
  useWorkspaceUserApplicationPermissionsByAccessQuery,
  useWorkspaceUserApplicationPermissionsQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import { WorkspaceUserApplicationForm } from '@/modules/workspace-user-applications/components/WorkspaceUserApplicationForm'
import { AccessPermissionsDrawer } from '@/modules/workspace-user-applications/components/AccessPermissionsDrawer'
import {
  useCreateWorkspaceUserApplicationMutation,
  useDeleteWorkspaceUserApplicationMutation,
  useUpdateWorkspaceUserApplicationMutation,
  useWorkspaceUserApplicationQuery,
  useWorkspaceUserApplicationsQuery,
} from '@/modules/workspace-user-applications/hooks/useWorkspaceUserApplicationsQuery'
import type {
  CreateWorkspaceUserApplicationDto,
  WorkspaceUserApplication,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import { getWorkspaceUserApplicationSummary } from '@/modules/workspace-user-applications/utils/access-display'
import { useWorkspaceUsersQuery } from '@/modules/workspace-users/hooks/useWorkspaceUsersQuery'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

function buildPermissionCountMap(items: { workspace_user_application_permission_wua_id: string | number }[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const accessId = String(item.workspace_user_application_permission_wua_id)
    accumulator[accessId] = (accumulator[accessId] ?? 0) + 1
    return accumulator
  }, {})
}

function buildEffectivePermissionCountMap(items: WorkspaceUserApplication[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[String(item.workspace_user_application_id)] =
      item.workspace_user_application_effective_permissions?.length ?? 0
    return accumulator
  }, {})
}

function getApplicationFallbacks(items: WorkspaceUserApplication[]) {
  const map = new Map<string, NonNullable<WorkspaceUserApplication['workspace_application']>>()

  for (const item of items) {
    if (!item.workspace_application) {
      continue
    }

    map.set(String(item.workspace_application.workspace_application_id), item.workspace_application)
  }

  return [...map.values()]
}

export function WorkspaceUserApplicationsPage() {
  const itemsQuery = useWorkspaceUserApplicationsQuery()
  const usersQuery = useWorkspaceUsersQuery()
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const applicationRolesQuery = useWorkspaceApplicationRolesQuery()
  const assignedPermissionsQuery = useWorkspaceUserApplicationPermissionsQuery()
  const createMutation = useCreateWorkspaceUserApplicationMutation()
  const deleteMutation = useDeleteWorkspaceUserApplicationMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [managedAccess, setManagedAccess] = useState<WorkspaceUserApplication | null>(null)
  const [itemToDelete, setItemToDelete] = useState<WorkspaceUserApplication | null>(null)

  const fallbackApplications = useMemo(
    () => getApplicationFallbacks(itemsQuery.data ?? []),
    [itemsQuery.data],
  )
  const applications = applicationsQuery.data ?? fallbackApplications
  const applicationRoles = applicationRolesQuery.data ?? []
  const permissionCountMap = useMemo(
    () => buildPermissionCountMap(assignedPermissionsQuery.data ?? []),
    [assignedPermissionsQuery.data],
  )
  const effectivePermissionCountMap = useMemo(
    () => buildEffectivePermissionCountMap(itemsQuery.data ?? []),
    [itemsQuery.data],
  )

  async function handleCreate(values: CreateWorkspaceUserApplicationDto) {
    await createMutation.mutateAsync(values)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_user_application_id)
    setItemToDelete(null)
  }

  if (itemsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando accesos de usuario a aplicaciones..." />
  }

  if (itemsQuery.error) {
    return <ErrorState description={getErrorMessage(itemsQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Accesos de usuario a aplicaciones"
      description="Gestiona accesos y permisos desde el contexto humano de cada usuario dentro de cada app."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo acceso
        </Button>
      }
    >
      <SectionCard
        title="Listado"
        description="Cada fila representa el acceso de un usuario a una aplicación y su contexto de permisos."
      >
        <ResourceTable
          caption="Workspace user applications"
          columns={[
            {
              key: 'user',
              header: 'Usuario',
              cell: (row) => getWorkspaceUserApplicationSummary(row).userName,
            },
            {
              key: 'email',
              header: 'Email',
              cell: (row) =>
                getWorkspaceUserApplicationSummary(row).userEmail ?? 'Sin email disponible',
            },
            {
              key: 'application',
              header: 'Aplicación',
              cell: (row) => getWorkspaceUserApplicationSummary(row).applicationName,
            },
            {
              key: 'application-role',
              header: 'Rol interno',
              cell: (row) =>
                row.workspace_application_role?.workspace_application_role_name ?? 'Sin rol',
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => (
                <AccessStatusBadge isActive={row.workspace_user_application_is_active} />
              ),
            },
            {
              key: 'permissions',
              header: 'Permisos directos',
              cell: (row) => permissionCountMap[String(row.workspace_user_application_id)] ?? 0,
            },
            {
              key: 'effective-permissions',
              header: 'Permisos efectivos',
              cell: (row) =>
                effectivePermissionCountMap[String(row.workspace_user_application_id)] ?? 0,
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Button
                    variant="secondary"
                    leftIcon={<ShieldCheck size={16} />}
                    onClick={() => setManagedAccess(row)}
                  >
                    Gestionar permisos
                  </Button>
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.userApplication(row.workspace_user_application_id)}
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
          data={itemsQuery.data ?? []}
          getRowId={(row) => row.workspace_user_application_id}
          emptyTitle="Sin accesos"
          emptyDescription="Todavía no hay relaciones usuario-aplicación."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear acceso"
        description="Selecciona el usuario y la aplicación desde buscadores y define si el acceso queda activo."
      >
        {usersQuery.isLoading || applicationsQuery.isLoading || applicationRolesQuery.isLoading ? (
          <LoadingState message="Cargando catálogo para crear el acceso..." />
        ) : null}
        {usersQuery.error ? <ErrorState description={getErrorMessage(usersQuery.error)} /> : null}
        {applicationsQuery.error && applications.length === 0 ? (
          <ErrorState description={getErrorMessage(applicationsQuery.error)} />
        ) : null}
        {applicationRolesQuery.error ? (
          <ErrorState description={getErrorMessage(applicationRolesQuery.error)} />
        ) : null}
        {!usersQuery.isLoading &&
        !applicationsQuery.isLoading &&
        !applicationRolesQuery.isLoading &&
        !usersQuery.error &&
        !applicationRolesQuery.error &&
        !(applicationsQuery.error && applications.length === 0) ? (
          <WorkspaceUserApplicationForm
            users={usersQuery.data ?? []}
            applications={applications}
            applicationRoles={applicationRoles}
            submitLabel="Crear acceso"
            submitIcon={<Save size={16} />}
            onCancel={() => setIsCreateOpen(false)}
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
          />
        ) : null}
      </Modal>

      <AccessPermissionsDrawer
        access={managedAccess}
        isOpen={Boolean(managedAccess)}
        onClose={() => setManagedAccess(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar acceso"
        description="Se eliminará el acceso del usuario a la aplicación seleccionada."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceUserApplicationDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceUserApplicationId = params.workspaceUserApplicationId ?? ''
  const itemQuery = useWorkspaceUserApplicationQuery(workspaceUserApplicationId)
  const usersQuery = useWorkspaceUsersQuery()
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const applicationRolesQuery = useWorkspaceApplicationRolesQuery()
  const assignedPermissionsQuery =
    useWorkspaceUserApplicationPermissionsByAccessQuery(workspaceUserApplicationId)
  const updateMutation =
    useUpdateWorkspaceUserApplicationMutation(workspaceUserApplicationId)
  const deleteMutation = useDeleteWorkspaceUserApplicationMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)

  const fallbackApplications = useMemo(
    () => getApplicationFallbacks(itemQuery.data ? [itemQuery.data] : []),
    [itemQuery.data],
  )
  const applications = applicationsQuery.data ?? fallbackApplications
  const applicationRoles = applicationRolesQuery.data ?? []

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceUserApplicationId)
    navigate(APP_ROUTES.userApplications, { replace: true })
  }

  if (itemQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando acceso..." />
  }

  if (itemQuery.error) {
    return <ErrorState description={getErrorMessage(itemQuery.error)} />
  }

  if (!itemQuery.data) {
    return <ErrorState description="No se encontró el acceso solicitado." />
  }

  const summary = getWorkspaceUserApplicationSummary(itemQuery.data)

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de acceso"
      description="Edita el acceso y gestiona sus permisos desde el mismo contexto."
    >
      <SectionCard
        title="Editar acceso"
        description="Selecciona usuario, aplicación y estado sin exponer IDs técnicos."
      >
        {usersQuery.isLoading || applicationsQuery.isLoading || applicationRolesQuery.isLoading ? (
          <LoadingState message="Cargando datos del formulario..." />
        ) : null}
        {usersQuery.error ? <ErrorState description={getErrorMessage(usersQuery.error)} /> : null}
        {applicationsQuery.error && applications.length === 0 ? (
          <ErrorState description={getErrorMessage(applicationsQuery.error)} />
        ) : null}
        {applicationRolesQuery.error ? (
          <ErrorState description={getErrorMessage(applicationRolesQuery.error)} />
        ) : null}
        {!usersQuery.isLoading &&
        !applicationsQuery.isLoading &&
        !applicationRolesQuery.isLoading &&
        !usersQuery.error &&
        !applicationRolesQuery.error &&
        !(applicationsQuery.error && applications.length === 0) ? (
          <WorkspaceUserApplicationForm
            users={usersQuery.data ?? []}
            applications={applications}
            applicationRoles={applicationRoles}
            defaultValues={{
              workspace_user_application_workspace_user_id: String(
                itemQuery.data.workspace_user_application_workspace_user_id,
              ),
              workspace_user_application_workspace_application_id: String(
                itemQuery.data.workspace_user_application_workspace_application_id,
              ),
              workspace_user_application_workspace_application_role_id: String(
                itemQuery.data.workspace_user_application_workspace_application_role_id ?? '',
              ),
              workspace_user_application_is_active:
                itemQuery.data.workspace_user_application_is_active,
            }}
            permissionsCount={assignedPermissionsQuery.data?.length ?? 0}
            submitLabel="Guardar cambios"
            submitIcon={<Save size={16} />}
            onCancel={() => navigate(APP_ROUTES.userApplications)}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync(values)
            }}
            isSubmitting={updateMutation.isPending}
          />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Permisos del acceso"
        description="Gestiona permisos desde el mismo acceso usuario-app."
        action={
          <Button
            variant="secondary"
            leftIcon={<ShieldCheck size={16} />}
            onClick={() => setIsPermissionsOpen(true)}
          >
            Gestionar permisos
          </Button>
        }
      >
        <div className="crud-grid">
          <p className="text-muted">
            {summary.userName} ({summary.userEmail ?? 'sin email'}) en {summary.applicationName}
          </p>
          {assignedPermissionsQuery.isLoading ? (
            <LoadingState message="Cargando permisos asignados..." />
          ) : null}
          {assignedPermissionsQuery.error ? (
            <ErrorState description={getErrorMessage(assignedPermissionsQuery.error)} />
          ) : null}
          {!assignedPermissionsQuery.isLoading && !assignedPermissionsQuery.error ? (
            assignedPermissionsQuery.data?.length ? (
              <div className="permission-badge-list">
                {assignedPermissionsQuery.data.map((item) => (
                  <PermissionBadge
                    key={item.workspace_user_application_permission_id}
                    label={
                      item.workspace_application_permission?.workspace_application_permission_name ??
                      `Permiso #${item.workspace_user_application_permission_wap_id}`
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">Este acceso aún no tiene permisos asignados.</p>
            )
          ) : null}
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
              Eliminar acceso
            </Button>
          }
        >
          <p className="text-muted">La eliminación revocará este acceso específico.</p>
        </SectionCard>
      </AccessGuard>

      <AccessPermissionsDrawer
        access={itemQuery.data}
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar acceso"
        description="Esta acción eliminará la relación usuario-aplicación."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
