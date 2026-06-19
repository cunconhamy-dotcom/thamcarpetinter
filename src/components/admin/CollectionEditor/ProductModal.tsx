import { X, Check } from 'lucide-react'

interface ProductItem {
  code: string
  name: string
  image: string
  highlights?: string[]
  colors?: string[]
  spec: {
    construction?: string
    pile?: string
    backing?: string
    size?: string
    useCase?: string
    installation?: string
  }
}

interface ProductModalProps {
  isOpen: boolean
  editingProduct: ProductItem | null
  editingProductIdx: number
  setEditingProduct: (product: ProductItem) => void
  onClose: () => void
  onSave: () => void
}

export function ProductModal({ isOpen, editingProduct, editingProductIdx, setEditingProduct, onClose, onSave }: ProductModalProps) {
  if (!isOpen || !editingProduct) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {editingProductIdx >= 0 ? 'Sửa sản phẩm' : 'Thêm mã sản phẩm'}
          </h2>
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={onClose} style={{ padding: 8 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="admin-input-group">
            <label className="admin-input-label">Mã SP (Code) *</label>
            <input className="admin-input" placeholder="Ví dụ: CI123"
              value={editingProduct.code} onChange={e => setEditingProduct({ ...editingProduct, code: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label className="admin-input-label">Tên gọi (Name)</label>
            <input className="admin-input" placeholder="Ví dụ: Ocean Blue"
              value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
          </div>
          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label className="admin-input-label">URL Hình ảnh</label>
            <input className="admin-input" placeholder="https://..."
              value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600, color: '#4b5563' }}>Thông số kỹ thuật</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'construction', label: 'Cấu trúc (Construction)', ph: 'Tufted Textured Loop' },
                { key: 'pile', label: 'Chất liệu sợi (Pile)', ph: '100% Nylon' },
                { key: 'backing', label: 'Đế thảm (Backing)', ph: 'EcoSoft' },
                { key: 'size', label: 'Kích thước (Size)', ph: '25x100 cm' },
                { key: 'warranty', label: 'Bảo hành (Warranty)', ph: '15 years' },
                { key: 'installation', label: 'Cách lắp đặt', ph: 'Ashlar, Herringbone' },
              ].map(({ key, label, ph }) => (
                <div key={key} className="admin-input-group">
                  <label className="admin-input-label">{label}</label>
                  <input className="admin-input" placeholder={ph}
                    value={(editingProduct.spec as Record<string, string>)[key] || ''}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      spec: { ...editingProduct.spec, [key]: e.target.value }
                    })} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0f0f5' }}>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>Hủy</button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={onSave}>
            <Check size={16} /> {editingProductIdx >= 0 ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  )
}
