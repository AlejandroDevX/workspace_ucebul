const FALLBACK_API_BASE_URL = 'http://localhost:8000/api'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export const env = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? FALLBACK_API_BASE_URL),
}
