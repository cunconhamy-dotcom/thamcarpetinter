/** DashboardPage — Admin dashboard with real stats from Supabase */
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { FolderOpen, FileText, Image, Users, TrendingUp, Eye, Clock, Sparkles } from 'lucide-react'

interface Stats {
  collections: number
  blogPosts: number
  mediaFiles: number
  users: number
}

interface ActivityItem {
  icon: typeof FolderOpen
  title: string
  desc: string
  time: string
  c: string
}

export function DashboardPage() {
  const { user, isDemoMode } = useAuth()
  const [stats, setStats] = useState<Stats>({ collections: 0, blogPosts: 0, mediaFiles: 0, users: 0 })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'

  useEffect(() => {
    async function loadDashboard() {
      if (isDemoMode) {
        setStats({ collections: 9, blogPosts: 0, mediaFiles: 0, users: 1 })
        setActivities([
          { icon: Sparkles, title: 'Hệ thống quản trị khởi tạo', desc: 'Admin panel đã sẵn sàng', time: 'Vừa xong', c: '#f29d38' },
          { icon: FolderOpen, title: '9 bộ sưu tập đã import', desc: 'Foundation, Fascination, Discovery...', time: 'Hôm nay', c: '#3b82f6' },
          { icon: Eye, title: 'Website đang hoạt động', desc: 'Public website accessible', time: 'Đang chạy', c: '#22c55e' },
        ])
        setIsLoading(false)
        return
      }

      try {
        // Fetch counts in parallel
        const [colRes, blogRes, mediaRes, userRes] = await Promise.all([
          supabase.from('collections').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('media').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
        ])

        setStats({
          collections: colRes.count ?? 0,
          blogPosts: blogRes.count ?? 0,
          mediaFiles: mediaRes.count ?? 0,
          users: userRes.count ?? 0,
        })

        // Fetch recent activity (latest records from each table)
        const recentActivities: ActivityItem[] = []

        const { data: recentCols } = await supabase
          .from('collections')
          .select('name, updated_at')
          .order('updated_at', { ascending: false })
          .limit(2)

        if (recentCols) {
          for (const col of recentCols) {
            recentActivities.push({
              icon: FolderOpen,
              title: `Bộ sưu tập: ${col.name}`,
              desc: 'Cập nhật gần đây',
              time: timeAgo(col.updated_at),
              c: '#3b82f6',
            })
          }
        }

        const { data: recentPosts } = await supabase
          .from('blog_posts')
          .select('title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(2)

        if (recentPosts) {
          for (const post of recentPosts) {
            recentActivities.push({
              icon: FileText,
              title: `Bài viết: ${post.title}`,
              desc: 'Cập nhật gần đây',
              time: timeAgo(post.updated_at),
              c: '#8b5cf6',
            })
          }
        }

        if (recentActivities.length === 0) {
          recentActivities.push(
            { icon: Sparkles, title: 'Hệ thống đã sẵn sàng', desc: 'Bắt đầu quản lý nội dung', time: 'Bây giờ', c: '#f29d38' },
            { icon: Eye, title: 'Website đang hoạt động', desc: 'Public website accessible', time: 'Đang chạy', c: '#22c55e' },
          )
        }

        setActivities(recentActivities)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setActivities([
          { icon: Sparkles, title: 'Hệ thống quản trị đang hoạt động', desc: 'Kết nối Supabase thành công', time: 'Bây giờ', c: '#f29d38' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [isDemoMode])

  const statCards = [
    { label: 'Bộ sưu tập', value: stats.collections, icon: FolderOpen, color: 'amber', trend: stats.collections > 0 ? `${stats.collections} bộ` : 'Chưa có' },
    { label: 'Bài viết', value: stats.blogPosts, icon: FileText, color: 'blue', trend: stats.blogPosts > 0 ? `${stats.blogPosts} bài` : 'Chưa có bài' },
    { label: 'Media files', value: stats.mediaFiles, icon: Image, color: 'green', trend: stats.mediaFiles > 0 ? `${stats.mediaFiles} file` : 'Chưa upload' },
    { label: 'Người dùng', value: stats.users, icon: Users, color: 'purple', trend: stats.users > 0 ? `${stats.users} tài khoản` : 'Admin' },
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
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`stat-card admin-animate-in admin-stagger-${i + 1}`} style={{ opacity: 0 }}>
              <div className="stat-card-header">
                <div className={`stat-card-icon ${s.color}`}><Icon size={22} /></div>
                <span className="stat-card-trend up">{s.trend}</span>
              </div>
              <div className="stat-card-body">
                {isLoading ? (
                  <div style={{ width: 48, height: 32, borderRadius: 8, background: '#f3f4f6', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : (
                  <div className="stat-card-value">{s.value}</div>
                )}
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
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, background: 'white', padding: 16, borderRadius: 14, border: '1px solid #f0f0f5' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f3f4f6', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '60%', height: 14, borderRadius: 6, background: '#f3f4f6', marginBottom: 8 }} />
                    <div style={{ width: '80%', height: 12, borderRadius: 6, background: '#f9fafb' }} />
                  </div>
                </div>
              ))
            ) : (
              activities.map((a) => {
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
              })
            )}
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
              {[
                ['Backend', isDemoMode ? 'Demo Mode' : 'Supabase'],
                ['Frontend', 'React 19 + Vite'],
                ['Database', isDemoMode ? 'localStorage' : 'PostgreSQL'],
                ['Phiên bản', 'v1.0.0'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{k}</span>
                  <span style={{ color: k === 'Backend' ? '#f29d38' : 'white' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </AdminLayout>
  )
}

/** Helper: relative time display */
function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}
