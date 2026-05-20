/** AdminHeader — Top header bar for admin pages */
import { Menu, Bell, Search } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  breadcrumb?: string[]
  onMenuToggle: () => void
}

export function AdminHeader({ title, breadcrumb = [], onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-header-menu-btn"
          onClick={onMenuToggle}
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        <div>
          {breadcrumb.length > 0 && (
            <div className="admin-header-breadcrumb">
              {breadcrumb.map((item, index) => (
                <span key={item}>
                  {index > 0 && <span className="admin-header-breadcrumb-sep">/</span>}
                  {index === breadcrumb.length - 1 ? (
                    <span className="admin-header-breadcrumb-current">{item}</span>
                  ) : (
                    <span>{item}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <h1 className="admin-header-title">{title}</h1>
        </div>
      </div>

      <div className="admin-header-right">
        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          title="Tìm kiếm"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          title="Thông báo"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid white',
          }} />
        </button>
      </div>
    </header>
  )
}
