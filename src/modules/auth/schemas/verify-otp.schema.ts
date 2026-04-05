import { z } from 'zod'

export const verifyOtpSchema = z.object({
  email: z.email('Ingresa un correo válido'),
  otp: z
    .string()
    .trim()
    .min(4, 'El OTP es requerido')
    .max(8, 'El OTP no puede superar 8 caracteres'),
})

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>
