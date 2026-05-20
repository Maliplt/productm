import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Table, Pagination, useToaster, Message } from 'rsuite'
import { MoreVertical, Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
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

type SortColumn = 'name' | 'category' | 'price' | 'quantity' | 'createdAt' | null
type SortDir = 'asc' | 'desc'

const ImageCell = ({ rowData, dataKey, ...props }: ImageCellProps) => {
  const imageUrl = rowData && dataKey ? (rowData[dataKey] as string) : undefined
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div style={{ width: '52px', height: '52px', background: '#f1f5f9', borderRadius: '3px', marginTop: '14px', overflow: 'hidden', display: 'inline-block', border: '1px solid #e2e8f0' }}>
        {imageUrl ? (
          <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Yok</span>
        )}
      </div>
    </Cell>
  )
}

function ActionMenu({ product, onView, onEdit, onDelete }: {
  product: Product
  onView: (p: Product) => void
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen(o => !o)
  }

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: pos.top,
    right: pos.right,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '3px',
    boxShadow: '0 4px 20px rgba(15,23,42,0.12)',
    zIndex: 9999,
    minWidth: '140px',
    overflow: 'hidden',
  }

  const itemBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', padding: '9px 14px',
    border: 'none', background: 'none',
    cursor: 'pointer', fontSize: '13px',
    fontFamily: 'inherit', textAlign: 'left',
  }

  return (
    <>
      <button
        ref={btnRef}
        className="btn-icon"
        style={{ border: '1px solid #e2e8f0', borderRadius: '3px' }}
        onClick={handleToggle}
      >
        <MoreVertical size={18} />
      </button>

      {open && createPortal(
        <div ref={menuRef} style={menuStyle}>
          <button
            style={{ ...itemBase, color: '#334155' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={e => { e.stopPropagation(); setOpen(false); onView(product) }}
          >
            <Eye size={15} style={{ color: '#6366f1' }} /> Detay
          </button>
          <button
            style={{ ...itemBase, color: '#334155' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={e => { e.stopPropagation(); setOpen(false); onEdit(product) }}
          >
            <Pencil size={15} style={{ color: '#f97316' }} /> Düzenle
          </button>
          <div style={{ height: '1px', background: '#f1f5f9' }} />
          <button
            style={{ ...itemBase, color: '#ef4444' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            onClick={e => { e.stopPropagation(); setOpen(false); onDelete(product) }}
          >
            <Trash2 size={15} /> Sil
          </button>
        </div>,
        document.body
      )}
    </>
  )
}

function SortHeader({ label, column, sortCol, sortDir, onSort }: {
  label: string; column: SortColumn; sortCol: SortColumn; sortDir: SortDir; onSort: (c: SortColumn) => void
}) {
  const active = sortCol === column
  return (
    <button
      onClick={() => onSort(column)}
      style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 0, fontSize: 'inherit', fontWeight: 'inherit',
        color: active ? '#6366f1' : 'inherit', fontFamily: 'inherit',
      }}
    >
      {label}
      {active
        ? (sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />)
        : <ArrowUpDown size={13} style={{ opacity: 0.4 }} />}
    </button>
  )
}

export default function ProductTable({ products, onEdit, onDelete, onView }: ProductTableProps) {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortCol, setSortCol] = useState<SortColumn>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const toaster = useToaster()

  function handleSort(col: SortColumn) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(1)
  }

  const sorted = [...products].sort((a, b) => {
    if (!sortCol) return 0
    const va = a[sortCol as keyof Product]
    const vb = b[sortCol as keyof Product]
    if (va === undefined || vb === undefined) return 0
    const cmp = String(va).localeCompare(String(vb), 'tr', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const data = sorted.filter((_v, i) => {
    const start = limit * (page - 1)
    return i >= start && i < start + limit
  })

  function handleDelete(product: Product) {
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

  return (
    <div style={{ background: '#fff', borderRadius: '3px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.06)', overflow: 'visible' }}>
      <Table
        autoHeight
        data={data}
        id="table"
        rowHeight={80}
        onRowClick={rowData => onView(rowData as Product)}
        rowClassName={() => 'cursor-pointer hover:bg-slate-50 transition-colors'}
        style={{ borderRadius: '3px' }}
      >
        <Column width={60} align="center" verticalAlign="middle">
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" className="text-slate-500 font-mono" />
        </Column>

        <Column width={80} align="center">
          <HeaderCell>Görsel</HeaderCell>
          <ImageCell dataKey="image" />
        </Column>

        <Column flexGrow={2} verticalAlign="middle" minWidth={180}>
          <HeaderCell>
            <SortHeader label="Ürün Adı" column="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </HeaderCell>
          <Cell dataKey="name" className="font-medium" />
        </Column>

        <Column flexGrow={1} verticalAlign="middle" minWidth={120}>
          <HeaderCell>
            <SortHeader label="Kategori" column="category" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </HeaderCell>
          <Cell>
            {rowData => (
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>
                {rowData.category}
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={1} verticalAlign="middle" minWidth={110}>
          <HeaderCell>
            <SortHeader label="Fiyat" column="price" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </HeaderCell>
          <Cell>
            {rowData => <span style={{ fontWeight: 600, color: '#f97316' }}>{(rowData.price as number).toLocaleString('tr-TR')}₺</span>}
          </Cell>
        </Column>

        <Column flexGrow={1} verticalAlign="middle" minWidth={100}>
          <HeaderCell>
            <SortHeader label="Stok" column="quantity" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </HeaderCell>
          <Cell>
            {rowData => (
              <span style={{ color: (rowData.quantity as number) < 5 ? '#ef4444' : '#16a34a', fontWeight: (rowData.quantity as number) < 5 ? 700 : 500 }}>
                {rowData.quantity} adet
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={1} verticalAlign="middle" minWidth={110}>
          <HeaderCell>
            <SortHeader label="Tarih" column="createdAt" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </HeaderCell>
          <Cell dataKey="createdAt" className="text-slate-500 text-sm" />
        </Column>

        <Column width={72} align="center" verticalAlign="middle">
          <HeaderCell>İşlem</HeaderCell>
          <Cell style={{ padding: '22px 12px', overflow: 'visible' }}>
            {rowData => (
              <ActionMenu
                product={rowData as Product}
                onView={p => onView(p)}
                onEdit={p => onEdit(p)}
                onDelete={p => handleDelete(p)}
              />
            )}
          </Cell>
        </Column>
      </Table>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #e2e8f0' }}>
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
