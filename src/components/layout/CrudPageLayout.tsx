import type { PropsWithChildren, ReactNode } from 'react'
import { PageHeader } from '@/components/base/PageHeader'

interface CrudPageLayoutProps extends PropsWithChildren {
  title: string
  description: string
  eyebrow?: string
  action?: ReactNode
}

export function CrudPageLayout({
  title,
  description,
  eyebrow,
  action,
  children,
}: CrudPageLayoutProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
      />
      {children}
    </div>
  )
}
