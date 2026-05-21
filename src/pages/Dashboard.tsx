import { useState } from 'react'
import { Container, Content, Input, InputGroup, Grid, Row, Col, Panel, Tabs } from 'rsuite'
import { Search, Plus, List as ListIcon, LayoutGrid, Filter, Package, Boxes, AlertTriangle, TrendingUp, Eye as EyeIcon, X, Upload } from 'lucide-react'
import type { Product } from '../types/product'
import initialProducts from '../data/products.json'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import ProductForm from '../components/ProductForm'
import ProductTable from '../components/ProductTable'
import FilterModal from '../components/FilterModal'
import CsvImportModal from '../components/CsvImportModal'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts as Product[])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('table')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    const matchLowStock = lowStockOnly ? p.quantity < 5 : true
    return matchSearch && matchLowStock
  })

  function handleSave(data: Omit<Product, 'id' | 'createdAt'>) {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1
      const today = new Date().toISOString().split('T')[0]
      setProducts(prev => [...prev, { ...data, id: newId, createdAt: today }])
    }
  }

  function handleDelete(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function handleImportCsv(newItems: Omit<Product, 'id' | 'createdAt'>[]) {
    setProducts(prev => {
      let currentMaxId = Math.max(0, ...prev.map(p => p.id))
      const today = new Date().toISOString().split('T')[0]
      
      const itemsWithIds = newItems.map(item => {
        currentMaxId++
        return {
          ...item,
          id: currentMaxId,
          createdAt: today
        }
      })
      
      return [...prev, ...itemsWithIds]
    })
  }

  function openDetailModal(product: Product) {
    setSelectedProduct(product)
    setIsDetailOpen(true)
  }

  function openEditForm(product: Product) {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  function openNewForm() {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockCount = products.filter(p => p.quantity < 5).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const statCards = [
    { label: 'Toplam Ürün', value: products.length, icon: <Package size={22} />, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { label: 'Toplam Stok', value: totalStock, icon: <Boxes size={22} />, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    {
      label: 'Düşük Stok', value: lowStockCount, icon: <AlertTriangle size={22} />,
      gradient: lowStockCount > 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #94a3b8, #64748b)',
      valueColor: lowStockCount > 0 ? '#dc2626' : '#0f172a',
      hasEyeFilter: true,
    },
    { label: 'Toplam Değer', value: `${totalValue.toLocaleString('tr-TR')}₺`, icon: <TrendingUp size={22} />, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', fontSize: '20px' },
  ]

  return (
    <Container className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLogout={onLogout} />
      <Content style={{ padding: '12px 16px', flex: 1 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          <Grid fluid style={{ marginBottom: '12px' }}>
            <Row gutter={16}>
              {statCards.map((card, i) => (
                <Col span={{ xs: 12, sm: 6 }} key={i}>
                  <Panel bordered style={{ background: '#fdfbf7', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '3px', background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        {card.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>{card.label}</div>
                        <div style={{ fontSize: (card as { fontSize?: string }).fontSize ?? '24px', fontWeight: 'bold', color: (card as { valueColor?: string }).valueColor ?? '#0f172a' }}>{card.value}</div>
                      </div>
                      {(card as { hasEyeFilter?: boolean }).hasEyeFilter && (
                        <button
                          className="btn-icon"
                          title={lowStockOnly ? 'Tüm ürünleri göster' : 'Yalnızca düşük stokları göster'}
                          onClick={() => setLowStockOnly(v => !v)}
                          style={{ borderRadius: '3px', border: lowStockOnly ? '1.5px solid #ef4444' : '1px solid #e2e8f0', color: lowStockOnly ? '#ef4444' : '#94a3b8', background: lowStockOnly ? '#fef2f2' : 'transparent' }}
                        >
                          {lowStockOnly ? <X size={16} /> : <EyeIcon size={16} />}
                        </button>
                      )}
                    </div>
                  </Panel>
                </Col>
              ))}
            </Row>
          </Grid>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
            <InputGroup style={{ flex: 1, background: '#fdfbf7' }}>
              <InputGroup.Addon>
                <Search size={20} />
              </InputGroup.Addon>
              <Input
                placeholder="Ürün adı veya kategoriye göre ara..."
                value={search}
                onChange={v => setSearch(v)}
              />
            </InputGroup>
            <button className="btn btn-filter" onClick={() => setIsFilterModalOpen(true)}>
              <Filter size={18} />
              Filtrele
            </button>
            <button className="btn btn-orange" onClick={openNewForm}>
              <Plus size={20} />
              Yeni Ürün
            </button>
            <button className="btn btn-ghost" onClick={() => setIsCsvModalOpen(true)}>
              <Upload size={18} />
              CSV ile Aktar
            </button>
          </div>

          <Tabs activeKey={activeTab} onSelect={key => setActiveTab(key as string)} appearance="subtle" style={{ marginBottom: '8px' }}>
            <Tabs.Tab eventKey="table" title="Liste Görünümü" icon={<ListIcon size={18} />}>
              <div className="pt-2">
                {filteredProducts.length === 0 ? (
                  <Panel bordered style={{ textAlign: 'center', padding: '32px 0', background: '#fdfbf7' }}>
                    <p style={{ fontSize: '16px', color: '#64748b' }}>Ürün bulunamadı</p>
                  </Panel>
                ) : (
                  <ProductTable products={filteredProducts} onView={openDetailModal} onEdit={openEditForm} onDelete={handleDelete} />
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="grid" title="Grid Görünümü" icon={<LayoutGrid size={18} />}>
              <div className="pt-2">
                {filteredProducts.length === 0 ? (
                  <Panel bordered style={{ textAlign: 'center', padding: '32px 0', background: '#fdfbf7' }}>
                    <p style={{ fontSize: '16px', color: '#64748b' }}>Ürün bulunamadı</p>
                  </Panel>
                ) : (
                  <Grid fluid>
                    <Row gutter={16}>
                      {filteredProducts.map(product => (
                        <Col span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={product.id} style={{ marginBottom: '16px' }}>
                          <ProductCard product={product} onClick={() => openDetailModal(product)} />
                        </Col>
                      ))}
                    </Row>
                  </Grid>
                )}
              </div>
            </Tabs.Tab>
          </Tabs>
        </div>
      </Content>

      <ProductModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />
      <ProductForm
        key={isFormOpen ? `form-${editingProduct?.id || 'new'}` : 'form-closed'}
        editProduct={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        onViewDetail={product => { setIsFormOpen(false); openDetailModal(product) }}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        products={products}
        onEdit={openEditForm}
        onDelete={handleDelete}
        onView={openDetailModal}
      />
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={handleImportCsv}
      />
      <Footer />
    </Container>
  )
}
