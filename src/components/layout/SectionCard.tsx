import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '@/components/base/Card'

interface SectionCardProps extends PropsWithChildren {
  title: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
  className?: string
}

export function SectionCard(props: SectionCardProps) {
  return <Card {...props} />
}
