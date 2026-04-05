import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="feedback-state">
      <span className="feedback-state__icon">
        <Inbox size={18} />
      </span>
      <div>
        <h3 className="feedback-state__title">{title}</h3>
        {description ? <p className="feedback-state__description">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
