import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Switch } from '@/components/base/Switch'
import { ApplicationSearchSelect } from '@/components/forms/ApplicationSearchSelect'
import { FormActions } from '@/components/forms/FormActions'
import { UserSearchSelect } from '@/components/forms/UserSearchSelect'
import { AssignmentSummaryCard } from '@/components/layout/AssignmentSummaryCard'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import type {
  CreateWorkspaceUserApplicationDto,
  UpdateWorkspaceUserApplicationDto,
} from '@/modules/workspace-user-applications/types/workspace-user-application.types'

const workspaceUserApplicationSchema = z.object({
  workspace_user_application_workspace_user_id: z.string().trim().min(1, 'Selecciona un usuario.'),
  workspace_user_application_workspace_application_id: z
    .string()
    .trim()
    .min(1, 'Selecciona una aplicación.'),
  workspace_user_application_is_active: z.boolean(),
})

export const workspaceUserApplicationDefaultValues: CreateWorkspaceUserApplicationDto = {
  workspace_user_application_workspace_user_id: '',
  workspace_user_application_workspace_application_id: '',
  workspace_user_application_is_active: true,
}

interface WorkspaceUserApplicationFormProps {
  users: WorkspaceUser[]
  applications: WorkspaceApplication[]
  defaultValues?: Partial<CreateWorkspaceUserApplicationDto>
  permissionsCount?: number
  isSubmitting?: boolean
  submitLabel: string
  submitIcon?: ReactNode
  cancelLabel?: string
  onCancel: () => void
  onSubmit: (values: UpdateWorkspaceUserApplicationDto) => Promise<void> | void
}

function findUser(users: WorkspaceUser[], id?: string) {
  return users.find((item) => String(item.workspace_user_id) === id) ?? null
}

function findApplication(applications: WorkspaceApplication[], id?: string) {
  return (
    applications.find((item) => String(item.workspace_application_id) === id) ?? null
  )
}

export function WorkspaceUserApplicationForm({
  users,
  applications,
  defaultValues,
  permissionsCount,
  isSubmitting = false,
  submitLabel,
  submitIcon,
  cancelLabel,
  onCancel,
  onSubmit,
}: WorkspaceUserApplicationFormProps) {
  const form = useForm<CreateWorkspaceUserApplicationDto>({
    resolver: zodResolver(workspaceUserApplicationSchema),
    defaultValues: {
      ...workspaceUserApplicationDefaultValues,
      ...defaultValues,
    },
  })
  const [selectedUser, setSelectedUser] = useState<WorkspaceUser | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<WorkspaceApplication | null>(null)

  useEffect(() => {
    form.reset({
      ...workspaceUserApplicationDefaultValues,
      ...defaultValues,
    })
  }, [defaultValues, form])

  const selectedUserId = form.watch('workspace_user_application_workspace_user_id')
  const selectedApplicationId = form.watch('workspace_user_application_workspace_application_id')
  const isActive = form.watch('workspace_user_application_is_active')

  useEffect(() => {
    setSelectedUser(findUser(users, selectedUserId))
  }, [selectedUserId, users])

  useEffect(() => {
    setSelectedApplication(findApplication(applications, selectedApplicationId))
  }, [applications, selectedApplicationId])

  const canRenderSummary = useMemo(
    () => Boolean(selectedUser && selectedApplication),
    [selectedApplication, selectedUser],
  )

  return (
    <form className="resource-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="crud-grid">
        <UserSearchSelect
          users={users}
          value={selectedUser}
          onSelect={(user) => {
            setSelectedUser(user)
            form.setValue(
              'workspace_user_application_workspace_user_id',
              String(user.workspace_user_id),
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            )
          }}
          onClear={() => {
            setSelectedUser(null)
            form.setValue('workspace_user_application_workspace_user_id', '', {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          error={form.formState.errors.workspace_user_application_workspace_user_id?.message}
          disabled={isSubmitting}
        />

        <ApplicationSearchSelect
          applications={applications}
          value={selectedApplication}
          onSelect={(application) => {
            setSelectedApplication(application)
            form.setValue(
              'workspace_user_application_workspace_application_id',
              String(application.workspace_application_id),
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            )
          }}
          onClear={() => {
            setSelectedApplication(null)
            form.setValue('workspace_user_application_workspace_application_id', '', {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          error={form.formState.errors.workspace_user_application_workspace_application_id?.message}
          disabled={isSubmitting}
        />

        <Switch
          label="Acceso activo"
          description="Define si el usuario puede usar esta aplicación desde este acceso."
          checked={isActive}
          onChange={(event) =>
            form.setValue('workspace_user_application_is_active', event.target.checked, {
              shouldDirty: true,
            })
          }
          disabled={isSubmitting}
        />

        {canRenderSummary ? (
          <AssignmentSummaryCard
            userName={`${selectedUser!.workspace_user_name} ${selectedUser!.workspace_user_last_name}`}
            userEmail={selectedUser!.workspace_user_email}
            applicationName={selectedApplication!.workspace_application_name}
            isActive={isActive}
            permissionsCount={permissionsCount}
          />
        ) : null}
      </div>

      <FormActions
        submitLabel={submitLabel}
        onCancel={onCancel}
        cancelLabel={cancelLabel}
        isSubmitting={isSubmitting}
        submitIcon={submitIcon}
      />
    </form>
  )
}
