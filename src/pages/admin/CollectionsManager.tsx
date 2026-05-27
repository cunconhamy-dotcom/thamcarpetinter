/** CollectionsManager — Full CRUD management for carpet collections */
import { useState, useMemo, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Edit, Trash2, Eye, FolderOpen, AlertTriangle, X } from 'lucide-react'
import type { ContentStatus } from '@/types/admin'

interface ManagedCollection {
  id: string
  name: string
  slug: string
  tagline: string
  heroImage: string
  productCount: number
  status: ContentStatus
  updatedAt: string
}

interface SupabaseCollectionRow {
  id: string
  slug?: string
  name: string
  tagline?: string
  hero_image?: string
  metadata?: {
    products?: unknown[]
  }
  status?: string
  updated_at?: string
  created_at?: string
}

// Demo data for demo mode
const DEMO_COLLECTIONS: ManagedCollection[] = [
  { id: 'foundation', name: 'Foundation', slug: 'foundation', tagline: 'Nền tảng cho mọi không gian', heroImage: '', productCount: 5, status: 'published', updatedAt: new Date().toISOString() },
  { id: 'fascination', name: 'Fascination', slug: 'fascination', tagline: 'Sự cuốn hút trong từng sợi thảm', heroImage: '', productCount: 4, status: 'published', updatedAt: new Date().toISOString() },
  { id: 'discovery', name: 'Discovery', slug: 'discovery', tagline: 'Khám phá không gian mới', heroImage: '', productCount: 6, status: 'published', updatedAt: new Date().toISOString() },
]

export function CollectionsManager() {
  const { isDemoMode } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [managedCollections, setManagedCollections] = useState<ManagedCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<ManagedCollection | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchCollections = useCallback(async () => {
    if (isDemoMode) {
      setManagedCollections(DEMO_COLLECTIONS)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      showNotification('error', 'Không thể tải dữ liệu bộ sưu tập')
    } else if (data) {
      setManagedCollections(data.map((c: SupabaseCollectionRow) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.id,
        tagline: c.tagline || '',
        heroImage: c.hero_image || '',
        productCount: c.metadata?.products?.length || 0,
        status: (c.status as ContentStatus) || 'published',
        updatedAt: c.updated_at || c.created_at || new Date().toISOString(),
      })))
    }
    setIsLoading(false)
  }, [isDemoMode])

  useEffect(() => { fetchCollections() }, [fetchCollections])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const navTo = (href: string) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleCreate = () => {
    navTo('/admin/collections/new')
  }

  const handleEdit = (col: ManagedCollection) => {
    navTo(`/admin/collections/${col.id}`)
  }

  const handleView = (col: ManagedCollection) => {
    // Open the public page in a new tab (scroll to collection)
    window.open(`/#collection-${col.slug}`, '_blank')
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    if (isDemoMode) {
      setManagedCollections(prev => prev.filter(c => c.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.name}" thành công`)
      setDeleteTarget(null)
      return
    }

    setIsDeleting(true)
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', deleteTarget.id)

    if (error) {
      showNotification('error', `Lỗi khi xóa: ${error.message}`)
    } else {
      setManagedCollections(prev => prev.filter(c => c.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.name}" thành công`)
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  const filtered = useMemo(() => {
    let result = managedCollections
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter)
    }
    return result
  }, [managedCollections, searchQuery, statusFilter])

  const statusLabels: Record<ContentStatus, string> = {
    published: 'Đã xuất bản',
    draft: 'Bản nháp',
    archived: 'Đã lưu trữ',
  }

  return (
    <AdminLayout title="Quản lý bộ sưu tập" breadcrumb={['Quản trị', 'Nội dung', 'Bộ sưu tập']}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'admin-fadeIn 0.3s ease',
          maxWidth: 400,
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      {/* Action Bar */}
      <div className="admin-action-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search">
            <Search size={16} className="admin-search-icon" />
            <input
              placeholder="Tìm bộ sưu tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
            className="admin-input"
            style={{ maxWidth: 180, padding: '10px 14px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
        </div>

        <button type="button" className="admin-btn admin-btn-primary" onClick={handleCreate}>
          <Plus size={16} />
          Thêm bộ sưu tập
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng', value: managedCollections.length, c: '#1a1a2e' },
          { label: 'Đã xuất bản', value: managedCollections.filter(c => c.status === 'published').length, c: '#22c55e' },
          { label: 'Bản nháp', value: managedCollections.filter(c => c.status === 'draft').length, c: '#eab308' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '12px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.value}</span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Collections Table */}
      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{
            width: 32, height: 32,
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #f29d38',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải dữ liệu...
        </div>
      ) : filtered.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bộ sưu tập</th>
                <th>Sản phẩm</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((col) => (
                <tr key={col.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {col.heroImage ? (
                        <img
                          src={col.heroImage}
                          alt={col.name}
                          style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #f0f0f5' }}
                        />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', flexShrink: 0 }}>
                          <FolderOpen size={20} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500, color: '#1a1a2e' }}>{col.name}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {col.tagline}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 999, fontSize: 13 }}>
                      {col.productCount} mã
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${col.status}`}>
                      <span className="status-badge-dot" />
                      {statusLabels[col.status]}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>
                    {new Date(col.updatedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" title="Xem" onClick={() => handleView(col)}><Eye size={15} /></button>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa" onClick={() => handleEdit(col)}><Edit size={15} /></button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" title="Xóa" onClick={() => setDeleteTarget(col)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon"><FolderOpen size={28} /></div>
          <div className="admin-empty-title">Không tìm thấy bộ sưu tập</div>
          <div className="admin-empty-desc">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => !isDeleting && setDeleteTarget(null)} />
          <div style={{
            position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 440,
            padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            animation: 'admin-fadeIn 0.2s ease',
          }}>
            <button
              type="button" className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => !isDeleting && setDeleteTarget(null)}
              style={{ position: 'absolute', top: 16, right: 16, padding: 8 }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a2e' }}>Xác nhận xóa</h3>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: '0 0 24px', padding: 16, background: '#f9fafb', borderRadius: 12 }}>
              Bạn có chắc muốn xóa bộ sưu tập <strong>"{deleteTarget.name}"</strong>? Tất cả sản phẩm và dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Hủy
              </button>
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting} style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                {isDeleting ? 'Đang xóa...' : 'Xóa bộ sưu tập'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
