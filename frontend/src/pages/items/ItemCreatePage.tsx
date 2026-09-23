import { useNavigate } from 'react-router'
import { useToast } from '@/components/Toast/toastContext'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCreateItem } from '@/hooks/useItems'
import { toApiError } from '@/services/http/apiError'
import type { MappingGridRow } from '@/types/mapping'
import { ItemForm } from './components/ItemForm'
import { formValuesToItemWrite, type ItemFormValues } from './components/itemFormSchema'

export function ItemCreatePage() {
  useDocumentTitle('Create Item Master')
  const navigate = useNavigate()
  const toast = useToast()
  const createItem = useCreateItem()

  const onSubmit = async (values: ItemFormValues, mappingRows: MappingGridRow[]) => {
    try {
      const created = await createItem.mutateAsync(formValuesToItemWrite(values))
      toast.show({ tone: 'success', title: 'Item saved.', message: `${created.ItemCode} was saved to the mock data source (not a database).` })
      if (mappingRows.length > 0) {
        toast.show({
          tone: 'warning',
          title: `${mappingRows.length} mapping ${mappingRows.length === 1 ? 'row was' : 'rows were'} not saved.`,
          message: 'Mapping persistence is pending Spidosoft confirmation (docs/10 §9-3).',
        })
      }
      navigate(`/masters/items/${created.ID}`)
    } catch (error) {
      toast.show({ tone: 'danger', title: "Item couldn't be saved.", message: toApiError(error).message })
    }
  }

  return (
    <>
      <PageHeader title="Create Item Master" />
      <ItemForm onSubmit={onSubmit} onCancel={() => navigate('/masters/items')} />
    </>
  )
}
