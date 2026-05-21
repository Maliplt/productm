import { useState } from 'react'
import { Modal, Table, Message, useToaster, Uploader } from 'rsuite'
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Trash2 } from 'lucide-react'
import type { Product } from '../types/product'

const { Column, HeaderCell, Cell } = Table

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (products: Omit<Product, 'id' | 'createdAt'>[]) => void
}

// Mappings
const HEADER_MAPPINGS: Record<string, { label: string; aliases: string[] }> = {
  name: { label: 'Ürün Adı', aliases: ['name', 'isim', 'ad', 'ürün', 'ürün adı', 'ürünadi', 'title', 'product name', 'baslik', 'başlık', 'ürünisim'] },
  category: { label: 'Kategori', aliases: ['category', 'kategori', 'tür', 'sınıf', 'grup', 'group', 'tur', 'sinif'] },
  price: { label: 'Fiyat', aliases: ['price', 'fiyat', 'tutar', 'fiyatı', 'fiyati', 'price', 'ucret', 'ücret', 'deger', 'değer'] },
  quantity: { label: 'Stok Adedi', aliases: ['quantity', 'stok', 'adet', 'miktar', 'sayı', 'sayi', 'stock', 'stok adedi', 'stokadedi', 'count', 'mevcut'] },
  description: { label: 'Açıklama', aliases: ['description', 'açıklama', 'aciklama', 'detay', 'description', 'aciklamalar', 'açıklamalar', 'info', 'details'] },
  image: { label: 'Görsel URL', aliases: ['image', 'görsel', 'resim', 'fotoğraf', 'fotograf', 'img', 'image', 'resimurl', 'görselurl'] },
  brand: { label: 'Marka', aliases: ['brand', 'marka', 'üretici', 'brand', 'uretici', 'company', 'yapimci', 'yapımcı'] },
  sku: { label: 'Stok Kodu (SKU)', aliases: ['sku', 'barkod', 'ürün kodu', 'ürünkodu', 'barcode', 'sku', 'stokkodu', 'stok kodu'] },
  weight: { label: 'Ağırlık', aliases: ['weight', 'ağırlık', 'agirlik', 'kütle', 'weight', 'kutle', 'gramaj'] },
  warranty: { label: 'Garanti', aliases: ['warranty', 'garanti', 'garanti süresi', 'garantisuresi', 'warranty', 'garanti_suresi'] }
}

// adapter
function getInternalKey(csvHeader: string): string | null {
  const cleanHeader = csvHeader.trim().toLowerCase();

  for (const [key, config] of Object.entries(HEADER_MAPPINGS)) {
    // eslesme
    if (config.aliases.includes(cleanHeader)) {
      return key;
    }
    // standartlastirma
    const normalizedHeader = cleanHeader.split(' ').join('').split('_').join('').split('-').join('');
    const matches = config.aliases.some(alias => {
      const normalizedAlias = alias.split(' ').join('').split('_').join('').split('-').join('');
      return normalizedHeader === normalizedAlias;
    });
    if (matches) {
      return key;
    }
  }
  return null;
}

// sayi parseri
function parseNumber(val: string): number {
  if (!val) return 0
  // clean
  let clean = val.replace('₺', '').replace('TL', '').replace('$', '').replace('€', '').trim();
  // format
  if (clean.indexOf('.') !== -1 && clean.indexOf(',') !== -1) {
    clean = clean.split('.').join('').replace(',', '.');
  } else if (clean.indexOf(',') !== -1) {
    clean = clean.replace(',', '.');
  }
  // clean
  clean = clean.split(' ').join('');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

// csv parser
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  // split
  const rawLines = text.split('\n');
  const lines = rawLines.map(line => line.trim()).filter(line => line !== '');
  const firstLine = lines[0] || '';

  // delimiter
  const delimiter = firstLine.indexOf(';') !== -1 ? ';' : ',';

  const rows: string[][] = []
  let currentRow: string[] = []
  let currentVal = ''
  let insideQuote = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (insideQuote) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"'
          i++ // skip
        } else {
          insideQuote = false
        }
      } else {
        currentVal += char
      }
    } else {
      if (char === '"') {
        insideQuote = true
      } else if (char === delimiter) {
        currentRow.push(currentVal)
        currentVal = ''
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++
        }
        currentRow.push(currentVal)
        if (currentRow.some(val => val.trim() !== '')) {
          rows.push(currentRow)
        }
        currentRow = []
        currentVal = ''
      } else {
        currentVal += char
      }
    }
  }

  if (currentVal !== '' || currentRow.length > 0) {
    currentRow.push(currentVal)
    if (currentRow.some(val => val.trim() !== '')) {
      rows.push(currentRow)
    }
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = rows[0].map(h => h.trim())
  const dataRows = rows.slice(1)

  return { headers, rows: dataRows }
}

export default function CsvImportModal({ isOpen, onClose, onImport }: CsvImportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedProducts, setParsedProducts] = useState<Omit<Product, 'id' | 'createdAt'>[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toaster = useToaster()

  function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Lütfen sadece .csv uzantılı dosyaları yükleyin.')
      return
    }

    setFileName(file.name)
    setErrorMsg(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const { headers, rows } = parseCSV(text)

        if (headers.length === 0) {
          setErrorMsg('Dosya boş veya geçersiz formatta.')
          return
        }

        // mappings
        const resolvedMappings: { csv: string; internal: string; label: string }[] = []
        const unresolved: string[] = []

        headers.forEach(h => {
          const internalKey = getInternalKey(h)
          if (internalKey) {
            resolvedMappings.push({
              csv: h,
              internal: internalKey,
              label: HEADER_MAPPINGS[internalKey].label
            })
          } else {
            unresolved.push(h)
          }
        })

        if (resolvedMappings.length === 0) {
          setErrorMsg('CSV başlıkları ile sistem alanları eşleştirilemedi. Lütfen kolon başlıklarını kontrol edin.')
          return
        }

        // adapt
        const adaptedProducts = rows.map((row) => {
          const product: Partial<Omit<Product, 'id' | 'createdAt'>> = {}

          headers.forEach((header, index) => {
            const rawVal = row[index] || ''
            const internalKey = getInternalKey(header)

            if (internalKey) {
              if (internalKey === 'price') {
                product.price = parseNumber(rawVal)
              } else if (internalKey === 'quantity') {
                product.quantity = Math.round(parseNumber(rawVal))
              } else {
                product[internalKey as keyof Omit<Product, 'id' | 'createdAt' | 'price' | 'quantity'>] = rawVal.trim()
              }
            }
          })

          // bos donen kisimlar 
          return {
            name: product.name || 'İsimsiz Ürün',
            category: product.category || 'Genel',
            price: product.price !== undefined && product.price >= 0 ? product.price : 0,
            quantity: product.quantity !== undefined && product.quantity >= 0 ? product.quantity : 0,
            description: product.description || 'Açıklama belirtilmemiş.',
            image: product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            brand: product.brand,
            sku: product.sku,
            weight: product.weight,
            warranty: product.warranty
          }
        })

        setParsedProducts(adaptedProducts)
      } catch (err) {
        setErrorMsg('Dosya okunurken bir hata oluştu: ' + (err instanceof Error ? err.message : String(err)))
      }
    }

    reader.onerror = () => {
      setErrorMsg('Dosya yüklenirken teknik bir sorun oluştu.')
    }

    reader.readAsText(file)
  }

  function handleReset() {
    setFileName(null)
    setParsedProducts([])
    setErrorMsg(null)
  }

  function handleImportSubmit() {
    if (parsedProducts.length === 0) return
    onImport(parsedProducts)
    toaster.push(
      <Message type="success" showIcon>
        {parsedProducts.length} adet ürün başarıyla içe aktarıldı.
      </Message>,
      { placement: 'topEnd', duration: 3500 }
    )
    handleClose()
  }

  function handleClose() {
    handleReset()
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg" dialogStyle={{ width: '95%', maxWidth: '1100px' }}>
      <Modal.Header>
        <Modal.Title>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UploadCloud size={22} className="text-orange-500" />
            CSV Dosyasından Ürün İçe Aktar
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 240px)', overflowX: 'hidden', overflowY: 'auto', padding: '16px' }}>
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '3px', marginBottom: '16px', fontSize: '13px' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {parsedProducts.length === 0 ? (
          <div>
            <Uploader
              action="#"
              accept=".csv"
              autoUpload={false}
              draggable
              multiple={false}
              onChange={(fileList) => {
                const file = fileList[fileList.length - 1]
                if (file && file.blobFile) {
                  processFile(file.blobFile)
                }
              }}
              fileList={[]}
            >
              <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <UploadCloud size={48} className="text-slate-400" />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                    CSV dosyasını buraya sürükleyip bırakın
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    veya dosya seçmek için <span style={{ color: '#f97316', fontWeight: 500 }}>tıklayın</span>
                  </p>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f4eee1', color: '#475569', padding: '6px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: 500 }}>
                  <FileText size={14} />
                  Desteklenen format: CSV
                </div>
              </div>
            </Uploader>
          </div>
        ) : (
          <div>
            {/* Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f4eee1', border: '1px solid #e8dfcd', borderRadius: '3px', padding: '10px 16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{fileName}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>({parsedProducts.length} ürün bulundu)</span>
              </div>
              <button
                onClick={handleReset}
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #ef4444', color: '#ef4444' }}
              >
                <Trash2 size={13} />
                Temizle
              </button>
            </div>

            {/* Preview */}
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
              Önizleme Tablosu:
            </div>
            <div style={{ background: '#fdfbf7', borderRadius: '3px', border: '1px solid #e8dfcd', overflow: 'hidden' }}>
              <Table
                autoHeight
                data={parsedProducts}
                rowHeight={48}
                style={{ borderRadius: '3px' }}
              >
                <Column width={50} align="center" verticalAlign="middle">
                  <HeaderCell>#</HeaderCell>
                  <Cell>
                    {(_rowData, rowIndex) => <span className="font-mono text-slate-400">{rowIndex !== undefined ? rowIndex + 1 : ''}</span>}
                  </Cell>
                </Column>

                <Column width={60} align="center">
                  <HeaderCell>Görsel</HeaderCell>
                  <Cell style={{ padding: '4px 0' }}>
                    {rowData => (
                      <div style={{ width: '32px', height: '32px', background: '#f4eee1', borderRadius: '3px', overflow: 'hidden', display: 'inline-block', border: '1px solid #e8dfcd' }}>
                        <img src={rowData.image as string} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </Cell>
                </Column>

                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                  <HeaderCell>Ürün Adı</HeaderCell>
                  <Cell dataKey="name" style={{ fontWeight: 500 }} />
                </Column>

                <Column flexGrow={1} minWidth={100} verticalAlign="middle">
                  <HeaderCell>Kategori</HeaderCell>
                  <Cell dataKey="category" />
                </Column>

                <Column flexGrow={1} minWidth={90} verticalAlign="middle">
                  <HeaderCell>Fiyat</HeaderCell>
                  <Cell>
                    {rowData => <span style={{ fontWeight: 600, color: '#f97316' }}>{(rowData.price as number).toLocaleString('tr-TR')}₺</span>}
                  </Cell>
                </Column>

                <Column flexGrow={1} minWidth={80} verticalAlign="middle">
                  <HeaderCell>Stok</HeaderCell>
                  <Cell>
                    {rowData => (
                      <span style={{ color: (rowData.quantity as number) < 5 ? '#ef4444' : '#16a34a', fontWeight: 500 }}>
                        {rowData.quantity} adet
                      </span>
                    )}
                  </Cell>
                </Column>

                <Column flexGrow={1} minWidth={90} verticalAlign="middle">
                  <HeaderCell>Marka</HeaderCell>
                  <Cell dataKey="brand">
                    {rowData => <span>{rowData.brand || '-'}</span>}
                  </Cell>
                </Column>

                <Column flexGrow={2} minWidth={160} verticalAlign="middle">
                  <HeaderCell>Açıklama</HeaderCell>
                  <Cell dataKey="description" className="text-slate-500 text-xs" />
                </Column>
              </Table>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ padding: '12px 16px', borderTop: '1px solid #e8dfcd', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button className="btn btn-ghost" onClick={handleClose}>
          Vazgeç
        </button>
        <button
          className="btn btn-orange"
          disabled={parsedProducts.length === 0}
          onClick={handleImportSubmit}
          style={{ opacity: parsedProducts.length === 0 ? 0.6 : 1, cursor: parsedProducts.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          İçe Aktar ({parsedProducts.length} Ürün)
        </button>
      </Modal.Footer>
    </Modal>
  )
}
