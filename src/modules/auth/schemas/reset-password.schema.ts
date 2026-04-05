import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    email: z.email('Ingresa un correo válido'),
    otp: z
      .string()
      .trim()
      .min(4, 'El OTP es requerido')
      .max(8, 'El OTP no puede superar 8 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    passwordConfirmation: z
      .string()
      .min(8, 'Confirma la nueva contraseña'),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
