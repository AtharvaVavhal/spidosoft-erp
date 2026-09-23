import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { ToastProvider } from '@/components/Toast/ToastProvider'
import { queryClient } from './queryClient'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  )
}
