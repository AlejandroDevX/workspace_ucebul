import {
  Button as FoundationButton,
  type ButtonProps as FoundationButtonProps,
} from 'foundation-ui'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps
  extends Omit<
    FoundationButtonProps,
    'leadingIcon' | 'loading' | 'trailingIcon' | 'variant'
  > {
  variant?: ButtonVariant
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <FoundationButton
      {...props}
      fullWidth={fullWidth}
      leadingIcon={leftIcon}
      loading={isLoading}
      trailingIcon={rightIcon}
      type={type}
      variant={variant}
    >
      {children}
    </FoundationButton>
  )
}
