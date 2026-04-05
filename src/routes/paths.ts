export const ROUTE_SEGMENTS = {
  login: 'login',
  forgotPassword: 'forgot-password',
  verifyOtp: 'verify-otp',
  resetPassword: 'reset-password',
  dashboard: 'dashboard',
  profile: 'profile',
  users: 'users',
  roles: 'roles',
  applications: 'applications',
  userRoles: 'user-roles',
  userApplications: 'user-applications',
  applicationPermissions: 'application-permissions',
  userApplicationPermissions: 'user-application-permissions',
  otps: 'otps',
  unauthorized: 'unauthorized',
} as const

export const APP_ROUTES = {
  root: '/',
  dashboard: `/${ROUTE_SEGMENTS.dashboard}`,
  login: `/${ROUTE_SEGMENTS.login}`,
  forgotPassword: `/${ROUTE_SEGMENTS.forgotPassword}`,
  verifyOtp: `/${ROUTE_SEGMENTS.verifyOtp}`,
  resetPassword: `/${ROUTE_SEGMENTS.resetPassword}`,
  profile: `/${ROUTE_SEGMENTS.profile}`,
  unauthorized: `/${ROUTE_SEGMENTS.unauthorized}`,
  users: `/${ROUTE_SEGMENTS.users}`,
  roles: `/${ROUTE_SEGMENTS.roles}`,
  applications: `/${ROUTE_SEGMENTS.applications}`,
  userRoles: `/${ROUTE_SEGMENTS.userRoles}`,
  userApplications: `/${ROUTE_SEGMENTS.userApplications}`,
  applicationPermissions: `/${ROUTE_SEGMENTS.applicationPermissions}`,
  userApplicationPermissions: `/${ROUTE_SEGMENTS.userApplicationPermissions}`,
  otps: `/${ROUTE_SEGMENTS.otps}`,
} as const

export const detailRoutes = {
  user: (workspaceUserId: string | number) => `${APP_ROUTES.users}/${workspaceUserId}`,
  role: (workspaceRoleId: string | number) => `${APP_ROUTES.roles}/${workspaceRoleId}`,
  application: (workspaceApplicationId: string | number) =>
    `${APP_ROUTES.applications}/${workspaceApplicationId}`,
  userRole: (workspaceUserRoleId: string | number) =>
    `${APP_ROUTES.userRoles}/${workspaceUserRoleId}`,
  userApplication: (workspaceUserApplicationId: string | number) =>
    `${APP_ROUTES.userApplications}/${workspaceUserApplicationId}`,
  applicationPermission: (workspaceApplicationPermissionId: string | number) =>
    `${APP_ROUTES.applicationPermissions}/${workspaceApplicationPermissionId}`,
  userApplicationPermission: (
    workspaceUserApplicationPermissionId: string | number,
  ) =>
    `${APP_ROUTES.userApplicationPermissions}/${workspaceUserApplicationPermissionId}`,
  otp: (workspaceOtpId: string | number) => `${APP_ROUTES.otps}/${workspaceOtpId}`,
}
