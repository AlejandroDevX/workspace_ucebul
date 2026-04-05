import type { PropsWithChildren, ReactNode } from 'react'

interface FormFieldProps extends PropsWithChildren {
  htmlFor: string
  label: string
  error?: string
  hint?: ReactNode
}

export function FormField({
  htmlFor,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {error ? <span className="form-field__error">{error}</span> : null}
      {!error && hint ? <span className="form-field__hint">{hint}</span> : null}
    </label>
  )
}
