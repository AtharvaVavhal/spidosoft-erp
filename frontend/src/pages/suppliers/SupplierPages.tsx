import { useNavigate, useParams } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import type { DataTableColumn } from '@/components/DataTable/DataTable'
import { IconLink } from '@/components/IconButton/IconButton'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { ErrorState, LoadingState } from '@/components/States/States'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSupplier, useSupplierSearch } from '@/hooks/useSuppliers'
import type { SupplierMaster } from '@/types/supplier'
import { formatDateTime, formatInteger, formatText } from '@/utils/format'
import { PartyFormShell } from '../masters/PartyFormShell'
import { PartyListShell } from '../masters/PartyListShell'
import { DetailList } from '../shared/DetailList'
import grid from '../shared/FormGrid.module.css'
import { EMPTY_SUPPLIER_FORM, SUPPLIER_SECTIONS, supplierFormSchema } from './supplierForm'

const REF_TBD = 'not marked FK in the schema; reference target unknown (docs/10 C5, C6)'
const AUDIT_TBD = 'population rules not confirmed (docs/10 §9-9)'
/** Numeric identifiers (phone, PIN) are shown as plain digits — never grouped like quantities. */
const digits = (v: number | string | null) => (v === null ? '—' : String(v))

const columns: Array<DataTableColumn<SupplierMaster>> = [
  { key: 'code', header: 'Supplier Code', width: 120, render: (r) => <span className="tabular">{formatText(r.SuppCode)}</span> },
  { key: 'name', header: 'Supplier Name', render: (r) => formatText(r.SuppName), title: (r) => r.SuppName ?? undefined },
  { key: 'contact', header: 'Contact Person', width: 160, tone: 'secondary', render: (r) => formatText(r.ContactPerson) },
  { key: 'city', header: 'City', width: 128, tone: 'secondary', render: (r) => formatText(r.City) },
  { key: 'mobile', header: 'Mobile', width: 120, tone: 'secondary', render: (r) => <span className="tabular">{digits(r.Mobile)}</span> },
  { key: 'gstin', header: 'GSTIN', width: 168, tone: 'secondary', render: (r) => <span className="tabular">{formatText(r.GSTIN)}</span> },
  {
    key: 'actions',
    header: <span className="sr-only">Actions</span>,
    width: 56,
    align: 'right',
    render: (r) => <IconLink icon={Pencil} label={`Open ${formatText(r.SuppCode)}`} to={`/masters/suppliers/${r.Id}`} />,
    skeletonWidth: 16,
  },
]

export function SupplierListPage() {
  useDocumentTitle('Supplier Master')
  return (
    <PartyListShell
      title="Supplier Master"
      noun="supplier"
      createTo="/masters/suppliers/new"
      columns={columns}
      rowKey={(r) => r.Id}
      useSearch={useSupplierSearch}
    />
  )
}

export function SupplierFormPage() {
  useDocumentTitle('New Supplier')
  const navigate = useNavigate()
  return (
    <>
      <PageHeader title="Create Supplier Master" />
      <PartyFormShell
        sections={SUPPLIER_SECTIONS}
        resolver={zodResolver(supplierFormSchema)}
        defaultValues={EMPTY_SUPPLIER_FORM}
        onCancel={() => navigate('/masters/suppliers')}
        references={
          <DetailList
            items={['supptypeid', 'CountryId', 'StateId', 'CityId'].map((label) => ({
              label,
              value: 'Not editable yet',
              tbd: REF_TBD,
            }))}
          />
        }
      />
    </>
  )
}

export function SupplierDetailPage() {
  const params = useParams()
  const id = Number.parseInt(params.id ?? '', 10)
  const validId = Number.isInteger(id) && id > 0 ? id : null
  const query = useSupplier(validId)
  useDocumentTitle(query.data?.SuppCode ?? 'Supplier')

  if (validId === null) return <ErrorState title="Invalid supplier link." message="The supplier identifier in the address is not valid." />
  if (query.isPending) return <LoadingState label="Loading supplier…" />
  if (query.isError) return <ErrorState title="Supplier couldn't be loaded." message={query.error.message} onRetry={() => void query.refetch()} />

  const s = query.data
  return (
    <div className={grid.formWrap}>
      <PageHeader title={formatText(s.SuppName)} description={formatText(s.SuppCode)} />
      <Panel>
        <PanelSection title="Supplier details">
          <DetailList
            items={[
              { label: 'Supplier Code', value: formatText(s.SuppCode), numeric: true },
              { label: 'Supplier Name', value: formatText(s.SuppName) },
              { label: 'Contact Person', value: formatText(s.ContactPerson) },
              { label: 'Branch', value: formatText(s.Branch) },
              { label: 'GSTIN', value: formatText(s.GSTIN), numeric: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="Address">
          <DetailList
            items={[
              { label: 'Address 1', value: formatText(s.Address1) },
              { label: 'Address 2', value: formatText(s.Address2) },
              { label: 'City', value: formatText(s.City) },
              { label: 'State', value: formatText(s.State) },
              { label: 'PIN Code', value: digits(s.PinCode), numeric: true },
              { label: 'Country', value: formatText(s.Country) },
            ]}
          />
        </PanelSection>
        <PanelSection title="Contact">
          <DetailList
            items={[
              { label: 'Email ID', value: formatText(s.EmailID) },
              { label: 'Telephone', value: digits(s.Telephone), numeric: true },
              { label: 'Mobile', value: digits(s.Mobile), numeric: true },
              { label: 'Fax', value: formatText(s.Fax) },
              { label: 'Website', value: formatText(s.Website) },
              { label: 'Remarks', value: formatText(s.Remarks), full: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="References" description="Raw id values; not marked as foreign keys in the schema">
          <DetailList
            items={[
              { label: 'supptypeid', value: formatInteger(s.supptypeid), tbd: REF_TBD, numeric: true },
              { label: 'CountryId', value: formatInteger(s.CountryId), tbd: REF_TBD, numeric: true },
              { label: 'StateId', value: formatInteger(s.StateId), tbd: REF_TBD, numeric: true },
              { label: 'CityId', value: formatInteger(s.CityId), tbd: REF_TBD, numeric: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="Record">
          <DetailList
            items={[
              { label: 'Id', value: String(s.Id), numeric: true },
              { label: 'Username', value: formatText(s.Username), tbd: AUDIT_TBD },
              { label: 'LoginBranch', value: formatText(s.LoginBranch), tbd: AUDIT_TBD },
              { label: 'SystEmentryDate', value: formatDateTime(s.SystEmentryDate), tbd: AUDIT_TBD, numeric: true },
              { label: 'BranchId', value: formatInteger(s.BranchId), tbd: AUDIT_TBD, numeric: true },
              { label: 'LoginUserId', value: formatInteger(s.LoginUserId), tbd: AUDIT_TBD, numeric: true },
            ]}
          />
        </PanelSection>
      </Panel>
    </div>
  )
}
