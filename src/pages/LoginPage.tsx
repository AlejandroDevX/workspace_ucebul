import { zodResolver } from '@hookform/resolvers/zod'
import { RHFTextField } from 'foundation-ui'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import {
  loginSchema,
  type LoginFormValues,
} from '@/modules/auth/schemas/login.schema'
import { useLoginMutation } from '@/modules/auth/hooks/useAuthMutations'
import { APP_ROUTES } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

export function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      workspace_user_email: '',
      workspace_user_password: '',
      workspace_personal_access_token_name: 'workspace_access_token',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    await loginMutation.mutateAsync(values)
    navigate(APP_ROUTES.dashboard, { replace: true })
  }

  return (
    <Card
      className="auth-card"
      title="Iniciar sesión"
      description="Accede al panel principal del Workspace con tu cuenta global."
    >
      <form className="auth-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <RHFTextField
          autoComplete="email"
          control={form.control}
          label="Correo"
          name="workspace_user_email"
          placeholder="correo@ucebul.com"
          required
        />

        <RHFTextField
          autoComplete="current-password"
          control={form.control}
          label="Contraseña"
          name="workspace_user_password"
          placeholder="••••••••"
          required
          type="password"
        />

        {loginMutation.error ? (
          <ErrorState description={getErrorMessage(loginMutation.error)} />
        ) : null}

        <Button
          type="submit"
          fullWidth
          isLoading={loginMutation.isPending}
          leftIcon={<LogIn size={16} />}
        >
          Entrar al workspace
        </Button>

        <div className="auth-form__footer">
          <Link className="link-inline" to={APP_ROUTES.forgotPassword}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </Card>
  )
}
