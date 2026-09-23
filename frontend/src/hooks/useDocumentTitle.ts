import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · SpidoSoft ERP` : 'SpidoSoft ERP'
  }, [title])
}
