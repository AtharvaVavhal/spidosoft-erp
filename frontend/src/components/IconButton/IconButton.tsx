import type { ComponentPropsWithRef } from 'react'
import { Link, type LinkProps } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import styles from './IconButton.module.css'

/** Icon-only button. `label` is mandatory: it is the accessible name and the tooltip. */
export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label'> {
  icon: LucideIcon
  label: string
}

export function IconButton({ icon: Icon, label, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cn(styles.iconButton, className)} {...rest}>
      <Icon aria-hidden="true" />
    </button>
  )
}

export interface IconLinkProps extends Omit<LinkProps, 'children' | 'aria-label'> {
  icon: LucideIcon
  label: string
}

export function IconLink({ icon: Icon, label, className, ...rest }: IconLinkProps) {
  return (
    <Link aria-label={label} title={label} className={cn(styles.iconButton, className)} {...rest}>
      <Icon aria-hidden="true" />
    </Link>
  )
}
