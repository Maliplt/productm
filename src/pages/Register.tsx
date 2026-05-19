import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel, Form, Message, useToaster, type FormInstance } from 'rsuite'
import { SchemaModel, StringType } from 'schema-typed'
import Footer from '../components/Footer'
import { UserPlus } from 'lucide-react'

const model = SchemaModel({
  name: StringType()
    .minLength(2, 'Ad Soyad en az 2 karakter olmalıdır.')
    .isRequired('Ad Soyad zorunludur.'),
  email: StringType()
    .isEmail('Geçerli bir e-posta adresi giriniz.')
    .isRequired('E-posta adresi zorunludur.'),
  password: StringType()
    .minLength(6, 'Şifre en az 6 karakter olmalıdır.')
    .isRequired('Şifre zorunludur.'),
})

export default function Register() {
  const formRef = useRef<FormInstance>(null)
  const [formValue, setFormValue] = useState({ name: '', email: '', password: '' })
  const [formError, setFormError] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const toaster = useToaster()

  function handleSubmit() {
    if (!formRef.current?.check()) return
    toaster.push(
      <Message type="success" showIcon duration={4000}>
        Kayıt başarılı! Lütfen giriş yapınız.
      </Message>,
      { placement: 'topCenter' }
    )
    navigate('/login')
  }

  const panelHeader = (
    <div className="text-center py-6 border-b border-slate-100">
      <h1 className="text-3xl font-black tracking-tight m-0 select-none">
        <span className="text-slate-900">product</span>
        <span className="text-orange-500">m</span>
      </h1>
      <p className="text-slate-500 mt-2 font-medium">Yeni hesap oluşturun</p>
    </div>
  )

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80")` }}
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] z-0" />
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <Panel bordered className="bg-white/95 backdrop-blur-md w-full max-w-sm shadow-2xl rounded-2xl border border-white/20" header={panelHeader}>
          <Form
            ref={formRef}
            model={model}
            formValue={formValue}
            onChange={val => setFormValue(val as typeof formValue)}
            onCheck={setFormError}
            fluid
          >
            <Form.Group controlId="name">
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control name="name" type="text" placeholder="Adınız Soyadınız" errorMessage={formError.name} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>E-posta</Form.Label>
              <Form.Control name="email" type="email" placeholder="ornek@sirket.com" errorMessage={formError.email} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Şifre</Form.Label>
              <Form.Control name="password" type="password" placeholder="••••••••" errorMessage={formError.password} />
            </Form.Group>
            <Form.Group style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>
                <UserPlus size={18} />
                Kayıt Ol
              </button>
            </Form.Group>
          </Form>
          <div className="text-center mt-4">
            <span className="text-slate-500 text-sm">Zaten hesabınız var mı? </span>
            <Link to="/login" className="text-orange-500 outline-none hover:underline text-sm font-medium">Giriş Yap</Link>
          </div>
        </Panel>
      </main>
      <div className="z-10">
        <Footer />
      </div>
    </div>
  )
}
