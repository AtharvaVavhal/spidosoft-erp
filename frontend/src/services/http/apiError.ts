import type { ApiErrorBody, FieldViolation } from '@/types/api'

/** Normalised error thrown by every service call (HTTP or mock). */
export class ApiError extends Error {
  readonly code: string
  readonly status: number | null
  readonly violations: FieldViolation[]
  readonly requestId: string | null

  constructor(
    code: string,
    message: string,
    options: { status?: number | null; violations?: FieldViolation[]; requestId?: string | null } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = options.status ?? null
    this.violations = options.violations ?? []
    this.requestId = options.requestId ?? null
  }

  static fromBody(body: ApiErrorBody, status: number | null): ApiError {
    return new ApiError(body.code, body.message, {
      status,
      violations: body.violations,
      requestId: body.requestId,
    })
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof Error) return new ApiError('CLIENT_ERROR', error.message)
  return new ApiError('CLIENT_ERROR', 'An unexpected error occurred.')
}
