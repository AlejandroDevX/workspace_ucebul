import {
  AppWindow,
  KeyRound,
  LayoutGrid,
  Shield,
  ShieldCheck,
  UserCircle2,
  Users,
  Workflow,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { AccessGuard } from '@/components/layout/AccessGuard'
import { APP_ROUTES } from '@/routes/paths'
import { cn } from '@/utils/classnames'

const navigationItems = [
  {
    to: APP_ROUTES.dashboard,
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    to: APP_ROUTES.profile,
    label: 'Perfil',
    icon: UserCircle2,
  },
] as const

const adminNavigationItems = [
  {
    to: APP_ROUTES.users,
    label: 'Usuarios',
    icon: Users,
  },
  {
    to: APP_ROUTES.userRoles,
    label: 'Roles de usuario',
    icon: Shield,
  },
  {
    to: APP_ROUTES.userApplications,
    label: 'Accesos por app',
    icon: Workflow,
  },
  {
    to: APP_ROUTES.applicationPermissions,
    label: 'Permisos por app',
    icon: ShieldCheck,
  },
  {
    to: APP_ROUTES.userApplicationPermissions,
    label: 'Permisos de usuario',
    icon: KeyRound,
  },
] as const

const superAdminNavigationItems = [
  {
    to: APP_ROUTES.roles,
    label: 'Roles globales',
    icon: Shield,
  },
  {
    to: APP_ROUTES.applications,
    label: 'Aplicaciones',
    icon: Workflow,
  },
  {
    to: APP_ROUTES.otps,
    label: 'OTPs',
    icon: KeyRound,
  },
] as const

export function Sidebar() {
  function renderNavItems(
    items: ReadonlyArray<{ to: string; label: string; icon: typeof LayoutGrid }>,
  ) {
    return items.map((item) => {
      const Icon = item.icon

      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === APP_ROUTES.dashboard}
          className={({ isActive }) =>
            cn('sidebar__link', isActive && 'sidebar__link--active')
          }
        >
          <Icon size={18} />
          <span>{item.label}</span>
        </NavLink>
      )
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">UW</span>
        <div>
          <p className="sidebar__eyebrow">Ucebul Ecosystem</p>
          <h1 className="sidebar__title">Workspace</h1>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Principal">
        {renderNavItems(navigationItems)}
      </nav>

      <AccessGuard allowedRoles={['admin', 'super_admin']}>
        <section className="sidebar__section">
          <div className="sidebar__section-header">
            <Shield size={16} />
            <span>Módulos Admin</span>
          </div>
          <nav className="sidebar__nav" aria-label="Administración">
            {renderNavItems(adminNavigationItems)}
          </nav>
        </section>
      </AccessGuard>

      <AccessGuard allowedRoles={['super_admin']}>
        <section className="sidebar__section">
          <div className="sidebar__section-header">
            <ShieldCheck size={16} />
            <span>Módulos Super Admin</span>
          </div>
          <nav className="sidebar__nav" aria-label="Super administración">
            {renderNavItems(superAdminNavigationItems)}
          </nav>
        </section>
      </AccessGuard>

      <div className="sidebar__footer">
        <AppWindow size={16} />
        <p>SPA administrativa conectada a la API real del Workspace.</p>
      </div>
    </aside>
  )
}
