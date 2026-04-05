import { useId, useMemo, useState } from 'react'
import { AppWindow, Search, X } from 'lucide-react'
import { Button } from '@/components/base/Button'
import { Input } from '@/components/base/Input'
import type { WorkspaceApplication } from '@/modules/workspace-applications/types/workspace-application.types'
import { cn } from '@/utils/classnames'

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

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
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
  const inputId = useId()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalizedQuery = normalizeValue(query)

    if (!normalizedQuery) {
      return applications.slice(0, 8)
    }

    return applications
      .filter((application) =>
        [application.workspace_application_name, application.workspace_application_slug].some(
          (candidate) => normalizeValue(candidate).includes(normalizedQuery),
        ),
      )
      .slice(0, 8)
  }, [applications, query])

  return (
    <div className="search-select">
      <label className="form-field" htmlFor={inputId}>
        <span className="form-field__label">{label}</span>
        {value ? (
          <div className={cn('search-select__selected', error && 'search-select__selected--invalid')}>
            <div>
              <strong>{value.workspace_application_name}</strong>
              <p>{value.workspace_application_slug}</p>
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
            <div className="search-select__results" role="listbox" aria-label="Aplicaciones">
              {results.length ? (
                results.map((application) => (
                  <button
                    key={application.workspace_application_id}
                    className="search-select__option"
                    type="button"
                    onClick={() => {
                      onSelect(application)
                      setQuery('')
                    }}
                    disabled={disabled}
                  >
                    <span className="search-select__option-icon">
                      <AppWindow size={16} />
                    </span>
                    <span>
                      <strong>{application.workspace_application_name}</strong>
                      <small>{application.workspace_application_slug}</small>
                    </span>
                  </button>
                ))
              ) : (
                <p className="search-select__empty">No se encontraron aplicaciones.</p>
              )}
            </div>
          </div>
        )}
        {error ? <span className="form-field__error">{error}</span> : null}
      </label>
    </div>
  )
}
