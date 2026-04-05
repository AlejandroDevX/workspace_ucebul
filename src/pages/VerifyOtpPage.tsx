import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { Input } from '@/components/base/Input'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { useVerifyOtpMutation } from '@/modules/auth/hooks/useAuthMutations'
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from '@/modules/auth/schemas/verify-otp.schema'
import { APP_ROUTES } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const verifyOtpMutation = useVerifyOtpMutation()
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      otp: '',
    },
  })

  async function onSubmit(values: VerifyOtpFormValues) {
    await verifyOtpMutation.mutateAsync(values)
    navigate({
      pathname: APP_ROUTES.resetPassword,
      search: createSearchParams({
        email: values.email,
        otp: values.otp,
      }).toString(),
    })
  }

  return (
    <Card
      className="auth-card"
      title="Verificar OTP"
      description="Confirma el código recibido para continuar con el cambio de contraseña."
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
          label="Código OTP"
          error={form.formState.errors.otp?.message}
          hint="Usa el código exacto entregado por el backend."
        >
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            invalid={Boolean(form.formState.errors.otp)}
            {...form.register('otp')}
          />
        </FormField>

        {verifyOtpMutation.error ? (
          <ErrorState description={getErrorMessage(verifyOtpMutation.error)} />
        ) : null}

        <Button
          type="submit"
          fullWidth
          isLoading={verifyOtpMutation.isPending}
          leftIcon={<ShieldCheck size={16} />}
        >
          Verificar código
        </Button>

        <div className="auth-form__footer">
          <Link className="link-inline" to={APP_ROUTES.forgotPassword}>
            Solicitar un nuevo OTP
          </Link>
        </div>
      </form>
    </Card>
  )
}
