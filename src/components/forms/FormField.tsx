import { FormField as FoundationFormField } from 'foundation-ui'
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
    <FoundationFormField
      controlId={htmlFor}
      error={error}
      hint={hint}
      label={label}
      required={false}
    >
      {children}
    </FoundationFormField>
  )
}
