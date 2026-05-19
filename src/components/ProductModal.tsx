import type { ReactNode } from 'react'
import { Modal, Divider } from 'rsuite'
import { Pencil, Trash2, Package, Tag, DollarSign, Archive, AlignLeft, Building2, Hash, Weight, ShieldCheck } from 'lucide-react'
import type { Product } from '../types/product'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductModal({ product, isOpen, onClose, onEdit, onDelete }: ProductModalProps) {
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

  const isLowStock = product.quantity < 5

  const detailRows = [
    { icon: <Tag size={16} />, label: 'Kategori', value: <span className="category-badge">{product.category}</span> },
    product.brand ? { icon: <Building2 size={16} />, label: 'Marka', value: product.brand } : null,
    product.sku ? { icon: <Hash size={16} />, label: 'SKU', value: product.sku } : null,
    {
      icon: <DollarSign size={16} />, label: 'Fiyat',
      value: <span className="price-value">{product.price.toLocaleString('tr-TR')}₺</span>,
    },
    {
      icon: <Archive size={16} />, label: 'Stok',
      value: (
        <span className={isLowStock ? 'stock-low' : 'stock-ok'}>
          {product.quantity} adet {isLowStock && <span className="stock-warning-badge">Kritik</span>}
        </span>
      ),
    },
    product.weight ? { icon: <Weight size={16} />, label: 'Ağırlık', value: product.weight } : null,
    product.warranty ? { icon: <ShieldCheck size={16} />, label: 'Garanti', value: product.warranty } : null,
  ].filter(Boolean) as { icon: ReactNode; label: string; value: ReactNode }[]

  return (
    <Modal open={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} />
            Ürün Detayı
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {product.image && (
          <div style={{ width: '100%', height: '220px', background: '#f8fafc', overflow: 'hidden', borderBottom: '1px solid #e2e8f0' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '20px 24px 0' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{product.name}</h2>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {detailRows.map((row, i) => (
            <div key={i}>
              <div className="product-detail-row">
                <span className="product-detail-label">{row.icon} {row.label}</span>
                <span className="product-detail-value">{row.value}</span>
              </div>
              {i < detailRows.length - 1 && <Divider style={{ margin: '8px 0' }} />}
            </div>
          ))}

          {product.description && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ marginTop: '4px' }}>
                <div className="product-detail-label" style={{ marginBottom: '8px' }}>
                  <AlignLeft size={16} /> Açıklama
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>{product.description}</p>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button className="btn btn-danger-outline" style={{ flex: 1 }} onClick={handleDelete}>
            <Trash2 size={18} />
            Sil
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleEdit}>
            <Pencil size={18} />
            Düzenle
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}