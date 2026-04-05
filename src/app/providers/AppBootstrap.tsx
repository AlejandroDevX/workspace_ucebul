import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { subscribeUnauthorized } from '@/utils/auth-events'

export function AppBootstrap() {
  const initializeSession = useAuthStore((state) => state.initializeSession)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    void initializeSession()
  }, [initializeSession])

  useEffect(() => subscribeUnauthorized(clearSession), [clearSession])

  return null
}
