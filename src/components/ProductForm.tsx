import { Modal, Form, Button, NumberInput, Input } from 'rsuite'
import { useState, useEffect } from 'react'
import type { Product } from '../types/product'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void
  editProduct: Product | null 
}

const emptyForm: Record<string, any> = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  description: '',
  image: '',
}

export default function ProductForm({ isOpen, onClose, onSave, editProduct }: ProductFormProps) {
  const [formValue, setFormValue] = useState<Record<string, any>>(emptyForm)

  useEffect(() => {
    if (isOpen) {
      if (editProduct) {
        setFormValue({
          name: editProduct.name,
          category: editProduct.category,
          price: String(editProduct.price),
          quantity: String(editProduct.quantity),
          description: editProduct.description,
          image: editProduct.image || '',
        })
      } else {
        setFormValue(emptyForm)
      }
    }
  }, [editProduct, isOpen])

  function handleChange(field: string, value: any) {
    setFormValue(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    onSave({
      name: formValue.name,
      category: formValue.category,
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      description: formValue.description,
      image: formValue.image,
    })
    onClose()
  }

  const isEditing = editProduct !== null

  return (
    <Modal open={isOpen} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title style={{ fontWeight: 'bold' }}>{isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Ürün Adı</Form.Label>
            <Input value={formValue.name} onChange={v => handleChange('name', v)} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Kategori</Form.Label>
            <Input value={formValue.category} onChange={v => handleChange('category', v)} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Görsel URL</Form.Label>
            <Input value={formValue.image} onChange={v => handleChange('image', v)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Fiyat</Form.Label>
            <NumberInput value={formValue.price} onChange={v => handleChange('price', v)} min={0} required style={{ width: '100%' }} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Stok Adedi</Form.Label>
            <NumberInput value={formValue.quantity} onChange={v => handleChange('quantity', v)} min={0} required style={{ width: '100%' }} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Açıklama</Form.Label>
            <Input as="textarea" rows={3} value={formValue.description} onChange={v => handleChange('description', v)} />
          </Form.Group>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button onClick={onClose} appearance="default" style={{ flex: 1 }}>İptal</Button>
            <Button type="submit" appearance="primary" color="blue" style={{ flex: 1 }}>{isEditing ? 'Güncelle' : 'Ekle'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}