import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Button } from 'rsuite'
import CogIcon from '@rsuite/icons/Gear'

interface HeaderProps {
  onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <Navbar appearance="default" style={{ padding: '0 20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
      <Navbar.Brand as={Link} to="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
        Productm
      </Navbar.Brand>
      <Nav>
        <Nav.Item as={Link} to="/">Ürünler</Nav.Item>
        <Nav.Item icon={<CogIcon />}>Ayarlar</Nav.Item>
      </Nav>
      <Nav style={{ marginLeft: 'auto' }}>
        <Nav.Item as="div" style={{ paddingTop: '8px' }}>
          {!isAuthPage && onLogout ? (
            <Button appearance="subtle" onClick={onLogout} color="red">
              Çıkış Yap
            </Button>
          ) : (
            <>
              <Button appearance="subtle" onClick={() => navigate('/login')} style={{ marginRight: '8px' }}>
                Giriş Yap
              </Button>
              <Button appearance="primary" onClick={() => navigate('/register')}>
                Kayıt Ol
              </Button>
            </>
          )}
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}
