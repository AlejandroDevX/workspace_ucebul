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
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import { FormActions } from '@/components/forms/FormActions'
import {
  ResourceForm,
  type ResourceFormField,
} from '@/components/forms/ResourceForm'
import {
  useCreateWorkspaceApplicationMutation,
  useDeleteWorkspaceApplicationMutation,
  useUpdateWorkspaceApplicationMutation,
  useWorkspaceApplicationQuery,
  useWorkspaceApplicationsQuery,
} from '@/modules/workspace-applications/hooks/useWorkspaceApplicationsQuery'
import type {
  CreateWorkspaceApplicationDto,
  UpdateWorkspaceApplicationDto,
  WorkspaceApplication,
} from '@/modules/workspace-applications/types/workspace-application.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const workspaceApplicationSchema = z.object({
  workspace_application_name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio'),
  workspace_application_slug: z.string().trim().min(1, 'El slug es obligatorio'),
  workspace_application_description: z.string().trim().optional().or(z.literal('')),
  workspace_application_logo_url: z
    .string()
    .trim()
    .url('Ingresa una URL válida')
    .optional()
    .or(z.literal('')),
  workspace_application_url: z.url('Ingresa una URL válida'),
  workspace_application_is_active: z.boolean(),
})

const defaultValues: CreateWorkspaceApplicationDto = {
  workspace_application_name: '',
  workspace_application_slug: '',
  workspace_application_description: '',
  workspace_application_logo_url: '',
  workspace_application_url: '',
  workspace_application_is_active: true,
}

const fields: Array<ResourceFormField<CreateWorkspaceApplicationDto>> = [
  {
    name: 'workspace_application_name',
    label: 'Nombre',
    placeholder: 'CRM',
  },
  {
    name: 'workspace_application_slug',
    label: 'Slug',
    placeholder: 'crm',
  },
  {
    name: 'workspace_application_url',
    label: 'URL',
    type: 'url',
    placeholder: 'https://crm.local',
  },
  {
    name: 'workspace_application_logo_url',
    label: 'Logo URL',
    type: 'url',
    placeholder: 'https://example.com/logo.png',
  },
  {
    name: 'workspace_application_description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Descripción breve de la aplicación',
  },
  {
    name: 'workspace_application_is_active',
    label: 'Aplicación activa',
    type: 'checkbox',
    hint: 'El backend espera un boolean en `workspace_application_is_active`.',
  },
]

function getApplicationTone(isActive: boolean) {
  return isActive ? 'success' : 'warning'
}

export function WorkspaceApplicationsPage() {
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const createMutation = useCreateWorkspaceApplicationMutation()
  const deleteMutation = useDeleteWorkspaceApplicationMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] =
    useState<WorkspaceApplication | null>(null)
  const form = useForm<CreateWorkspaceApplicationDto>({
    resolver: zodResolver(workspaceApplicationSchema),
    defaultValues,
  })

  async function handleCreate(values: CreateWorkspaceApplicationDto) {
    await createMutation.mutateAsync({
      ...values,
      workspace_application_description:
        values.workspace_application_description || undefined,
      workspace_application_logo_url: values.workspace_application_logo_url || undefined,
    })
    form.reset(defaultValues)
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!applicationToDelete) {
      return
    }

    await deleteMutation.mutateAsync(applicationToDelete.workspace_application_id)
    setApplicationToDelete(null)
  }

  if (applicationsQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando aplicaciones..." />
  }

  if (applicationsQuery.error) {
    return <ErrorState description={getErrorMessage(applicationsQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="Aplicaciones"
      description="Registro global de aplicaciones dentro del workspace."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nueva aplicación
        </Button>
      }
    >
      <SectionCard title="Listado" description="Aplicaciones disponibles para asignación y permisos.">
        <ResourceTable
          caption="Workspace applications"
          columns={[
            {
              key: 'name',
              header: 'Aplicación',
              cell: (row) => row.workspace_application_name,
            },
            {
              key: 'slug',
              header: 'Slug',
              cell: (row) => row.workspace_application_slug,
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => (
                <StatusBadge
                  label={row.workspace_application_is_active ? 'Activa' : 'Inactiva'}
                  tone={getApplicationTone(row.workspace_application_is_active)}
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
                    to={detailRoutes.application(row.workspace_application_id)}
                  >
                    Abrir
                  </Link>
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => setApplicationToDelete(row)}
                  >
                    Eliminar
                  </Button>
                </div>
              ),
            },
          ]}
          data={applicationsQuery.data ?? []}
          getRowId={(row) => row.workspace_application_id}
          emptyTitle="Sin aplicaciones"
          emptyDescription="No se han registrado aplicaciones todavía."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear aplicación"
        description="Formulario base alineado con `workspace-applications`."
      >
        <ResourceForm
          form={form}
          fields={fields}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear aplicación"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(applicationToDelete)}
        title="Eliminar aplicación"
        description="Se eliminará la aplicación seleccionada del workspace."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setApplicationToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceApplicationDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceApplicationId = params.workspaceApplicationId ?? ''
  const applicationQuery = useWorkspaceApplicationQuery(workspaceApplicationId)
  const updateMutation = useUpdateWorkspaceApplicationMutation(workspaceApplicationId)
  const deleteMutation = useDeleteWorkspaceApplicationMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const form = useForm<UpdateWorkspaceApplicationDto>({
    resolver: zodResolver(workspaceApplicationSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!applicationQuery.data) {
      return
    }

    form.reset({
      workspace_application_name: applicationQuery.data.workspace_application_name,
      workspace_application_slug: applicationQuery.data.workspace_application_slug,
      workspace_application_description:
        applicationQuery.data.workspace_application_description ?? '',
      workspace_application_logo_url:
        applicationQuery.data.workspace_application_logo_url ?? '',
      workspace_application_url: applicationQuery.data.workspace_application_url,
      workspace_application_is_active:
        applicationQuery.data.workspace_application_is_active,
    })
  }, [applicationQuery.data, form])

  async function handleSubmit(values: UpdateWorkspaceApplicationDto) {
    await updateMutation.mutateAsync({
      ...values,
      workspace_application_description:
        values.workspace_application_description || undefined,
      workspace_application_logo_url: values.workspace_application_logo_url || undefined,
    })
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceApplicationId)
    navigate(APP_ROUTES.applications, { replace: true })
  }

  if (applicationQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando aplicación..." />
  }

  if (applicationQuery.error) {
    return <ErrorState description={getErrorMessage(applicationQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="Detalle de aplicación"
      description="Edición del recurso `workspace-applications`."
    >
      <SectionCard title="Editar aplicación" description={`ID ${workspaceApplicationId}`}>
        <ResourceForm
          form={form}
          fields={fields}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.applications)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <SectionCard
        title="Zona crítica"
        description="Eliminar una aplicación afecta accesos y permisos asociados."
        action={
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Eliminar aplicación
          </Button>
        }
      >
        <p className="text-muted">
          Revisa dependencias antes de borrar este recurso del catálogo global.
        </p>
      </SectionCard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar aplicación"
        description="Esta acción eliminará la aplicación del workspace."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
