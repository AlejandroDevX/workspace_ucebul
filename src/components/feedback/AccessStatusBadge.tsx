import { StatusBadge } from '@/components/feedback/StatusBadge'

interface AccessStatusBadgeProps {
  isActive: boolean
}

export function AccessStatusBadge({ isActive }: AccessStatusBadgeProps) {
  return (
    <StatusBadge
      label={isActive ? 'Activo' : 'Inactivo'}
      tone={isActive ? 'success' : 'warning'}
    />
  )
}
