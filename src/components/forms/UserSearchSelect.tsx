import { FormField, Select, type SelectOption } from 'foundation-ui'
import { useMemo } from 'react'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'

interface UserSearchSelectProps {
  users: WorkspaceUser[]
  value: WorkspaceUser | null
  onSelect: (user: WorkspaceUser) => void
  onClear: () => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function UserSearchSelect({
  users,
  value,
  onSelect,
  onClear,
  label = 'Usuario',
  placeholder = 'Busca por nombre, apellido o email',
  error,
  disabled = false,
}: UserSearchSelectProps) {
  const options = useMemo<SelectOption[]>(
    () =>
      users.map((user) => ({
        label: `${user.workspace_user_name} ${user.workspace_user_last_name}`,
        value: String(user.workspace_user_id),
        description: user.workspace_user_email,
      })),
    [users],
  )

  return (
    <FormField error={error} label={label}>
      <Select
        clearable
        disabled={disabled}
        emptyMessage="No se encontraron usuarios."
        invalid={Boolean(error)}
        options={options}
        placeholder={placeholder}
        renderOption={(option) => (
          <span>
            <strong>{option.label}</strong>
            {option.description ? <small>{option.description}</small> : null}
          </span>
        )}
        searchPlaceholder="Busca por nombre o correo"
        searchable
        value={value ? String(value.workspace_user_id) : null}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            onClear()
            return
          }

          const selectedUser =
            users.find((user) => String(user.workspace_user_id) === nextValue) ?? null

          if (selectedUser) {
            onSelect(selectedUser)
          }
        }}
      />
    </FormField>
  )
}
