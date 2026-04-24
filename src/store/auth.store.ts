import { create } from 'zustand'
import { authService } from '@/modules/auth/api/auth.service'
import type { AuthSession, LoginDto } from '@/modules/auth/types/auth.types'
import { authStorage } from '@/lib/storage'
import type {
  AuthUser,
  CurrentApplication,
  CurrentApplicationAccess,
} from '@/types/auth'
import type { WorkspaceAuthUserApplication, WorkspaceAuthUserRole } from '@/modules/auth/types/auth.types'
import type { GroupedPermissions } from '@/types/permissions'

const WORKSPACE_APPLICATION_SLUG = 'workspace'

type AuthStatus = 'guest' | 'loading' | 'authenticated'

interface AuthState {
  user: AuthUser | null
  workspaceRoles: WorkspaceAuthUserRole[]
  userApplications: WorkspaceAuthUserApplication[]
  currentApplication: CurrentApplication | null
  currentApplicationAccess: CurrentApplicationAccess | null
  currentApplicationPermissions: GroupedPermissions
  workspaceModules: GroupedPermissions
  token: string | null
  status: AuthStatus
  hasInitialized: boolean
  isBootstrapping: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  initializeSession: () => Promise<void>
  refreshSession: (params?: { application_slug?: string; application_id?: string | number }) => Promise<void>
  login: (payload: LoginDto) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

const initialToken = authStorage.getToken()
let bootstrapPromise: Promise<void> | null = null

function getSessionState(session: AuthSession) {
  return {
    user: session.user,
    workspaceRoles: session.workspaceRoles,
    userApplications: session.userApplications,
    currentApplication: session.currentApplication,
    currentApplicationAccess: session.currentApplicationAccess,
    currentApplicationPermissions: session.currentApplicationPermissions,
    workspaceModules: session.workspaceModules,
    status: 'authenticated' as const,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

const clearedSessionState = {
  user: null,
  workspaceRoles: [],
  userApplications: [],
  currentApplication: null,
  currentApplicationAccess: null,
  currentApplicationPermissions: {},
  workspaceModules: {},
  status: 'guest' as const,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  workspaceRoles: [],
  userApplications: [],
  currentApplication: null,
  currentApplicationAccess: null,
  currentApplicationPermissions: {},
  workspaceModules: {},
  token: initialToken,
  status: initialToken ? 'loading' : 'guest',
  hasInitialized: !initialToken,
  isBootstrapping: Boolean(initialToken),
  isAuthenticated: false,
  isLoading: Boolean(initialToken),
  error: null,
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
          ...clearedSessionState,
          token: null,
          hasInitialized: true,
          isBootstrapping: false,
        })
        bootstrapPromise = null
        return
      }

      set({
        token,
        status: 'loading',
        isLoading: true,
        error: null,
        isBootstrapping: true,
      })

      try {
        const validation = await authService.validateToken()

        if (!validation.is_valid) {
          throw new Error('Token inválido')
        }

        const session = await authService.getSession({
          application_slug: WORKSPACE_APPLICATION_SLUG,
        })

        set({
          ...getSessionState(session),
          token,
          hasInitialized: true,
          isBootstrapping: false,
        })
      } catch {
        authStorage.clearToken()
        set({
          ...clearedSessionState,
          token: null,
          hasInitialized: true,
          isBootstrapping: false,
        })
      } finally {
        bootstrapPromise = null
      }
    })()

    return bootstrapPromise
  },
  async refreshSession(params = { application_slug: WORKSPACE_APPLICATION_SLUG }) {
    const token = get().token ?? authStorage.getToken()

    if (!token) {
      set({
        ...clearedSessionState,
        token: null,
        hasInitialized: true,
        isBootstrapping: false,
      })
      return
    }

    set({ status: 'loading', isLoading: true, error: null })

    try {
      const session = await authService.getSession(params)
      set({
        ...getSessionState(session),
        token,
        hasInitialized: true,
        isBootstrapping: false,
      })
    } catch (error) {
      set({
        status: get().isAuthenticated ? 'authenticated' : 'guest',
        isLoading: false,
        error: error instanceof Error ? error.message : 'No fue posible actualizar la sesión',
      })
      throw error
    }
  },
  async login(payload) {
    set({ status: 'loading', isLoading: true, error: null })

    try {
      const { token } = await authService.login(payload)
      authStorage.setToken(token)

      const session = await authService.getSession({
        application_slug: WORKSPACE_APPLICATION_SLUG,
      })

      set({
        ...getSessionState(session),
        token,
        hasInitialized: true,
        isBootstrapping: false,
      })
    } catch (error) {
      authStorage.clearToken()
      set({
        ...clearedSessionState,
        token: null,
        hasInitialized: true,
        isBootstrapping: false,
        error: error instanceof Error ? error.message : 'No fue posible iniciar sesión',
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
        ...clearedSessionState,
        token: null,
        hasInitialized: true,
        isBootstrapping: false,
      })
    }
  },
  clearSession() {
    authStorage.clearToken()
    set({
      ...clearedSessionState,
      token: null,
      hasInitialized: true,
      isBootstrapping: false,
    })
  },
}))
