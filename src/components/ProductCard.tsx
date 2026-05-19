import { Panel, Stack, Tag } from 'rsuite'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Panel
      bordered
      bodyFill
      className="flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
      style={{ '--tw-ring-color': '#f97316' } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="w-full h-40 bg-slate-50 border-b border-slate-200 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 text-sm">Görsel Yok</span>
        )}
      </div>
      <Panel>
        <Stack justifyContent="space-between" alignItems="flex-start" className="mb-2">
          <h6 className="m-0 text-sm font-bold text-slate-900">{product.name}</h6>
          <span style={{ color: '#f97316', fontWeight: 700, fontSize: '14px' }}>{product.price.toLocaleString('tr-TR')}₺</span>
        </Stack>
        <p className="text-slate-500 text-xs mb-1">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
        <Stack justifyContent="space-between" className="pt-3 border-t border-slate-100">
          <span className="text-slate-500 text-xs">Stok Durumu</span>
          <Tag color={product.quantity < 5 ? 'red' : 'green'}>
            {product.quantity} adet
          </Tag>
        </Stack>
      </Panel>
    </Panel>
  )
}
