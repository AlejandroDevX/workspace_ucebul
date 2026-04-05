import { Navigate, Outlet } from 'react-router-dom'
import { LoadingState } from '@/components/feedback/LoadingState'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status)
  const token = useAuthStore((state) => state.token)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)

  if (isBootstrapping) {
    return <LoadingState fullScreen message="Recuperando sesión..." />
  }

  if (!token || status !== 'authenticated') {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return <Outlet />
}
