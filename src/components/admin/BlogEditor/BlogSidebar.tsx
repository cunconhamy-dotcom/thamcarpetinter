import { X, UploadCloud, Image as ImageIcon } from 'lucide-react'

interface BlogSidebarProps {
  status: string
  setStatus: (v: string) => void
  category: string
  setCategory: (v: string) => void
  excerpt: string
  setExcerpt: (v: string) => void
  thumbnailPreview: string
  thumbnailUploading: boolean
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearThumbnail: () => void
  metaDescription: string
  setMetaDescription: (v: string) => void
}

export function BlogSidebar({
  status, setStatus,
  category, setCategory,
  excerpt, setExcerpt,
  thumbnailPreview, thumbnailUploading, handleThumbnailUpload, clearThumbnail,
  metaDescription, setMetaDescription
}: BlogSidebarProps) {
  return (
    <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Xuất bản</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-input-group">
            <label className="admin-input-label">Trạng thái</label>
            <select className="admin-input" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label className="admin-input-label">Chuyên mục</label>
            <select className="admin-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="news">Tin tức & Sự kiện</option>
              <option value="tips">Hướng dẫn & Mẹo</option>
              <option value="projects">Dự án tiêu biểu</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label className="admin-input-label">Tóm tắt (Excerpt)</label>
            <textarea className="admin-input" rows={3} placeholder="Mô tả ngắn về bài viết..."
              value={excerpt} onChange={e => setExcerpt(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh & SEO</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-input-group">
            <label className="admin-input-label">Ảnh đại diện (Thumbnail)</label>
            {thumbnailPreview ? (
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                <img src={thumbnailPreview} alt="Thumbnail" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                  <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.95)' }}>
                    Đổi
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                  </label>
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm"
                    style={{ background: 'rgba(255,255,255,0.95)' }}
                    onClick={clearThumbnail}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb', cursor: 'pointer', display: 'block' }}>
                {thumbnailUploading ? (
                  <UploadCloud size={32} color="#f29d38" style={{ margin: '0 auto 12px' }} />
                ) : (
                  <ImageIcon size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                )}
                <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>
                  {thumbnailUploading ? 'Đang upload...' : 'Nhấn để tải ảnh lên'}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>1200x630px recommended</div>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">SEO Meta Description</label>
            <textarea className="admin-input" rows={4}
              placeholder="Mô tả ngắn hiển thị trên Google (tối đa 160 ký tự)..."
              value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
            <span style={{ fontSize: 11, color: metaDescription.length > 160 ? '#ef4444' : '#9ca3af' }}>
              {metaDescription.length}/160
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
