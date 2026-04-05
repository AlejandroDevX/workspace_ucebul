import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/classnames'

interface FieldGroupProps extends PropsWithChildren {
  columns?: 1 | 2
  className?: string
}

export function FieldGroup({
  columns = 2,
  className,
  children,
}: FieldGroupProps) {
  return (
    <div className={cn('field-group', columns === 1 && 'field-group--single', className)}>
      {children}
    </div>
  )
}
