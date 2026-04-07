import { ArrowUpRight, Blocks, Sparkles } from 'lucide-react'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'
import { PageHeader } from '@/components/base/PageHeader'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { useAuthStore } from '@/store/auth.store'
import type { AuthApplicationAccess } from '@/types/auth'

function getAllowedApplications(applications?: AuthApplicationAccess[]) {
  const uniqueApplications = new Map<string, AuthApplicationAccess>()

  for (const application of applications ?? []) {
    const key = String(application.id ?? application.slug ?? application.name ?? '')

    if (!key) {
      continue
    }

    if (!uniqueApplications.has(key)) {
      uniqueApplications.set(key, application)
    }
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

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const applications = getAllowedApplications(user?.applications)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workspace"
        title={`Hola, ${user?.name ?? 'equipo Ucebul'}`}
        description="Tu espacio de trabajo muestra únicamente las aplicaciones habilitadas para esta sesión."
      />

      <section className="dashboard-hero-grid">
        <Card className="dashboard-hero-card">
          <div className="dashboard-hero-card__eyebrow">
            <Sparkles size={16} />
            <span>Acceso personalizado</span>
          </div>
          <h2>Aplicaciones disponibles para ti</h2>
          <p>
            El dashboard filtra tu experiencia según los accesos activos del Workspace.
          </p>
          <div className="dashboard-hero-card__stats">
            <div>
              <strong>{applications.length}</strong>
              <span>aplicaciones permitidas</span>
            </div>
            <div>
              <strong>{(user?.roles ?? []).length}</strong>
              <span>roles globales resueltos</span>
            </div>
          </div>
        </Card>

        <Card
          className="dashboard-side-card"
          title="Tu sesión"
          description="Resumen rápido del acceso actual."
        >
          <div className="dashboard-side-card__stack">
            <div className="dashboard-side-card__item">
              <span>Usuario</span>
              <strong>{user?.email ?? 'Sin correo disponible'}</strong>
            </div>
            <div className="dashboard-side-card__item">
              <span>Acceso</span>
              <StatusBadge
                label={applications.length > 0 ? 'Disponible' : 'Sin apps'}
                tone={applications.length > 0 ? 'success' : 'warning'}
              />
            </div>
            <div className="tag-list">
              {(user?.roles ?? []).map((role) => (
                <PermissionBadge key={role} label={role} />
              ))}
            </div>
          </div>
        </Card>
      </section>

      <Card
        title="Aplicaciones permitidas"
        description="Accesos disponibles para el usuario autenticado en este momento."
      >
        {applications.length > 0 ? (
          <div className="dashboard-apps-grid">
            {applications.map((application) => (
              <article
                key={String(application.id ?? application.slug ?? application.name)}
                className="dashboard-app-card"
              >
                <div className="dashboard-app-card__header">
                  <div className="dashboard-app-card__brand">
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

                    <div className="dashboard-app-card__copy">
                      <h3>{application.name ?? 'Aplicación sin nombre'}</h3>
                      <p>{application.description ?? 'Acceso disponible en tu workspace.'}</p>
                    </div>
                  </div>

                  <StatusBadge
                    label={application.isActive === false ? 'Inactiva' : 'Activa'}
                    tone={application.isActive === false ? 'warning' : 'success'}
                  />
                </div>

                <div className="dashboard-app-card__meta">
                  {application.slug ? <PermissionBadge label={application.slug} /> : null}
                  <PermissionBadge label="Acceso permitido" />
                </div>

                {application.url ? (
                  <div className="dashboard-app-card__actions">
                    <Button
                      rightIcon={<ArrowUpRight size={16} />}
                      onClick={() => window.open(application.url, '_blank', 'noopener,noreferrer')}
                      variant="secondary"
                    >
                      Abrir aplicación
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin aplicaciones asignadas"
            description="Tu usuario aún no tiene accesos activos a aplicaciones dentro del Workspace."
            action={
              <div className="dashboard-empty-state__action">
                <Blocks size={16} />
                <span>Solicita acceso a un administrador del Workspace.</span>
              </div>
            }
          />
        )}
      </Card>
    </div>
  )
}
