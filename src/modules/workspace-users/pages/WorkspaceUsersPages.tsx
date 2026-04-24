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
import {
  ResourceForm,
  type ResourceFormField,
} from '@/components/forms/ResourceForm'
import {
  useCreateWorkspaceUserMutation,
  useDeleteWorkspaceUserMutation,
  useUpdateWorkspaceUserMutation,
  useWorkspaceUserQuery,
  useWorkspaceUsersQuery,
} from '@/modules/workspace-users/hooks/useWorkspaceUsersQuery'
import type {
  CreateWorkspaceUserDto,
  UpdateWorkspaceUserDto,
  WorkspaceUser,
} from '@/modules/workspace-users/types/workspace-user.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const createWorkspaceUserSchema = z.object({
  workspace_user_email: z.email('Ingresa un correo válido'),
  workspace_user_document_number: z
    .string()
    .trim()
    .min(1, 'El número de documento es obligatorio'),
  workspace_user_name: z.string().trim().min(1, 'El nombre es obligatorio'),
  workspace_user_last_name: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio'),
})

const updateWorkspaceUserSchema = z.object({
  workspace_user_email: z.email('Ingresa un correo válido'),
  workspace_user_document_number: z
    .string()
    .trim()
    .min(1, 'El número de documento es obligatorio'),
  workspace_user_password: z.string().trim().optional(),
  workspace_user_name: z.string().trim().min(1, 'El nombre es obligatorio'),
  workspace_user_last_name: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio'),
})

const createDefaults: CreateWorkspaceUserDto = {
  workspace_user_email: '',
  workspace_user_document_number: '',
  workspace_user_name: '',
  workspace_user_last_name: '',
}

const userCreateFields: Array<ResourceFormField<CreateWorkspaceUserDto>> = [
  {
    name: 'workspace_user_email',
    label: 'Correo',
    type: 'email',
    placeholder: 'usuario@workspace.com',
  },
  {
    name: 'workspace_user_document_number',
    label: 'Número de documento',
    placeholder: '1234567890',
  },
  {
    name: 'workspace_user_name',
    label: 'Nombre',
    placeholder: 'Jane',
  },
  {
    name: 'workspace_user_last_name',
    label: 'Apellido',
    placeholder: 'Doe',
  },
]

const userUpdateFields: Array<ResourceFormField<UpdateWorkspaceUserDto>> = [
  {
    name: 'workspace_user_email',
    label: 'Correo',
    type: 'email',
    placeholder: 'usuario@workspace.com',
  },
  {
    name: 'workspace_user_name',
    label: 'Nombre',
    placeholder: 'Jane',
  },
  {
    name: 'workspace_user_document_number',
    label: 'Número de documento',
    placeholder: '1234567890',
  },
  {
    name: 'workspace_user_last_name',
    label: 'Apellido',
    placeholder: 'Doe',
  },
  {
    name: 'workspace_user_password',
    label: 'Nueva contraseña',
    type: 'password',
    placeholder: 'Dejar vacío para mantener la actual',
    hint: 'En update este campo es opcional.',
  },
]

export function WorkspaceUsersPage() {
  const usersQuery = useWorkspaceUsersQuery()
  const createMutation = useCreateWorkspaceUserMutation()
  const deleteMutation = useDeleteWorkspaceUserMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<WorkspaceUser | null>(null)
  const form = useForm<CreateWorkspaceUserDto>({
    resolver: zodResolver(createWorkspaceUserSchema),
    defaultValues: createDefaults,
  })

  async function handleCreate(values: CreateWorkspaceUserDto) {
    await createMutation.mutateAsync(values)
    form.reset(createDefaults)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!userToDelete) {
      return
    }

    await deleteMutation.mutateAsync(userToDelete.workspace_user_id)
    setUserToDelete(null)
  }

  if (usersQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando usuarios del workspace..." />
  }

  if (usersQuery.error) {
    return <ErrorState description={getErrorMessage(usersQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Usuarios"
      description="Administración base de usuarios globales del workspace."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo usuario
        </Button>
      }
    >
      <SectionCard
        title="Listado"
        description="Consulta, abre y gestiona usuarios registrados en el ecosistema."
      >
        <ResourceTable
          caption="Workspace users"
          columns={[
            {
              key: 'name',
              header: 'Usuario',
              cell: (row) =>
                `${row.workspace_user_name} ${row.workspace_user_last_name}`,
            },
            {
              key: 'email',
              header: 'Correo',
              cell: (row) => row.workspace_user_email,
            },
            {
              key: 'document',
              header: 'Documento',
              cell: (row) => row.workspace_user_document_number ?? 'Sin documento',
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link
                    className="button button--ghost"
                    to={detailRoutes.user(row.workspace_user_id)}
                  >
                    Abrir
                  </Link>
                  <AccessGuard allowedRoles={['super_admin']}>
                    <Button
                      variant="danger"
                      onClick={() => setUserToDelete(row)}
                      leftIcon={<Trash2 size={16} />}
                    >
                      Eliminar
                    </Button>
                  </AccessGuard>
                </div>
              ),
            },
          ]}
          data={usersQuery.data ?? []}
          getRowId={(row) => row.workspace_user_id}
          emptyTitle="Sin usuarios"
          emptyDescription="Todavía no hay usuarios registrados en el workspace."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear usuario"
        description="Registra la identidad básica del usuario. La contraseña inicial se gestiona desde el servidor."
      >
        <ResourceForm
          form={form}
          fields={userCreateFields}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear usuario"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Eliminar usuario"
        description="Se eliminará el usuario seleccionado del workspace."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceUserDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceUserId = params.workspaceUserId ?? ''
  const userQuery = useWorkspaceUserQuery(workspaceUserId)
  const updateMutation = useUpdateWorkspaceUserMutation(workspaceUserId)
  const deleteMutation = useDeleteWorkspaceUserMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const form = useForm<UpdateWorkspaceUserDto>({
    resolver: zodResolver(updateWorkspaceUserSchema),
    defaultValues: {
      workspace_user_email: '',
      workspace_user_document_number: '',
      workspace_user_password: '',
      workspace_user_name: '',
      workspace_user_last_name: '',
    },
  })

  useEffect(() => {
    if (!userQuery.data) {
      return
    }

    form.reset({
      workspace_user_email: userQuery.data.workspace_user_email,
      workspace_user_document_number:
        userQuery.data.workspace_user_document_number ?? '',
      workspace_user_password: '',
      workspace_user_name: userQuery.data.workspace_user_name,
      workspace_user_last_name: userQuery.data.workspace_user_last_name,
    })
  }, [form, userQuery.data])

  async function handleSubmit(values: UpdateWorkspaceUserDto) {
    const payload = {
      ...values,
      workspace_user_password: values.workspace_user_password?.trim() || undefined,
    }

    await updateMutation.mutateAsync(payload)
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceUserId)
    navigate(APP_ROUTES.users, { replace: true })
  }

  if (userQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando usuario..." />
  }

  if (userQuery.error) {
    return <ErrorState description={getErrorMessage(userQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de usuario"
      description="Edición base del recurso `workspace-users`."
    >
      <SectionCard title="Editar usuario" description={`ID ${workspaceUserId}`}>
        <ResourceForm
          form={form}
          fields={userUpdateFields}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.users)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Solo super_admin puede eliminar usuarios globales."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar usuario
            </Button>
          }
        >
          <p className="text-muted">
            El backend expone `DELETE /api/workspace-users/{'{workspace_user}'}` solo para super admin.
          </p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar usuario"
        description="Esta acción eliminará el usuario del workspace."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
