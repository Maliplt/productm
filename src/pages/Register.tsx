import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel, Form, Button, Message, useToaster, AutoComplete } from 'rsuite'
// import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailData, setEmailData] = useState<string[]>([])
  const navigate = useNavigate()
  const toaster = useToaster()

  const suffixes = ['@gmail.com', '@outlook.com']

  const handleEmailChange = (value: string) => {
    setEmail(value)
    const at = value.match(/@[\S]*/)
    const nextData = at
      ? suffixes
        .filter(item => item.indexOf(at[0]) >= 0)
        .map(item => `${value}${item.replace(at[0], '')}`)
      : suffixes.map(item => `${value}${item}`)
    setEmailData(value ? nextData : [])
  }

  function handleSubmit() {
    if (name && email && password) {
      toaster.push(
        <Message type="success" showIcon duration={4000}>
          Kayıt başarılı! Lütfen giriş yapınız.
        </Message>,
        { placement: 'topCenter' }
      )
      navigate('/login')
    }
  }

  const panelHeader = (
    <div className="text-center py-6 border-b border-slate-100">
      <h1 className="text-3xl font-black tracking-tight m-0 select-none">
        <span className="text-slate-900">product</span>
        <span className="text-orange-500">m</span>
      </h1>
      <p className="text-slate-500 mt-2 font-medium">Kayıt Ol</p>
    </div>
  )

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80")`
      }}
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] z-0" />

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <Panel bordered className="bg-white/95 backdrop-blur-md w-full max-w-sm shadow-2xl rounded-2xl border border-white/20" header={panelHeader}>
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
              <AutoComplete
                data={emailData}
                value={email}
                onChange={handleEmailChange}
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
            <Form.Group style={{ marginTop: '20px' }}>
              <Button appearance="primary" color="blue" type="submit" block>
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
      <div className="z-10">
        <Footer />
      </div>
    </div>
  )
}
