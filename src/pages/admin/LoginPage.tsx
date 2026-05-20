/** LoginPage — Admin login with email/password (demo or Supabase) */
import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import '@/styles/admin.css'

export function LoginPage() {
  const { signIn, isDemoMode } = useAuth()
  const [email, setEmail] = useState(isDemoMode ? 'admin@carpetsinter.vn' : '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.')
      setIsLoading(false)
      return
    }

    const result = await signIn(email, password)

    if (result.error) {
      if (result.error === 'DEMO_INVALID') {
        setError('Sai thông tin đăng nhập. Thử: admin@carpetsinter.vn / admin123')
      } else {
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'Email hoặc mật khẩu không đúng.',
          'Email not confirmed': 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.',
          'Too many requests': 'Quá nhiều lần thử. Vui lòng đợi vài phút.',
        }
        setError(errorMessages[result.error] ?? `Đăng nhập thất bại: ${result.error}`)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">CI</div>
        <h1 className="admin-login-title">Đăng Nhập Quản Trị</h1>
        <p className="admin-login-subtitle">
          Carpets Inter Vietnam — Hệ thống quản lý nội dung
        </p>

        {/* Demo mode banner */}
        {isDemoMode && (
          <div style={{
            background: 'linear-gradient(135deg, #fff8ed, #fff3d6)',
            border: '1px solid #f0c070',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: '#92400e',
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🎭 Chế độ Demo</div>
            <div>Email: <code style={{ background: '#fde68a', padding: '1px 5px', borderRadius: 4 }}>admin@carpetsinter.vn</code></div>
            <div>Mật khẩu: <code style={{ background: '#fde68a', padding: '1px 5px', borderRadius: 4 }}>admin123</code></div>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={`admin-input ${error ? 'error' : ''}`}
              placeholder="admin@carpetsinter.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="login-password">
              Mật khẩu
            </label>
            <input
              id="login-password"
              type="password"
              className={`admin-input ${error ? 'error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-input-error" style={{ fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block',
                }} />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {isDemoMode && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#d97706', marginTop: 16 }}>
            Demo mode — Dữ liệu không được lưu trên server
          </p>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          © 2026 Carpets Inter Vietnam. Bảo lưu mọi quyền.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
