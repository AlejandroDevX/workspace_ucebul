import { httpClient } from '@/services/http-client'
import { ApiError } from '@/services/api-error'
import type {
  ForgotPasswordDto,
  AuthMeParams,
  AuthSession,
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
  AuthApplicationRoleAccess,
  AuthApplicationAccess,
  AuthPermissionAccess,
  AuthUser,
  WorkspaceRole,
} from '@/types/auth'
import type { ApiSuccessResponse } from '@/types/api'
import type { EntityId } from '@/types/common'
import type { GroupedPermissions } from '@/types/permissions'
import { isRecord } from '@/utils/is-record'
import { unwrapData } from '@/utils/api-response'
import { sanitizeQueryParams } from '@/utils/query-params'

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
        if (isRecord(role.workspace_role) && typeof role.workspace_role.workspace_role_slug === 'string') {
          return role.workspace_role.workspace_role_slug
        }

        if (typeof role.slug === 'string') {
          return role.slug
        }

        if (typeof role.workspace_role_slug === 'string') {
          return role.workspace_role_slug
        }

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
    .filter((role): role is WorkspaceRole => typeof role === 'string' && role.length > 0)
}

function normalizePermission(value: unknown): AuthPermissionAccess | null {
  if (!isRecord(value)) {
    return null
  }

  const source = isRecord(value.workspace_application_permission)
    ? value.workspace_application_permission
    : value

  const id =
    (source.workspace_application_permission_id as EntityId | undefined) ??
    (source.id as EntityId | undefined)
  const name =
    readString(source.workspace_application_permission_name) ||
    readString(source.name) ||
    undefined
  const slug =
    readString(source.workspace_application_permission_slug) ||
    readString(source.slug) ||
    undefined
  const description =
    readString(source.workspace_application_permission_description) ||
    readString(source.description) ||
    undefined

  if (!id && !name && !slug) {
    return null
  }

  return {
    id,
    name,
    slug,
    description,
  }
}

function normalizePermissions(value: unknown): AuthPermissionAccess[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((permission) => normalizePermission(permission))
    .filter((permission): permission is AuthPermissionAccess => permission !== null)
}

function normalizeApplicationRole(value: unknown): AuthApplicationRoleAccess | null {
  if (!isRecord(value)) {
    return null
  }

  const source = isRecord(value.workspace_application_role)
    ? value.workspace_application_role
    : value

  const id =
    (source.workspace_application_role_id as EntityId | undefined) ??
    (source.id as EntityId | undefined)
  const name =
    readString(source.workspace_application_role_name) ||
    readString(source.name) ||
    undefined
  const slug =
    readString(source.workspace_application_role_slug) ||
    readString(source.slug) ||
    undefined
  const description =
    readString(source.workspace_application_role_description) ||
    readString(source.description) ||
    undefined
  const isActive =
    typeof source.workspace_application_role_is_active === 'boolean'
      ? source.workspace_application_role_is_active
      : typeof source.is_active === 'boolean'
        ? source.is_active
        : undefined
  const permissions = normalizePermissions(
    source.application_permissions ?? source.workspace_application_permissions,
  )

  if (!id && !name && !slug) {
    return null
  }

  return {
    id,
    name,
    slug,
    description,
    isActive,
    permissions,
  }
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

      const accessId =
        (application.workspace_user_application_id as EntityId | undefined) ??
        (application.id as EntityId | undefined)
      const nestedApplication = isRecord(application.workspace_application)
        ? application.workspace_application
        : undefined
      const nestedRole = isRecord(application.workspace_application_role)
        ? application.workspace_application_role
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
      const description =
        readString(nestedApplication?.workspace_application_description) ||
        readString(application.description) ||
        undefined
      const logoUrl =
        readString(nestedApplication?.workspace_application_logo_url) ||
        readString(application.logo_url) ||
        undefined
      const url =
        readString(nestedApplication?.workspace_application_url) ||
        readString(application.url) ||
        undefined
      const isActive =
        typeof nestedApplication?.workspace_application_is_active === 'boolean'
          ? nestedApplication.workspace_application_is_active
          : typeof application.is_active === 'boolean'
            ? application.is_active
            : undefined
      const accessIsActive =
        typeof application.workspace_user_application_is_active === 'boolean'
          ? application.workspace_user_application_is_active
          : undefined
      const directPermissions = normalizePermissions(application.user_application_permissions)
      const effectivePermissions = normalizePermissions(
        application.workspace_user_application_effective_permissions,
      )
      const applicationRole = normalizeApplicationRole(nestedRole)
      const permissionsByModule = isRecord(application.permissions_by_module)
        ? (application.permissions_by_module as GroupedPermissions)
        : undefined

      return {
        accessId,
        id:
          (nestedApplication?.workspace_application_id as EntityId | undefined) ??
          (application.id as EntityId | undefined),
        name: name || undefined,
        slug,
        description,
        logoUrl,
        url,
        isActive,
        accessIsActive,
        applicationRole,
        directPermissions,
        effectivePermissions,
        permissionsByModule,
      }
    })
    .filter((application): application is AuthApplicationAccess => application !== null)
}

function normalizeWorkspaceUser(source: WorkspaceAuthUserResponse): AuthUser {
  return {
    id: source.workspace_user_id,
    workspace_user_id: source.workspace_user_id,
    name: source.workspace_user_name,
    workspace_user_name: source.workspace_user_name,
    lastName: source.workspace_user_last_name,
    workspace_user_last_name: source.workspace_user_last_name,
    email: source.workspace_user_email,
    workspace_user_email: source.workspace_user_email,
    roles: normalizeRoles(source.user_roles),
    applications: normalizeApplications(source.user_applications),
  }
}

function normalizeGroupedPermissions(value: unknown): GroupedPermissions {
  return isRecord(value) ? (value as GroupedPermissions) : {}
}

function normalizeAuthSession(payload: unknown): AuthSession | undefined {
  const candidate = unwrapData<unknown>(payload)

  if (!isRecord(candidate)) {
    return undefined
  }

  const user = normalizeAuthUser(candidate)

  if (!user) {
    return undefined
  }

  return {
    user,
    workspaceRoles: Array.isArray(candidate.user_roles)
      ? (candidate.user_roles as NonNullable<WorkspaceAuthUserResponse['user_roles']>)
      : [],
    userApplications: Array.isArray(candidate.user_applications)
      ? (candidate.user_applications as NonNullable<
          WorkspaceAuthUserResponse['user_applications']
        >)
      : [],
    currentApplication: isRecord(candidate.current_application)
      ? (candidate.current_application as unknown as AuthSession['currentApplication'])
      : null,
    currentApplicationAccess: isRecord(candidate.current_application_access)
      ? (candidate.current_application_access as unknown as AuthSession['currentApplicationAccess'])
      : null,
    currentApplicationPermissions: normalizeGroupedPermissions(
      candidate.current_application_permissions,
    ),
    workspaceModules: normalizeGroupedPermissions(candidate.workspace_modules),
    otps: Array.isArray(candidate.otps)
      ? (candidate.otps as AuthSession['otps'])
      : [],
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
    workspace_user_id: id,
    name: readString(source.name) || readString(source.workspace_user_name, email),
    workspace_user_name:
      readString(source.name) || readString(source.workspace_user_name, email),
    lastName: readString(source.last_name) || readString(source.workspace_user_last_name) || undefined,
    workspace_user_last_name:
      readString(source.last_name) || readString(source.workspace_user_last_name) || undefined,
    email,
    workspace_user_email: email,
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

export async function getAuthenticatedWorkspaceSession(params: AuthMeParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<WorkspaceAuthUserResponse>>(
    '/auth/me',
    {
      params: sanitizeQueryParams(params),
    },
  )
  const session = normalizeAuthSession(response.data)

  if (!session) {
    throw new ApiError('No fue posible resolver el usuario autenticado')
  }

  return session
}

export async function getAuthenticatedWorkspaceUser(params: AuthMeParams = {}) {
  const session = await getAuthenticatedWorkspaceSession(params)

  return session.user
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
  getSession: getAuthenticatedWorkspaceSession,
  validateToken: validateWorkspaceToken,
  forgotPassword: forgotWorkspacePassword,
  verifyOtp: verifyWorkspaceOtp,
  resetPassword: resetWorkspacePassword,
}
