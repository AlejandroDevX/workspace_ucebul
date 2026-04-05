import { LoaderCircle } from 'lucide-react'
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
    <div className={cn('feedback-state', fullScreen && 'feedback-state--fullscreen')}>
      <span className="feedback-state__icon feedback-state__icon--spin">
        <LoaderCircle size={18} />
      </span>
      <p className="feedback-state__description">{message}</p>
    </div>
  )
}
