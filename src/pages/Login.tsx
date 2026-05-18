import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel, Form, Button } from 'rsuite'
//import Header from '../components/Header' 
import Footer from '../components/Footer'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit() {
    if (email && password) {
      onLogin()
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* <Header /> */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Panel bordered className="bg-white w-full max-w-sm shadow-sm" header={<h3 className="text-xl font-bold text-center m-0">Giriş Yap</h3>}>
          <Form onSubmit={handleSubmit} fluid>
            <Form.Group>
              <Form.Label>E-posta</Form.Label>
              <Form.Control 
                name="email" 
                type="email" 
                value={email}
                onChange={v => setEmail(v)}
                placeholder="ornek@mail.com"
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
              <Button appearance="primary" color="blue" type="submit" block>
                Giriş Yap
              </Button>
            </Form.Group>
          </Form>
          <div className="text-center mt-4">
            <span className="text-slate-500 text-sm">Hesabınız yok mu? </span>
            <Link to="/register" className="text-blue-600 outline-none hover:underline text-sm font-medium">Kayıt Ol</Link>
          </div>
        </Panel>
      </main>
      <Footer />
    </div>
  )
}
