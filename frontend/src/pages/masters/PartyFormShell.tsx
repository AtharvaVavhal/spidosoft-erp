import type { ReactNode } from 'react'
import { useForm, type DefaultValues, type FieldValues, type Path, type Resolver } from 'react-hook-form'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import { FormField } from '@/components/FormField/FormField'
import { Input } from '@/components/Input/Input'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { Textarea } from '@/components/Textarea/Textarea'
import { FormActionBar } from '@/layouts/FormActionBar'
import grid from '@/pages/shared/FormGrid.module.css'

export interface ShellField<T extends FieldValues> {
  name: Path<T>
  label: string
  maxLength?: number
  inputMode?: 'numeric' | 'email' | 'url' | 'tel'
  multiline?: boolean
  hint?: string
}

export interface ShellSection<T extends FieldValues> {
  title: string
  fields: Array<ShellField<T>>
}

/**
 * Form SHELL for Customer/Supplier Master: documented columns and confirmed type limits only.
 * Save is disabled — create/edit is outside the confirmed requirement and persistence rules
 * (code generation, audit/branch population) are TBD (docs/10 §11, §9-9).
 */
export function PartyFormShell<T extends FieldValues, TOutput extends FieldValues = T>({
  sections,
  resolver,
  defaultValues,
  onCancel,
  references,
}: {
  sections: Array<ShellSection<T>>
  resolver: Resolver<T, unknown, TOutput>
  defaultValues: DefaultValues<T>
  onCancel: () => void
  references: ReactNode
}) {
  const {
    register,
    formState: { errors },
  } = useForm<T, unknown, TOutput>({ resolver, defaultValues, mode: 'onTouched' })

  return (
    <form className={grid.formWrap} onSubmit={(e) => e.preventDefault()} noValidate>
      <div className={grid.stack}>
        <Alert tone="warning" title="Form shell only.">
          Creating or editing this master is not in the confirmed requirement, so Save is unavailable until scope and
          persistence rules are confirmed (docs/10 §11). Field limits follow the confirmed column types.
        </Alert>
        <Panel>
          {sections.map((section) => (
            <PanelSection key={section.title} title={section.title}>
              <div className={grid.grid}>
                {section.fields.map((f) => {
                  const error = errors[f.name]?.message
                  return (
                    <FormField
                      key={f.name}
                      label={f.label}
                      error={typeof error === 'string' ? error : undefined}
                      hint={f.hint}
                      className={f.multiline ? grid.full : undefined}
                    >
                      {(control) =>
                        f.multiline ? (
                          <Textarea {...register(f.name)} {...control} rows={2} />
                        ) : (
                          <Input {...register(f.name)} {...control} maxLength={f.maxLength} inputMode={f.inputMode} />
                        )
                      }
                    </FormField>
                  )
                })}
              </div>
            </PanelSection>
          ))}
          <PanelSection title="References" description="Lookup-backed columns">
            {references}
          </PanelSection>
        </Panel>
      </div>
      <FormActionBar>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled title="Pending confirmation (docs/10 §11)">
          Save
        </Button>
      </FormActionBar>
    </form>
  )
}
