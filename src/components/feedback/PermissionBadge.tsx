interface PermissionBadgeProps {
  label: string
}

export function PermissionBadge({ label }: PermissionBadgeProps) {
  return <span className="permission-badge">{label}</span>
}
