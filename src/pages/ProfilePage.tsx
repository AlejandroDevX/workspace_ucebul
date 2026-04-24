import {
  ArrowUpRight,
  BadgeCheck,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Avatar, Tabs, type TabItem } from 'foundation-ui'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { PageHeader } from '@/components/base/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'
import type { AuthApplicationAccess, AuthPermissionAccess } from '@/types/auth'

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

function getPermissionKey(permission: AuthPermissionAccess) {
  return String(permission.id ?? permission.slug ?? permission.name ?? '')
}

function getPermissionLabel(permission: AuthPermissionAccess) {
  return permission.name ?? permission.slug ?? 'Permiso'
}

function getUniquePermissions(application: AuthApplicationAccess) {
  const permissions = new Map<string, AuthPermissionAccess>()

  for (const permission of application.effectivePermissions ?? []) {
    const key = getPermissionKey(permission)

    if (key) {
      permissions.set(key, permission)
    }
  }

  if (permissions.size > 0) {
    return [...permissions.values()]
  }

  for (const permission of application.directPermissions ?? []) {
    const key = getPermissionKey(permission)

    if (key) {
      permissions.set(key, permission)
    }
  }

  return [...permissions.values()]
}

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const applications = getAllowedApplications(user?.applications)
  const activeApplicationsCount = applications.filter(
    (application) => application.isActive !== false && application.accessIsActive !== false,
  ).length
  const totalPermissions = applications.reduce(
    (count, application) => count + getUniquePermissions(application).length,
    0,
  )
  const displayName =
    [user?.name, user?.lastName].filter(Boolean).join(' ').trim() || 'Usuario Ucebul'
  const rolesCount = (user?.roles ?? []).length
  const tabs: TabItem[] = [
    {
      value: 'overview',
      label: 'Resumen',
      content: (
        <div className="profile-panel">
          <header className="profile-panel__header">
            <h3 className="profile-panel__title">Resumen de la cuenta</h3>
            <p className="profile-panel__description">
              Consulta tu información principal y el alcance general de acceso dentro del workspace.
            </p>
          </header>

          <div className="profile-tab-grid">
            <section className="profile-section-block">
              <h4>Información personal</h4>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-item__icon">
                    <UserRound size={18} />
                  </span>
                  <div>
                    <span>Nombre completo</span>
                    <strong>{displayName}</strong>
                  </div>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-item__icon">
                    <Mail size={18} />
                  </span>
                  <div>
                    <span>Correo electrónico</span>
                    <strong>{user?.email ?? 'Sin correo disponible'}</strong>
                  </div>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-item__icon">
                    <BadgeCheck size={18} />
                  </span>
                  <div>
                    <span>Identificador</span>
                    <strong>{user?.id ?? 'Sin ID disponible'}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-section-block">
              <h4>Roles globales</h4>
              {rolesCount > 0 ? (
                <div className="profile-tab-stack">
                  <div className="tag-list">
                    {user?.roles.map((role) => <PermissionBadge key={role} label={role} />)}
                  </div>
                  <p className="text-muted">
                    Tus roles controlan qué módulos puedes consultar y gestionar dentro del panel.
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Sin roles globales"
                  description="Tu sesión no tiene roles globales resueltos en este momento."
                />
              )}
            </section>
          </div>
        </div>
      ),
    },
    {
      value: 'applications',
      label: 'Aplicaciones',
      badge: applications.length > 0 ? String(applications.length) : undefined,
      content: (
        <div className="profile-panel">
          <header className="profile-panel__header">
            <h3 className="profile-panel__title">Aplicaciones a las que tienes acceso</h3>
            <p className="profile-panel__description">
              Revisa tus accesos disponibles, el rol asignado en cada aplicación y los permisos activos.
            </p>
          </header>

          <div className="profile-app-overview">
            <div className="profile-app-overview__item">
              <span>Accesos disponibles</span>
              <strong>{applications.length}</strong>
            </div>
            <div className="profile-app-overview__item">
              <span>Accesos activos</span>
              <strong>{activeApplicationsCount}</strong>
            </div>
            <div className="profile-app-overview__item">
              <span>Permisos totales</span>
              <strong>{totalPermissions}</strong>
            </div>
          </div>

          {applications.length > 0 ? (
            <div className="profile-app-list">
              {applications.map((application) => {
                const permissions = getUniquePermissions(application)
                const previewPermissions = permissions.slice(0, 3)
                const remainingPermissions = permissions.length - previewPermissions.length
                const isAccessActive =
                  application.isActive !== false && application.accessIsActive !== false

                return (
                  <article
                    key={String(application.id ?? application.slug ?? application.name)}
                    className="profile-app-row"
                  >
                    <div className="profile-app-row__top">
                      <div className="profile-app-row__brand">
                        {application.logoUrl ? (
                          <img
                            className="profile-app-card__logo"
                            src={application.logoUrl}
                            alt={`Logo de ${application.name ?? application.slug ?? 'la aplicación'}`}
                          />
                        ) : (
                          <div className="profile-app-card__logo profile-app-card__logo--fallback">
                            {getApplicationInitials(application)}
                          </div>
                        )}

                        <div className="profile-app-row__copy">
                          <div className="profile-app-row__title-line">
                            <h3>{application.name ?? 'Aplicación sin nombre'}</h3>
                            {application.slug ? (
                              <span className="profile-app-row__slug">{application.slug}</span>
                            ) : null}
                          </div>
                          <p>
                            {application.description ??
                              'Acceso disponible dentro de tu entorno de trabajo.'}
                          </p>
                        </div>
                      </div>

                      <div className="profile-app-row__actions">
                        <StatusBadge
                          label={isAccessActive ? 'Acceso activo' : 'Acceso restringido'}
                          tone={isAccessActive ? 'success' : 'warning'}
                        />
                        {application.url ? (
                          <Button
                            variant="secondary"
                            rightIcon={<ArrowUpRight size={16} />}
                            onClick={() =>
                              window.open(application.url, '_blank', 'noopener,noreferrer')
                            }
                          >
                            Abrir aplicación
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="profile-app-row__summary">
                      <div className="profile-app-row__fact">
                        <span>Rol en la aplicación</span>
                        <strong>
                          {application.applicationRole?.name ?? 'Sin rol específico'}
                        </strong>
                        <small>
                          Define tu alcance funcional dentro de esta aplicación.
                        </small>
                      </div>
                      <div className="profile-app-row__fact">
                        <span>Permisos disponibles</span>
                        <strong>{permissions.length}</strong>
                        <small>
                          {permissions.length > 0
                            ? 'Permisos resueltos para este acceso.'
                            : 'No se reportan permisos detallados.'}
                        </small>
                      </div>
                      <div className="profile-app-row__fact">
                        <span>Estado operativo</span>
                        <strong>{isAccessActive ? 'Listo para usar' : 'Con restricciones'}</strong>
                        <small>
                          {isAccessActive
                            ? 'Puedes ingresar y operar con este acceso.'
                            : 'Revisa la activación con un administrador.'}
                        </small>
                      </div>
                    </div>

                    <div className="profile-app-row__permissions-block">
                      <div className="profile-app-row__permissions-header">
                        <strong>Permisos incluidos</strong>
                        <span>
                          {permissions.length > 0
                            ? `${permissions.length} disponibles`
                            : 'Sin permisos detallados'}
                        </span>
                      </div>

                      <div className="profile-app-row__permissions">
                        {previewPermissions.map((permission) => (
                          <PermissionBadge
                            key={getPermissionKey(permission)}
                            label={getPermissionLabel(permission)}
                          />
                        ))}
                        {remainingPermissions > 0 ? (
                          <PermissionBadge label={`+${remainingPermissions} permisos`} />
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="Sin aplicaciones asignadas"
              description="Todavía no tienes accesos activos a aplicaciones dentro del workspace."
            />
          )}
        </div>
      ),
    },
    {
      value: 'security',
      label: 'Seguridad',
      content: (
        <div className="profile-panel">
          <header className="profile-panel__header">
            <h3 className="profile-panel__title">Seguridad de la cuenta</h3>
            <p className="profile-panel__description">
              Mantén protegido tu acceso y usa el flujo de recuperación seguro cuando necesites actualizar tu contraseña.
            </p>
          </header>

          <div className="profile-tab-grid">
            <section className="profile-section-block profile-security-card">
              <h4>Contraseña y acceso</h4>
              <div className="profile-security-card__stack">
                <div className="profile-security-card__item">
                  <span className="profile-security-card__icon">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <strong>Sesión protegida</strong>
                    <p>
                      {token
                        ? 'Tu sesión está activa y validada dentro del workspace.'
                        : 'No hay un token persistido en esta sesión.'}
                    </p>
                  </div>
                </div>

                <div className="profile-security-card__item">
                  <span className="profile-security-card__icon">
                    <KeyRound size={18} />
                  </span>
                  <div>
                    <strong>Cambio de contraseña</strong>
                    <p>
                      El cambio se realiza mediante verificación por correo para evitar modificaciones no autorizadas.
                    </p>
                  </div>
                </div>

                <Button
                  leftIcon={<KeyRound size={16} />}
                  onClick={() => navigate(APP_ROUTES.forgotPassword)}
                >
                  Cambiar contraseña
                </Button>
              </div>
            </section>

            <section className="profile-section-block">
              <h4>Estado de la sesión</h4>
              <div className="profile-session-stack">
                <div className="profile-session-row">
                  <span>Sesión actual</span>
                  <StatusBadge
                    label={token ? 'Activa' : 'Sin token'}
                    tone={token ? 'success' : 'warning'}
                  />
                </div>
                <div className="profile-session-row">
                  <span>Revalidación</span>
                  <strong>Automática al refrescar</strong>
                </div>
                <div className="profile-session-row">
                  <span>Método de seguridad</span>
                  <strong>Verificación por correo</strong>
                </div>
              </div>
            </section>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Perfil"
        title="Mi cuenta"
        description="Consulta tu información, los roles del workspace, las aplicaciones habilitadas y las opciones de seguridad."
      />

      <section className="profile-shell">
        <aside className="profile-shell__summary">
          <Card className="profile-hero-card profile-summary-card">
            <div className="profile-hero-card__identity">
              <Avatar
                className="profile-hero-card__avatar"
                name={displayName}
                size="xl"
              />

              <div className="profile-hero-card__copy">
                <p className="profile-hero-card__eyebrow">Cuenta del workspace</p>
                <h2>{displayName}</h2>
                <p className="profile-summary-card__email">
                  {user?.email ?? 'Sin correo disponible'}
                </p>
              </div>
            </div>

            <div className="profile-hero-card__stats">
              <div>
                <span>Roles globales</span>
                <strong>{rolesCount}</strong>
              </div>
              <div>
                <span>Aplicaciones activas</span>
                <strong>{applications.length}</strong>
              </div>
              <div>
                <span>Permisos disponibles</span>
                <strong>{totalPermissions}</strong>
              </div>
            </div>

            <div className="profile-hero-card__meta">
              <StatusBadge
                label={token ? 'Sesión activa' : 'Sin token'}
                tone={token ? 'success' : 'warning'}
              />
              <PermissionBadge label={`${rolesCount} roles`} />
              <PermissionBadge label={`${applications.length} apps`} />
            </div>
          </Card>
        </aside>

        <div className="profile-shell__content">
          <Card className="profile-content-card">
            <Tabs className="profile-tabs" fullWidth items={tabs} />
          </Card>
        </div>
      </section>
    </div>
  )
}
