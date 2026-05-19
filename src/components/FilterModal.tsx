import { Modal, List, Stack, Tooltip, Whisper } from 'rsuite'
import { useState } from 'react'
import { Pencil, Trash2, Eye, Search, Filter } from 'lucide-react'
import type { Product } from '../types/product'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onView: (product: Product) => void
}

export default function FilterModal({ isOpen, onClose, products, onEdit, onDelete, onView }: FilterModalProps) {
  const [search, setSearch] = useState('')

  const lastThree = [...products].slice(-3).reverse()

  const searchResults = search.trim()
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 3)
    : lastThree

  const handleClose = () => {
    setSearch('')
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="md">
      <Modal.Header>
        <Modal.Title>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={22} />
            Ürün Filtrele &amp; Yönet
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="filter-search-wrap" style={{ marginBottom: '20px' }}>
          <div className="filter-search-box">
            <Search size={18} className="filter-search-icon" />
            <input
              className="filter-search-input"
              type="text"
              placeholder="Ürün adı veya kategoriye göre ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="filter-count-badge">
            {search.trim() ? `${searchResults.length} sonuç` : 'Son 3 ürün'}
          </span>
        </div>

        <List hover style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {searchResults.map(product => (
            <List.Item key={product.id} style={{ padding: '14px 18px' }}>
              <Stack justifyContent="space-between" alignItems="center">
                <Stack spacing={14}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '10px' }}>Yok</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', marginRight: '6px' }}>{product.category}</span>
                      <span style={{ color: '#f97316', fontWeight: 600 }}>{product.price.toLocaleString('tr-TR')}₺</span>
                    </div>
                  </div>
                </Stack>
                <Stack spacing={6}>
                  <Whisper placement="top" speaker={<Tooltip>Detay</Tooltip>}>
                    <button className="btn-icon btn-icon-view" onClick={() => { onView(product); handleClose() }}>
                      <Eye size={18} />
                    </button>
                  </Whisper>
                  <Whisper placement="top" speaker={<Tooltip>Düzenle</Tooltip>}>
                    <button className="btn-icon btn-icon-edit" onClick={() => { onEdit(product); handleClose() }}>
                      <Pencil size={18} />
                    </button>
                  </Whisper>
                  <Whisper placement="top" speaker={<Tooltip>Sil</Tooltip>}>
                    <button className="btn-icon btn-icon-delete" onClick={() => {
                      if (confirm('Silmek istediğinize emin misiniz?')) { onDelete(product.id) }
                    }}>
                      <Trash2 size={18} />
                    </button>
                  </Whisper>
                </Stack>
              </Stack>
            </List.Item>
          ))}
          {searchResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 32px', color: '#64748b' }}>
              <Search size={36} style={{ marginBottom: '12px', color: '#cbd5e1' }} />
              <div style={{ fontWeight: 500 }}>Sonuç bulunamadı</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Farklı bir arama terimi deneyin</div>
            </div>
          )}
        </List>
      </Modal.Body>
    </Modal>
  )
}
