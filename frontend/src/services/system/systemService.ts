import type { SystemHealth, SystemVersion } from '@/types/system'
import { request } from '../http/apiClient'

/** Real backend calls — /api/system/* is implemented. */
export const systemService = {
  health: () => request<SystemHealth>({ method: 'GET', url: '/system/health' }),
  version: () => request<SystemVersion>({ method: 'GET', url: '/system/version' }),
}
