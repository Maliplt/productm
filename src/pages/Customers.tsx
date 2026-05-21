import { Container, Content } from 'rsuite'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface CustomersProps {
  onLogout: () => void
}

export default function Customers({ onLogout }: CustomersProps) {
  return (
    <Container className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLogout={onLogout} />
      <Content style={{ padding: '40px 12px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#64748b', fontWeight: 500 }}>work in progress</h1>
      </Content>
      <Footer />
    </Container>
  )
}
