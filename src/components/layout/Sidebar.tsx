import {
  AppWindow,
  KeyRound,
  ListTree,
  LayoutGrid,
  Shield,
  ShieldCheck,
  ShieldEllipsis,
  UserCircle2,
  Users,
  Workflow,
} from 'lucide-react'
import { Sidebar as FoundationSidebar, type NavigationGroup } from 'foundation-ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

function hasAnyRole(userRoles: string[], expectedRoles: string[]) {
  return expectedRoles.some((role) => userRoles.includes(role))
}

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const roles = useAuthStore((state) => state.user?.roles ?? [])

  const sections: NavigationGroup[] = [
    {
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutGrid size={18} />,
          active: location.pathname === APP_ROUTES.dashboard,
          onClick: () => navigate(APP_ROUTES.dashboard),
        },
        {
          id: 'profile',
          label: 'Perfil',
          icon: <UserCircle2 size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.profile),
          onClick: () => navigate(APP_ROUTES.profile),
        },
      ],
    },
  ]

  if (hasAnyRole(roles, ['admin', 'super_admin'])) {
    sections.push({
      label: 'Módulos Admin',
      items: [
        {
          id: 'users',
          label: 'Usuarios',
          icon: <Users size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.users),
          onClick: () => navigate(APP_ROUTES.users),
        },
        {
          id: 'user-roles',
          label: 'Roles de usuario',
          icon: <Shield size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.userRoles),
          onClick: () => navigate(APP_ROUTES.userRoles),
        },
        {
          id: 'user-applications',
          label: 'Accesos por app',
          icon: <Workflow size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.userApplications),
          onClick: () => navigate(APP_ROUTES.userApplications),
        },
        {
          id: 'application-roles',
          label: 'Roles por app',
          icon: <ShieldEllipsis size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.applicationRoles),
          onClick: () => navigate(APP_ROUTES.applicationRoles),
        },
        {
          id: 'application-modules',
          label: 'Módulos por app',
          icon: <ListTree size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.applicationModules),
          onClick: () => navigate(APP_ROUTES.applicationModules),
        },
        {
          id: 'application-permissions',
          label: 'Permisos por app',
          icon: <ShieldCheck size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.applicationPermissions),
          onClick: () => navigate(APP_ROUTES.applicationPermissions),
        },
        {
          id: 'application-role-permissions',
          label: 'Permisos de rol',
          icon: <KeyRound size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.applicationRolePermissions),
          onClick: () => navigate(APP_ROUTES.applicationRolePermissions),
        },
        {
          id: 'user-application-permissions',
          label: 'Permisos de usuario',
          icon: <KeyRound size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.userApplicationPermissions),
          onClick: () => navigate(APP_ROUTES.userApplicationPermissions),
        },
      ],
    })
  }

  if (hasAnyRole(roles, ['super_admin'])) {
    sections.push({
      label: 'Módulos Super Admin',
      items: [
        {
          id: 'roles',
          label: 'Roles globales',
          icon: <Shield size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.roles),
          onClick: () => navigate(APP_ROUTES.roles),
        },
        {
          id: 'applications',
          label: 'Aplicaciones',
          icon: <Workflow size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.applications),
          onClick: () => navigate(APP_ROUTES.applications),
        },
        {
          id: 'otps',
          label: 'OTPs',
          icon: <KeyRound size={18} />,
          active: location.pathname.startsWith(APP_ROUTES.otps),
          onClick: () => navigate(APP_ROUTES.otps),
        },
      ],
    })
  }

  return (
    <FoundationSidebar
      collapsible
      collapsed={collapsed}
      footer={
        <>
          <AppWindow size={16} />
          <p>SPA administrativa conectada a la API real del Workspace.</p>
        </>
      }
      header={
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">UW</span>
          {!collapsed ? (
            <div>
              <p className="sidebar__eyebrow">Ucebul Ecosystem</p>
              <h1 className="sidebar__title">Workspace</h1>
            </div>
          ) : null}
        </div>
      }
      onCollapsedChange={onCollapsedChange}
      sections={sections}
    />
  )
}
