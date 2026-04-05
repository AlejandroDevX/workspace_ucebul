import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    workspace_otp_email: z.email('Ingresa un correo válido'),
    workspace_otp_code: z
      .string()
      .trim()
      .length(6, 'El OTP debe tener 6 dígitos'),
    workspace_user_password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    workspace_user_password_confirmation: z
      .string()
      .min(8, 'Confirma la nueva contraseña'),
    workspace_otp_purpose: z.string().trim().max(50).optional(),
  })
  .refine(
    (values) =>
      values.workspace_user_password ===
      values.workspace_user_password_confirmation,
    {
    message: 'Las contraseñas no coinciden',
      path: ['workspace_user_password_confirmation'],
    },
  )

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
