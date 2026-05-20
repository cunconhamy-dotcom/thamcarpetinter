/** BlogManager — View and manage blog posts */
import { useState } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Search, Plus, Edit, Trash2, FileText } from 'lucide-react'

// Mock Data
const mockPosts = [
  {
    id: '1',
    title: 'Xu hướng thảm văn phòng 2026: Bền vững & Thẩm mỹ',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
    author: 'Admin',
    status: 'published',
    createdAt: '2026-05-10T08:00:00Z',
  },
  {
    id: '2',
    title: 'Cách vệ sinh và bảo quản thảm viên đúng cách',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    author: 'Editor',
    status: 'draft',
    createdAt: '2026-05-14T10:30:00Z',
  }
]

export function BlogManager() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockPosts.filter(post => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleCreateNew = () => {
    window.location.href = '/admin/blog/new'
  }

  return (
    <AdminLayout title="Quản lý Bài viết" breadcrumb={['Quản trị', 'Blog', 'Danh sách']}>
      {/* Action Bar */}
      <div className="admin-action-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search">
            <Search size={16} className="admin-search-icon" />
            <input
              placeholder="Tìm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input"
            style={{ maxWidth: 180, padding: '10px 14px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        <button type="button" className="admin-btn admin-btn-primary" onClick={handleCreateNew}>
          <Plus size={16} />
          Viết bài mới
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng bài viết', value: mockPosts.length, c: '#1a1a2e' },
          { label: 'Đã xuất bản', value: mockPosts.filter(c => c.status === 'published').length, c: '#22c55e' },
          { label: 'Bản nháp', value: mockPosts.filter(c => c.status === 'draft').length, c: '#eab308' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '12px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.value}</span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bài viết</th>
                <th>Tác giả</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        style={{ width: 64, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f5' }}
                      />
                      <div style={{ fontWeight: 500, color: '#1a1a2e', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: '#4b5563' }}>{post.author}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      <span className="status-badge-dot" />
                      {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa"><Edit size={15} /></button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" title="Xóa"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon"><FileText size={28} /></div>
          <div className="admin-empty-title">Không tìm thấy bài viết</div>
          <div className="admin-empty-desc">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</div>
        </div>
      )}
    </AdminLayout>
  )
}
