import { useEffect, useId, useRef, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import styles from './Dialog.module.css'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer: ReactNode
  /** "alertdialog" for destructive/irreversible confirmations. */
  role?: 'dialog' | 'alertdialog'
  icon?: ReactNode
}

/**
 * Modal dialog built on the native <dialog> element: showModal() provides the focus trap, inert
 * background and Esc handling; focus returns to the trigger on close.
 */
export function Dialog({ open, onClose, title, description, children, footer, role = 'dialog', icon }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      {open && (
        <>
          <div className={styles.body}>
            {icon}
            <div>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <div id={descriptionId} className={styles.description}>
                  {description}
                </div>
              )}
              {children}
            </div>
          </div>
          <div className={styles.footer}>{footer}</div>
        </>
      )}
    </dialog>
  )
}

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  /** Names the action, e.g. "Delete" or "Clear form" — never "OK" (docs/06 §3.2). */
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, busy }: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      role="alertdialog"
      title={title}
      description={description}
      icon={
        <span className={styles.icon} aria-hidden="true">
          <TriangleAlert />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} autoFocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}
