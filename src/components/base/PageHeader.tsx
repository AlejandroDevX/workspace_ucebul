import { Badge, PageHeader as FoundationPageHeader } from 'foundation-ui'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  action?: ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
}: PageHeaderProps) {
  return (
    <FoundationPageHeader
      actions={action}
      breadcrumb={
        eyebrow ? (
          <Badge appearance="soft" tone="info">
            {eyebrow}
          </Badge>
        ) : undefined
      }
      description={description}
      title={title}
    />
  )
}
