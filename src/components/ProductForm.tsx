import { Modal, Form, NumberInput, Input } from 'rsuite'
import { useState } from 'react'
import { PackagePlus, Pencil, X, Save, Eye } from 'lucide-react'
import type { Product } from '../types/product'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void
  onViewDetail?: (product: Product) => void
  editProduct: Product | null
}

interface ProductFormValue {
  name: string
  category: string
  price: string
  quantity: string
  description: string
  image: string
  brand: string
  sku: string
  weight: string
  warranty: string
}

const emptyForm: ProductFormValue = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  description: '',
  image: '',
  brand: '',
  sku: '',
  weight: '',
  warranty: '',
}

export default function ProductForm({ isOpen, onClose, onSave, onViewDetail, editProduct }: ProductFormProps) {
  const [formValue, setFormValue] = useState<ProductFormValue>(() => editProduct ? {
    name: editProduct.name,
    category: editProduct.category,
    price: String(editProduct.price),
    quantity: String(editProduct.quantity),
    description: editProduct.description,
    image: editProduct.image || '',
    brand: editProduct.brand || '',
    sku: editProduct.sku || '',
    weight: editProduct.weight || '',
    warranty: editProduct.warranty || '',
  } : emptyForm)

  function handleChange(field: keyof ProductFormValue, value: string | number | null) {
    setFormValue(prev => ({ ...prev, [field]: String(value ?? '') }))
  }

  function handleSubmit() {
    onSave({
      name: formValue.name,
      category: formValue.category,
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      description: formValue.description,
      image: formValue.image,
      brand: formValue.brand,
      sku: formValue.sku,
      weight: formValue.weight,
      warranty: formValue.warranty,
    })
    onClose()
  }

  const isEditing = editProduct !== null

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isEditing ? <Pencil size={22} /> : <PackagePlus size={22} />}
            {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group>
            <Form.Label>Ürün Adı</Form.Label>
            <Input value={formValue.name} onChange={v => handleChange('name', v)} placeholder="Ürün adını giriniz" />
          </Form.Group>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Kategori</Form.Label>
              <Input value={formValue.category} onChange={v => handleChange('category', v)} placeholder="Kategori" />
            </Form.Group>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Marka</Form.Label>
              <Input value={formValue.brand} onChange={v => handleChange('brand', v)} placeholder="Marka" />
            </Form.Group>
          </div>

          <Form.Group style={{ marginTop: '16px' }}>
            <Form.Label>Görsel URL</Form.Label>
            <Input value={formValue.image} onChange={v => handleChange('image', v)} placeholder="https://..." />
          </Form.Group>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Fiyat (₺)</Form.Label>
              <NumberInput value={formValue.price} onChange={v => handleChange('price', v)} min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Group>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Stok Adedi</Form.Label>
              <NumberInput value={formValue.quantity} onChange={v => handleChange('quantity', v)} min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Group>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>SKU</Form.Label>
              <Input value={formValue.sku} onChange={v => handleChange('sku', v)} placeholder="Ürün kodu" />
            </Form.Group>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Ağırlık</Form.Label>
              <Input value={formValue.weight} onChange={v => handleChange('weight', v)} placeholder="1.5 kg" />
            </Form.Group>
            <Form.Group style={{ marginBottom: 0 }}>
              <Form.Label>Garanti</Form.Label>
              <Input value={formValue.warranty} onChange={v => handleChange('warranty', v)} placeholder="1 Yıl" />
            </Form.Group>
          </div>

          <Form.Group style={{ marginTop: '16px' }}>
            <Form.Label>Açıklama</Form.Label>
            <Input as="textarea" rows={3} value={formValue.description} onChange={v => handleChange('description', v)} placeholder="Ürün hakkında açıklama..." />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            <X size={18} />
            İptal
          </button>
          {isEditing && onViewDetail && (
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onViewDetail(editProduct!)}>
              <Eye size={18} />
              İncele
            </button>
          )}
          <button className="btn btn-orange" style={{ flex: 2 }} onClick={handleSubmit}>
            <Save size={18} />
            {isEditing ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}