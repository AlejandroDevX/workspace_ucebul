import { AppWindow, LayoutGrid, Shield, UserCircle2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
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

const pendingModules = [
  'Usuarios globales',
  'Roles del workspace',
  'Aplicaciones',
  'Permisos por aplicación',
  'OTPs',
] as const

export function Sidebar() {
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
        {navigationItems.map((item) => {
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
        })}
      </nav>

      <section className="sidebar__section">
        <div className="sidebar__section-header">
          <Shield size={16} />
          <span>Módulos listos</span>
        </div>
        <ul className="sidebar__list">
          {pendingModules.map((item) => (
            <li key={item} className="sidebar__list-item">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="sidebar__footer">
        <AppWindow size={16} />
        <p>Base SPA desacoplada para integrar la librería UI más adelante.</p>
      </div>
    </aside>
  )
}
