/** BlogManager — View and manage blog posts from Supabase */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Edit, Trash2, FileText, X, AlertTriangle } from 'lucide-react'
import type { ContentStatus } from '@/types/admin'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  author: string
  status: ContentStatus
  createdAt: string
}

const DEMO_POSTS: BlogPost[] = [
  {
    id: 'demo-1',
    title: 'Xu hướng thảm văn phòng 2026: Bền vững & Thẩm mỹ',
    slug: 'xu-huong-tham-van-phong-2026',
    excerpt: 'Khám phá những tông màu và chất liệu thảm được ưa chuộng nhất.',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
    author: 'Admin',
    status: 'published',
    createdAt: '2026-05-10T08:00:00Z',
  },
  {
    id: 'demo-2',
    title: 'Cách vệ sinh và bảo quản thảm viên đúng cách',
    slug: 'cach-ve-sinh-tham',
    excerpt: 'Hướng dẫn chi tiết giúp kéo dài tuổi thọ thảm sàn.',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    author: 'Editor',
    status: 'draft',
    createdAt: '2026-05-14T10:30:00Z',
  },
]

export function BlogManager() {
  const { isDemoMode } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const navTo = (href: string) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const fetchPosts = useCallback(async () => {
    if (isDemoMode) {
      setPosts(DEMO_POSTS)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      showNotification('error', 'Không thể tải danh sách bài viết')
    } else if (data) {
      setPosts(data.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        title: (p.title as string) || '',
        slug: (p.slug as string) || '',
        excerpt: (p.excerpt as string) || '',
        thumbnail: (p.cover_image as string) || '',
        author: (p.author_id as string) || 'Admin',
        status: ((p.status as string) || 'draft') as ContentStatus,
        createdAt: (p.created_at as string) || new Date().toISOString(),
      })))
    }
    setIsLoading(false)
  }, [isDemoMode])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    if (isDemoMode) {
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.title}"`)
      setDeleteTarget(null)
      return
    }

    setIsDeleting(true)
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteTarget.id)
    if (error) {
      showNotification('error', `Lỗi: ${error.message}`)
    } else {
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.title}"`)
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  const filtered = useMemo(() => {
    let result = posts
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }
    return result
  }, [posts, searchQuery, statusFilter])

  return (
    <AdminLayout title="Quản lý Bài viết" breadcrumb={['Quản trị', 'Blog', 'Danh sách']}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'admin-fadeIn 0.3s ease', maxWidth: 400,
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      {/* Action Bar */}
      <div className="admin-action-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search">
            <Search size={16} className="admin-search-icon" />
            <input placeholder="Tìm bài viết..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
            className="admin-input" style={{ maxWidth: 180, padding: '10px 14px' }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        <button type="button" className="admin-btn admin-btn-primary" onClick={() => navTo('/admin/blog/new')}>
          <Plus size={16} /> Viết bài mới
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng bài viết', value: posts.length, c: '#1a1a2e' },
          { label: 'Đã xuất bản', value: posts.filter(p => p.status === 'published').length, c: '#22c55e' },
          { label: 'Bản nháp', value: posts.filter(p => p.status === 'draft').length, c: '#eab308' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '12px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.value}</span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải dữ liệu...
        </div>
      ) : filtered.length > 0 ? (
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
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title}
                          style={{ width: 64, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f5' }} />
                      ) : (
                        <div style={{ width: 64, height: 48, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} color="#d1d5db" />
                        </div>
                      )}
                      <div style={{ fontWeight: 500, color: '#1a1a2e', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, color: '#4b5563' }}>{post.author}</span></td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      <span className="status-badge-dot" />
                      {post.status === 'published' ? 'Đã xuất bản' : post.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa"
                        onClick={() => navTo(`/admin/blog/${post.id}`)}><Edit size={15} /></button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" title="Xóa"
                        onClick={() => setDeleteTarget(post)}><Trash2 size={15} /></button>
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
          <div className="admin-empty-desc">
            {posts.length === 0 ? 'Nhấn "Viết bài mới" để tạo bài viết đầu tiên' : 'Thử thay đổi từ khóa tìm kiếm'}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => !isDeleting && setDeleteTarget(null)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 440, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'admin-fadeIn 0.2s ease' }}>
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => !isDeleting && setDeleteTarget(null)}
              style={{ position: 'absolute', top: 16, right: 16, padding: 8 }}><X size={18} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a2e' }}>Xác nhận xóa</h3>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: '0 0 24px', padding: 16, background: '#f9fafb', borderRadius: 12 }}>
              Bạn có chắc muốn xóa bài viết <strong>"{deleteTarget.title}"</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Hủy</button>
              <button type="button" className="admin-btn" onClick={handleDeleteConfirm} disabled={isDeleting}
                style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                {isDeleting ? 'Đang xóa...' : 'Xóa bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
