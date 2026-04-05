import { create } from 'zustand'
import { authService } from '@/modules/auth/api/auth.service'
import type { LoginDto } from '@/modules/auth/types/auth.types'
import { authStorage } from '@/lib/storage'
import type { AuthUser } from '@/types/auth'

type AuthStatus = 'guest' | 'loading' | 'authenticated'

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  hasInitialized: boolean
  isBootstrapping: boolean
  initializeSession: () => Promise<void>
  login: (payload: LoginDto) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

const initialToken = authStorage.getToken()
let bootstrapPromise: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: initialToken,
  status: initialToken ? 'loading' : 'guest',
  hasInitialized: !initialToken,
  isBootstrapping: Boolean(initialToken),
  async initializeSession() {
    if (get().hasInitialized) {
      return
    }

    if (bootstrapPromise) {
      return bootstrapPromise
    }

    bootstrapPromise = (async () => {
      const token = get().token ?? authStorage.getToken()

      if (!token) {
        set({
          user: null,
          token: null,
          status: 'guest',
          hasInitialized: true,
          isBootstrapping: false,
        })
        bootstrapPromise = null
        return
      }

      set({
        token,
        status: 'loading',
        isBootstrapping: true,
      })

      try {
        await authService.validateToken()
        const user = await authService.getMe()

        set({
          user,
          token,
          status: 'authenticated',
          hasInitialized: true,
          isBootstrapping: false,
        })
      } catch {
        authStorage.clearToken()
        set({
          user: null,
          token: null,
          status: 'guest',
          hasInitialized: true,
          isBootstrapping: false,
        })
      } finally {
        bootstrapPromise = null
      }
    })()

    return bootstrapPromise
  },
  async login(payload) {
    set({ status: 'loading' })

    try {
      const { token, user } = await authService.login(payload)
      authStorage.setToken(token)

      const resolvedUser = user ?? (await authService.getMe())

      set({
        user: resolvedUser,
        token,
        status: 'authenticated',
        hasInitialized: true,
        isBootstrapping: false,
      })
    } catch (error) {
      authStorage.clearToken()
      set({
        user: null,
        token: null,
        status: 'guest',
        hasInitialized: true,
        isBootstrapping: false,
      })
      throw error
    }
  },
  async logout() {
    try {
      await authService.logout()
    } finally {
      authStorage.clearToken()
      set({
        user: null,
        token: null,
        status: 'guest',
        hasInitialized: true,
        isBootstrapping: false,
      })
    }
  },
  clearSession() {
    authStorage.clearToken()
    set({
      user: null,
      token: null,
      status: 'guest',
      hasInitialized: true,
      isBootstrapping: false,
    })
  },
}))
