import { isRecord } from '@/utils/is-record'

export function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T
  }

  return payload as T
}

export function unwrapCollection<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload)

  if (Array.isArray(data)) {
    return data as T[]
  }

  if (isRecord(data) && Array.isArray(data.data)) {
    return data.data as T[]
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as T[]
  }

  return []
}
