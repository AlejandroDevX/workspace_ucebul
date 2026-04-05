import type { ReactNode } from 'react'
import { Button } from '@/components/base/Button'

interface FormActionsProps {
  submitLabel: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  submitIcon?: ReactNode
  align?: 'start' | 'end'
}

export function FormActions({
  submitLabel,
  cancelLabel = 'Cancelar',
  onCancel,
  isSubmitting = false,
  submitIcon,
  align = 'end',
}: FormActionsProps) {
  return (
    <div className={`form-actions form-actions--${align}`}>
      {onCancel ? (
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
      ) : null}
      <Button type="submit" isLoading={isSubmitting} leftIcon={submitIcon}>
        {submitLabel}
      </Button>
    </div>
  )
}
