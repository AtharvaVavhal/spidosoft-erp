import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil } from 'lucide-react'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { ErrorState, LoadingState } from '@/components/States/States'
import { useToast } from '@/components/Toast/toastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useItem, useUpdateItem } from '@/hooks/useItems'
import { toApiError } from '@/services/http/apiError'
import type { ItemMaster } from '@/types/item'
import type { MappingGridRow } from '@/types/mapping'
import { formatDateTime, formatDecimal, formatInteger, formatText } from '@/utils/format'
import { DetailList } from '../shared/DetailList'
import grid from '../shared/FormGrid.module.css'
import { ItemForm } from './components/ItemForm'
import { formValuesToItemWrite, itemToFormInput, type ItemFormValues } from './components/itemFormSchema'

const FK_TBD = 'FK target table not confirmed (docs/10 §9-8)'
const AUDIT_TBD = 'population rules not confirmed (docs/10 §9-9)'

/**
 * View/Edit layout for one item.
 * TBD — pending Spidosoft confirmation: the route id is ItemMaster.ID, but ID and ItemCode are both
 * marked PK and the identifying key is undecided (docs/10 C3).
 */
export function ItemDetailPage() {
  const params = useParams()
  const id = Number.parseInt(params.id ?? '', 10)
  const validId = Number.isInteger(id) && id > 0 ? id : null
  const query = useItem(validId)
  const [editing, setEditing] = useState(false)

  useDocumentTitle(query.data ? query.data.ItemCode : 'Item')

  if (validId === null) {
    return <ErrorState title="Invalid item link." message="The item identifier in the address is not valid." />
  }
  if (query.isPending) return <LoadingState label="Loading item…" />
  if (query.isError) {
    return <ErrorState title="Item couldn't be loaded." message={query.error.message} onRetry={() => void query.refetch()} />
  }

  const item = query.data
  return editing ? (
    <ItemEdit item={item} onDone={() => setEditing(false)} />
  ) : (
    <ItemView item={item} onEdit={() => setEditing(true)} />
  )
}

function ItemView({ item, onEdit }: { item: ItemMaster; onEdit: () => void }) {
  return (
    <div className={grid.formWrap}>
      <PageHeader
        title={item.ItemCode}
        description={formatText(item.ItemName)}
        actions={
          <Button variant="primary" icon={Pencil} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <div className={grid.stack}>
        <Panel>
          <PanelSection title="Item details">
            <DetailList
              items={[
                { label: 'Item Code', value: item.ItemCode, numeric: true },
                { label: 'Item Name', value: formatText(item.ItemName) },
                { label: 'Item Type', value: formatText(item.ItemType) },
                { label: 'Item Sub Type', value: formatText(item.ItemSubType) },
                { label: 'Material', value: formatText(item.Material) },
                { label: 'Raw Material', value: formatText(item.RawMaterial) },
                { label: 'Color', value: formatText(item.Color) },
                { label: 'UOM', value: formatText(item.UOM) },
                { label: 'Drawing No', value: formatText(item.DrawingNo) },
              ]}
            />
          </PanelSection>
          <PanelSection title="Tax & pricing">
            <DetailList
              items={[
                { label: 'HSN Code', value: formatText(item.HSNCODE), numeric: true },
                { label: 'GST Rate', value: formatDecimal(item.GSTRate), numeric: true },
                { label: 'Purchase Cost', value: formatDecimal(item.PurchaseCost), numeric: true },
                { label: 'Selling Price', value: formatDecimal(item.SellingPrice), numeric: true },
              ]}
            />
          </PanelSection>
          <PanelSection title="Specification">
            <DetailList items={[{ label: 'Specification', value: formatText(item.Specification), full: true }]} />
          </PanelSection>
          <PanelSection title="References" description="Raw id values; lookup tables are not confirmed">
            <DetailList
              items={[
                { label: 'CategoryId', value: formatInteger(item.CategoryId), tbd: FK_TBD, numeric: true },
                { label: 'SubCategoryId', value: formatInteger(item.SubCategoryId), tbd: FK_TBD, numeric: true },
                { label: 'ManufacturerId', value: formatInteger(item.ManufacturerId), tbd: FK_TBD, numeric: true },
                { label: 'ColourId', value: formatInteger(item.ColourId), tbd: FK_TBD, numeric: true },
                { label: 'UnitId', value: formatInteger(item.UnitId), tbd: FK_TBD, numeric: true },
              ]}
            />
          </PanelSection>
          <PanelSection title="Record">
            <DetailList
              items={[
                { label: 'ID', value: String(item.ID), numeric: true },
                { label: 'Username', value: formatText(item.Username), tbd: AUDIT_TBD },
                { label: 'LoginBranch', value: formatText(item.LoginBranch), tbd: AUDIT_TBD },
                { label: 'SystEmentryDate', value: formatDateTime(item.SystEmentryDate), tbd: AUDIT_TBD, numeric: true },
                { label: 'UserId', value: formatInteger(item.UserId), tbd: AUDIT_TBD, numeric: true },
                { label: 'BranchId', value: formatInteger(item.BranchId), tbd: AUDIT_TBD, numeric: true },
              ]}
            />
          </PanelSection>
        </Panel>
        <Alert tone="info" title="Supplier/Customer mappings">
          Saved mappings can't be shown yet: mapping persistence is pending Spidosoft confirmation (docs/10 §9-3).
        </Alert>
      </div>
    </div>
  )
}

function ItemEdit({ item, onDone }: { item: ItemMaster; onDone: () => void }) {
  const toast = useToast()
  const navigate = useNavigate()
  const updateItem = useUpdateItem(item.ID)

  const onSubmit = async (values: ItemFormValues, mappingRows: MappingGridRow[]) => {
    try {
      const updated = await updateItem.mutateAsync(formValuesToItemWrite(values, item))
      toast.show({ tone: 'success', title: 'Item saved.', message: `${updated.ItemCode} was updated in the mock data source (not a database).` })
      if (mappingRows.length > 0) {
        toast.show({
          tone: 'warning',
          title: `${mappingRows.length} mapping ${mappingRows.length === 1 ? 'row was' : 'rows were'} not saved.`,
          message: 'Mapping persistence is pending Spidosoft confirmation (docs/10 §9-3).',
        })
      }
      if (updated.ID !== item.ID) navigate(`/masters/items/${updated.ID}`)
      onDone()
    } catch (error) {
      toast.show({ tone: 'danger', title: "Item couldn't be saved.", message: toApiError(error).message })
    }
  }

  return (
    <>
      <PageHeader title={`Edit ${item.ItemCode}`} />
      <ItemForm defaultValues={itemToFormInput(item)} onSubmit={onSubmit} onCancel={onDone} />
    </>
  )
}
