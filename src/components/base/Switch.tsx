import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/classnames'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export function Switch({
  className,
  label,
  description,
  checked,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <label className={cn('switch-field', disabled && 'switch-field--disabled', className)}>
      <span className="switch-field__copy">
        <span className="switch-field__label">{label}</span>
        {description ? <span className="switch-field__description">{description}</span> : null}
      </span>
      <span className="switch">
        <input type="checkbox" checked={checked} disabled={disabled} {...props} />
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
      </span>
    </label>
  )
}
