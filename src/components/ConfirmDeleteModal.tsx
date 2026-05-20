import { Modal } from 'rsuite'
import { Trash2 } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  productName: string
  categoryName?: string //bos olabilir
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({ isOpen, productName, categoryName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <Modal open={isOpen} onClose={onCancel} size="sm">
      <Modal.Header>
        <Modal.Title>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
            <Trash2 size={18} />
            Ürünü Sil
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
          <strong>{productName}</strong> <strong>{categoryName}</strong> silinecek. Bu işlem geri alınamaz.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
            İptal
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm}>
            <Trash2 size={16} />
            Sil
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
