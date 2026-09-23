import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'rowDelete'
export type ButtonSize = 'sm' | 'md'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  children?: ReactNode
}

function classes(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(styles.button, styles[variant], size === 'sm' && styles.sm, className)
}

export interface ButtonProps extends CommonProps, Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Keeps the width, shows a spinner and sets aria-busy. */
  loading?: boolean
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle className={styles.spinner} aria-hidden="true" /> : Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  )
}

export interface ButtonLinkProps extends CommonProps, Omit<LinkProps, 'children'> {}

/** A navigation link styled as a button (e.g. "Create New"). */
export function ButtonLink({ variant = 'secondary', size = 'md', icon: Icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, className)} {...rest}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </Link>
  )
}
