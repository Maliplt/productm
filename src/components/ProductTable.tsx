import { useState } from 'react'
import { Table, Pagination, Tooltip, Whisper, useToaster, Message } from 'rsuite'
import { Pencil, Trash2, Eye } from 'lucide-react'
import type { Product } from '../types/product'

const { Column, HeaderCell, Cell } = Table

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onView: (product: Product) => void
}

interface ImageCellProps {
  rowData?: Record<string, unknown>
  dataKey?: string
  [key: string]: unknown
}

const ImageCell = ({ rowData, dataKey, ...props }: ImageCellProps) => {
  const imageUrl = rowData && dataKey ? (rowData[dataKey] as string) : undefined
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div className="w-16 h-16 bg-slate-100 rounded mt-2 overflow-hidden inline-block border border-slate-200">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] text-slate-400 flex items-center justify-center h-full">Yok</span>
        )}
      </div>
    </Cell>
  )
}

export default function ProductTable({ products, onEdit, onDelete, onView }: ProductTableProps) {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const toaster = useToaster()

  const data = products.filter((_v, i) => {
    const start = limit * (page - 1)
    return i >= start && i < start + limit
  })

  function handleDelete(product: Product, e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`"${product.name}" silinecek. Onaylıyor musunuz?`)) {
      onDelete(product.id)
      toaster.push(
        <Message type="success" showIcon duration={3000}>
          "{product.name}" başarıyla silindi.
        </Message>,
        { placement: 'topEnd' }
      )
    }
  }

  function handleEdit(product: Product, e: React.MouseEvent) {
    e.stopPropagation()
    onEdit(product)
  }

  function handleView(product: Product, e: React.MouseEvent) {
    e.stopPropagation()
    onView(product)
  }

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <Table
        autoHeight
        data={data}
        id="table"
        rowHeight={80}
        onRowClick={rowData => onView(rowData as Product)}
        rowClassName={() => 'cursor-pointer hover:bg-slate-50 transition-colors'}
      >
        <Column width={60} align="center" verticalAlign="middle">
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" className="text-slate-500 font-mono" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>Görsel</HeaderCell>
          <ImageCell dataKey="image" />
        </Column>

        <Column width={250} flexGrow={1} verticalAlign="middle">
          <HeaderCell>Ürün Adı</HeaderCell>
          <Cell dataKey="name" className="font-medium" />
        </Column>

        <Column width={130} verticalAlign="middle">
          <HeaderCell>Kategori</HeaderCell>
          <Cell>
            {rowData => (
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                {rowData.category}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={120} verticalAlign="middle">
          <HeaderCell>Fiyat</HeaderCell>
          <Cell>
            {rowData => <span className="font-semibold" style={{ color: '#f97316' }}>{rowData.price.toLocaleString('tr-TR')}₺</span>}
          </Cell>
        </Column>

        <Column width={100} verticalAlign="middle">
          <HeaderCell>Stok</HeaderCell>
          <Cell>
            {rowData => (
              <span className={rowData.quantity < 5 ? 'text-red-600 font-bold' : 'text-green-600 font-medium'}>
                {rowData.quantity} adet
              </span>
            )}
          </Cell>
        </Column>

        <Column width={120} verticalAlign="middle">
          <HeaderCell>Tarih</HeaderCell>
          <Cell dataKey="createdAt" className="text-slate-500 text-sm" />
        </Column>

        <Column width={140} align="center" verticalAlign="middle">
          <HeaderCell>İşlem</HeaderCell>
          <Cell style={{ padding: '22px' }}>
            {rowData => (
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                <Whisper placement="top" speaker={<Tooltip>Detay</Tooltip>}>
                  <button className="btn-icon btn-icon-view" onClick={e => handleView(rowData as Product, e)}>
                    <Eye size={20} />
                  </button>
                </Whisper>
                <Whisper placement="top" speaker={<Tooltip>Düzenle</Tooltip>}>
                  <button className="btn-icon btn-icon-edit" onClick={e => handleEdit(rowData as Product, e)}>
                    <Pencil size={20} />
                  </button>
                </Whisper>
                <Whisper placement="top" speaker={<Tooltip>Sil</Tooltip>}>
                  <button className="btn-icon btn-icon-delete" onClick={e => handleDelete(rowData as Product, e)}>
                    <Trash2 size={20} />
                  </button>
                </Whisper>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <div className="p-4 border-t border-slate-200">
        <Pagination
          prev next first last ellipsis boundaryLinks
          maxButtons={5}
          size="sm"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={products.length}
          limitOptions={[5, 10, 20, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={dataLimit => { setPage(1); setLimit(dataLimit) }}
          locale={{
            total: 'Toplam {0} kayıt',
            limit: '{0} / sayfa',
            skip: 'Sayfaya git',
            first: 'İlk',
            last: 'Son',
            prev: 'Önceki',
            next: 'Sonraki',
          }}
        />
      </div>
    </div>
  )
}
