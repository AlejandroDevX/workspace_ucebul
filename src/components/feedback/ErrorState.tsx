import { ErrorState as FoundationErrorState } from 'foundation-ui'
import type { ReactNode } from 'react'

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
  return <FoundationErrorState action={action} description={description} title={title} />
}
