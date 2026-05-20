/** BlogEditor — Create/Edit blog post */
import { useState, FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Save, Image as ImageIcon } from 'lucide-react'

export function BlogEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Saving post...')
    setTimeout(() => {
      alert('Đã lưu bài viết thành công (Mock)!')
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <AdminLayout title="Viết bài mới" breadcrumb={['Quản trị', 'Blog', 'Viết bài']}>
      <form onSubmit={handleSave}>
        <div className="admin-action-bar" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => window.history.back()}>
            Hủy
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Main Content Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ background: 'white', borderRadius: 16, padding: '32px 24px', border: '1px solid #f0f0f5' }}>
              <input 
                required 
                placeholder="Nhập tiêu đề bài viết..." 
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#1a1a2e',
                  marginBottom: 24,
                  fontFamily: 'inherit'
                }}
              />
              
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                {/* Mock Toolbar */}
                <div style={{ background: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 12, color: '#4b5563', fontSize: 14, fontWeight: 500 }}>
                  <span style={{ cursor: 'pointer' }}>B</span>
                  <span style={{ cursor: 'pointer' }}>I</span>
                  <span style={{ cursor: 'pointer' }}>U</span>
                  <span style={{ cursor: 'pointer', marginLeft: 12 }}>Heading</span>
                  <span style={{ cursor: 'pointer', marginLeft: 12 }}>Link</span>
                  <span style={{ cursor: 'pointer' }}>Image</span>
                </div>
                {/* Textarea */}
                <textarea 
                  placeholder="Nội dung bài viết..." 
                  style={{
                    width: '100%',
                    minHeight: 500,
                    border: 'none',
                    outline: 'none',
                    padding: 24,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: '#374151',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Xuất bản</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Trạng thái</label>
                  <select className="admin-input">
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Chuyên mục (Category)</label>
                  <select className="admin-input">
                    <option value="news">Tin tức & Sự kiện</option>
                    <option value="tips">Hướng dẫn & Mẹo</option>
                    <option value="projects">Dự án tiêu biểu</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh & SEO</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Ảnh đại diện (Thumbnail)</label>
                  <div style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb', cursor: 'pointer' }}>
                    <ImageIcon size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>Nhấn để tải ảnh lên</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>1200x630px recommended</div>
                  </div>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">SEO Meta Description</label>
                  <textarea 
                    className="admin-input" 
                    rows={4} 
                    placeholder="Mô tả ngắn hiển thị trên Google (tối đa 160 ký tự)..." 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
