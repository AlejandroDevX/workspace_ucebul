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
      email: '',
      password: '',
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
          htmlFor="password"
          label="Contraseña"
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            invalid={Boolean(form.formState.errors.password)}
            {...form.register('password')}
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
