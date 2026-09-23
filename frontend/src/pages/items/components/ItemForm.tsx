import { useState } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import { ConfirmDialog } from '@/components/Dialog/Dialog'
import { FormField } from '@/components/FormField/FormField'
import { Input } from '@/components/Input/Input'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { Select } from '@/components/Select/Select'
import { Textarea } from '@/components/Textarea/Textarea'
import { FormActionBar } from '@/layouts/FormActionBar'
import type { MappingGridRow } from '@/types/mapping'
import { ColumnLimits } from '@/utils/columnLimits'
import grid from '@/pages/shared/FormGrid.module.css'
import { MappingSection } from './MappingSection'
import {
  EMPTY_ITEM_FORM,
  ITEM_FIELD_LABELS,
  itemFormSchema,
  type ItemFormInput,
  type ItemFormValues,
} from './itemFormSchema'

export interface ItemFormProps {
  defaultValues?: ItemFormInput
  submitLabel?: string
  onSubmit: (values: ItemFormValues, mappingRows: MappingGridRow[]) => Promise<void>
  onCancel: () => void
}

/**
 * Item Master form + mapping section. Field set = confirmed ItemMaster columns that a user can
 * reasonably enter. Excluded: ID (identity TBD), audit columns (population TBD) and FK id columns,
 * whose lookup tables are unknown (docs/10 §9-8) — Manufacturer Name is shown disabled for that reason.
 */
export function ItemForm({ defaultValues = EMPTY_ITEM_FORM, submitLabel = 'Save', onSubmit, onCancel }: ItemFormProps) {
  const [mappingRows, setMappingRows] = useState<MappingGridRow[]>([])
  const [confirmClear, setConfirmClear] = useState(false)
  const [summary, setSummary] = useState<Array<keyof ItemFormInput>>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ItemFormInput, unknown, ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const specificationLength = useWatch({ control, name: 'Specification' })?.length ?? 0
  const hasChanges = isDirty || mappingRows.length > 0

  const submit = handleSubmit(
    async (values) => {
      setSummary([])
      await onSubmit(values, mappingRows)
    },
    (invalid: FieldErrors<ItemFormInput>) => setSummary(Object.keys(invalid) as Array<keyof ItemFormInput>),
  )

  const field = (name: keyof ItemFormInput) => ({ ...register(name), error: errors[name]?.message })

  const text = (name: keyof ItemFormInput, opts: { required?: boolean; max?: number; placeholder?: string; hint?: string } = {}) => {
    const { error, ...reg } = field(name)
    return (
      <FormField label={ITEM_FIELD_LABELS[name]} required={opts.required} error={error} hint={opts.hint}>
        {(control) => <Input {...reg} {...control} maxLength={opts.max} placeholder={opts.placeholder} />}
      </FormField>
    )
  }

  const decimal = (name: keyof ItemFormInput, suffix?: string) => {
    const { error, ...reg } = field(name)
    return (
      <FormField label={ITEM_FIELD_LABELS[name]} error={error}>
        {(control) => <Input {...reg} {...control} numeric inputMode="decimal" suffix={suffix} placeholder="0.00" />}
      </FormField>
    )
  }

  return (
    <form className={grid.formWrap} onSubmit={submit} noValidate>
      <div className={grid.stack}>
        <Alert tone="info">Fields marked * are required.</Alert>
        {summary.length > 0 && (
          <Alert tone="danger" title={`${summary.length} ${summary.length === 1 ? 'field needs' : 'fields need'} attention.`}>
            {summary.map((name, i) => (
              <span key={name}>
                {i > 0 && ', '}
                {ITEM_FIELD_LABELS[name]}
              </span>
            ))}
          </Alert>
        )}

        <Panel>
          <PanelSection title="Item details" description="Identification and classification">
            <div className={grid.grid}>
              {text('ItemCode', {
                required: true,
                max: ColumnLimits.item.ItemCode,
                hint: 'Code generation rule pending confirmation',
              })}
              {text('ItemName')}
              {text('ItemType')}
              {text('ItemSubType')}
              {text('Material')}
              {text('RawMaterial', { max: ColumnLimits.item.RawMaterial })}
              {text('Color')}
              {text('UOM', { max: ColumnLimits.item.UOM })}
              {text('DrawingNo', { max: ColumnLimits.item.DrawingNo })}
              <FormField label="Manufacturer Name" tbd="lookup table for ManufacturerId (docs/10 §9-8)">
                {(control) => <Select {...control} disabled placeholder="--Select--" options={[]} value="" />}
              </FormField>
            </div>
          </PanelSection>

          <PanelSection title="Tax & pricing">
            <div className={grid.grid}>
              {text('HSNCODE', { max: ColumnLimits.item.HSNCODE })}
              {decimal('GSTRate')}
              <div aria-hidden="true" />
              {decimal('PurchaseCost')}
              {decimal('SellingPrice')}
            </div>
          </PanelSection>

          <PanelSection title="Specification">
            {(() => {
              const { error, ...reg } = field('Specification')
              return (
                <FormField
                  label="Specification"
                  error={error}
                  hint={`${specificationLength} / ${ColumnLimits.item.Specification} characters`}
                >
                  {(control) => <Textarea {...reg} {...control} rows={3} maxLength={ColumnLimits.item.Specification} />}
                </FormField>
              )
            })()}
          </PanelSection>

          <MappingSection rows={mappingRows} onRowsChange={setMappingRows} />
        </Panel>
      </div>

      <FormActionBar meta={hasChanges ? 'Unsaved changes' : undefined}>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        {/* TBD — pending Spidosoft confirmation: Clear scope (docs/10 Q-15). Here it clears unsaved input on this screen only. */}
        <Button variant="secondary" disabled={!hasChanges} onClick={() => setConfirmClear(true)}>
          Clear
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </FormActionBar>

      <ConfirmDialog
        open={confirmClear}
        title="Clear this form?"
        description="All unsaved values and GridView rows on this screen will be removed."
        confirmLabel="Clear form"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          reset(defaultValues)
          setMappingRows([])
          setSummary([])
          setConfirmClear(false)
        }}
      />
    </form>
  )
}
