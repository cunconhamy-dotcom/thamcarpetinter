/** DashboardPage — Admin dashboard with stats and quick actions */
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { FolderOpen, FileText, Image, Users, TrendingUp, Eye, Clock, Sparkles } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'

  const stats = [
    { label: 'Bộ sưu tập', value: 9, icon: FolderOpen, color: 'amber', trend: '+2 tuần này' },
    { label: 'Bài viết', value: 0, icon: FileText, color: 'blue', trend: 'Chưa có bài' },
    { label: 'Media files', value: 0, icon: Image, color: 'green', trend: 'Chưa upload' },
    { label: 'Người dùng', value: 1, icon: Users, color: 'purple', trend: 'Admin' },
  ]

  const activities = [
    { icon: Sparkles, title: 'Hệ thống quản trị khởi tạo', desc: 'Admin panel đã sẵn sàng', time: 'Vừa xong', c: '#f29d38' },
    { icon: FolderOpen, title: '9 bộ sưu tập đã import', desc: 'Foundation, Fascination, Discovery...', time: 'Hôm nay', c: '#3b82f6' },
    { icon: Eye, title: 'Website đang hoạt động', desc: 'Public website accessible', time: 'Đang chạy', c: '#22c55e' },
  ]

  const actions = [
    { label: 'Quản lý bộ sưu tập', desc: 'Thêm, sửa, xóa bộ sưu tập thảm', href: '/admin/collections', icon: FolderOpen, c: '#f29d38' },
    { label: 'Viết bài mới', desc: 'Tạo bài viết blog mới', href: '/admin/blog/new', icon: FileText, c: '#3b82f6' },
    { label: 'Upload media', desc: 'Thêm hình ảnh, video vào thư viện', href: '/admin/media', icon: Image, c: '#22c55e' },
  ]

  const navTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <AdminLayout title={`${greeting}, ${user?.fullName || 'Admin'}!`} breadcrumb={['Quản trị', 'Bảng điều khiển']}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`stat-card admin-animate-in admin-stagger-${i + 1}`} style={{ opacity: 0 }}>
              <div className="stat-card-header">
                <div className={`stat-card-icon ${s.color}`}><Icon size={22} /></div>
                <span className="stat-card-trend up">{s.trend}</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity + Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* Recent Activity */}
        <div>
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-section-title">Hoạt động gần đây</div>
              <div className="dashboard-section-desc">Cập nhật mới nhất</div>
            </div>
            <Clock size={18} style={{ color: '#9ca3af' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activities.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.title} style={{ display: 'flex', gap: 14, background: 'white', padding: 16, borderRadius: 14, border: '1px solid #f0f0f5' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${a.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.c, flexShrink: 0 }}><Icon size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#d1d5db', flexShrink: 0 }}>{a.time}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-section-title">Thao tác nhanh</div>
              <div className="dashboard-section-desc">Chức năng thường dùng</div>
            </div>
            <TrendingUp size={18} style={{ color: '#9ca3af' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {actions.map((a) => {
              const Icon = a.icon
              return (
                <a key={a.label} href={a.href} onClick={navTo(a.href)} style={{ display: 'flex', gap: 14, background: 'white', padding: 18, borderRadius: 14, border: '1px solid #f0f0f5', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.c, flexShrink: 0 }}><Icon size={22} /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#1a1a2e' }}>{a.label}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{a.desc}</div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* System Info */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: 16, padding: 24, marginTop: 16, color: 'white' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Thông tin hệ thống</div>
            <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
              {[['Backend', 'Supabase'], ['Frontend', 'React 19 + Vite'], ['Database', 'PostgreSQL'], ['Phiên bản', 'v1.0.0']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{k}</span>
                  <span style={{ color: k === 'Backend' ? '#f29d38' : 'white' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
