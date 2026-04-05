import { Badge } from 'foundation-ui'

interface PermissionBadgeProps {
  label: string
}

export function PermissionBadge({ label }: PermissionBadgeProps) {
  return (
    <Badge appearance="soft" className="permission-badge" tone="info">
      {label}
    </Badge>
  )
}
