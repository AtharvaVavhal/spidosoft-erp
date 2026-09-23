import axios, { AxiosError } from 'axios'
import type { ApiEnvelope } from '@/types/api'
import { ApiError } from './apiError'

/**
 * Axios instance for the Spring Boot API. Every response uses the ApiResponse envelope
 * ({ success, data, error, timestamp }); `request` unwraps `data` or throws ApiError.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
  headers: { Accept: 'application/json' },
})

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return typeof value === 'object' && value !== null && 'success' in value && 'timestamp' in value
}

function normalise(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const body: unknown = error.response?.data
    const status = error.response?.status ?? null
    if (isEnvelope(body) && body.error) return ApiError.fromBody(body.error, status)
    if (error.code === AxiosError.ECONNABORTED) return new ApiError('TIMEOUT', 'The server did not respond in time.', { status })
    if (!error.response) return new ApiError('NETWORK_ERROR', 'The server could not be reached.', { status })
    return new ApiError('HTTP_ERROR', `The server returned HTTP ${error.response.status}.`, { status })
  }
  return new ApiError('CLIENT_ERROR', 'An unexpected error occurred.')
}

export async function request<T>(config: Parameters<typeof apiClient.request>[0]): Promise<T> {
  try {
    const response = await apiClient.request<ApiEnvelope<T>>(config)
    const body = response.data
    if (!isEnvelope(body)) throw new ApiError('INVALID_RESPONSE', 'The server returned an unexpected response.')
    if (!body.success || body.data === null) {
      throw body.error
        ? ApiError.fromBody(body.error, response.status)
        : new ApiError('INVALID_RESPONSE', 'The server returned no data.')
    }
    return body.data as T
  } catch (error) {
    throw error instanceof ApiError ? error : normalise(error)
  }
}
