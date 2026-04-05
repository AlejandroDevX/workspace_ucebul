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
import { SectionCard } from '@/components/layout/SectionCard'
import { FormActions } from '@/components/forms/FormActions'
import { ResourceForm } from '@/components/forms/ResourceForm'
import {
  useCreateWorkspaceRoleMutation,
  useDeleteWorkspaceRoleMutation,
  useUpdateWorkspaceRoleMutation,
  useWorkspaceRoleQuery,
  useWorkspaceRolesQuery,
} from '@/modules/workspace-roles/hooks/useWorkspaceRolesQuery'
import type {
  CreateWorkspaceRoleDto,
  UpdateWorkspaceRoleDto,
  WorkspaceRole,
} from '@/modules/workspace-roles/types/workspace-role.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const workspaceRoleSchema = z.object({
  workspace_role_name: z.string().trim().min(1, 'El nombre del rol es obligatorio'),
})

const defaultValues: CreateWorkspaceRoleDto = {
  workspace_role_name: '',
}

export function WorkspaceRolesPage() {
  const rolesQuery = useWorkspaceRolesQuery()
  const createMutation = useCreateWorkspaceRoleMutation()
  const deleteMutation = useDeleteWorkspaceRoleMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<WorkspaceRole | null>(null)
  const form = useForm<CreateWorkspaceRoleDto>({
    resolver: zodResolver(workspaceRoleSchema),
    defaultValues,
  })

  async function handleCreate(values: CreateWorkspaceRoleDto) {
    await createMutation.mutateAsync(values)
    form.reset(defaultValues)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!roleToDelete) {
      return
    }

    await deleteMutation.mutateAsync(roleToDelete.workspace_role_id)
    setRoleToDelete(null)
  }

  if (rolesQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando roles del workspace..." />
  }

  if (rolesQuery.error) {
    return <ErrorState description={getErrorMessage(rolesQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="Roles"
      description="Gestión de roles globales del workspace."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo rol
        </Button>
      }
    >
      <SectionCard title="Listado" description="Roles disponibles para asignación global.">
        <ResourceTable
          caption="Workspace roles"
          columns={[
            {
              key: 'name',
              header: 'Nombre del rol',
              cell: (row) => row.workspace_role_name,
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link className="button button--ghost" to={detailRoutes.role(row.workspace_role_id)}>
                    Abrir
                  </Link>
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => setRoleToDelete(row)}
                  >
                    Eliminar
                  </Button>
                </div>
              ),
            },
          ]}
          data={rolesQuery.data ?? []}
          getRowId={(row) => row.workspace_role_id}
          emptyTitle="Sin roles"
          emptyDescription="No hay roles creados todavía."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear rol"
        description="Este recurso solo está disponible para super admin."
      >
        <ResourceForm
          form={form}
          fields={[
            {
              name: 'workspace_role_name',
              label: 'Nombre del rol',
              placeholder: 'admin',
            },
          ]}
          onSubmit={handleCreate}
          columns={1}
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
        title="Eliminar rol"
        description="Se eliminará el rol seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceRoleDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceRoleId = params.workspaceRoleId ?? ''
  const roleQuery = useWorkspaceRoleQuery(workspaceRoleId)
  const updateMutation = useUpdateWorkspaceRoleMutation(workspaceRoleId)
  const deleteMutation = useDeleteWorkspaceRoleMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const form = useForm<UpdateWorkspaceRoleDto>({
    resolver: zodResolver(workspaceRoleSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!roleQuery.data) {
      return
    }

    form.reset({
      workspace_role_name: roleQuery.data.workspace_role_name,
    })
  }, [form, roleQuery.data])

  async function handleSubmit(values: UpdateWorkspaceRoleDto) {
    await updateMutation.mutateAsync(values)
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceRoleId)
    navigate(APP_ROUTES.roles, { replace: true })
  }

  if (roleQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando rol..." />
  }

  if (roleQuery.error) {
    return <ErrorState description={getErrorMessage(roleQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="Detalle de rol"
      description="Edición del recurso `workspace-roles`."
    >
      <SectionCard title="Editar rol" description={`ID ${workspaceRoleId}`}>
        <ResourceForm
          form={form}
          fields={[
            {
              name: 'workspace_role_name',
              label: 'Nombre del rol',
              placeholder: 'admin',
            },
          ]}
          onSubmit={handleSubmit}
          columns={1}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.roles)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <SectionCard
        title="Zona crítica"
        description="Eliminar un rol afecta asignaciones globales existentes."
        action={
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Eliminar rol
          </Button>
        }
      >
        <p className="text-muted">Confirma esta acción solo si el rol ya no debe existir.</p>
      </SectionCard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar rol"
        description="Esta acción eliminará el rol del workspace."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
