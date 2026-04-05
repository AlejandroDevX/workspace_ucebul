import { zodResolver } from '@hookform/resolvers/zod'
import { RHFTextField } from 'foundation-ui'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/modules/auth/schemas/forgot-password.schema'
import { useForgotPasswordMutation } from '@/modules/auth/hooks/useAuthMutations'
import { APP_ROUTES } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      workspace_user_email: '',
    },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    const response = await forgotPasswordMutation.mutateAsync(values)
    navigate({
      pathname: APP_ROUTES.verifyOtp,
      search: createSearchParams({
        workspace_otp_email: values.workspace_user_email,
        workspace_otp_purpose: response.workspace_otp.workspace_otp_purpose,
      }).toString(),
    })
  }

  return (
    <Card
      className="auth-card"
      title="Recuperar contraseña"
      description="Solicita un OTP para restablecer el acceso a tu cuenta."
    >
      <form className="auth-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <RHFTextField
          autoComplete="email"
          control={form.control}
          hint="El backend enviará el OTP al correo asociado."
          label="Correo"
          name="workspace_user_email"
          placeholder="correo@ucebul.com"
          required
          type="email"
        />

        {forgotPasswordMutation.error ? (
          <ErrorState description={getErrorMessage(forgotPasswordMutation.error)} />
        ) : null}

        <Button
          type="submit"
          fullWidth
          isLoading={forgotPasswordMutation.isPending}
          leftIcon={<Mail size={16} />}
        >
          Enviar OTP
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
