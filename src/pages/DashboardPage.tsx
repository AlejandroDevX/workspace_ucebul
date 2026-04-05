import { Activity, Shield, Users, Workflow } from 'lucide-react'
import { Card } from '@/components/base/Card'
import { DataTable } from '@/components/base/DataTable'
import { PageHeader } from '@/components/base/PageHeader'
import { useAuthStore } from '@/store/auth.store'

const overviewCards = [
  {
    title: 'Usuarios globales',
    description: 'Gestiona identidad, acceso y lifecycle desde una sola capa de workspace.',
    icon: Users,
  },
  {
    title: 'Roles y permisos',
    description: 'La arquitectura ya contempla guards globales, admin y super admin.',
    icon: Shield,
  },
  {
    title: 'Aplicaciones conectadas',
    description: 'La base permite extender accesos y permisos por app sin rehacer la SPA.',
    icon: Workflow,
  },
  {
    title: 'Sesión y seguridad',
    description: 'Token, validación de sesión y recuperación por OTP quedan centralizados.',
    icon: Activity,
  },
] as const

const moduleReadiness = [
  {
    id: 'users',
    module: '/users',
    endpoint: '/workspace-users',
    state: 'Listo',
  },
  {
    id: 'roles',
    module: '/roles',
    endpoint: '/workspace-roles',
    state: 'Listo',
  },
  {
    id: 'applications',
    module: '/applications',
    endpoint: '/workspace-applications',
    state: 'Listo',
  },
  {
    id: 'application-permissions',
    module: '/application-permissions',
    endpoint: '/workspace-application-permissions',
    state: 'Listo',
  },
] as const

type ModuleReadinessRow = (typeof moduleReadiness)[number]

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workspace overview"
        title={`Hola, ${user?.name ?? 'equipo Ucebul'}`}
        description="La base del frontend quedó organizada por dominio, preparada para crecer sin acoplar la UI temporal al backend."
      />

      <section className="dashboard-overview-grid">
        {overviewCards.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title} className="dashboard-metric-card">
              <div className="dashboard-metric-card__icon">
                <Icon size={18} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Card>
          )
        })}
      </section>

      <section className="dashboard-content-grid">
        <Card
          title="Arquitectura inicial"
          description="Decisiones aplicadas para mantener desacoplamiento, mantenibilidad y crecimiento por módulos."
        >
          <ul className="feature-list">
            <li>Router con guards públicos, autenticados y por rol global.</li>
            <li>Store de auth en Zustand solo para estado verdaderamente transversal.</li>
            <li>React Query reservado para estado servidor y mutaciones remotas.</li>
            <li>Axios encapsulado en servicios y normalizadores, no en componentes visuales.</li>
            <li>CSS puro con tokens globales y componentes visuales reemplazables.</li>
          </ul>
        </Card>

        <Card
          title="Módulos administrativos"
          description="Cada dominio queda con tipos, servicio y hooks base para empezar a conectar vistas reales."
        >
          <DataTable<ModuleReadinessRow>
            caption="Estado de la base administrativa"
            columns={[
              { key: 'module', header: 'Ruta SPA', cell: (row) => row.module },
              { key: 'endpoint', header: 'Endpoint', cell: (row) => row.endpoint },
              {
                key: 'state',
                header: 'Estado',
                cell: (row) => <span className="badge">{row.state}</span>,
              },
            ]}
            data={moduleReadiness}
            getRowId={(row) => row.id}
          />
        </Card>
      </section>
    </div>
  )
}
