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
      email: searchParams.get('email') ?? '',
      otp: searchParams.get('otp') ?? '',
      password: '',
      passwordConfirmation: '',
    },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    await resetPasswordMutation.mutateAsync(values)
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
          htmlFor="email"
          label="Correo"
          error={form.formState.errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="correo@ucebul.com"
            autoComplete="email"
            invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />
        </FormField>

        <FormField
          htmlFor="otp"
          label="OTP"
          error={form.formState.errors.otp?.message}
        >
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            invalid={Boolean(form.formState.errors.otp)}
            {...form.register('otp')}
          />
        </FormField>

        <FormField
          htmlFor="password"
          label="Nueva contraseña"
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            invalid={Boolean(form.formState.errors.password)}
            {...form.register('password')}
          />
        </FormField>

        <FormField
          htmlFor="passwordConfirmation"
          label="Confirmar contraseña"
          error={form.formState.errors.passwordConfirmation?.message}
        >
          <Input
            id="passwordConfirmation"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            invalid={Boolean(form.formState.errors.passwordConfirmation)}
            {...form.register('passwordConfirmation')}
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
