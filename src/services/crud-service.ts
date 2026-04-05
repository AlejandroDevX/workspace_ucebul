import { httpClient } from '@/services/http-client'
import { unwrapCollection, unwrapData } from '@/utils/api-response'
import { sanitizeQueryParams } from '@/utils/query-params'

export interface CrudFilters {
  page?: number
  perPage?: number
  search?: string
}

export function createCrudService<TItem, TCreate, TUpdate, TFilters extends object | undefined = CrudFilters>(
  resourcePath: string,
) {
  return {
    async list(filters?: TFilters) {
      const response = await httpClient.get(resourcePath, {
        params: sanitizeQueryParams(filters),
      })

      return unwrapCollection<TItem>(response.data)
    },
    async getById(id: number | string) {
      const response = await httpClient.get(`${resourcePath}/${id}`)

      return unwrapData<TItem>(response.data)
    },
    async create(payload: TCreate) {
      const response = await httpClient.post(resourcePath, payload)

      return unwrapData<TItem>(response.data)
    },
    async update(id: number | string, payload: TUpdate) {
      const response = await httpClient.put(`${resourcePath}/${id}`, payload)

      return unwrapData<TItem>(response.data)
    },
    async remove(id: number | string) {
      await httpClient.delete(`${resourcePath}/${id}`)
    },
  }
}
