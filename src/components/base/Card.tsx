import { Card as FoundationCard } from 'foundation-ui'
import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/utils/classnames'

interface CardProps extends PropsWithChildren {
  title?: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({
  children,
  title,
  description,
  action,
  footer,
  className,
}: CardProps) {
  return (
    <FoundationCard className={cn('card', className)} elevated>
      {(title || description || action) && (
        <header className="card__header">
          <div>
            {title ? <h2 className="card__title">{title}</h2> : null}
            {description ? <p className="card__description">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      )}
      <div className="card__content">{children}</div>
      {footer ? <footer className="card__footer">{footer}</footer> : null}
    </FoundationCard>
  )
}
