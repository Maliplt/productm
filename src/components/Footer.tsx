export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
        <div>&copy; 2026 Productm Platformu. Tüm hakları saklıdır.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Gizlilik</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Kullanım Şartları</a>
          <a href="#" className="hover:text-blue-600 transition-colors">İletişim</a>
        </div>
      </div>
    </footer>
  )
}
