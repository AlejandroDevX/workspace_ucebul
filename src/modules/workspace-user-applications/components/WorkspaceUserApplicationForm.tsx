import { FormField, Select, type SelectOption } from 'foundation-ui'
import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Switch } from '@/components/base/Switch'
import { ApplicationSearchSelect } from '@/components/forms/ApplicationSearchSelect'
import { FormActions } from '@/components/forms/FormActions'
import { UserSearchSelect } from '@/components/forms/UserSearchSelect'
import { AssignmentSummaryCard } from '@/components/layout/AssignmentSummaryCard'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import type { WorkspaceApplicationRole } from '@/modules/workspace-application-roles/types/workspace-application-role.types'
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
  workspace_user_application_workspace_application_role_id: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  workspace_user_application_is_active: z.boolean(),
})

const workspaceUserApplicationDefaultValues: CreateWorkspaceUserApplicationDto = {
  workspace_user_application_workspace_user_id: '',
  workspace_user_application_workspace_application_id: '',
  workspace_user_application_workspace_application_role_id: '',
  workspace_user_application_is_active: true,
}

interface WorkspaceUserApplicationFormProps {
  users: WorkspaceUser[]
  applications: WorkspaceApplication[]
  applicationRoles: WorkspaceApplicationRole[]
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
  applicationRoles,
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

  const selectedUserId = useWatch({
    control: form.control,
    name: 'workspace_user_application_workspace_user_id',
  })
  const selectedApplicationId = useWatch({
    control: form.control,
    name: 'workspace_user_application_workspace_application_id',
  })
  const selectedApplicationRoleId = useWatch({
    control: form.control,
    name: 'workspace_user_application_workspace_application_role_id',
  })
  const isActive = useWatch({
    control: form.control,
    name: 'workspace_user_application_is_active',
  })

  useEffect(() => {
    setSelectedUser(findUser(users, selectedUserId))
  }, [selectedUserId, users])

  useEffect(() => {
    setSelectedApplication(findApplication(applications, selectedApplicationId))
  }, [applications, selectedApplicationId])

  const filteredApplicationRoles = useMemo(
    () =>
      applicationRoles.filter(
        (role) =>
          String(role.workspace_application_role_workspace_application_id) ===
          String(selectedApplicationId),
      ),
    [applicationRoles, selectedApplicationId],
  )

  const applicationRoleOptions = useMemo<SelectOption[]>(
    () =>
      filteredApplicationRoles.map((role) => ({
        label: role.workspace_application_role_name,
        value: String(role.workspace_application_role_id),
      })),
    [filteredApplicationRoles],
  )

  useEffect(() => {
    if (!selectedApplicationRoleId) {
      return
    }

    const roleStillAvailable = filteredApplicationRoles.some(
      (role) => String(role.workspace_application_role_id) === String(selectedApplicationRoleId),
    )

    if (!roleStillAvailable) {
      form.setValue('workspace_user_application_workspace_application_role_id', '', {
        shouldDirty: true,
      })
    }
  }, [filteredApplicationRoles, form, selectedApplicationRoleId])

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
            form.setValue('workspace_user_application_workspace_application_role_id', '', {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          onClear={() => {
            setSelectedApplication(null)
            form.setValue('workspace_user_application_workspace_application_id', '', {
              shouldDirty: true,
              shouldValidate: true,
            })
            form.setValue('workspace_user_application_workspace_application_role_id', '', {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          error={form.formState.errors.workspace_user_application_workspace_application_id?.message}
          disabled={isSubmitting}
        />

        <FormField
          controlId="workspace_user_application_workspace_application_role_id"
          error={
            form.formState.errors.workspace_user_application_workspace_application_role_id
              ?.message
          }
          label="Rol interno"
          hint="Opcional. Si no eliges uno, el acceso quedará sin rol interno heredado."
        >
          <Select
            controlId="workspace_user_application_workspace_application_role_id"
            disabled={isSubmitting || !selectedApplicationId}
            invalid={Boolean(
              form.formState.errors.workspace_user_application_workspace_application_role_id,
            )}
            options={applicationRoleOptions}
            placeholder={
              selectedApplicationId
                ? 'Selecciona un rol interno'
                : 'Primero selecciona una aplicación'
            }
            searchable={applicationRoleOptions.length > 6}
            value={
              typeof selectedApplicationRoleId === 'string' &&
              selectedApplicationRoleId.length > 0
                ? selectedApplicationRoleId
                : null
            }
            onValueChange={(value) => {
              form.setValue(
                'workspace_user_application_workspace_application_role_id',
                value ?? '',
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              )
            }}
          />
        </FormField>

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
