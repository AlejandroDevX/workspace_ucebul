export interface PaginationFilters {
  page?: number
  perPage?: number
  search?: string
}

export type ValidationErrors = Record<string, string[]>

export interface ApiSuccessResponse<TData> {
  success: true
  message: string
  data: TData
  meta: unknown[]
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ValidationErrors
}
