import { httpClient } from '@/services/http-client'
import { ApiError } from '@/services/api-error'
import type {
  ForgotPasswordDto,
  LoginDto,
  LoginResult,
  ResetPasswordDto,
  VerifyOtpDto,
  WorkspaceAuthUserResponse,
  WorkspaceForgotPasswordResponseData,
  WorkspaceLoginRequest,
  WorkspaceLoginResponse,
  WorkspaceResetPasswordResponseData,
  WorkspaceValidateTokenData,
  WorkspaceVerifyOtpResponseData,
} from '@/modules/auth/types/auth.types'
import type {
  AuthApplicationAccess,
  AuthUser,
  WorkspaceRole,
} from '@/types/auth'
import type { ApiSuccessResponse } from '@/types/api'
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

        if (isRecord(role.workspace_role) && typeof role.workspace_role.workspace_role_name === 'string') {
          return role.workspace_role.workspace_role_name
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
      const nestedApplication = isRecord(application.workspace_application)
        ? application.workspace_application
        : undefined
      const name =
        readString(application.name) ||
        readString(nestedApplication?.workspace_application_name) ||
        readString(application.application_name) ||
        readString(application.workspace_application_name)
      const slug =
        readString(application.slug) ||
        readString(nestedApplication?.workspace_application_slug) ||
        undefined

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
    workspace_user_email: payload.workspace_user_email,
    workspace_user_password: payload.workspace_user_password,
    ...(payload.workspace_personal_access_token_name
      ? {
          workspace_personal_access_token_name: payload.workspace_personal_access_token_name,
        }
      : {}),
  }
}

export async function loginWorkspaceUser(payload: LoginDto): Promise<LoginResult> {
  const response = await httpClient.post<WorkspaceLoginResponse>(
    '/auth/login',
    mapLoginPayload(payload),
  )

  return {
    token: extractToken(response.data),
    tokenType: extractTokenType(response.data),
    user: normalizeAuthUser(response.data),
  }
}

export async function logoutWorkspaceUser() {
  await httpClient.post<ApiSuccessResponse<null>>('/auth/logout')
}

export async function getAuthenticatedWorkspaceUser() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceAuthUserResponse>>(
    '/auth/me',
  )
  const user = normalizeAuthUser(response.data)

  if (!user) {
    throw new ApiError('No fue posible resolver el usuario autenticado')
  }

  return user
}

export async function validateWorkspaceToken() {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceValidateTokenData>>(
    '/auth/validate-token',
  )

  return unwrapData<WorkspaceValidateTokenData>(response.data)
}

export async function forgotWorkspacePassword(payload: ForgotPasswordDto) {
  const response = await httpClient.post<
    ApiSuccessResponse<WorkspaceForgotPasswordResponseData>
  >('/auth/forgot-password', payload)

  return unwrapData<WorkspaceForgotPasswordResponseData>(response.data)
}

export async function verifyWorkspaceOtp(payload: VerifyOtpDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceVerifyOtpResponseData>>(
    '/auth/verify-otp',
    payload,
  )

  return unwrapData<WorkspaceVerifyOtpResponseData>(response.data)
}

export async function resetWorkspacePassword(payload: ResetPasswordDto) {
  const response = await httpClient.post<ApiSuccessResponse<WorkspaceResetPasswordResponseData>>(
    '/auth/reset-password',
    {
      ...payload,
      workspace_otp_purpose: payload.workspace_otp_purpose ?? 'password_reset',
    },
  )

  return unwrapData<WorkspaceResetPasswordResponseData>(response.data)
}

export const authService = {
  login: loginWorkspaceUser,
  logout: logoutWorkspaceUser,
  getMe: getAuthenticatedWorkspaceUser,
  validateToken: validateWorkspaceToken,
  forgotPassword: forgotWorkspacePassword,
  verifyOtp: verifyWorkspaceOtp,
  resetPassword: resetWorkspacePassword,
}
