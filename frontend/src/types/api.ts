/** Mirrors backend com.spidosoft.erp.response.* (ApiResponse envelope). */

export interface FieldViolation {
  field: string
  message: string
}

export interface ApiErrorBody {
  code: string
  message: string
  violations: FieldViolation[]
  path: string
  requestId: string | null
}

export interface ApiEnvelope<T> {
  success: boolean
  data: T | null
  error: ApiErrorBody | null
  timestamp: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PageQuery {
  /** Zero-based page index. */
  page: number
  size: number
}

export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 50
