/** MediaManager — Upload and manage images/documents */
import { useState } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Search, UploadCloud, Copy, Trash2, File as FileIcon } from 'lucide-react'

// Mock Data
const mockMedia = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
    name: 'office-carpet-1.jpg',
    size: '1.2 MB',
    type: 'image/jpeg',
    createdAt: '2026-05-12T10:00:00Z'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    name: 'cleaning-guide-hero.jpg',
    size: '850 KB',
    type: 'image/jpeg',
    createdAt: '2026-05-14T14:20:00Z'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    name: 'hotel-lobby-carpet.webp',
    size: '2.1 MB',
    type: 'image/webp',
    createdAt: '2026-05-15T09:10:00Z'
  }
]

export function MediaManager() {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockMedia.filter(m => 
    searchQuery ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Đã copy URL: ' + url)
  }

  const handleDelete = (name: string) => {
    if (confirm(`Bạn có chắc muốn xóa file "${name}"?`)) {
      alert('Đã xóa (Mock)')
    }
  }

  return (
    <AdminLayout title="Thư viện Media" breadcrumb={['Quản trị', 'Media']}>
      
      {/* Action Bar */}
      <div className="admin-action-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          <div className="admin-search" style={{ maxWidth: 400 }}>
            <Search size={16} className="admin-search-icon" />
            <input
              placeholder="Tìm kiếm file media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div style={{ 
        border: '2px dashed #d1d5db', 
        borderRadius: 16, 
        padding: 48, 
        textAlign: 'center', 
        background: 'white', 
        cursor: 'pointer',
        marginBottom: 32,
        transition: 'all 0.2s ease'
      }}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f29d38'; e.currentTarget.style.background = '#fef9e7'; }}
      onDragLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = 'white'; }}
      onDrop={(e) => { e.preventDefault(); alert('Upload file mock'); e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = 'white'; }}
      >
        <UploadCloud size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600, color: '#1a1a2e' }}>Kéo thả file vào đây để tải lên</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Hỗ trợ JPG, PNG, WEBP, PDF (Tối đa 5MB)</p>
        <button type="button" className="admin-btn admin-btn-secondary" style={{ marginTop: 24 }}>
          Hoặc chọn file từ máy tính
        </button>
      </div>

      {/* Media Grid */}
      {filtered.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 24 
        }}>
          {filtered.map((media) => (
            <div key={media.id} style={{ 
              background: 'white', 
              borderRadius: 16, 
              border: '1px solid #f0f0f5', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#f3f4f6' }}>
                <img 
                  src={media.url} 
                  alt={media.name} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, width: '100%', height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </div>
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }} title={media.name}>
                  {media.name}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
                  {new Date(media.createdAt).toLocaleDateString('vi-VN')} • {media.size}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-full" onClick={() => handleCopyUrl(media.url)}>
                    <Copy size={14} /> Copy URL
                  </button>
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(media.name)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon"><FileIcon size={28} /></div>
          <div className="admin-empty-title">Không tìm thấy file</div>
          <div className="admin-empty-desc">Thử thay đổi từ khóa tìm kiếm</div>
        </div>
      )}

    </AdminLayout>
  )
}
