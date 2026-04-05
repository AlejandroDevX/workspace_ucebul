import { LoadingState as FoundationLoadingState } from 'foundation-ui'
import { cn } from '@/utils/classnames'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingState({
  message = 'Cargando información...',
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <div className={cn('workspace-loading-state', fullScreen && 'workspace-loading-state--fullscreen')}>
      <FoundationLoadingState
        description={message}
        title="Cargando"
      />
    </div>
  )
}
