import { useId } from 'react'
import styles from './Radio.module.css'

export interface RadioGroupOption<T extends string> {
  value: T
  label: string
}

export interface RadioGroupProps<T extends string> {
  legend: string
  name: string
  value: T
  options: Array<RadioGroupOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
}

/** Native radios in a fieldset/legend (docs/06 §3.2). */
export function RadioGroup<T extends string>({ legend, name, value, options, onChange, disabled }: RadioGroupProps<T>) {
  const id = useId()
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option} htmlFor={`${id}-${option.value}`}>
          <input
            id={`${id}-${option.value}`}
            className={styles.radio}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}
