import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ErrorState } from '@/components/States/States'

/** Last-resort boundary for render/route errors. Details are logged to the console, not shown. */
export function RouteErrorPage() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)
  const message = isRouteErrorResponse(error)
    ? `The page returned ${error.status} ${error.statusText}.`
    : 'Something went wrong while showing this page.'
  return (
    <div style={{ padding: 48 }}>
      <ErrorState title="This page couldn't be displayed." message={message} onRetry={() => window.location.reload()} />
    </div>
  )
}
