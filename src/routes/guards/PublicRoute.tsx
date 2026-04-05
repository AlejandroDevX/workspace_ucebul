import { Navigate, Outlet } from 'react-router-dom'
import { LoadingState } from '@/components/feedback/LoadingState'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

export function PublicRoute() {
  const status = useAuthStore((state) => state.status)
  const token = useAuthStore((state) => state.token)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)

  if (isBootstrapping && token) {
    return <LoadingState fullScreen message="Validando sesión activa..." />
  }

  if (status === 'authenticated' && token) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}
