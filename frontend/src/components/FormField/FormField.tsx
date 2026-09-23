import { useId, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { TbdTag } from '@/components/Tbd/Tbd'
import styles from './FormField.module.css'

export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-required'?: boolean
}

export interface FormFieldProps {
  label: string
  /** Required marker: asterisk in danger.text, aria-hidden; the control gets aria-required (r4). */
  required?: boolean
  hint?: ReactNode
  error?: string
  /** Shows a TBD tag next to the label with this reason. */
  tbd?: string
  className?: string
  /** Render prop receives the id/ARIA wiring for the control. */
  children: (control: FieldControlProps) => ReactNode
}

export function FormField({ label, required, hint, error, tbd, className, children }: FormFieldProps) {
  const id = useId()
  // An error replaces the hint, so the field never shows two messages at once.
  const showHint = Boolean(hint) && !error
  const hintId = showHint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        <span>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}*
            </span>
          )}
        </span>
        {tbd && <TbdTag reason={tbd} />}
      </label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {error && (
        <div className={styles.error} id={errorId}>
          <CircleAlert aria-hidden="true" />
          {error}
        </div>
      )}
      {showHint && (
        <div className={styles.hint} id={hintId}>
          {hint}
        </div>
      )}
    </div>
  )
}
