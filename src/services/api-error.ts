import { isAxiosError } from 'axios'

export class ApiError extends Error {
  readonly status?: number
  readonly details?: unknown

  constructor(
    message: string,
    status?: number,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function normalizeApiError(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const details = error.response?.data
    const message =
      (typeof details === 'object' &&
      details !== null &&
      'message' in details &&
      typeof details.message === 'string'
        ? details.message
        : undefined) ??
      error.message ??
      'Request failed'

    return new ApiError(message, status, details)
  }

  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Unexpected application error')
}
