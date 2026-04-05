import { Card } from '@/components/base/Card'
import { PageHeader } from '@/components/base/PageHeader'
import { PermissionBadge } from '@/components/feedback/PermissionBadge'
import { useAuthStore } from '@/store/auth.store'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Perfil"
        title="Mi cuenta"
        description="Resumen de la sesión autenticada y los roles globales del workspace."
      />

      <div className="profile-grid">
        <Card title="Identidad">
          <dl className="detail-list">
            <div>
              <dt>Nombre</dt>
              <dd>{user?.name ?? 'Sin nombre disponible'}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{user?.email ?? 'Sin correo disponible'}</dd>
            </div>
            <div>
              <dt>ID</dt>
              <dd>{user?.id ?? 'Sin ID disponible'}</dd>
            </div>
          </dl>
        </Card>

        <Card
          title="Roles globales"
          description="Los guards consumen esta información para controlar el acceso por ruta."
        >
          <div className="tag-list">
            {(user?.roles ?? []).length > 0 ? (
              user?.roles.map((role) => <PermissionBadge key={role} label={role} />)
            ) : (
              <p className="text-muted">No hay roles resueltos en la sesión actual.</p>
            )}
          </div>
        </Card>

        <Card
          title="Sesión"
          description="Estado local que se persiste y revalida contra Laravel al refrescar."
        >
          <dl className="detail-list">
            <div>
              <dt>Token persistido</dt>
              <dd>{token ? 'Disponible' : 'No disponible'}</dd>
            </div>
            <div>
              <dt>Revalidación</dt>
              <dd>Automática mediante `/auth/validate-token` y `/auth/me`.</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
