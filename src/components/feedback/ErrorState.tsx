import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description: string
  action?: ReactNode
}

export function ErrorState({
  title = 'Ocurrió un problema',
  description,
  action,
}: ErrorStateProps) {
  return (
    <div className="feedback-state feedback-state--error">
      <span className="feedback-state__icon">
        <AlertTriangle size={18} />
      </span>
      <div>
        <h3 className="feedback-state__title">{title}</h3>
        <p className="feedback-state__description">{description}</p>
      </div>
      {action}
    </div>
  )
}
