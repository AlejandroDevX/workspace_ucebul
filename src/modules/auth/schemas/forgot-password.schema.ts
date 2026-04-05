import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  workspace_user_email: z.email('Ingresa un correo válido'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
