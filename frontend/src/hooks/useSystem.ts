import { useQuery } from '@tanstack/react-query'
import { systemService } from '@/services/system/systemService'

/** Real backend calls (implemented endpoints). No retries: an absent backend should show promptly. */
export function useSystemHealth() {
  return useQuery({ queryKey: ['system', 'health'], queryFn: systemService.health, retry: false })
}

export function useSystemVersion() {
  return useQuery({ queryKey: ['system', 'version'], queryFn: systemService.version, retry: false })
}
