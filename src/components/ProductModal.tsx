import { Modal, Button, Stack, Divider } from 'rsuite'
import { Pencil, Trash2 } from 'lucide-react'
import type { Product } from '../types/product'

interface ProductModalProps {
  product: Product | null   
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProductModalProps) {
  if (!product) return null

  function handleDelete() {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      onDelete(product!.id)
      onClose()
    }
  }

  function handleEdit() {
    onEdit(product!)
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title style={{ fontWeight: 'bold' }}>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {product.image && (
          <div style={{ width: '100%', height: '180px', marginBottom: '20px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <Stack direction="column" alignItems="stretch" spacing={12}>
          <Stack justifyContent="space-between">
            <span style={{ color: '#64748b' }}>Kategori</span>
            <span style={{ fontWeight: 'bold' }}>{product.category}</span>
          </Stack>
          <Divider style={{ margin: 0 }} />
          <Stack justifyContent="space-between">
            <span style={{ color: '#64748b' }}>Fiyat</span>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{product.price.toLocaleString('tr-TR')}₺</span>
          </Stack>
          <Divider style={{ margin: 0 }} />
          <Stack justifyContent="space-between">
            <span style={{ color: '#64748b' }}>Stok</span>
            <span style={{ fontWeight: 'bold', color: product.quantity < 5 ? '#dc2626' : 'inherit' }}>{product.quantity} adet</span>
          </Stack>
          
          <div style={{ marginTop: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Açıklama</span>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{product.description}</p>
          </div>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button appearance="ghost" color="red" startIcon={<Trash2 size={18} />} onClick={handleDelete} style={{ flex: 1 }}>
            Sil
          </Button>
          <Button appearance="ghost" color="blue" startIcon={<Pencil size={18} />} onClick={handleEdit} style={{ flex: 1 }}>
            Düzenle
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}