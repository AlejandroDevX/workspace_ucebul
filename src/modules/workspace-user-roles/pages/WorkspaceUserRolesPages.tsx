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
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { SectionCard } from '@/components/layout/SectionCard'
import { FormActions } from '@/components/forms/FormActions'
import { ResourceForm } from '@/components/forms/ResourceForm'
import {
  useCreateWorkspaceUserRoleMutation,
  useDeleteWorkspaceUserRoleMutation,
  useUpdateWorkspaceUserRoleMutation,
  useWorkspaceUserRoleQuery,
  useWorkspaceUserRolesQuery,
} from '@/modules/workspace-user-roles/hooks/useWorkspaceUserRolesQuery'
import type {
  CreateWorkspaceUserRoleDto,
  UpdateWorkspaceUserRoleDto,
  WorkspaceUserRole,
} from '@/modules/workspace-user-roles/types/workspace-user-role.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const workspaceUserRoleSchema = z.object({
  workspace_user_role_workspace_user_id: z.string().trim().min(1, 'El ID de usuario es obligatorio'),
  workspace_user_role_workspace_role_id: z.string().trim().min(1, 'El ID de rol es obligatorio'),
})

const defaultValues: CreateWorkspaceUserRoleDto = {
  workspace_user_role_workspace_user_id: '',
  workspace_user_role_workspace_role_id: '',
}

const fields = [
  {
    name: 'workspace_user_role_workspace_user_id',
    label: 'ID de usuario',
    placeholder: '2',
    hint: 'El backend no expone catálogo de usuarios filtrado para este formulario.',
  },
  {
    name: 'workspace_user_role_workspace_role_id',
    label: 'ID de rol',
    placeholder: '1',
    hint: 'Usa el `workspace_role_id` existente.',
  },
] as const

function resolveUserRoleLabel(row: WorkspaceUserRole) {
  const user = row.workspace_user
  const role = row.workspace_role

  return {
    user: user
      ? `${user.workspace_user_name} ${user.workspace_user_last_name}`
      : `Usuario #${row.workspace_user_role_workspace_user_id}`,
    role: role?.workspace_role_name ?? `Rol #${row.workspace_user_role_workspace_role_id}`,
  }
}

export function WorkspaceUserRolesPage() {
  const rolesQuery = useWorkspaceUserRolesQuery()
  const createMutation = useCreateWorkspaceUserRoleMutation()
  const deleteMutation = useDeleteWorkspaceUserRoleMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<WorkspaceUserRole | null>(null)
  const form = useForm<CreateWorkspaceUserRoleDto>({
    resolver: zodResolver(workspaceUserRoleSchema),
    defaultValues,
  })

  async function handleCreate(values: CreateWorkspaceUserRoleDto) {
    await createMutation.mutateAsync(values)
    form.reset(defaultValues)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_user_role_id)
    setItemToDelete(null)
  }

  if (rolesQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando roles de usuario..." />
  }

  if (rolesQuery.error) {
    return <ErrorState description={getErrorMessage(rolesQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Roles de usuario"
      description="Relaciones entre usuarios y roles globales del workspace."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nueva asignación
        </Button>
      }
    >
      <SectionCard title="Listado" description="Asignaciones usuario-rol registradas.">
        <ResourceTable
          caption="Workspace user roles"
          columns={[
            {
              key: 'user',
              header: 'Usuario',
              cell: (row) => resolveUserRoleLabel(row).user,
            },
            {
              key: 'role',
              header: 'Rol',
              cell: (row) => resolveUserRoleLabel(row).role,
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.userRole(row.workspace_user_role_id)}
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
          data={rolesQuery.data ?? []}
          getRowId={(row) => row.workspace_user_role_id}
          emptyTitle="Sin asignaciones"
          emptyDescription="Todavía no hay relaciones usuario-rol."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear asignación"
        description="Para usuarios admin, el backend actual obliga a usar IDs explícitos para este formulario."
      >
        <ResourceForm
          form={form}
          fields={fields}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear asignación"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar asignación"
        description="Se eliminará la relación entre usuario y rol."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceUserRoleDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceUserRoleId = params.workspaceUserRoleId ?? ''
  const itemQuery = useWorkspaceUserRoleQuery(workspaceUserRoleId)
  const updateMutation = useUpdateWorkspaceUserRoleMutation(workspaceUserRoleId)
  const deleteMutation = useDeleteWorkspaceUserRoleMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const form = useForm<UpdateWorkspaceUserRoleDto>({
    resolver: zodResolver(workspaceUserRoleSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!itemQuery.data) {
      return
    }

    form.reset({
      workspace_user_role_workspace_user_id:
        String(itemQuery.data.workspace_user_role_workspace_user_id),
      workspace_user_role_workspace_role_id:
        String(itemQuery.data.workspace_user_role_workspace_role_id),
    })
  }, [form, itemQuery.data])

  async function handleSubmit(values: UpdateWorkspaceUserRoleDto) {
    await updateMutation.mutateAsync(values)
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceUserRoleId)
    navigate(APP_ROUTES.userRoles, { replace: true })
  }

  if (itemQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando asignación..." />
  }

  if (itemQuery.error) {
    return <ErrorState description={getErrorMessage(itemQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de rol de usuario"
      description="Edición del recurso `workspace-user-roles`."
    >
      <SectionCard title="Editar asignación" description={`ID ${workspaceUserRoleId}`}>
        <ResourceForm
          form={form}
          fields={fields}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.userRoles)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
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
          <p className="text-muted">La eliminación romperá esta relación usuario-rol.</p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar asignación"
        description="Esta acción eliminará la relación usuario-rol."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
