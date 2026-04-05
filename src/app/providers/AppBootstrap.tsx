import { useEffect } from 'react'
import { router } from '@/routes/router'
import { APP_ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/store/auth.store'
import {
  subscribeForbidden,
  subscribeUnauthorized,
} from '@/utils/auth-events'

export function AppBootstrap() {
  const initializeSession = useAuthStore((state) => state.initializeSession)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    void initializeSession()
  }, [initializeSession])

  useEffect(() => subscribeUnauthorized(clearSession), [clearSession])

  useEffect(
    () =>
      subscribeForbidden(() => {
        void router.navigate(APP_ROUTES.unauthorized)
      }),
    [],
  )

  return null
}
