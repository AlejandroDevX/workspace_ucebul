import {
  ArrowUpRight,
  Clock3,
  KeyRound,
  LayoutGrid,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { useAuthStore } from '@/store/auth.store'
import type { AuthApplicationAccess } from '@/types/auth'

function getAllowedApplications(applications?: AuthApplicationAccess[]) {
  const uniqueApplications = new Map<string, AuthApplicationAccess>()

  for (const application of applications ?? []) {
    const key = String(application.id ?? application.slug ?? application.name ?? '')

    if (!key || uniqueApplications.has(key)) {
      continue
    }

    uniqueApplications.set(key, application)
  }

  return [...uniqueApplications.values()]
}

function getApplicationInitials(application: AuthApplicationAccess) {
  const source = application.name ?? application.slug ?? 'App'

  return source
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getSessionActivity(applications: AuthApplicationAccess[], roles: string[]) {
  const activeApplications = applications.filter(
    (application) => application.isActive !== false && application.accessIsActive !== false,
  )

  const items = [
    {
      id: 'session',
      title: 'Sesión lista para trabajar',
      description: 'Tu cuenta está autenticada y el workspace ya resolvió tus accesos actuales.',
      meta: 'Ahora',
      icon: Clock3,
    },
  ]

  if (roles.length > 0) {
    items.push({
      id: 'roles',
      title: `Roles globales cargados: ${roles.length}`,
      description:
        roles.length === 1
          ? `Tu rol activo es ${roles[0]}.`
          : `Roles detectados: ${roles.join(', ')}.`,
      meta: 'Sesión actual',
      icon: ShieldCheck,
    })
  }

  for (const application of activeApplications.slice(0, 3)) {
    items.push({
      id: `app-${String(application.id ?? application.slug ?? application.name)}`,
      title: application.name ?? 'Aplicación disponible',
      description:
        application.applicationRole?.name
          ? `Acceso activo con rol ${application.applicationRole.name}.`
          : 'Acceso activo para esta sesión.',
      meta: 'Disponible ahora',
      icon: LayoutGrid,
    })
  }

  if (activeApplications.length === 0) {
    items.push({
      id: 'no-apps',
      title: 'Sin aplicaciones activas',
      description: 'No hay accesos activos asignados para esta sesión.',
      meta: 'Revisión actual',
      icon: KeyRound,
    })
  }

  return items
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const applications = getAllowedApplications(user?.applications)
  const activityItems = getSessionActivity(applications, user?.roles ?? [])

  return (
    <div className="dashboard-grid">
      <aside className="dashboard-grid__sidebar">
        <Card
          title="Actividad reciente"
          description="Resumen de la sesión actual y de los accesos disponibles en este momento."
        >
          <div className="dashboard-activity-list">
            {activityItems.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.id} className="dashboard-activity-item">
                  <span className="dashboard-activity-item__icon">
                    <Icon size={18} />
                  </span>
                  <div className="dashboard-activity-item__content">
                    <div className="dashboard-activity-item__header">
                      <strong>{item.title}</strong>
                      <span>{item.meta}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </Card>
      </aside>

      <section className="dashboard-grid__content">
        <Card
          title="Accesos rápidos"
          description="Abre directamente las aplicaciones asignadas a tu usuario desde el workspace."
        >
          {applications.length > 0 ? (
            <div className="dashboard-quick-access-list">
              {applications.map((application) => {
                const isAccessActive =
                  application.isActive !== false && application.accessIsActive !== false

                return (
                  <article
                    key={String(application.id ?? application.slug ?? application.name)}
                    className="dashboard-quick-access-item"
                  >
                    <div className="dashboard-quick-access-item__brand">
                      {application.logoUrl ? (
                        <img
                          className="dashboard-app-card__logo"
                          src={application.logoUrl}
                          alt={`Logo de ${application.name ?? application.slug ?? 'la aplicación'}`}
                        />
                      ) : (
                        <div className="dashboard-app-card__logo dashboard-app-card__logo--fallback">
                          {getApplicationInitials(application)}
                        </div>
                      )}

                      <div className="dashboard-quick-access-item__copy">
                        <h3>{application.name ?? 'Aplicación sin nombre'}</h3>
                        <StatusBadge
                          label={isAccessActive ? 'Acceso activo' : 'Acceso inactivo'}
                          tone={isAccessActive ? 'success' : 'warning'}
                        />
                      </div>
                    </div>

                    {application.url ? (
                      <Button
                        rightIcon={<ArrowUpRight size={16} />}
                        onClick={() =>
                          window.open(application.url, '_blank', 'noopener,noreferrer')
                        }
                        variant="secondary"
                      >
                        Ir a la app
                      </Button>
                    ) : (
                      <Button disabled variant="secondary">
                        Enlace no disponible
                      </Button>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="Sin aplicaciones asignadas"
              description="Tu usuario aún no tiene accesos activos a aplicaciones dentro del Workspace."
            />
          )}
        </Card>
      </section>
    </div>
  )
}
