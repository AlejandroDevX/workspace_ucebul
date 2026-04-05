import type { ReactNode } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/base/Input'
import { FieldGroup } from '@/components/forms/FieldGroup'
import { cn } from '@/utils/classnames'

interface ResourceFormOption {
  label: string
  value: string
}

type ResourceFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'select'

export interface ResourceFormField<TValues extends FieldValues> {
  name: Path<TValues>
  label: string
  type?: ResourceFieldType
  placeholder?: string
  hint?: ReactNode
  options?: ResourceFormOption[]
  disabled?: boolean
  rows?: number
}

interface ResourceFormProps<TValues extends FieldValues> {
  form: UseFormReturn<TValues, any, any>
  fields: ReadonlyArray<ResourceFormField<TValues>>
  onSubmit: (values: TValues) => void | Promise<void>
  actions: ReactNode
  columns?: 1 | 2
  className?: string
}

export function ResourceForm<TValues extends FieldValues>({
  form,
  fields,
  onSubmit,
  actions,
  columns = 2,
  className,
}: ResourceFormProps<TValues>) {
  return (
    <form className={cn('resource-form', className)} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup columns={columns}>
        {fields.map((field) => {
          const error = form.formState.errors[field.name]?.message
          const key = String(field.name)

          if (field.type === 'checkbox') {
            return (
              <label key={key} className="checkbox-field">
                <input
                  type="checkbox"
                  disabled={field.disabled}
                  {...form.register(field.name)}
                />
                <div>
                  <span className="checkbox-field__label">{field.label}</span>
                  {field.hint ? (
                    <span className="checkbox-field__hint">{field.hint}</span>
                  ) : null}
                </div>
              </label>
            )
          }

          return (
            <FormField
              key={key}
              htmlFor={key}
              label={field.label}
              hint={field.hint}
              error={typeof error === 'string' ? error : undefined}
            >
              {field.type === 'textarea' ? (
                <textarea
                  id={key}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  className="input textarea"
                  disabled={field.disabled}
                  {...form.register(field.name)}
                />
              ) : field.type === 'select' ? (
                <select
                  id={key}
                  className="input"
                  disabled={field.disabled}
                  {...form.register(field.name)}
                >
                  <option value="">Selecciona una opción</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={key}
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  invalid={Boolean(error)}
                  disabled={field.disabled}
                  {...form.register(field.name)}
                />
              )}
            </FormField>
          )
        })}
      </FieldGroup>
      {actions}
    </form>
  )
}
