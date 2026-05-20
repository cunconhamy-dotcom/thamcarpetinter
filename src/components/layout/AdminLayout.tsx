/** AdminLayout — Main layout wrapper for all admin pages */
import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import '@/styles/admin.css'

interface AdminLayoutProps {
  title: string
  breadcrumb?: string[]
  children: React.ReactNode
}

export function AdminLayout({ title, breadcrumb, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath = window.location.pathname

  return (
    <div className="admin-layout">
      <AdminSidebar
        currentPath={currentPath}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          title={title}
          breadcrumb={breadcrumb}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="admin-content admin-animate-in">
          {children}
        </div>
      </div>
    </div>
  )
}
