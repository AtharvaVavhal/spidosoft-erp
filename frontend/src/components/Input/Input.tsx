import type { ComponentPropsWithRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import styles from './Input.module.css'

export interface InputProps extends ComponentPropsWithRef<'input'> {
  /** Right-aligned tabular figures for numeric values (locked rule). */
  numeric?: boolean
  prefix?: string
  suffix?: string
  leadingIcon?: LucideIcon
}

export function Input({ numeric, prefix, suffix, leadingIcon: Icon, className, ...rest }: InputProps) {
  const input = (
    <input
      className={cn(
        styles.control,
        numeric && styles.numeric,
        prefix && styles.hasPrefix,
        suffix && styles.hasSuffix,
        Icon && styles.hasIcon,
        className,
      )}
      {...rest}
    />
  )
  if (!prefix && !suffix && !Icon) return input
  return (
    <div className={styles.wrap}>
      {Icon && <Icon className={styles.leadingIcon} aria-hidden="true" />}
      {prefix && <span className={cn(styles.affix, styles.prefix)} aria-hidden="true">{prefix}</span>}
      {input}
      {suffix && <span className={cn(styles.affix, styles.suffix)} aria-hidden="true">{suffix}</span>}
    </div>
  )
}
