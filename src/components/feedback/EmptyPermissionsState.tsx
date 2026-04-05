import { ShieldOff } from 'lucide-react'

interface EmptyPermissionsStateProps {
  title: string
  description: string
}

export function EmptyPermissionsState({
  title,
  description,
}: EmptyPermissionsStateProps) {
  return (
    <div className="empty-permissions-state">
      <div className="empty-permissions-state__icon">
        <ShieldOff size={18} />
      </div>
      <div>
        <h3 className="empty-permissions-state__title">{title}</h3>
        <p className="empty-permissions-state__description">{description}</p>
      </div>
    </div>
  )
}
