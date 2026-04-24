import { ChevronDown, KeyRound, LogOut, UserRound } from 'lucide-react'
import { Avatar, Breadcrumb, Dropdown, type BreadcrumbItem } from 'foundation-ui'
import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '@/modules/auth/hooks/useAuthMutations'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

const routeGroups = [
  {
    base: APP_ROUTES.users,
    label: 'Usuarios',
    detailLabel: 'Detalle de usuario',
  },
  {
    base: APP_ROUTES.roles,
    label: 'Roles',
    detailLabel: 'Detalle de rol',
  },
  {
    base: APP_ROUTES.applications,
    label: 'Aplicaciones',
    detailLabel: 'Detalle de aplicación',
  },
  {
    base: APP_ROUTES.applicationRoles,
    label: 'Roles por aplicación',
    detailLabel: 'Detalle de rol interno',
  },
  {
    base: APP_ROUTES.applicationModules,
    label: 'Módulos por aplicación',
    detailLabel: 'Detalle de módulo',
  },
  {
    base: APP_ROUTES.userRoles,
    label: 'Roles de usuario',
    detailLabel: 'Detalle de asignación de rol',
  },
  {
    base: APP_ROUTES.userApplications,
    label: 'Accesos por aplicación',
    detailLabel: 'Detalle de acceso',
  },
  {
    base: APP_ROUTES.applicationPermissions,
    label: 'Permisos por aplicación',
    detailLabel: 'Detalle de permiso',
  },
  {
    base: APP_ROUTES.applicationRolePermissions,
    label: 'Permisos de rol',
    detailLabel: 'Detalle de permiso heredado',
  },
  {
    base: APP_ROUTES.userApplicationPermissions,
    label: 'Permisos de usuario en app',
    detailLabel: 'Detalle de permiso asignado',
  },
  {
    base: APP_ROUTES.otps,
    label: 'OTPs',
    detailLabel: 'Detalle de OTP',
  },
] as const

function resolveTopbarMeta(pathname: string): {
  title: string
  breadcrumbs: BreadcrumbItem[]
} {
  if (pathname === APP_ROUTES.dashboard) {
    return {
      title: 'Inicio',
      breadcrumbs: [{ label: 'Inicio', current: true }],
    }
  }

  if (pathname === APP_ROUTES.profile) {
    return {
      title: 'Perfil',
      breadcrumbs: [
        { label: 'Inicio', href: APP_ROUTES.dashboard },
        { label: 'Perfil', current: true },
      ],
    }
  }

  if (pathname === APP_ROUTES.unauthorized) {
    return {
      title: 'Acceso restringido',
      breadcrumbs: [
        { label: 'Inicio', href: APP_ROUTES.dashboard },
        { label: 'Acceso restringido', current: true },
      ],
    }
  }

  for (const route of routeGroups) {
    if (pathname === route.base) {
      return {
        title: route.label,
        breadcrumbs: [
          { label: 'Inicio', href: APP_ROUTES.dashboard },
          { label: route.label, current: true },
        ],
      }
    }

    if (pathname.startsWith(`${route.base}/`)) {
      return {
        title: route.detailLabel,
        breadcrumbs: [
          { label: 'Inicio', href: APP_ROUTES.dashboard },
          { label: route.label, href: route.base },
          { label: route.detailLabel, current: true },
        ],
      }
    }
  }

  return {
    title: 'Workspace',
    breadcrumbs: [
      { label: 'Inicio', href: APP_ROUTES.dashboard },
      { label: 'Workspace', current: true },
    ],
  }
}

function AppBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const navigate = useNavigate()

  function handleNavigate(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    const link = target.closest('a[href]')

    if (!link) return
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const href = link.getAttribute('href')

    if (!href || href.startsWith('http')) {
      return
    }

    event.preventDefault()
    navigate(href)
  }

  return <Breadcrumb className="topbar__breadcrumb" items={items} onClick={handleNavigate} />
}

export function Topbar() {
  const location = useLocation()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { title, breadcrumbs } = resolveTopbarMeta(location.pathname)
  const displayName =
    [user?.name, user?.lastName].filter(Boolean).join(' ').trim() || 'Usuario autenticado'

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled() {
        navigate(APP_ROUTES.login, { replace: true })
      },
    })
  }

  return (
    <header className="topbar">
      <div className="topbar__main">
        <div className="topbar__heading">
          <h1 className="topbar__title">{title}</h1>
          <AppBreadcrumb items={breadcrumbs} />
        </div>

        <div className="topbar__actions">
          <Dropdown
            items={[
              {
                type: 'label',
                id: 'account-label',
                label: displayName,
              },
              {
                id: 'profile',
                label: 'Mi perfil',
                description: 'Consulta tu información y accesos.',
                icon: <UserRound size={16} />,
                onSelect: () => navigate(APP_ROUTES.profile),
              },
              {
                id: 'change-password',
                label: 'Cambiar contraseña',
                description: 'Abre el flujo seguro por correo.',
                icon: <KeyRound size={16} />,
                onSelect: () => navigate(APP_ROUTES.forgotPassword),
              },
              {
                type: 'separator',
                id: 'account-separator',
              },
              {
                id: 'logout',
                label: 'Cerrar sesión',
                description: 'Finaliza la sesión actual.',
                icon: <LogOut size={16} />,
                danger: true,
                disabled: logoutMutation.isPending,
                onSelect: handleLogout,
              },
            ]}
            trigger={
              <button
                className="topbar__account-trigger"
                disabled={logoutMutation.isPending}
                type="button"
              >
                <div className="topbar__identity">
                  <Avatar className="topbar__avatar" name={displayName} />
                  <div className="topbar__identity-copy">
                    <strong>{displayName}</strong>
                  </div>
                </div>
                <ChevronDown aria-hidden="true" className="topbar__account-caret" size={18} />
              </button>
            }
          />
        </div>
      </div>
    </header>
  )
}
