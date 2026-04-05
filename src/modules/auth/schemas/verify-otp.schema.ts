import { z } from 'zod'

export const verifyOtpSchema = z.object({
  workspace_otp_email: z.email('Ingresa un correo válido'),
  workspace_otp_code: z
    .string()
    .trim()
    .length(6, 'El OTP debe tener 6 dígitos'),
  workspace_otp_purpose: z
    .string()
    .trim()
    .min(1)
    .max(50),
})

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>
