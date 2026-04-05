import { StatusBadge as FoundationStatusBadge } from 'foundation-ui'

type StatusTone = 'default' | 'success' | 'warning' | 'danger'

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
}

export function StatusBadge({
  label,
  tone = 'default',
}: StatusBadgeProps) {
  return (
    <FoundationStatusBadge
      status={label}
      tone={tone === 'default' ? 'neutral' : tone}
    />
  )
}
