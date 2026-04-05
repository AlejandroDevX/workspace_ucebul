import { useId, useMemo, useState } from 'react'
import { Search, UserRound, X } from 'lucide-react'
import { Button } from '@/components/base/Button'
import { Input } from '@/components/base/Input'
import type { WorkspaceUser } from '@/modules/workspace-users/types/workspace-user.types'
import { cn } from '@/utils/classnames'

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

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
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
  const inputId = useId()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalizedQuery = normalizeValue(query)

    if (!normalizedQuery) {
      return users.slice(0, 8)
    }

    return users
      .filter((user) => {
        const fullName = `${user.workspace_user_name} ${user.workspace_user_last_name}`

        return [fullName, user.workspace_user_name, user.workspace_user_last_name, user.workspace_user_email]
          .some((candidate) => normalizeValue(candidate).includes(normalizedQuery))
      })
      .slice(0, 8)
  }, [query, users])

  return (
    <div className="search-select">
      <label className="form-field" htmlFor={inputId}>
        <span className="form-field__label">{label}</span>
        {value ? (
          <div className={cn('search-select__selected', error && 'search-select__selected--invalid')}>
            <div>
              <strong>
                {value.workspace_user_name} {value.workspace_user_last_name}
              </strong>
              <p>{value.workspace_user_email}</p>
            </div>
            <Button variant="ghost" type="button" onClick={onClear} disabled={disabled}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="search-select__control">
            <div className="search-select__input-wrapper">
              <Search className="search-select__icon" size={16} />
              <Input
                id={inputId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                invalid={Boolean(error)}
                disabled={disabled}
              />
            </div>
            <div className="search-select__results" role="listbox" aria-label="Usuarios">
              {results.length ? (
                results.map((user) => (
                  <button
                    key={user.workspace_user_id}
                    className="search-select__option"
                    type="button"
                    onClick={() => {
                      onSelect(user)
                      setQuery('')
                    }}
                    disabled={disabled}
                  >
                    <span className="search-select__option-icon">
                      <UserRound size={16} />
                    </span>
                    <span>
                      <strong>
                        {user.workspace_user_name} {user.workspace_user_last_name}
                      </strong>
                      <small>{user.workspace_user_email}</small>
                    </span>
                  </button>
                ))
              ) : (
                <p className="search-select__empty">No se encontraron usuarios.</p>
              )}
            </div>
          </div>
        )}
        {error ? <span className="form-field__error">{error}</span> : null}
      </label>
    </div>
  )
}
