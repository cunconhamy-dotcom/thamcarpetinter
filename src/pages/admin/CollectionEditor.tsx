/** CollectionEditor — Create/Edit collection and manage products */
import { useState, FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Save, Plus, X, Image as ImageIcon, Trash2 } from 'lucide-react'

export function CollectionEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickFacts, setQuickFacts] = useState<string[]>([''])
  const [valuePoints, setValuePoints] = useState<string[]>([''])
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Saving collection...')
    setTimeout(() => {
      alert('Đã lưu thành công (Mock)!')
      setIsSubmitting(false)
    }, 800)
  }

  const handleAddQuickFact = () => setQuickFacts([...quickFacts, ''])
  const handleUpdateQuickFact = (index: number, val: string) => {
    const newFacts = [...quickFacts]
    newFacts[index] = val
    setQuickFacts(newFacts)
  }
  const handleRemoveQuickFact = (index: number) => {
    setQuickFacts(quickFacts.filter((_, i) => i !== index))
  }

  const handleAddValuePoint = () => setValuePoints([...valuePoints, ''])
  const handleUpdateValuePoint = (index: number, val: string) => {
    const newPoints = [...valuePoints]
    newPoints[index] = val
    setValuePoints(newPoints)
  }
  const handleRemoveValuePoint = (index: number) => {
    setValuePoints(valuePoints.filter((_, i) => i !== index))
  }

  return (
    <AdminLayout title="Chỉnh sửa bộ sưu tập" breadcrumb={['Quản trị', 'Nội dung', 'Bộ sưu tập', 'Chỉnh sửa']}>
      <form onSubmit={handleSave}>
        <div className="admin-action-bar" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Main Content Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Thông tin cơ bản</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Tên bộ sưu tập *</label>
                  <input required className="admin-input" placeholder="Ví dụ: EcoSoft Series" />
                </div>
                
                <div className="admin-input-group">
                  <label className="admin-input-label">Tagline</label>
                  <input className="admin-input" placeholder="Slogan ngắn" />
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Mô tả ngắn (Summary)</label>
                  <textarea className="admin-input" rows={3} placeholder="Mô tả tóm tắt..." />
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Mô tả chi tiết (Detail)</label>
                  <textarea className="admin-input" rows={5} placeholder="Nội dung chi tiết..." />
                </div>
              </div>
            </div>

            {/* Dynamic Lists */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Đặc điểm & Giá trị</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Quick Facts */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label className="admin-input-label">Đặc điểm nổi bật (Quick Facts)</label>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddQuickFact}>
                      <Plus size={14} /> Thêm
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quickFacts.map((fact, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input className="admin-input" value={fact} onChange={(e) => handleUpdateQuickFact(i, e.target.value)} placeholder="Nhập đặc điểm..." />
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveQuickFact(i)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Points */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label className="admin-input-label">Giá trị mang lại (Value Points)</label>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddValuePoint}>
                      <Plus size={14} /> Thêm
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {valuePoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input className="admin-input" value={point} onChange={(e) => handleUpdateValuePoint(i, e.target.value)} placeholder="Nhập giá trị..." />
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveValuePoint(i)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Management */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Danh sách sản phẩm (Mã màu)</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setIsProductModalOpen(true)}>
                  <Plus size={14} /> Thêm sản phẩm
                </button>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Mã SP</th>
                      <th>Tên gọi</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
                        Chưa có sản phẩm nào
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Trạng thái & Phân loại</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Trạng thái</label>
                  <select className="admin-input">
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Ứng dụng (Applications)</label>
                  <input className="admin-input" placeholder="Ví dụ: Văn phòng, Khách sạn" />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh & Màu sắc</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Màu chủ đạo (Accent Color)</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input type="color" className="admin-input" style={{ width: 60, height: 40, padding: 4 }} defaultValue="#f29d38" />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Dùng cho UI và hiệu ứng</span>
                  </div>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Ảnh đại diện (Cover/Hero)</label>
                  <div style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb', cursor: 'pointer' }}>
                    <ImageIcon size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>Nhấn để tải ảnh lên</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PNG, JPG hoặc WEBP (Max 2MB)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setIsProductModalOpen(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Thêm mã sản phẩm</h2>
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setIsProductModalOpen(false)} style={{ padding: 8 }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Mã SP (Code) *</label>
                <input className="admin-input" placeholder="Ví dụ: CI123" />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Tên gọi (Name)</label>
                <input className="admin-input" placeholder="Ví dụ: Ocean Blue" />
              </div>
              <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                <label className="admin-input-label">URL Hình ảnh</label>
                <input className="admin-input" placeholder="https://..." />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600, color: '#4b5563' }}>Thông số kỹ thuật</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Cấu trúc (Construction)</label>
                    <input className="admin-input" placeholder="Tufted Textured Loop" />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Chất liệu sợi (Pile)</label>
                    <input className="admin-input" placeholder="100% Nylon" />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Đế thảm (Backing)</label>
                    <input className="admin-input" placeholder="EcoSoft" />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Kích thước (Size)</label>
                    <input className="admin-input" placeholder="25x100 cm" />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Bảo hành (Warranty)</label>
                    <input className="admin-input" placeholder="15 years" />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Cách lắp đặt (Installation)</label>
                    <input className="admin-input" placeholder="Ashlar, Herringbone" />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0f0f5' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsProductModalOpen(false)}>Hủy</button>
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => { alert('Đã thêm sản phẩm (Mock)'); setIsProductModalOpen(false) }}>Lưu sản phẩm</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
