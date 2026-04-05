export function sanitizeQueryParams(params?: object) {
  if (!params) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }

      return value !== undefined && value !== null && value !== ''
    }),
  )
}
