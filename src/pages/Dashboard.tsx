import { useState } from 'react'
import { Container, Content, Input, InputGroup, Button, Grid, Row, Col, Panel, Tabs } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import PlusIcon from '@rsuite/icons/Plus'
import ListIcon from '@rsuite/icons/List'
import AppSelectIcon from '@rsuite/icons/AppSelect'
import type { Product } from '../types/product'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import ProductForm from '../components/ProductForm'
import ProductTable from '../components/ProductTable'
import FilterModal from '../components/FilterModal'
import Header from '../components/Header'
import Footer from '../components/Footer'

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    category: 'Laptop',
    price: 65000,
    quantity: 8,
    description: 'Apple M3 Pro işlemci, 18GB RAM, 512GB SSD. Profesyonel kullanım için ideal.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-01',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    category: 'Telefon',
    price: 52000,
    quantity: 3,
    description: 'A17 Pro çip, 256GB depolama, Titanyum kasa, USB-C bağlantı.',
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-05',
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    category: 'Aksesuar',
    price: 9500,
    quantity: 20,
    description: 'Aktif gürültü engelleme, Uyarlanabilir Ses, MagSafe şarj kutusu.',
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-10',
  },
  {
    id: 4,
    name: 'iPad Air M2',
    category: 'Tablet',
    price: 28000,
    quantity: 2,
    description: 'M2 işlemci, 10.9 inç Liquid Retina ekran, Wi-Fi 6.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-12',
  },
  {
    id: 5,
    name: 'Magic Keyboard',
    category: 'Aksesuar',
    price: 4200,
    quantity: 15,
    description: 'Touch ID ve sayısal tuş takımı ile, Türkçe Q klavye.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-15',
  },
  {
    id: 6,
    name: 'Apple Watch S9',
    category: 'Saat',
    price: 18000,
    quantity: 4,
    description: 'S9 çip, Always-On Retina ekran, kan oksijeni ve EKG sensörü.',
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-18',
  },
]

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<string>('table')

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  function handleSave(data: Omit<Product, 'id' | 'createdAt'>) {
    if (editingProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, ...data } : p))
      )
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1
      const today = new Date().toISOString().split('T')[0]
      setProducts(prev => [...prev, { ...data, id: newId, createdAt: today }])
    }
  }

  function handleDelete(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id))
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
  const lowStockCount = products.filter(p => p.quantity < 3).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <Container className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLogout={onLogout} />
      <Content style={{ padding: '32px 24px', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Grid fluid style={{ marginBottom: '32px' }}>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Panel bordered style={{ background: '#fff' }}>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Toplam Ürün</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{products.length}</div>
                </Panel>
              </Col>
              <Col xs={12} sm={6}>
                <Panel bordered style={{ background: '#fff' }}>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Toplam Stok</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalStock}</div>
                </Panel>
              </Col>
              <Col xs={12} sm={6}>
                <Panel bordered style={{ background: '#fff' }}>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Düşük Stok</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: lowStockCount > 0 ? '#dc2626' : 'inherit' }}>{lowStockCount}</div>
                </Panel>
              </Col>
              <Col xs={12} sm={6}>
                <Panel bordered style={{ background: '#fff' }}>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Toplam Değer</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalValue.toLocaleString('tr-TR')}₺</div>
                </Panel>
              </Col>
            </Row>
          </Grid>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <InputGroup style={{ flex: 1, background: '#fff' }}>
              <InputGroup.Addon>
                <SearchIcon />
              </InputGroup.Addon>
              <Input 
                placeholder="Ürün adı veya kategoriye göre ara..." 
                value={search}
                onChange={v => setSearch(v)}
              />
            </InputGroup>
            <Button appearance="default" onClick={() => setIsFilterModalOpen(true)}>
              Filtre
            </Button>
            <Button appearance="primary" color="orange" startIcon={<PlusIcon />} onClick={openNewForm}>
              Yeni Ürün
            </Button>
          </div>

          <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key as string)} appearance="subtle" style={{ marginBottom: '20px' }}>
            <Tabs.Tab eventKey="table" title="Liste Görünümü" icon={<ListIcon />}>
              <div className="pt-4">
                {filteredProducts.length === 0 ? (
                  <Panel bordered style={{ textAlign: 'center', padding: '64px 0', background: '#fff' }}>
                    <p style={{ fontSize: '16px', color: '#64748b' }}>Ürün bulunamadı</p>
                  </Panel>
                ) : (
                  <ProductTable 
                    products={filteredProducts} 
                    onView={openDetailModal} 
                    onEdit={openEditForm} 
                    onDelete={handleDelete} 
                  />
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="grid" title="Grid Görünümü" icon={<AppSelectIcon />}>
              <div className="pt-4">
                {filteredProducts.length === 0 ? (
                  <Panel bordered style={{ textAlign: 'center', padding: '64px 0', background: '#fff' }}>
                    <p style={{ fontSize: '16px', color: '#64748b' }}>Ürün bulunamadı</p>
                  </Panel>
                ) : (
                  <Grid fluid>
                    <Row gutter={16}>
                      {filteredProducts.map(product => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id} style={{ marginBottom: '16px' }}>
                          <ProductCard
                            product={product}
                            onClick={() => openDetailModal(product)}
                          />
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
        editProduct={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        products={products}
        onEdit={openEditForm}
        onDelete={handleDelete}
        onView={openDetailModal}
      />
      <Footer />
    </Container>
  )
}


