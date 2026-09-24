import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axeViolations } from '@/test/axe'
import type { MappingGridRow } from '@/types/mapping'
import { MappingSection } from './MappingSection'

/**
 * The confirmed requirement: Is Supplier / Is Customer, Select Code / Select Name, and "If you click on
 * the add button, the data should be bind in the GridView below." GridView rows are UI state only —
 * nothing here is persisted (mapping storage is pending Spidosoft confirmation).
 */
function Harness() {
  const [rows, setRows] = useState<MappingGridRow[]>([])
  return <MappingSection rows={rows} onRowsChange={setRows} />
}

function renderSection() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const user = userEvent.setup()
  const view = render(
    <QueryClientProvider client={client}>
      <Harness />
    </QueryClientProvider>,
  )
  return { user, ...view }
}

const grid = () => screen.getByRole('table', { name: /Mapped (suppliers|customers)/ })
const selectCode = () => screen.getByLabelText(/Select Code/)
const selectName = () => screen.getByLabelText('Select Name')
const addButton = () => screen.getByRole('button', { name: 'Add' })

async function waitForOptions() {
  // The mock adapter answers after a short simulated latency.
  await screen.findByRole('option', { name: 'SMSP0001' })
}

describe('MappingSection', () => {
  it('shows the formal controls with Is Supplier selected and an empty GridView', async () => {
    renderSection()
    await waitForOptions()

    expect(screen.getByRole('radio', { name: 'Is Supplier' })).toHaveProperty('checked', true)
    expect(screen.getByRole('radio', { name: 'Is Customer' })).toHaveProperty('checked', false)
    expect(within(grid()).getByText('No entries added yet.')).toBeTruthy()
    expect(addButton()).toHaveProperty('disabled', true)
  })

  it('binds the selected supplier into the GridView on Add and resets the selectors', async () => {
    const { user } = renderSection()
    await waitForOptions()

    await user.selectOptions(selectCode(), 'SMSP0003')
    // Code and Name are provisionally linked to one selection (docs/10 Q-3 — TBD).
    expect((selectName() as HTMLSelectElement).selectedOptions[0]?.textContent).toBe('Deccan Metal Traders (SMSP0003)')
    expect(addButton()).toHaveProperty('disabled', false)

    await user.click(addButton())

    const row = within(grid()).getByRole('row', { name: /SMSP0003/ })
    expect(within(row).getAllByRole('cell').map((c) => c.textContent)).toEqual(['1', 'SMSP0003', 'Deccan Metal Traders', 'Delete'])
    expect((selectCode() as HTMLSelectElement).value).toBe('')
    expect(addButton()).toHaveProperty('disabled', true)
  })

  it('numbers rows and removes a row with Delete', async () => {
    const { user } = renderSection()
    await waitForOptions()

    await user.selectOptions(selectCode(), 'SMSP0001')
    await user.click(addButton())
    await user.selectOptions(selectCode(), 'SMSP0002')
    await user.click(addButton())

    expect(within(grid()).getAllByRole('row')).toHaveLength(3) // header + 2
    await user.click(screen.getByRole('button', { name: /Delete SMSP0001/ }))

    const rows = within(grid()).getAllByRole('row')
    expect(rows).toHaveLength(2)
    expect(within(rows[1]!).getAllByRole('cell')[0]?.textContent).toBe('1')
    expect(rows[1]?.textContent).toContain('SMSP0002')
  })

  it('switches the GridView headers and options to Customer', async () => {
    const { user } = renderSection()
    await waitForOptions()

    await user.click(screen.getByRole('radio', { name: 'Is Customer' }))
    // The reference data repeats this name, so two options match.
    expect(await screen.findAllByRole('option', { name: /A-One Aluminium Works/ })).toHaveLength(2)

    expect(within(grid()).getByRole('columnheader', { name: 'Customer Code' })).toBeTruthy()
    expect(within(grid()).getByRole('columnheader', { name: 'Customer Name' })).toBeTruthy()
    // Duplicate names are disambiguated by their code (docs/10 C9).
    const nameLabels = Array.from((selectName() as HTMLSelectElement).options).map((o) => o.textContent)
    expect(nameLabels.every((label) => label === 'Select Name' || /\(.+\)$/.test(label ?? ''))).toBe(true)
  })

  it('has no axe violations when empty or with rows', async () => {
    const { user, container } = renderSection()
    await waitForOptions()
    expect(await axeViolations(container)).toEqual([])

    await user.selectOptions(selectCode(), 'SMSP0001')
    await user.click(addButton())
    expect(await axeViolations(container)).toEqual([])
  })
})
