import { useState } from 'react'
import { Container, Content, Panel, Form, Input, Button, Toggle, SelectPicker, Grid, Row, Col, Message, useToaster, Modal } from 'rsuite'
import { User, Settings as SettingsIcon, Bell, Database, Save, Trash2, Download } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface SettingsProps {
  onLogout: () => void
}

export default function Settings({ onLogout }: SettingsProps) {
  const toaster = useToaster()
  const [profile, setProfile] = useState({
    name: 'Ali Polatkesen',
    email: '****@example.com',
    avatar: '/darksouls_avatar.png',
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    stockAlerts: true,
    weeklyReport: false,
  })

  const [appLang, setAppLang] = useState('tr')
  const [showResetModal, setShowResetModal] = useState(false)

  function handleSaveProfile() {
    toaster.push(
      <Message type="success" showIcon>Profil bilgileri başarıyla güncellendi.</Message>,
      { placement: 'topEnd', duration: 3000 }
    )
  }

  function handleSaveSettings() {
    toaster.push(
      <Message type="success" showIcon>Sistem ayarları kaydedildi.</Message>,
      { placement: 'topEnd', duration: 3000 }
    )
  }

  function handleResetData() {
    setShowResetModal(true)
  }

  function confirmReset() {
    setShowResetModal(false)
    toaster.push(
      <Message type="info" showIcon>Tüm veriler varsayılana sıfırlandı.</Message>,
      { placement: 'topEnd', duration: 3000 }
    )
  }

  function handleExportData() {
    toaster.push(
      <Message type="success" showIcon>Veriler JSON formatında dışa aktarıldı.</Message>,
      { placement: 'topEnd', duration: 3000 }
    )
  }

  return (
    <Container className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLogout={onLogout} />
      <Content style={{ padding: '12px 12px', flex: 1 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <SettingsIcon size={24} style={{ color: '#f97316' }} />
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Sistem Ayarları</h1>
          </div>

          <Grid fluid style={{ padding: 0 }}>
            <Row gutter={16} style={{ alignItems: 'flex-start' }}>
              <Col span={{ xs: 24, md: 12 }} style={{ marginBottom: '12px' }}>
                <Panel
                  bordered
                  header={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a' }}>
                      <User size={18} /> Profil Bilgileri
                    </span>
                  }
                  style={{ background: '#fdfbf7', border: '1px solid #e8dfcd' }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e8dfcd' }}>
                      <img src={profile.avatar} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Form.Group style={{ marginBottom: 0 }}>
                        <Form.Label style={{ fontSize: '12px' }}>Profil Fotoğrafı URL</Form.Label>
                        <Input
                          size="sm"
                          value={profile.avatar}
                          onChange={val => setProfile(prev => ({ ...prev, avatar: val }))}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <Form fluid>
                    <Form.Group style={{ marginBottom: '8px' }}>
                      <Form.Label>Ad Soyad</Form.Label>
                      <Input
                        value={profile.name}
                        onChange={val => setProfile(prev => ({ ...prev, name: val }))}
                      />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '8px' }}>
                      <Form.Label>E-posta Adresi</Form.Label>
                      <Input
                        value={profile.email}
                        onChange={val => setProfile(prev => ({ ...prev, email: val }))}
                      />
                    </Form.Group>
                    <Button
                      className="btn btn-orange"
                      onClick={handleSaveProfile}
                      style={{ marginTop: '4px' }}
                    >
                      <Save size={16} /> Profili Kaydet
                    </Button>
                  </Form>
                </Panel>
              </Col>

              <Col span={{ xs: 24, md: 12 }}>
                <Panel
                  bordered
                  header={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a' }}>
                      <Bell size={18} /> Tercihler &amp; Bildirimler
                    </span>
                  }
                  style={{ background: '#fdfbf7', border: '1px solid #e8dfcd', marginBottom: '16px' }}
                >
                  <Form fluid>
                    <Form.Group style={{ marginBottom: '8px' }}>
                      <Form.Label>Dil Tercihi</Form.Label>
                      <SelectPicker
                        cleanable={false}
                        searchable={false}
                        data={[
                          { label: 'Türkçe', value: 'tr' },
                          { label: 'English', value: 'en' }
                        ]}
                        value={appLang}
                        onChange={val => setAppLang(val || 'tr')}
                        block
                      />
                    </Form.Group>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '4px 0 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>Düşük Stok Uyarıları</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Stok seviyesi kritik düzeye indiğinde bildir.</div>
                        </div>
                        <Toggle checked={notifications.stockAlerts} onChange={val => setNotifications(prev => ({ ...prev, stockAlerts: val }))} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>E-posta Bildirimleri</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Günlük ve haftalık özet raporları e-posta ile al.</div>
                        </div>
                        <Toggle checked={notifications.emailAlerts} onChange={val => setNotifications(prev => ({ ...prev, emailAlerts: val }))} />
                      </div>
                    </div>

                    <Button
                      className="btn btn-orange"
                      onClick={handleSaveSettings}
                      style={{ marginTop: '4px' }}
                    >
                      <Save size={16} /> Ayarları Kaydet
                    </Button>
                  </Form>
                </Panel>

                <Panel
                  bordered
                  header={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a' }}>
                      <Database size={18} /> Veri Yönetimi
                    </span>
                  }
                  style={{ background: '#fdfbf7', border: '1px solid #e8dfcd' }}
                >
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', lineHeight: 1.5 }}>
                    Ürün veritabanınızla ilgili yedekleme ve sıfırlama işlemlerini buradan gerçekleştirebilirsiniz.
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                      onClick={handleExportData}
                    >
                      <Download size={15} /> Veriyi Yedekle
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                      onClick={handleResetData}
                    >
                      <Trash2 size={15} /> Sıfırla
                    </button>
                  </div>
                </Panel>
              </Col>
            </Row>
          </Grid>

        </div>
      </Content>
      <Footer />

      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} size="xs">
        <Modal.Header>
          <Modal.Title style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
            <Trash2 size={20} /> Veriyi Sıfırla
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '16px 20px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
          Bu işlem geri alınamaz ve tüm kayıtlar varsayılana döndürülür. Devam et?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmReset} color="red" appearance="primary" className="btn btn-danger">
            Evet
          </Button>
          <Button onClick={() => setShowResetModal(false)} appearance="subtle">
            İptal
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
