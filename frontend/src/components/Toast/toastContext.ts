import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'warning' | 'danger' | 'info'

export interface ToastInput {
  tone: ToastTone
  title: string
  message?: string
}

export interface ToastContextValue {
  show: (toast: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}
