/** AdminSidebar — Main navigation sidebar for admin panel */
import { useAuth } from '@/contexts/AuthContext'

import {
  LayoutDashboard,
  Layout,
  FolderOpen,
  FileText,
  Image,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Bot,
  Users2,
  Mail
} from 'lucide-react'

interface NavSection {
  title: string
  items: {
    label: string
    href: string
    icon: typeof LayoutDashboard
    permission: string
    badge?: number
  }[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Bảng điều khiển', href: '/admin', icon: LayoutDashboard, permission: 'dashboard.view' },
    ],
  },
  {
    title: 'Trang chủ',
    items: [
      { label: 'Slider Trang Chủ', href: '/admin/ui-hero-sections', icon: Image, permission: 'homepage.view' },
    ],
  },
  {
    title: 'Bộ Sưu Tập & Nội Dung',
    items: [
      { label: 'Bộ Sưu Tập Core', href: '/admin/collections', icon: FolderOpen, permission: 'collections.view' },
      { label: 'Đặc Điểm Nổi Bật', href: '/admin/collection-value-points', icon: FileText, permission: 'collections.view' },
      { label: 'Thư Viện Ảnh', href: '/admin/collection-galleries', icon: Image, permission: 'collections.view' },
      { label: 'Tài Liệu', href: '/admin/collection-resources', icon: FileText, permission: 'collections.view' },
    ],
  },
  {
    title: 'Sản Phẩm',
    items: [
      { label: 'Sản Phẩm', href: '/admin/products', icon: LayoutDashboard, permission: 'collections.view' },
      { label: 'Thông Số Sản Phẩm', href: '/admin/product-specs', icon: Layout, permission: 'collections.view' },
    ]
  },
  {
    title: 'Khách hàng & CRM',
    items: [
      { label: 'Đăng ký tư vấn', href: '/admin/leads', icon: Users2, permission: 'collections.view' },
      { label: 'Email Marketing', href: '/admin/emails', icon: Mail, permission: 'collections.view' },
    ]
  },
  {
    title: 'Nội dung khác',
    items: [
      { label: 'Bài viết', href: '/admin/blog', icon: FileText, permission: 'blog.view' },
      { label: 'Thư viện media', href: '/admin/media', icon: Image, permission: 'media.view' },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Người dùng', href: '/admin/users', icon: Users, permission: 'users.view' },
      { label: 'Cài đặt', href: '/admin/settings', icon: Settings, permission: 'settings.view' },
      { label: 'Trợ lý AI', href: '/admin/ai-settings', icon: Bot, permission: 'settings.view' },
    ],
  },
]

interface AdminSidebarProps {
  currentPath: string
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ currentPath, isOpen, onClose }: AdminSidebarProps) {
  const { user, signOut, hasPermission } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    // Force router to re-evaluate — ProtectedRoute will show LoginPage
    window.history.pushState({}, '', '/admin')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const roleLabels: Record<string, string> = {
    admin: 'Quản trị viên',
    writer: 'Biên tập viên',
    viewer: 'Người xem',
  }

  const getInitials = (name: string | null, email: string): string => {
    if (name) {
      return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-logo">CI</div>
          <div className="admin-sidebar-brand-text">
            <div className="admin-sidebar-brand-name">Carpets Inter</div>
            <div className="admin-sidebar-brand-label">Quản trị</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(item =>
              hasPermission(item.permission)
            )

            if (visibleItems.length === 0) return null

            return (
              <div key={section.title} className="admin-sidebar-section">
                <div className="admin-sidebar-section-title">{section.title}</div>
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href + '/'))
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        window.history.pushState({}, '', item.href)
                        window.dispatchEvent(new PopStateEvent('popstate'))
                        onClose()
                      }}
                    >
                      <span className="admin-sidebar-link-icon">
                        <Icon size={18} />
                      </span>
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span className="admin-sidebar-link-badge">{item.badge}</span>
                      ) : null}
                      {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                    </a>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* User info */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {getInitials(user.fullName, user.email)}
          </div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-name">{user.fullName || user.email}</div>
            <div className="admin-sidebar-user-role">{roleLabels[user.role] ?? user.role}</div>
          </div>
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={handleSignOut}
            title="Đăng xuất"
            style={{ padding: '8px', borderRadius: '8px' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}
