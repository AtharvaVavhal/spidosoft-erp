import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/cn'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  indeterminate?: boolean
}

export function Checkbox({ indeterminate = false, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])
  return <input ref={ref} type="checkbox" className={cn(styles.checkbox, className)} {...rest} />
}
