import { useState } from 'react'
import { Table, Pagination, IconButton, Tooltip, Whisper, Stack } from 'rsuite'
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

  const handleChangeLimit = (dataLimit: number) => {
    setPage(1)
    setLimit(dataLimit)
  }

  const data = products.filter((_v, i) => {
    const start = limit * (page - 1)
    const end = start + limit
    return i >= start && i < end
  })

  function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      onDelete(id)
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
        onRowClick={(rowData) => onView(rowData as Product)}
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
             {(rowData) => (
               <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                 {rowData.category}
               </span>
             )}
          </Cell>
        </Column>

        <Column width={120} verticalAlign="middle">
          <HeaderCell>Fiyat</HeaderCell>
          <Cell>
            {(rowData) => <span className="font-semibold">{rowData.price.toLocaleString('tr-TR')}₺</span>}
          </Cell>
        </Column>

        <Column width={100} verticalAlign="middle">
          <HeaderCell>Stok</HeaderCell>
          <Cell>
            {(rowData) => (
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
            {(rowData) => (
              <Stack spacing={6} justifyContent="center">
                <Whisper placement="top" speaker={<Tooltip>Detay</Tooltip>}>
                  <IconButton 
                    icon={<Eye size={18} />} 
                    circle 
                    size="sm" 
                    appearance="subtle"
                    onClick={(e) => handleView(rowData as Product, e)}
                  />
                </Whisper>
                <Whisper placement="top" speaker={<Tooltip>Düzenle</Tooltip>}>
                  <IconButton 
                    icon={<Pencil size={18} />} 
                    circle 
                    size="sm" 
                    appearance="subtle" 
                    color="blue"
                    onClick={(e) => handleEdit(rowData as Product, e)}
                  />
                </Whisper>
                <Whisper placement="top" speaker={<Tooltip>Sil</Tooltip>}>
                  <IconButton 
                    icon={<Trash2 size={18} />} 
                    circle 
                    size="sm" 
                    appearance="subtle" 
                    color="red"
                    onClick={(e) => handleDelete((rowData as Product).id, e)}
                  />
                </Whisper>
              </Stack>
            )}
          </Cell>
        </Column>
      </Table>
      
      <div className="p-4 border-t border-slate-200">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="sm"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={products.length}
          limitOptions={[10, 20, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  )
}
