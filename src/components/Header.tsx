import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Dropdown } from 'rsuite'
import { Settings, LogOut, LogIn, UserPlus, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <Navbar appearance="default" style={{ padding: '0 20px', borderBottom: '1px solid #e8dfcd', background: '#fdfbf7' }}>
      <Navbar.Brand as={Link} to="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
        <span>product</span><span style={{ color: '#f97316' }}>m</span>
      </Navbar.Brand>
      <Nav>
        <Nav.Item as={Link} to="/" active={location.pathname === '/' || location.pathname === '/dashboard'}>Ürünler</Nav.Item>
        <Nav.Item as={Link} to="/customers" active={location.pathname === '/customers'}>Müşteriler</Nav.Item>
      </Nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px', gap: '12px' }}>
        {!isAuthPage && onLogout ? (
          <Dropdown
            renderToggle={(props, ref) => (
              <button
                {...props}
                ref={ref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  background: '#fdfbf7',
                  border: '1px solid #e8dfcd',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <img
                  src="/darksouls_avatar.png"
                  alt="Avatar"
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>Ali Polatkesen</span>
                <ChevronDown size={12} style={{ color: '#94a3b8' }} />
              </button>
            )}
            placement="bottomEnd"
          >
            <Dropdown.Item onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={15} />
              Ayarlar
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
              <LogOut size={15} />
              Çıkış Yap
            </Dropdown.Item>
          </Dropdown>
        ) : !isAuthPage ? null : (
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
