import { httpClient } from '@/services/http-client'
import { ApiError } from '@/services/api-error'
import type {
  ForgotPasswordDto,
  LoginDto,
  LoginResult,
  ResetPasswordDto,
  VerifyOtpDto,
  WorkspaceAuthUserResponse,
  WorkspaceLoginRequest,
  WorkspaceLoginResponse,
} from '@/modules/auth/types/auth.types'
import type {
  AuthApplicationAccess,
  AuthUser,
  WorkspaceRole,
} from '@/types/auth'
import type { EntityId } from '@/types/common'
import { isRecord } from '@/utils/is-record'
import { unwrapData } from '@/utils/api-response'

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeRoles(value: unknown): WorkspaceRole[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((role) => {
      if (typeof role === 'string') {
        return role
      }

      if (isRecord(role)) {
        if (typeof role.name === 'string') {
          return role.name
        }

        if (typeof role.role_name === 'string') {
          return role.role_name
        }

        if (typeof role.workspace_role_name === 'string') {
          return role.workspace_role_name
        }
      }

      return null
    })
    .filter((role): role is WorkspaceRole => role === 'user' || role === 'admin' || role === 'super_admin')
}

function normalizeApplications(value: unknown): AuthApplicationAccess[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((application): AuthApplicationAccess | null => {
      if (!isRecord(application)) {
        return null
      }

      const id = application.id as EntityId | undefined
      const name =
        readString(application.name) ||
        readString(application.application_name) ||
        readString(application.workspace_application_name)
      const slug = readString(application.slug) || undefined

      return {
        id,
        name: name || undefined,
        slug,
      }
    })
    .filter((application): application is AuthApplicationAccess => application !== null)
}

function normalizeWorkspaceUser(source: WorkspaceAuthUserResponse): AuthUser {
  return {
    id: source.workspace_user_id,
    name: source.workspace_user_name,
    lastName: source.workspace_user_last_name,
    email: source.workspace_user_email,
    roles: normalizeRoles(source.user_roles),
    applications: normalizeApplications(source.user_applications),
  }
}

function normalizeAuthUser(payload: unknown): AuthUser | undefined {
  const candidate = unwrapData<unknown>(payload)

  if (isRecord(candidate) && isRecord(candidate.workspace_user)) {
    return normalizeWorkspaceUser(
      candidate.workspace_user as unknown as WorkspaceAuthUserResponse,
    )
  }

  if (
    isRecord(candidate) &&
    isRecord(candidate.data) &&
    isRecord(candidate.data.workspace_user)
  ) {
    return normalizeWorkspaceUser(
      candidate.data.workspace_user as unknown as WorkspaceAuthUserResponse,
    )
  }

  const source = isRecord(candidate) && isRecord(candidate.user) ? candidate.user : candidate

  if (!isRecord(source)) {
    return undefined
  }

  const id =
    (source.id as EntityId | undefined) ??
    (source.workspace_user_id as EntityId | undefined)
  const email =
    readString(source.email) ||
    readString(source.workspace_user_email)

  if (id === undefined || !email) {
    return undefined
  }

  const roleSource =
    source.roles ??
    source.user_roles ??
    source.role_names ??
    (typeof source.role === 'string' ? [source.role] : [])

  return {
    id,
    name: readString(source.name) || readString(source.workspace_user_name, email),
    lastName: readString(source.last_name) || readString(source.workspace_user_last_name) || undefined,
    email,
    roles: normalizeRoles(roleSource),
    applications: normalizeApplications(
      source.applications ?? source.user_applications,
    ),
  }
}

function extractToken(payload: unknown) {
  const sources = [payload, unwrapData<unknown>(payload)]

  for (const source of sources) {
    if (!isRecord(source)) {
      continue
    }

    const token =
      source.token ??
      source.access_token ??
      source.accessToken ??
      source.workspace_access_token

    if (typeof token === 'string') {
      return token
    }

    if (isRecord(source.data)) {
      const nestedToken =
        source.data.token ??
        source.data.access_token ??
        source.data.accessToken ??
        source.data.workspace_access_token

      if (typeof nestedToken === 'string') {
        return nestedToken
      }
    }
  }

  throw new ApiError('El backend no devolvió un token de acceso válido')
}

function extractTokenType(payload: unknown) {
  const sources = [payload, unwrapData<unknown>(payload)]

  for (const source of sources) {
    if (!isRecord(source)) {
      continue
    }

    const tokenType =
      source.token_type ??
      source.access_token_type ??
      source.workspace_access_token_type

    if (typeof tokenType === 'string') {
      return tokenType
    }

    if (isRecord(source.data)) {
      const nestedTokenType =
        source.data.token_type ??
        source.data.access_token_type ??
        source.data.workspace_access_token_type

      if (typeof nestedTokenType === 'string') {
        return nestedTokenType
      }
    }
  }

  return undefined
}

function mapLoginPayload(payload: LoginDto): WorkspaceLoginRequest {
  return {
    workspace_user_email: payload.email,
    workspace_user_password: payload.password,
    ...(payload.personalAccessTokenName
      ? {
          workspace_personal_access_token_name: payload.personalAccessTokenName,
        }
      : {}),
  }
}

export const authService = {
  async login(payload: LoginDto): Promise<LoginResult> {
    const response = await httpClient.post<WorkspaceLoginResponse>(
      '/auth/login',
      mapLoginPayload(payload),
    )

    return {
      token: extractToken(response.data),
      tokenType: extractTokenType(response.data),
      user: normalizeAuthUser(response.data),
    }
  },
  async logout() {
    await httpClient.post('/auth/logout')
  },
  async getMe() {
    const response = await httpClient.get('/auth/me')
    const user = normalizeAuthUser(response.data)

    if (!user) {
      throw new ApiError('No fue posible resolver el usuario autenticado')
    }

    return user
  },
  async validateToken() {
    await httpClient.get('/auth/validate-token')
    return true
  },
  async forgotPassword(payload: ForgotPasswordDto) {
    await httpClient.post('/auth/forgot-password', payload)
  },
  async verifyOtp(payload: VerifyOtpDto) {
    await httpClient.post('/auth/verify-otp', payload)
  },
  async resetPassword(payload: ResetPasswordDto) {
    await httpClient.post('/auth/reset-password', {
      email: payload.email,
      otp: payload.otp,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
    })
  },
}
