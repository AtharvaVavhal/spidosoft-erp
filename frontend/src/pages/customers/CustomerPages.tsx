import { useNavigate, useParams } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import type { DataTableColumn } from '@/components/DataTable/DataTable'
import { IconLink } from '@/components/IconButton/IconButton'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { ErrorState, LoadingState } from '@/components/States/States'
import { useCustomer, useCustomerSearch } from '@/hooks/useCustomers'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { CustomerMaster } from '@/types/customer'
import { formatDateTime, formatInteger, formatText } from '@/utils/format'
import { PartyFormShell } from '../masters/PartyFormShell'
import { PartyListShell } from '../masters/PartyListShell'
import { DetailList } from '../shared/DetailList'
import grid from '../shared/FormGrid.module.css'
import { CUSTOMER_SECTIONS, EMPTY_CUSTOMER_FORM, customerFormSchema } from './customerForm'

const FK_TBD = 'FK target table not confirmed (docs/10 §9-8)'
const AUDIT_TBD = 'population rules not confirmed (docs/10 §9-9)'

const columns: Array<DataTableColumn<CustomerMaster>> = [
  { key: 'code', header: 'Customer Code', width: 120, render: (r) => <span className="tabular">{formatText(r.CustCode)}</span> },
  { key: 'name', header: 'Customer Name', render: (r) => formatText(r.CustName), title: (r) => r.CustName ?? undefined },
  { key: 'contact', header: 'Contact Person', width: 160, tone: 'secondary', render: (r) => formatText(r.ContactPerson) },
  { key: 'city', header: 'City', width: 128, tone: 'secondary', render: (r) => formatText(r.City) },
  { key: 'mobile', header: 'Mobile', width: 120, tone: 'secondary', render: (r) => <span className="tabular">{formatText(r.Mobile)}</span> },
  { key: 'gstin', header: 'GSTIN', width: 168, tone: 'secondary', render: (r) => <span className="tabular">{formatText(r.GSTIN)}</span> },
  {
    key: 'actions',
    header: <span className="sr-only">Actions</span>,
    width: 56,
    align: 'right',
    render: (r) => <IconLink icon={Pencil} label={`Open ${formatText(r.CustCode)}`} to={`/masters/customers/${r.Id}`} />,
    skeletonWidth: 16,
  },
]

export function CustomerListPage() {
  useDocumentTitle('Customer Master')
  return (
    <PartyListShell
      title="Customer Master"
      noun="customer"
      createTo="/masters/customers/new"
      columns={columns}
      rowKey={(r) => r.Id}
      useSearch={useCustomerSearch}
    />
  )
}

export function CustomerFormPage() {
  useDocumentTitle('New Customer')
  const navigate = useNavigate()
  return (
    <>
      <PageHeader title="Create Customer Master" />
      <PartyFormShell
        sections={CUSTOMER_SECTIONS}
        resolver={zodResolver(customerFormSchema)}
        defaultValues={EMPTY_CUSTOMER_FORM}
        onCancel={() => navigate('/masters/customers')}
        references={
          <DetailList
            items={['CustomerTypeId', 'CityId', 'StateId', 'CountryId', 'ConsigneeId'].map((label) => ({
              label,
              value: 'Not editable yet',
              tbd: FK_TBD,
            }))}
          />
        }
      />
    </>
  )
}

export function CustomerDetailPage() {
  const params = useParams()
  const id = Number.parseInt(params.id ?? '', 10)
  const validId = Number.isInteger(id) && id > 0 ? id : null
  const query = useCustomer(validId)
  useDocumentTitle(query.data?.CustCode ?? 'Customer')

  if (validId === null) return <ErrorState title="Invalid customer link." message="The customer identifier in the address is not valid." />
  if (query.isPending) return <LoadingState label="Loading customer…" />
  if (query.isError) return <ErrorState title="Customer couldn't be loaded." message={query.error.message} onRetry={() => void query.refetch()} />

  const c = query.data
  return (
    <div className={grid.formWrap}>
      <PageHeader title={formatText(c.CustName)} description={formatText(c.CustCode)} />
      <Panel>
        <PanelSection title="Customer details">
          <DetailList
            items={[
              { label: 'Customer Code', value: formatText(c.CustCode), numeric: true },
              { label: 'Customer Name', value: formatText(c.CustName) },
              { label: 'Contact Person', value: formatText(c.ContactPerson) },
              { label: 'Branch', value: formatText(c.Branch) },
              { label: 'GSTIN', value: formatText(c.GSTIN), numeric: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="Address">
          <DetailList
            items={[
              { label: 'Address 1', value: formatText(c.Address1) },
              { label: 'Address 2', value: formatText(c.Address2) },
              { label: 'City', value: formatText(c.City) },
              { label: 'State', value: formatText(c.State) },
              { label: 'PIN Code', value: formatText(c.PinCode), numeric: true },
              { label: 'Country', value: formatText(c.Country) },
            ]}
          />
        </PanelSection>
        <PanelSection title="Contact">
          <DetailList
            items={[
              { label: 'Email ID', value: formatText(c.EmailID) },
              { label: 'Telephone', value: formatText(c.Telephone), numeric: true },
              { label: 'Mobile', value: formatText(c.Mobile), numeric: true },
              { label: 'Fax', value: formatText(c.Fax) },
              { label: 'Website', value: formatText(c.Website) },
              { label: 'Remarks', value: formatText(c.Remarks), full: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="References" description="Raw id values; lookup tables are not confirmed">
          <DetailList
            items={[
              { label: 'CustomerTypeId', value: formatInteger(c.CustomerTypeId), tbd: FK_TBD, numeric: true },
              { label: 'CityId', value: formatInteger(c.CityId), tbd: FK_TBD, numeric: true },
              { label: 'StateId', value: formatInteger(c.StateId), tbd: FK_TBD, numeric: true },
              { label: 'CountryId', value: formatInteger(c.CountryId), tbd: FK_TBD, numeric: true },
              { label: 'ConsigneeId', value: formatInteger(c.ConsigneeId), tbd: FK_TBD, numeric: true },
            ]}
          />
        </PanelSection>
        <PanelSection title="Record">
          <DetailList
            items={[
              { label: 'Id', value: String(c.Id), numeric: true },
              { label: 'Username', value: formatText(c.Username), tbd: AUDIT_TBD },
              { label: 'LoginBranch', value: formatText(c.LoginBranch), tbd: AUDIT_TBD },
              { label: 'SystEmentryDate', value: formatDateTime(c.SystEmentryDate), tbd: AUDIT_TBD, numeric: true },
              { label: 'BranchId', value: formatInteger(c.BranchId), tbd: AUDIT_TBD, numeric: true },
              { label: 'LoginUserId', value: formatInteger(c.LoginUserId), tbd: AUDIT_TBD, numeric: true },
            ]}
          />
        </PanelSection>
      </Panel>
    </div>
  )
}
