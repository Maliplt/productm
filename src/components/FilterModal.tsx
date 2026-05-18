import { Modal, AutoComplete, List, Stack, IconButton, Tooltip, Whisper } from 'rsuite'
import { useState } from 'react'
import { Pencil, Trash2, Eye } from 'lucide-react'
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

  const data = products.map(p => p.name)
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title style={{ fontWeight: 'bold' }}>Ürün Filtrele & Yönet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: '20px' }}>
          <AutoComplete 
            data={data} 
            value={search} 
            onChange={setSearch} 
            placeholder="Ara.." 
            style={{ width: '100%' }}
          />
        </div>
        
        <List hover style={{ border: '1px solid #e2e8f0', borderRadius: '6px', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredProducts.map(product => (
            <List.Item key={product.id} style={{ padding: '12px 16px' }}>
              <Stack justifyContent="space-between" alignItems="center">
                <Stack spacing={12}>
                  <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{product.category} - {product.price.toLocaleString('tr-TR')}₺</div>
                  </div>
                </Stack>
                <Stack spacing={6}>
                  <Whisper placement="top" speaker={<Tooltip>Detay</Tooltip>}>
                    <IconButton icon={<Eye size={18} />} circle size="sm" appearance="subtle" onClick={() => { onView(product); onClose(); }} />
                  </Whisper>
                  <Whisper placement="top" speaker={<Tooltip>Düzenle</Tooltip>}>
                    <IconButton icon={<Pencil size={18} />} circle size="sm" appearance="subtle" color="blue" onClick={() => { onEdit(product); onClose(); }} />
                  </Whisper>
                  <Whisper placement="top" speaker={<Tooltip>Sil</Tooltip>}>
                    <IconButton icon={<Trash2 size={18} />} circle size="sm" appearance="subtle" color="red" onClick={() => {
                       if(confirm('Silmek istediğinize emin misiniz?')) { onDelete(product.id) }
                    }} />
                  </Whisper>
                </Stack>
              </Stack>
            </List.Item>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Sonuç bulunamadı</div>
          )}
        </List>
      </Modal.Body>
    </Modal>
  )
}
