import { ButtonLink } from '@/components/Button/Button'
import { EmptyState } from '@/components/States/States'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div style={{ paddingTop: 64 }}>
      <EmptyState
        title="Page not found"
        description="The address may be mistyped, or the page may not exist yet."
        action={<ButtonLink to="/">Go to Dashboard</ButtonLink>}
      />
    </div>
  )
}
