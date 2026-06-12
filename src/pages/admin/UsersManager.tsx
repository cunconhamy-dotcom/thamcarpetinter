/** UsersManager — Manage admin users and roles */
import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Users, Shield, ShieldCheck, Eye, Check, X, Save } from 'lucide-react'
import { type UserRole, DEFAULT_ROLE_PERMISSIONS, PERMISSION_GROUPS } from '@/types/auth'

interface UserItem {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: string
}

const DEMO_USERS: UserItem[] = [
  { id: 'demo-admin-001', email: 'admin@carpetsinter.vn', fullName: 'Admin Demo', avatarUrl: null, role: 'admin', createdAt: new Date().toISOString() },
]

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; icon: typeof Shield }> = {
  admin: { label: 'Quản trị viên', color: '#8b5cf6', bg: '#f0e8fe', icon: ShieldCheck },
  writer: { label: 'Biên tập viên', color: '#3b82f6', bg: '#e8f0fe', icon: Shield },
  viewer: { label: 'Người xem', color: '#6b7280', bg: '#f3f4f6', icon: Eye },
}

export function UsersManager() {
  const { user, isDemoMode, hasPermission } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [changingRole, setChangingRole] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const canEditUsers = hasPermission('users.edit')
  
  // Permissions State
  const { permissions, setPermissions } = useAuth()
  const [writerPerms, setWriterPerms] = useState<string[]>(permissions.writer ?? DEFAULT_ROLE_PERMISSIONS.writer)
  const [isSavingPerms, setIsSavingPerms] = useState(false)

  // Sync state if context changes
  useEffect(() => {
    setWriterPerms(permissions.writer ?? DEFAULT_ROLE_PERMISSIONS.writer)
  }, [permissions.writer])

  const fetchUsers = useCallback(async () => {
    if (isDemoMode) {
      setUsers(DEMO_USERS)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      showNotification('error', 'Không thể tải danh sách người dùng')
    } else if (data) {
      setUsers(data.map((u: Record<string, unknown>) => ({
        id: u.id as string,
        email: (u.email as string) || '',
        fullName: (u.full_name as string) || null,
        avatarUrl: (u.avatar_url as string) || null,
        role: ((u.role as string) || 'viewer') as UserRole,
        createdAt: (u.created_at as string) || new Date().toISOString(),
      })))
    }
    setIsLoading(false)
  }, [isDemoMode])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === user?.id) {
      showNotification('error', 'Không thể thay đổi vai trò của chính mình')
      return
    }

    if (isDemoMode) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showNotification('success', 'Đã cập nhật vai trò (Demo)')
      return
    }

    setChangingRole(userId)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      showNotification('error', `Lỗi: ${error.message}`)
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showNotification('success', 'Đã cập nhật vai trò thành công')
    }
    setChangingRole(null)
  }

  const getInitials = (name: string | null, email: string): string => {
    if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    return email.slice(0, 2).toUpperCase()
  }

  const handleSavePermissions = async () => {
    setIsSavingPerms(true)
    const newPerms = { ...permissions, writer: writerPerms }
    
    if (isDemoMode) {
      setPermissions(newPerms)
      showNotification('success', 'Đã lưu phân quyền (Demo Mode)')
      setIsSavingPerms(false)
      return
    }

    const { error } = await supabase.from('site_config').upsert(
      { key: 'role_permissions', value: newPerms, updated_by: user?.id },
      { onConflict: 'key' }
    )

    if (error) {
      showNotification('error', 'Lỗi khi lưu phân quyền')
    } else {
      setPermissions(newPerms)
      showNotification('success', 'Đã lưu phân quyền thành công')
    }
    setIsSavingPerms(false)
  }

  const togglePermission = (perm: string) => {
    setWriterPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])
  }

  const AVATAR_COLORS = ['#f29d38', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4']


  return (
    <AdminLayout title="Quản lý Người dùng" breadcrumb={['Quản trị', 'Hệ thống', 'Người dùng']}>
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
          {notification.type === 'success' ? <Check size={18} style={{ color: '#22c55e' }} /> : <X size={18} style={{ color: '#ef4444' }} />}
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng người dùng', value: users.length, c: '#1a1a2e', icon: Users },
          { label: 'Quản trị viên', value: users.filter(u => u.role === 'admin').length, c: '#8b5cf6', icon: ShieldCheck },
          { label: 'Biên tập viên', value: users.filter(u => u.role === 'writer').length, c: '#3b82f6', icon: Shield },
          { label: 'Người xem', value: users.filter(u => u.role === 'viewer').length, c: '#6b7280', icon: Eye },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 14, alignItems: 'center', flex: '1 1 180px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.c }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải...
        </div>
      ) : users.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                {canEditUsers && <th style={{ textAlign: 'right' }}>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const roleCfg = ROLE_CONFIG[u.role]
                const RoleIcon = roleCfg.icon
                const isSelf = u.id === user?.id
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: `linear-gradient(135deg, ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 600, fontSize: 14, flexShrink: 0,
                        }}>
                          {getInitials(u.fullName, u.email)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: '#1a1a2e' }}>
                            {u.fullName || 'Chưa đặt tên'}
                            {isSelf && <span style={{ fontSize: 11, color: '#f29d38', marginLeft: 8, fontWeight: 400 }}>(Bạn)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                        background: roleCfg.bg, color: roleCfg.color,
                      }}>
                        <RoleIcon size={12} />
                        {roleCfg.label}
                      </span>
                      {u.role === 'writer' && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                          background: '#f1f5f9', color: '#64748b', marginLeft: 8
                        }}>
                          {writerPerms.length} quyền
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: '#9ca3af' }}>
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    {canEditUsers && (
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {isSelf ? (
                            <span style={{ fontSize: 12, color: '#d1d5db' }}>—</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                              disabled={changingRole === u.id}
                              className="admin-input"
                              style={{ maxWidth: 160, padding: '6px 10px', fontSize: 13 }}
                            >
                              <option value="admin">Quản trị viên</option>
                              <option value="writer">Biên tập viên</option>
                              <option value="viewer">Người xem</option>
                            </select>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Users size={28} /></div>
          <div className="admin-empty-title">Chưa có người dùng</div>
          <div className="admin-empty-desc">Người dùng sẽ xuất hiện khi đăng ký tài khoản</div>
        </div>
      )}

      {/* Permissions Editor */}
      {canEditUsers && (
        <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={20} color="#3b82f6" /> Phân quyền Biên tập viên (Writer)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Tùy chỉnh các quyền hạn dành cho người hỗ trợ đăng bài, chỉnh sửa.</p>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleSavePermissions} disabled={isSavingPerms}>
              <Save size={16} /> {isSavingPerms ? 'Đang lưu...' : 'Lưu phân quyền'}
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {PERMISSION_GROUPS.map(group => {
              const groupPerms = group.permissions.map(p => p.key)
              const selectedCount = groupPerms.filter(p => writerPerms.includes(p)).length
              const allSelected = selectedCount === groupPerms.length && groupPerms.length > 0
              
              const handleToggleAll = () => {
                if (allSelected) {
                  setWriterPerms(prev => prev.filter(p => !groupPerms.includes(p as any)))
                } else {
                  setWriterPerms(prev => Array.from(new Set([...prev, ...groupPerms])))
                }
              }

              return (
                <div key={group.label} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{group.label}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{group.description}</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={allSelected} 
                        onChange={handleToggleAll}
                        style={{ width: 14, height: 14, accentColor: '#f29d38' }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#f29d38' }}>Tất cả</span>
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {group.permissions.map(perm => {
                      const isChecked = writerPerms.includes(perm.key)
                      return (
                        <label key={perm.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(perm.key as string)}
                            style={{ width: 16, height: 16, marginTop: 2, accentColor: '#3b82f6' }}
                          />
                          <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.4 }}>{perm.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
