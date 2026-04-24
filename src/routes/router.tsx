import { Navigate, createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import {
  WorkspaceApplicationDetailPage,
  WorkspaceApplicationsPage,
} from '@/modules/workspace-applications/pages/WorkspaceApplicationsPages'
import {
  WorkspaceApplicationModuleDetailPage,
  WorkspaceApplicationModulesPage,
} from '@/modules/workspace-application-modules/pages/WorkspaceApplicationModulesPages'
import {
  WorkspaceApplicationRoleDetailPage,
  WorkspaceApplicationRolesPage,
} from '@/modules/workspace-application-roles/pages/WorkspaceApplicationRolesPages'
import {
  WorkspaceOtpDetailPage,
  WorkspaceOtpsPage,
} from '@/modules/workspace-otps/pages/WorkspaceOtpsPages'
import {
  WorkspaceApplicationPermissionDetailPage,
  WorkspaceApplicationPermissionsPage,
  WorkspaceUserApplicationPermissionDetailPage,
  WorkspaceUserApplicationPermissionsPage,
} from '@/modules/workspace-permissions/pages/WorkspacePermissionsPages'
import {
  WorkspaceApplicationRolePermissionDetailPage,
  WorkspaceApplicationRolePermissionsPage,
} from '@/modules/workspace-permissions/pages/WorkspaceApplicationRolePermissionsPages'
import {
  WorkspaceRoleDetailPage,
  WorkspaceRolesPage,
} from '@/modules/workspace-roles/pages/WorkspaceRolesPages'
import {
  WorkspaceUserApplicationDetailPage,
  WorkspaceUserApplicationsPage,
} from '@/modules/workspace-user-applications/pages/WorkspaceUserApplicationsPages'
import {
  WorkspaceUserRoleDetailPage,
  WorkspaceUserRolesPage,
} from '@/modules/workspace-user-roles/pages/WorkspaceUserRolesPages'
import {
  WorkspaceUserDetailPage,
  WorkspaceUsersPage,
} from '@/modules/workspace-users/pages/WorkspaceUsersPages'
import { DashboardPage } from '@/pages/DashboardPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import { VerifyOtpPage } from '@/pages/VerifyOtpPage'
import { ROUTE_SEGMENTS } from '@/routes/paths'
import { ProtectedRoute } from '@/routes/guards/ProtectedRoute'
import { PublicRoute } from '@/routes/guards/PublicRoute'
import { RoleRoute } from '@/routes/guards/RoleRoute'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTE_SEGMENTS.login,
            element: <LoginPage />,
          },
          {
            path: ROUTE_SEGMENTS.forgotPassword,
            element: <ForgotPasswordPage />,
          },
          {
            path: ROUTE_SEGMENTS.verifyOtp,
            element: <VerifyOtpPage />,
          },
          {
            path: ROUTE_SEGMENTS.resetPassword,
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTE_SEGMENTS.dashboard} replace />,
          },
          {
            path: ROUTE_SEGMENTS.dashboard,
            element: <DashboardPage />,
          },
          {
            path: ROUTE_SEGMENTS.profile,
            element: <ProfilePage />,
          },
          {
            path: ROUTE_SEGMENTS.unauthorized,
            element: <UnauthorizedPage />,
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={['admin', 'super_admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTE_SEGMENTS.users,
                element: <WorkspaceUsersPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.users}/:workspaceUserId`,
                element: <WorkspaceUserDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.userRoles,
                element: <WorkspaceUserRolesPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.userRoles}/:workspaceUserRoleId`,
                element: <WorkspaceUserRoleDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.applicationRoles,
                element: <WorkspaceApplicationRolesPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.applicationRoles}/:workspaceApplicationRoleId`,
                element: <WorkspaceApplicationRoleDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.userApplications,
                element: <WorkspaceUserApplicationsPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.userApplications}/:workspaceUserApplicationId`,
                element: <WorkspaceUserApplicationDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.applicationPermissions,
                element: <WorkspaceApplicationPermissionsPage />,
              },
              {
                path: ROUTE_SEGMENTS.applicationModules,
                element: <WorkspaceApplicationModulesPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.applicationModules}/:workspaceApplicationModuleId`,
                element: <WorkspaceApplicationModuleDetailPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.applicationPermissions}/:workspaceApplicationPermissionId`,
                element: <WorkspaceApplicationPermissionDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.applicationRolePermissions,
                element: <WorkspaceApplicationRolePermissionsPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.applicationRolePermissions}/:workspaceApplicationRolePermissionId`,
                element: <WorkspaceApplicationRolePermissionDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.userApplicationPermissions,
                element: <WorkspaceUserApplicationPermissionsPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.userApplicationPermissions}/:workspaceUserApplicationPermissionId`,
                element: <WorkspaceUserApplicationPermissionDetailPage />,
              },
            ],
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={['super_admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTE_SEGMENTS.roles,
                element: <WorkspaceRolesPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.roles}/:workspaceRoleId`,
                element: <WorkspaceRoleDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.applications,
                element: <WorkspaceApplicationsPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.applications}/:workspaceApplicationId`,
                element: <WorkspaceApplicationDetailPage />,
              },
              {
                path: ROUTE_SEGMENTS.otps,
                element: <WorkspaceOtpsPage />,
              },
              {
                path: `${ROUTE_SEGMENTS.otps}/:workspaceOtpId`,
                element: <WorkspaceOtpDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
