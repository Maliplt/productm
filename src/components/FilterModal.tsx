import { Modal, List, Stack, Tooltip, Whisper, AutoComplete, SelectPicker } from 'rsuite'
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const categories = [...new Set(products.map(p => p.category))].map(c => ({ label: c, value: c }))
  const brands = [...new Set(products.filter(p => p.brand).map(p => p.brand as string))].map(b => ({ label: b, value: b }))

  const autocompleteData = products.map(p => ({ label: p.name, value: p.name }))

  const isFiltering = search.trim() !== '' || selectedCategory !== null || selectedBrand !== null

  const searchResults = isFiltering
    ? products.filter(p => {
        const matchSearch = search.trim()
          ? p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
          : true
        const matchCategory = selectedCategory ? p.category === selectedCategory : true
        const matchBrand = selectedBrand ? p.brand === selectedBrand : true
        return matchSearch && matchCategory && matchBrand
      })
    : []

  const handleClose = () => {
    setSearch('')
    setSelectedCategory(null)
    setSelectedBrand(null)
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
        <div style={{ marginBottom: '16px' }}>
          <AutoComplete
            data={autocompleteData}
            value={search}
            onChange={val => setSearch(val)}
            placeholder="Ürün adı veya kategoriye göre ara..."
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <SelectPicker
            data={categories}
            value={selectedCategory}
            onChange={val => setSelectedCategory(val)}
            placeholder="Kategori seçin"
            cleanable
            block
          />
          <SelectPicker
            data={brands}
            value={selectedBrand}
            onChange={val => setSelectedBrand(val)}
            placeholder="Marka seçin"
            cleanable
            block
          />
        </div>

        {isFiltering && (
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              {searchResults.length} sonuç bulundu
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(''); setSelectedCategory(null); setSelectedBrand(null) }}
            >
              Temizle
            </button>
          </div>
        )}

        {!isFiltering ? (
          <div style={{ textAlign: 'center', padding: '48px 32px', color: '#64748b' }}>
            <Search size={36} style={{ marginBottom: '12px', color: '#cbd5e1' }} />
            <div style={{ fontWeight: 500 }}>Aramak için yazmaya başlayın</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>veya kategori / marka filtresi seçin</div>
          </div>
        ) : (
          <List hover style={{ borderRadius: '3px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 32px', color: '#64748b' }}>
                <Search size={36} style={{ marginBottom: '12px', color: '#cbd5e1' }} />
                <div style={{ fontWeight: 500 }}>Sonuç bulunamadı</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>Farklı bir arama terimi deneyin</div>
              </div>
            ) : (
              searchResults.map(product => (
                <List.Item key={product.id} style={{ padding: '14px 18px' }}>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Stack spacing={14}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '10px' }}>Yok</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                          <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '3px', marginRight: '6px' }}>{product.category}</span>
                          {product.brand && <span style={{ color: '#94a3b8', marginRight: '6px' }}>{product.brand}</span>}
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
              ))
            )}
          </List>
        )}
      </Modal.Body>
    </Modal>
  )
}
