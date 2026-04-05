import { LogOut, ShieldCheck } from 'lucide-react'
import { Topbar as FoundationTopbar } from 'foundation-ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { useLogoutMutation } from '@/modules/auth/hooks/useAuthMutations'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

function resolvePageTitle(pathname: string) {
  if (pathname.startsWith(APP_ROUTES.users)) return 'Usuarios'
  if (pathname.startsWith(APP_ROUTES.roles)) return 'Roles'
  if (pathname.startsWith(APP_ROUTES.applications)) return 'Aplicaciones'
  if (pathname.startsWith(APP_ROUTES.userRoles)) return 'Roles de usuario'
  if (pathname.startsWith(APP_ROUTES.userApplications)) return 'Accesos por aplicación'
  if (pathname.startsWith(APP_ROUTES.applicationPermissions)) return 'Permisos por aplicación'
  if (pathname.startsWith(APP_ROUTES.userApplicationPermissions)) return 'Permisos de usuario en app'
  if (pathname.startsWith(APP_ROUTES.otps)) return 'OTPs'
  if (pathname === APP_ROUTES.profile) return 'Perfil'
  if (pathname === APP_ROUTES.unauthorized) return 'Acceso restringido'
  if (pathname === APP_ROUTES.dashboard) return 'Dashboard'
  return 'Workspace'
}

function resolvePageEyebrow(pathname: string) {
  if (
    pathname.startsWith(APP_ROUTES.roles) ||
    pathname.startsWith(APP_ROUTES.applications) ||
    pathname.startsWith(APP_ROUTES.otps)
  ) {
    return 'Super admin workspace panel'
  }

  if (
    pathname.startsWith(APP_ROUTES.users) ||
    pathname.startsWith(APP_ROUTES.userRoles) ||
    pathname.startsWith(APP_ROUTES.userApplications) ||
    pathname.startsWith(APP_ROUTES.applicationPermissions) ||
    pathname.startsWith(APP_ROUTES.userApplicationPermissions)
  ) {
    return 'Admin workspace panel'
  }

  return 'Workspace control panel'
}

export function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogoutMutation()
  const user = useAuthStore((state) => state.user)

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled() {
        navigate(APP_ROUTES.login, { replace: true })
      },
    })
  }

  return (
    <FoundationTopbar
      leading={<ShieldCheck size={18} />}
      subtitle={resolvePageEyebrow(location.pathname)}
      title={resolvePageTitle(location.pathname)}
      trailing={
        <div className="topbar__actions">
          <div className="topbar__identity">
            <span className="topbar__identity-icon">
              <ShieldCheck size={16} />
            </span>
            <div>
              <strong>{user?.name ?? 'Usuario autenticado'}</strong>
              <span>{user?.email ?? 'Sin correo disponible'}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            isLoading={logoutMutation.isPending}
            leftIcon={<LogOut size={16} />}
          >
            Salir
          </Button>
        </div>
      }
    />
  )
}
