import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { Input } from '@/components/base/Input'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
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
      <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          htmlFor="workspace_otp_email"
          label="Correo"
          error={form.formState.errors.workspace_otp_email?.message}
        >
          <Input
            id="workspace_otp_email"
            type="email"
            placeholder="correo@ucebul.com"
            autoComplete="email"
            invalid={Boolean(form.formState.errors.workspace_otp_email)}
            {...form.register('workspace_otp_email')}
          />
        </FormField>

        <FormField
          htmlFor="workspace_otp_code"
          label="OTP"
          error={form.formState.errors.workspace_otp_code?.message}
        >
          <Input
            id="workspace_otp_code"
            type="text"
            placeholder="123456"
            invalid={Boolean(form.formState.errors.workspace_otp_code)}
            {...form.register('workspace_otp_code')}
          />
        </FormField>

        <FormField
          htmlFor="workspace_user_password"
          label="Nueva contraseña"
          error={form.formState.errors.workspace_user_password?.message}
        >
          <Input
            id="workspace_user_password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            invalid={Boolean(form.formState.errors.workspace_user_password)}
            {...form.register('workspace_user_password')}
          />
        </FormField>

        <FormField
          htmlFor="workspace_user_password_confirmation"
          label="Confirmar contraseña"
          error={form.formState.errors.workspace_user_password_confirmation?.message}
        >
          <Input
            id="workspace_user_password_confirmation"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            invalid={Boolean(form.formState.errors.workspace_user_password_confirmation)}
            {...form.register('workspace_user_password_confirmation')}
          />
        </FormField>

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
