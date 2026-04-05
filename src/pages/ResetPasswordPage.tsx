import { zodResolver } from '@hookform/resolvers/zod'
import { RHFTextField } from 'foundation-ui'
import { KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useResetPasswordMutation } from '@/modules/auth/hooks/useAuthMutations'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/modules/auth/schemas/reset-password.schema'
import { APP_ROUTES } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPasswordMutation = useResetPasswordMutation()
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      workspace_otp_email: searchParams.get('workspace_otp_email') ?? '',
      workspace_otp_code: searchParams.get('workspace_otp_code') ?? '',
      workspace_user_password: '',
      workspace_user_password_confirmation: '',
      workspace_otp_purpose: searchParams.get('workspace_otp_purpose') ?? 'password_reset',
    },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    const {
      workspace_user_password_confirmation: _workspaceUserPasswordConfirmation,
      ...payload
    } = values

    await resetPasswordMutation.mutateAsync(payload)
    navigate(APP_ROUTES.login, { replace: true })
  }

  return (
    <Card
      className="auth-card"
      title="Crear nueva contraseña"
      description="Define una nueva credencial para restablecer el acceso al Workspace."
    >
      <form className="auth-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <RHFTextField
          autoComplete="email"
          control={form.control}
          label="Correo"
          name="workspace_otp_email"
          placeholder="correo@ucebul.com"
          required
          type="email"
        />

        <RHFTextField
          control={form.control}
          label="OTP"
          name="workspace_otp_code"
          placeholder="123456"
          required
        />

        <RHFTextField
          autoComplete="new-password"
          control={form.control}
          label="Nueva contraseña"
          name="workspace_user_password"
          placeholder="••••••••"
          required
          type="password"
        />

        <RHFTextField
          autoComplete="new-password"
          control={form.control}
          label="Confirmar contraseña"
          name="workspace_user_password_confirmation"
          placeholder="••••••••"
          required
          type="password"
        />

        {resetPasswordMutation.error ? (
          <ErrorState description={getErrorMessage(resetPasswordMutation.error)} />
        ) : null}

        <Button
          type="submit"
          fullWidth
          isLoading={resetPasswordMutation.isPending}
          leftIcon={<KeyRound size={16} />}
        >
          Restablecer contraseña
        </Button>

        <div className="auth-form__footer">
          <Link className="link-inline" to={APP_ROUTES.login}>
            Volver al login
          </Link>
        </div>
      </form>
    </Card>
  )
}
