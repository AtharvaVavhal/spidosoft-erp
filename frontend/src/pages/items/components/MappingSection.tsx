import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import { DataTable, type DataTableColumn } from '@/components/DataTable/DataTable'
import { FormField } from '@/components/FormField/FormField'
import { RadioGroup } from '@/components/Radio/Radio'
import { Select } from '@/components/Select/Select'
import { ErrorState } from '@/components/States/States'
import { PanelSection } from '@/components/Panel/Panel'
import { usePartyOptions } from '@/hooks/usePartyOptions'
import type { MappingGridRow, PartyType } from '@/types/mapping'
import { formatText } from '@/utils/format'
import styles from './MappingSection.module.css'

/**
 * "Select Type & Add Supplier/Customer to List" — formal requirement R-4 / R-5 (docs/02).
 *
 * CONFIRMED: controls Is Supplier / Is Customer, Select Code, Select Name, Add, GridView
 * (S.No, Code, Name, Action → Delete); clicking Add binds the selection into the GridView.
 *
 * UI-state only. Persistence model intentionally deferred (docs/10 §9 decisions 3–6).
 * Provisional UI behaviour — TBD, pending Spidosoft confirmation:
 *  - Select Code and Select Name are linked to one selection (docs/10 Q-3 / C9).
 *  - Rows are kept per party type and the GridView shows the selected type ("OR" semantics — C10).
 *  - No duplicate prevention and no type lock (docs/10 Q-4, 2F-3).
 *  - Default type Is Supplier follows the Reference UI (image 7); the default is not stated.
 */
export function MappingSection({ rows, onRowsChange }: { rows: MappingGridRow[]; onRowsChange: (rows: MappingGridRow[]) => void }) {
  const [type, setType] = useState<PartyType>('SUPPLIER')
  const [selectedId, setSelectedId] = useState('')
  const options = usePartyOptions(type)
  const label = type === 'SUPPLIER' ? 'Supplier' : 'Customer'

  const codeOptions = useMemo(
    () => (options.data ?? []).map((p) => ({ value: String(p.id), label: formatText(p.code) })),
    [options.data],
  )
  // Names are not unique (docs/10 C9), so each name option also shows its code.
  const nameOptions = useMemo(
    () => (options.data ?? []).map((p) => ({ value: String(p.id), label: `${formatText(p.name)} (${formatText(p.code)})` })),
    [options.data],
  )
  const visibleRows = rows.filter((r) => r.partyType === type)

  const add = () => {
    const party = options.data?.find((p) => String(p.id) === selectedId)
    if (!party) return
    onRowsChange([...rows, { rowKey: `${type}-${party.id}-${Date.now()}`, partyType: type, party }])
    setSelectedId('') // selectors reset after Add (Reference UI observation, image 9)
  }

  const columns: Array<DataTableColumn<MappingGridRow>> = [
    { key: 'sno', header: 'S.No', width: 64, tone: 'tertiary', render: (r) => visibleRows.indexOf(r) + 1 },
    { key: 'code', header: `${label} Code`, width: 160, render: (r) => <span className="tabular">{formatText(r.party.code)}</span> },
    { key: 'name', header: `${label} Name`, render: (r) => formatText(r.party.name), title: (r) => r.party.name ?? undefined },
    {
      key: 'action',
      header: 'Action',
      width: 112,
      align: 'right',
      render: (r) => (
        <Button
          variant="rowDelete"
          size="sm"
          icon={Trash2}
          aria-label={`Delete ${formatText(r.party.code)} ${formatText(r.party.name)}`}
          onClick={() => onRowsChange(rows.filter((x) => x.rowKey !== r.rowKey))}
        >
          Delete
        </Button>
      ),
    },
  ]

  return (
    <PanelSection title="Select Type & Add Supplier/Customer to List">
      <RadioGroup<PartyType>
        legend="Type"
        name="mapping-type"
        value={type}
        options={[
          { value: 'SUPPLIER', label: 'Is Supplier' },
          { value: 'CUSTOMER', label: 'Is Customer' },
        ]}
        onChange={(next) => {
          setType(next)
          setSelectedId('')
        }}
      />
      {options.isError ? (
        <div className={styles.notice}>
          <ErrorState title={`${label}s couldn't be loaded.`} message={options.error.message} onRetry={() => void options.refetch()} />
        </div>
      ) : (
        <div className={styles.row}>
          <FormField label="Select Code" tbd="Code ↔ Name linkage (docs/10 Q-3)">
            {(field) => (
              <Select
                {...field}
                placeholder={options.isPending ? 'Loading…' : 'Select Code'}
                disabled={options.isPending}
                options={codeOptions}
                value={selectedId}
                onChange={(e) => setSelectedId(e.currentTarget.value)}
              />
            )}
          </FormField>
          <FormField label="Select Name">
            {(field) => (
              <Select
                {...field}
                placeholder={options.isPending ? 'Loading…' : 'Select Name'}
                disabled={options.isPending}
                options={nameOptions}
                value={selectedId}
                onChange={(e) => setSelectedId(e.currentTarget.value)}
              />
            )}
          </FormField>
          <Button icon={Plus} onClick={add} disabled={selectedId === ''}>
            Add
          </Button>
        </div>
      )}
      <div className={styles.grid}>
        <DataTable
          label={`Mapped ${label.toLowerCase()}s`}
          columns={columns}
          rows={visibleRows}
          rowKey={(r) => r.rowKey}
          status={visibleRows.length > 0 ? 'ready' : 'empty'}
          minWidth={480}
          compactStates
          emptyState={<div className={styles.emptyGrid}>No entries added yet.</div>}
        />
      </div>
      <Alert tone="info" className={styles.notice}>
        GridView rows are kept on this screen only. Saving mappings is pending Spidosoft confirmation of the mapping
        storage (docs/10 §9-3).
      </Alert>
    </PanelSection>
  )
}
