import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/utils/cn'
import inputStyles from '@/components/Input/Input.module.css'
import styles from './Textarea.module.css'

export function Textarea({ className, ...rest }: ComponentPropsWithRef<'textarea'>) {
  return <textarea className={cn(inputStyles.control, styles.textarea, className)} {...rest} />
}
