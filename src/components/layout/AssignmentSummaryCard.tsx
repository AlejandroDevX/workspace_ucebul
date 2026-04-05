import { Mail, UserRound, Workflow } from 'lucide-react'
import { AccessStatusBadge } from '@/components/feedback/AccessStatusBadge'

interface AssignmentSummaryCardProps {
  userName: string
  userEmail?: string
  applicationName: string
  isActive: boolean
  permissionsCount?: number
}

export function AssignmentSummaryCard({
  userName,
  userEmail,
  applicationName,
  isActive,
  permissionsCount,
}: AssignmentSummaryCardProps) {
  return (
    <section className="assignment-summary-card">
      <div className="assignment-summary-card__header">
        <div>
          <p className="assignment-summary-card__eyebrow">Acceso seleccionado</p>
          <h3 className="assignment-summary-card__title">{userName}</h3>
        </div>
        <AccessStatusBadge isActive={isActive} />
      </div>
      <dl className="assignment-summary-card__grid">
        <div className="assignment-summary-card__item">
          <dt>
            <UserRound size={14} />
            Usuario
          </dt>
          <dd>{userName}</dd>
        </div>
        <div className="assignment-summary-card__item">
          <dt>
            <Mail size={14} />
            Email
          </dt>
          <dd>{userEmail ?? 'Sin email disponible'}</dd>
        </div>
        <div className="assignment-summary-card__item">
          <dt>
            <Workflow size={14} />
            Aplicación
          </dt>
          <dd>{applicationName}</dd>
        </div>
        {permissionsCount !== undefined ? (
          <div className="assignment-summary-card__item">
            <dt>Permisos asignados</dt>
            <dd>{permissionsCount}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}
