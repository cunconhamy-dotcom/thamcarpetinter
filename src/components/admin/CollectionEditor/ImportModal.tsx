import { Check } from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  isImporting: boolean
  importUrl: string
  setImportUrl: (url: string) => void
  onClose: () => void
  onImport: () => void
}

export function ImportModal({ isOpen, isImporting, importUrl, setImportUrl, onClose, onImport }: ImportModalProps) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => !isImporting && onClose()} />
      <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600 }}>Nhập dữ liệu tự động từ URL</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Dán đường link (URL) của bộ sưu tập. Hệ thống sẽ tự động sử dụng AI để đọc nội dung và điền vào form.</p>
        
        <div className="admin-input-group">
          <label className="admin-input-label">Đường dẫn URL</label>
          <input className="admin-input" placeholder="https://carpetsinter.com/..."
            value={importUrl} onChange={e => setImportUrl(e.target.value)} disabled={isImporting} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={isImporting}>Hủy</button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={onImport} disabled={isImporting || !importUrl}>
            {isImporting ? <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
            {isImporting ? 'Đang trích xuất...' : 'Bắt đầu trích xuất'}
          </button>
        </div>
      </div>
    </div>
  )
}
