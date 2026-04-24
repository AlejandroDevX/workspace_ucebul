import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2 } from 'lucide-react'
import { Select, type SelectOption } from 'foundation-ui'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { Modal } from '@/components/base/Modal'
import { ResourceTable } from '@/components/base/ResourceTable'
import { EmptyPermissionsState } from '@/components/feedback/EmptyPermissionsState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { FormActions } from '@/components/forms/FormActions'
import {
  ResourceForm,
  type ResourceFormField,
} from '@/components/forms/ResourceForm'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import { useWorkspaceApplicationsQuery } from '@/modules/workspace-applications/hooks/useWorkspaceApplicationsQuery'
import {
  useCreateWorkspaceApplicationModuleMutation,
  useDeleteWorkspaceApplicationModuleMutation,
  useUpdateWorkspaceApplicationModuleMutation,
  useWorkspaceApplicationModuleQuery,
  useWorkspaceApplicationModulesQuery,
} from '@/modules/workspace-application-modules/hooks/useWorkspaceApplicationModulesQuery'
import type {
  CreateWorkspaceApplicationModuleDto,
  UpdateWorkspaceApplicationModuleDto,
  WorkspaceApplicationModule,
} from '@/modules/workspace-application-modules/types/workspace-application-module.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

const moduleCreateSchema = z.object({
  workspace_application_module_workspace_application_id: z
    .string()
    .trim()
    .min(1, 'Selecciona una aplicación.'),
  workspace_application_module_name: z.string().trim().min(1, 'El nombre es obligatorio'),
  workspace_application_module_slug: z.string().trim().min(1, 'El slug es obligatorio'),
  workspace_application_module_description: z.string().trim().optional().or(z.literal('')),
  workspace_application_module_icon: z.string().trim().optional().or(z.literal('')),
  workspace_application_module_order: z
    .string()
    .trim()
    .regex(/^\d*$/, 'El orden debe ser numérico')
    .optional()
    .or(z.literal('')),
  workspace_application_module_is_active: z.boolean(),
})

const moduleUpdateSchema = moduleCreateSchema.omit({
  workspace_application_module_workspace_application_id: true,
})

const createDefaults: CreateWorkspaceApplicationModuleDto = {
  workspace_application_module_workspace_application_id: '',
  workspace_application_module_name: '',
  workspace_application_module_slug: '',
  workspace_application_module_description: '',
  workspace_application_module_icon: '',
  workspace_application_module_order: '0',
  workspace_application_module_is_active: true,
}

const updateDefaults: UpdateWorkspaceApplicationModuleDto = {
  workspace_application_module_name: '',
  workspace_application_module_slug: '',
  workspace_application_module_description: '',
  workspace_application_module_icon: '',
  workspace_application_module_order: '0',
  workspace_application_module_is_active: true,
}

function buildCreateFields(
  applicationOptions: Array<{ label: string; value: string }>,
): Array<ResourceFormField<CreateWorkspaceApplicationModuleDto>> {
  return [
    {
      name: 'workspace_application_module_workspace_application_id',
      label: 'Aplicación',
      type: 'select',
      options: applicationOptions,
    },
    ...(buildUpdateFields() as unknown as Array<
      ResourceFormField<CreateWorkspaceApplicationModuleDto>
    >),
  ]
}

function buildUpdateFields(): Array<ResourceFormField<UpdateWorkspaceApplicationModuleDto>> {
  return [
    {
      name: 'workspace_application_module_name',
      label: 'Nombre',
      placeholder: 'Usuarios',
    },
    {
      name: 'workspace_application_module_slug',
      label: 'Slug',
      placeholder: 'users',
    },
    {
      name: 'workspace_application_module_icon',
      label: 'Icono',
      placeholder: 'users',
    },
    {
      name: 'workspace_application_module_order',
      label: 'Orden',
      placeholder: '1',
    },
    {
      name: 'workspace_application_module_description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Gestión de usuarios',
    },
    {
      name: 'workspace_application_module_is_active',
      label: 'Módulo activo',
      type: 'checkbox',
    },
  ]
}

function sanitizeCreatePayload(values: CreateWorkspaceApplicationModuleDto) {
  return {
    ...values,
    workspace_application_module_description:
      values.workspace_application_module_description || undefined,
    workspace_application_module_icon:
      values.workspace_application_module_icon || undefined,
    workspace_application_module_order:
      values.workspace_application_module_order || '0',
  }
}

function sanitizeUpdatePayload(values: UpdateWorkspaceApplicationModuleDto) {
  return {
    ...values,
    workspace_application_module_description:
      values.workspace_application_module_description || undefined,
    workspace_application_module_icon:
      values.workspace_application_module_icon || undefined,
    workspace_application_module_order:
      values.workspace_application_module_order || '0',
  }
}

function sortModules(modules: WorkspaceApplicationModule[]) {
  return [...modules].sort(
    (left, right) =>
      left.workspace_application_module_order -
      right.workspace_application_module_order,
  )
}

export function WorkspaceApplicationModulesPage() {
  const applicationsQuery = useWorkspaceApplicationsQuery()
  const [selectedApplicationId, setSelectedApplicationId] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const modulesQuery = useWorkspaceApplicationModulesQuery(
    selectedApplicationId
      ? { workspace_application_id: selectedApplicationId }
      : undefined,
  )
  const createMutation = useCreateWorkspaceApplicationModuleMutation()
  const deleteMutation = useDeleteWorkspaceApplicationModuleMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] =
    useState<WorkspaceApplicationModule | null>(null)
  const applicationOptions = useMemo<Array<SelectOption>>(
    () => [
      { label: 'Todas las aplicaciones', value: '' },
      ...(applicationsQuery.data ?? []).map((application) => ({
        label: application.workspace_application_name,
        value: String(application.workspace_application_id),
      })),
    ],
    [applicationsQuery.data],
  )
  const createApplicationOptions = applicationOptions.filter((option) => option.value)
  const form = useForm<CreateWorkspaceApplicationModuleDto>({
    resolver: zodResolver(moduleCreateSchema),
    defaultValues: createDefaults,
  })
  const modules = sortModules(modulesQuery.data ?? [])

  async function handleCreate(values: CreateWorkspaceApplicationModuleDto) {
    await createMutation.mutateAsync(sanitizeCreatePayload(values))
    form.reset(createDefaults)
    setFeedback('Módulo creado correctamente.')
    setIsCreateOpen(false)
  }

  async function handleDelete() {
    if (!moduleToDelete) {
      return
    }

    await deleteMutation.mutateAsync(moduleToDelete.workspace_application_module_id)
    setFeedback('Módulo eliminado correctamente.')
    setModuleToDelete(null)
  }

  if (applicationsQuery.isLoading || modulesQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando módulos de aplicación..." />
  }

  if (applicationsQuery.error) {
    return <ErrorState description={getErrorMessage(applicationsQuery.error)} />
  }

  if (modulesQuery.error) {
    return <ErrorState description={getErrorMessage(modulesQuery.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Módulos de aplicación"
      description="Administra la estructura funcional de cada aplicación antes de agrupar permisos."
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo módulo
        </Button>
      }
    >
      <SectionCard
        title="Listado"
        description="Filtra por aplicación y ordena visualmente cada módulo por su campo de orden."
      >
        <div className="crud-toolbar">
          <Select
            controlId="application-module-filter"
            options={applicationOptions}
            placeholder="Filtrar por aplicación"
            value={selectedApplicationId}
            onValueChange={(value) => setSelectedApplicationId(value ?? '')}
          />
          {feedback ? <p className="text-muted">{feedback}</p> : null}
        </div>
        <ResourceTable
          caption="Workspace application modules"
          columns={[
            {
              key: 'module',
              header: 'Módulo',
              cell: (row) => row.workspace_application_module_name,
            },
            {
              key: 'slug',
              header: 'Slug',
              cell: (row) => row.workspace_application_module_slug,
            },
            {
              key: 'application',
              header: 'Aplicación',
              cell: (row) =>
                row.workspace_application?.workspace_application_name ?? 'Sin contexto',
            },
            {
              key: 'icon',
              header: 'Icono',
              cell: (row) => row.workspace_application_module_icon ?? 'Sin icono',
            },
            {
              key: 'order',
              header: 'Orden',
              cell: (row) => row.workspace_application_module_order,
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => (
                <StatusBadge
                  label={
                    row.workspace_application_module_is_active ? 'Activo' : 'Inactivo'
                  }
                  tone={
                    row.workspace_application_module_is_active
                      ? 'success'
                      : 'warning'
                  }
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
                    to={detailRoutes.applicationModule(
                      row.workspace_application_module_id,
                    )}
                  >
                    Abrir
                  </Link>
                  <AccessGuard allowedRoles={['super_admin']}>
                    <Button
                      variant="danger"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => setModuleToDelete(row)}
                    >
                      Eliminar
                    </Button>
                  </AccessGuard>
                </div>
              ),
            },
          ]}
          data={modules}
          getRowId={(row) => row.workspace_application_module_id}
          emptyTitle="Sin módulos"
          emptyDescription="No hay módulos registrados para el filtro seleccionado."
        />
      </SectionCard>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear módulo"
        description="Define el módulo dentro de una aplicación específica."
      >
        <ResourceForm
          form={form}
          fields={buildCreateFields(createApplicationOptions)}
          onSubmit={handleCreate}
          actions={
            <FormActions
              submitLabel="Crear módulo"
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(moduleToDelete)}
        title="Eliminar módulo"
        description="Los permisos asociados quedarán bajo Sin módulo."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setModuleToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceApplicationModuleDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceApplicationModuleId = params.workspaceApplicationModuleId ?? ''
  const moduleQuery = useWorkspaceApplicationModuleQuery(workspaceApplicationModuleId)
  const updateMutation =
    useUpdateWorkspaceApplicationModuleMutation(workspaceApplicationModuleId)
  const deleteMutation = useDeleteWorkspaceApplicationModuleMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const form = useForm<UpdateWorkspaceApplicationModuleDto>({
    resolver: zodResolver(moduleUpdateSchema),
    defaultValues: updateDefaults,
  })

  useEffect(() => {
    if (!moduleQuery.data) {
      return
    }

    form.reset({
      workspace_application_module_name:
        moduleQuery.data.workspace_application_module_name,
      workspace_application_module_slug:
        moduleQuery.data.workspace_application_module_slug,
      workspace_application_module_description:
        moduleQuery.data.workspace_application_module_description ?? '',
      workspace_application_module_icon:
        moduleQuery.data.workspace_application_module_icon ?? '',
      workspace_application_module_order: String(
        moduleQuery.data.workspace_application_module_order,
      ),
      workspace_application_module_is_active:
        moduleQuery.data.workspace_application_module_is_active,
    })
  }, [form, moduleQuery.data])

  async function handleSubmit(values: UpdateWorkspaceApplicationModuleDto) {
    await updateMutation.mutateAsync(sanitizeUpdatePayload(values))
    setFeedback('Módulo actualizado correctamente.')
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceApplicationModuleId)
    navigate(APP_ROUTES.applicationModules, { replace: true })
  }

  if (moduleQuery.isLoading) {
    return <LoadingState fullScreen message="Cargando módulo..." />
  }

  if (moduleQuery.error) {
    return <ErrorState description={getErrorMessage(moduleQuery.error)} />
  }

  if (!moduleQuery.data) {
    return <ErrorState description="No se encontró el módulo solicitado." />
  }

  return (
    <CrudPageLayout
      eyebrow="Admin / Super Admin"
      title="Detalle de módulo"
      description="Edita el nombre, slug, icono, orden y estado del módulo."
    >
      <SectionCard
        title="Editar módulo"
        description={moduleQuery.data.workspace_application?.workspace_application_name}
      >
        {feedback ? <p className="text-muted">{feedback}</p> : null}
        <ResourceForm
          form={form}
          fields={buildUpdateFields()}
          onSubmit={handleSubmit}
          actions={
            <FormActions
              submitLabel="Guardar cambios"
              onCancel={() => navigate(APP_ROUTES.applicationModules)}
              isSubmitting={updateMutation.isPending}
              submitIcon={<Save size={16} />}
            />
          }
        />
      </SectionCard>

      <SectionCard
        title="Permisos asociados"
        description="Permisos que actualmente pertenecen a este módulo."
      >
        {moduleQuery.data.permissions?.length ? (
          <div className="permission-badge-list">
            {moduleQuery.data.permissions.map((permission) => (
              <span
                className="permission-badge"
                key={permission.workspace_application_permission_id}
              >
                {permission.workspace_application_permission_slug}
              </span>
            ))}
          </div>
        ) : (
          <EmptyPermissionsState
            title="Sin permisos asociados"
            description="Este módulo todavía no agrupa permisos."
          />
        )}
      </SectionCard>

      <AccessGuard allowedRoles={['super_admin']}>
        <SectionCard
          title="Zona crítica"
          description="Eliminar el módulo no elimina sus permisos."
          action={
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar módulo
            </Button>
          }
        >
          <p className="text-muted">
            Los permisos asociados quedarán disponibles bajo Sin módulo.
          </p>
        </SectionCard>
      </AccessGuard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar módulo"
        description="Esta acción removerá el módulo de la aplicación."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
