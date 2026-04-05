import { LogOut, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { useLogoutMutation } from '@/modules/auth/hooks/useAuthMutations'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

function resolvePageTitle(pathname: string) {
  switch (pathname) {
    case APP_ROUTES.profile:
      return 'Perfil'
    case APP_ROUTES.unauthorized:
      return 'Acceso restringido'
    default:
      return 'Dashboard'
  }
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
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Workspace control panel</p>
        <h2 className="topbar__title">{resolvePageTitle(location.pathname)}</h2>
      </div>

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
    </header>
  )
}
