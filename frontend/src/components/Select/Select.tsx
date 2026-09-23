import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/utils/cn'
import inputStyles from '@/components/Input/Input.module.css'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'children'> {
  options: SelectOption[]
  /** Rendered as the empty first option, e.g. "Select Code". */
  placeholder?: string
}

/**
 * Native select for short static lists (docs/06 §3.2). A searchable combobox for long master-data lists
 * is a later design-system addition (headless library decision TBD — docs/08).
 */
export function Select({ options, placeholder, className, value, ...rest }: SelectProps) {
  const isPlaceholder = placeholder !== undefined && (value === '' || value === undefined)
  return (
    <select
      className={cn(inputStyles.control, styles.select, isPlaceholder && styles.placeholder, className)}
      value={value}
      {...rest}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
