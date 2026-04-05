import { cn } from '@/utils/classnames'

type StatusTone = 'default' | 'success' | 'warning' | 'danger'

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
}

export function StatusBadge({
  label,
  tone = 'default',
}: StatusBadgeProps) {
  return <span className={cn('status-badge', `status-badge--${tone}`)}>{label}</span>
}
