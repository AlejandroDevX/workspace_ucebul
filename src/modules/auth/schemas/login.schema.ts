import { z } from 'zod'

export const loginSchema = z.object({
  workspace_user_email: z.email('Ingresa un correo válido'),
  workspace_user_password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  workspace_personal_access_token_name: z.string().trim().max(255).optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
