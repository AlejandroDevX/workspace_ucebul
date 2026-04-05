import { useMutation } from '@tanstack/react-query'
import { authService } from '@/modules/auth/api/auth.service'
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '@/modules/auth/types/auth.types'
import { useAuthStore } from '@/store/auth.store'

export function useLoginMutation() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: login,
  })
}

export function useLogoutMutation() {
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: logout,
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordDto) => authService.forgotPassword(payload),
  })
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpDto) => authService.verifyOtp(payload),
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordDto) => authService.resetPassword(payload),
  })
}
