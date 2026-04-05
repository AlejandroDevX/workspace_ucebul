import {
  FormField,
  Select,
  Textarea,
  type SelectOption,
} from 'foundation-ui'
import type { ReactNode } from 'react'
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form'
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
    <form
      className={cn('resource-form', className)}
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup columns={columns}>
        {fields.map((field) => {
          const error = form.formState.errors[field.name]?.message
          const key = String(field.name)
          const options: SelectOption[] =
            field.options?.map((option) => ({
              label: option.label,
              value: option.value,
            })) ?? []

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
              controlId={key}
              error={typeof error === 'string' ? error : undefined}
              hint={field.hint}
              label={field.label}
            >
              {field.type === 'textarea' ? (
                <Textarea
                  id={key}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  invalid={Boolean(error)}
                  {...form.register(field.name)}
                />
              ) : field.type === 'select' ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: controllerField }) => (
                    <Select
                      controlId={key}
                      disabled={field.disabled}
                      invalid={Boolean(error)}
                      options={options}
                      placeholder="Selecciona una opción"
                      searchable={options.length > 6}
                      value={
                        typeof controllerField.value === 'string'
                          ? controllerField.value
                          : null
                      }
                      onValueChange={(value) => {
                        controllerField.onChange(value ?? '')
                        controllerField.onBlur()
                      }}
                    />
                  )}
                />
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
