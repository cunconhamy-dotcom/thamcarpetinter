/** CollectionsManager — CRUD management for carpet collections */
import { useState, useMemo, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Search, Plus, Edit, Trash2, Eye, FolderOpen } from 'lucide-react'
import type { ContentStatus } from '@/types/admin'

interface ManagedCollection {
  id: string
  name: string
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

export function CollectionsManager() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const [managedCollections, setManagedCollections] = useState<ManagedCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCollections() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching collections:', error)
      } else if (data) {
        setManagedCollections(data.map((c: SupabaseCollectionRow) => ({
          id: c.slug || c.id,
          name: c.name,
          tagline: c.tagline || '',
          heroImage: c.hero_image || '',
          productCount: c.metadata?.products?.length || 0,
          status: (c.status as ContentStatus) || 'published',
          updatedAt: c.updated_at || c.created_at || new Date().toISOString(),
        })))
      }
      setIsLoading(false)
    }

    fetchCollections()
  }, [])

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

        <button type="button" className="admin-btn admin-btn-primary" onClick={() => alert('Tính năng tạo mới sẽ sẵn sàng khi kết nối Supabase')}>
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
                      <img
                        src={col.heroImage}
                        alt={col.name}
                        style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #f0f0f5' }}
                      />
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
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" title="Xem"><Eye size={15} /></button>
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
          <div className="admin-empty-icon"><FolderOpen size={28} /></div>
          <div className="admin-empty-title">Không tìm thấy bộ sưu tập</div>
          <div className="admin-empty-desc">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</div>
        </div>
      )}
    </AdminLayout>
  )
}
