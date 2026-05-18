import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel, Form, Button } from 'rsuite'
// import Header from '../components/Header'
import Footer from '../components/Footer'

interface RegisterProps {
  onRegister: () => void
}

export default function Register({ onRegister }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit() {
    if (name && email && password) {
      onRegister()
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* <Header /> */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Panel bordered className="bg-white w-full max-w-sm shadow-sm" header={<h3 className="text-xl font-bold text-center m-0">Hesap Oluştur</h3>}>
          <Form onSubmit={handleSubmit} fluid>
            <Form.Group>
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control 
                name="name" 
                type="text" 
                value={name}
                onChange={v => setName(v)}
                placeholder="Ad Soyad"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-posta</Form.Label>
              <Form.Control 
                name="email" 
                type="email" 
                value={email}
                onChange={v => setEmail(v)}
                placeholder="ornek@sirket.com"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Şifre</Form.Label>
              <Form.Control 
                name="password" 
                type="password"
                value={password}
                onChange={v => setPassword(v)}
                placeholder="********"
              />
            </Form.Group>
            <Form.Group>
              <Button appearance="primary" type="submit" block>
                Kayıt Ol
              </Button>
            </Form.Group>
          </Form>
          <div className="text-center mt-4">
            <span className="text-slate-500 text-sm">Zaten hesabınız var mı? </span>
            <Link to="/login" className="text-blue-600 outline-none hover:underline text-sm font-medium">Giriş Yap</Link>
          </div>
        </Panel>
      </main>
      <Footer />
    </div>
  )
}
