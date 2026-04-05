import { FormField, Select, type SelectOption } from 'foundation-ui'
import { useMemo } from 'react'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'

interface ApplicationSearchSelectProps {
  applications: WorkspaceApplication[]
  value: WorkspaceApplication | null
  onSelect: (application: WorkspaceApplication) => void
  onClear: () => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function ApplicationSearchSelect({
  applications,
  value,
  onSelect,
  onClear,
  label = 'Aplicación',
  placeholder = 'Busca por nombre o slug',
  error,
  disabled = false,
}: ApplicationSearchSelectProps) {
  const options = useMemo<SelectOption[]>(
    () =>
      applications.map((application) => ({
        label: application.workspace_application_name,
        value: String(application.workspace_application_id),
        description: application.workspace_application_slug,
      })),
    [applications],
  )

  return (
    <FormField error={error} label={label}>
      <Select
        clearable
        disabled={disabled}
        emptyMessage="No se encontraron aplicaciones."
        invalid={Boolean(error)}
        options={options}
        placeholder={placeholder}
        renderOption={(option) => (
          <span>
            <strong>{option.label}</strong>
            {option.description ? <small>{option.description}</small> : null}
          </span>
        )}
        searchPlaceholder="Busca por nombre o slug"
        searchable
        value={value ? String(value.workspace_application_id) : null}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            onClear()
            return
          }

          const selectedApplication =
            applications.find(
              (application) => String(application.workspace_application_id) === nextValue,
            ) ?? null

          if (selectedApplication) {
            onSelect(selectedApplication)
          }
        }}
      />
    </FormField>
  )
}
