import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
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
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
