import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { Input } from '@/components/base/Input'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
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
      <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          htmlFor="workspace_user_email"
          label="Correo"
          error={form.formState.errors.workspace_user_email?.message}
        >
          <Input
            id="workspace_user_email"
            type="email"
            placeholder="correo@ucebul.com"
            autoComplete="email"
            invalid={Boolean(form.formState.errors.workspace_user_email)}
            {...form.register('workspace_user_email')}
          />
        </FormField>

        <FormField
          htmlFor="workspace_user_password"
          label="Contraseña"
          error={form.formState.errors.workspace_user_password?.message}
        >
          <Input
            id="workspace_user_password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            invalid={Boolean(form.formState.errors.workspace_user_password)}
            {...form.register('workspace_user_password')}
          />
        </FormField>

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
