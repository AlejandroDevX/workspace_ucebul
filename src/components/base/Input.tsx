import {
  Input as FoundationInput,
  type InputProps as FoundationInputProps,
} from 'foundation-ui'
import { forwardRef } from 'react'

type InputProps = FoundationInputProps

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref,
) {
  return <FoundationInput {...props} ref={ref} />
})
