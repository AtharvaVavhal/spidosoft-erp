import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { apiClient, request } from './apiClient'
import { ApiError } from './apiError'

function respond(data: unknown, status = 200): AxiosResponse {
  return { data, status, statusText: '', headers: {}, config: { headers: new AxiosHeaders() } }
}

describe('request (ApiResponse envelope)', () => {
  it('unwraps data from a successful envelope', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue(
      respond({ success: true, data: { status: 'UP', database: 'NOT_CONFIGURED' }, error: null, timestamp: 't' }),
    )
    await expect(request({ url: '/system/health' })).resolves.toEqual({ status: 'UP', database: 'NOT_CONFIGURED' })
  })

  it('maps an error envelope to ApiError with code, violations and request id', async () => {
    const body = {
      success: false,
      data: null,
      timestamp: 't',
      error: {
        code: 'VALIDATION_FAILED',
        message: 'One or more fields are invalid.',
        violations: [{ field: 'ItemCode', message: 'must not be blank' }],
        path: '/api/items',
        requestId: 'req-1',
      },
    }
    const axiosError = new AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, respond(body, 400))
    vi.spyOn(apiClient, 'request').mockRejectedValue(axiosError)

    const error = await request({ url: '/items' }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'VALIDATION_FAILED', status: 400, requestId: 'req-1' })
    expect((error as ApiError).violations).toHaveLength(1)
  })

  it('reports an unreachable server as NETWORK_ERROR', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'))
    await expect(request({ url: '/system/health' })).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('rejects a body that is not an envelope', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue(respond('<html>'))
    await expect(request({ url: '/system/health' })).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })
})
