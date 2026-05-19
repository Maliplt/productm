import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'rsuite'
import { Settings, LogOut, LogIn, UserPlus } from 'lucide-react'

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
        <span>product</span><span style={{ color: '#f97316' }}>m</span>
      </Navbar.Brand>
      <Nav>
        <Nav.Item as={Link} to="/">Ürünler</Nav.Item>
        <Nav.Item as={Link} to="/settings">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Settings size={18} />
            Ayarlar
          </span>
        </Nav.Item>
      </Nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
        {!isAuthPage && onLogout ? (
          <button className="btn btn-danger-outline" onClick={onLogout}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
              <LogIn size={16} />
              Giriş Yap
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              <UserPlus size={16} />
              Kayıt Ol
            </button>
          </div>
        )}
      </div>
    </Navbar>
  )
}
