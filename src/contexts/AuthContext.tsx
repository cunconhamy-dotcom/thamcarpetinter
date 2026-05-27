/**
 * AuthContext — provides authentication state and actions.
 * Supports two modes:
 *   1. Demo mode (default): localStorage-based, no Supabase needed.
 *      Credentials: admin@carpetsinter.vn / admin123
 *   2. Supabase mode: activated automatically when VITE_SUPABASE_URL is set.
 */
import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { type UserProfile, type UserRole, type AuthState, DEFAULT_ROLE_PERMISSIONS } from '@/types/auth'

// ─── Demo Mode Config ────────────────────────────────────────────────────────
const DEMO_EMAIL = 'admin@carpetsinter.vn'
const DEMO_PASSWORD = 'admin123'
const DEMO_SESSION_KEY = 'ci_admin_demo_session'

const DEMO_USER: UserProfile = {
  id: 'demo-admin-001',
  email: DEMO_EMAIL,
  fullName: 'Admin Demo',
  avatarUrl: null,
  role: 'admin' as UserRole,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ─── Determine if running in demo mode ───────────────────────────────────────
const IS_DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL

// ─── Ensure supabase module loads once ───────────────────────────────────────
let supabaseModule: typeof import('@/lib/supabase') | null = null
const supabaseReady: Promise<typeof import('@/lib/supabase') | null> = IS_DEMO_MODE
  ? Promise.resolve(null)
  : import('@/lib/supabase').then((m) => { supabaseModule = m; return m }).catch(() => null)

// ─── Context types ────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  permissions: Record<string, string[]>
  setPermissions: (newPerms: Record<string, string[]>) => void
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (IS_DEMO_MODE) {
      try {
        const saved = localStorage.getItem(DEMO_SESSION_KEY)
        if (saved === 'active') {
          return { user: DEMO_USER, isLoading: false, isAuthenticated: true }
        }
      } catch {
        // Ignore localStorage error
      }
      return { user: null, isLoading: false, isAuthenticated: false }
    }
    return { user: null, isLoading: true, isAuthenticated: false }
  })

  const [permissions, setPermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  // ── Fetch profile helper ──
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const mod = supabaseModule || await supabaseReady
    if (!mod) return null
    try {
      const { data, error } = await mod.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) return null

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        role: data.role as UserRole,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch {
      return null
    }
  }, [])

  // ── Init on mount (Supabase mode only) ──
  useEffect(() => {
    if (IS_DEMO_MODE) return

    let cancelled = false

    const init = async () => {
      const mod = await supabaseReady
      if (!mod || cancelled) return

      // 1. Set up auth state change subscription FIRST
      const { data: { subscription } } = mod.supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (cancelled) return
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            if (!cancelled) setState({ user: profile, isLoading: false, isAuthenticated: !!profile })
          } else {
            if (!cancelled) setState({ user: null, isLoading: false, isAuthenticated: false })
          }
        }
      )
      subscriptionRef.current = subscription

      // 2. Load permissions from site_config
      try {
        const { data: configData } = await mod.supabase.from('site_config').select('value').eq('key', 'role_permissions').maybeSingle()
        if (configData?.value && !cancelled) {
          setPermissions({ ...DEFAULT_ROLE_PERMISSIONS, ...(configData.value as any) })
        }
      } catch { /* ignore */ }

      // 3. Check existing session
      try {
        const { data: { session } } = await mod.supabase.auth.getSession()
        if (cancelled) return

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (!cancelled) setState({ user: profile, isLoading: false, isAuthenticated: !!profile })
        } else {
          if (!cancelled) setState({ user: null, isLoading: false, isAuthenticated: false })
        }
      } catch {
        if (!cancelled) setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    }

    init()

    return () => {
      cancelled = true
      subscriptionRef.current?.unsubscribe()
    }
  }, [fetchProfile])

  // ─── signIn ───────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    if (IS_DEMO_MODE) {
      if (
        email.trim().toLowerCase() === DEMO_EMAIL &&
        password === DEMO_PASSWORD
      ) {
        localStorage.setItem(DEMO_SESSION_KEY, 'active')
        setState({ user: DEMO_USER, isLoading: false, isAuthenticated: true })
        return { error: null }
      }
      return { error: 'DEMO_INVALID' }
    }

    const mod = supabaseModule || await supabaseReady
    if (!mod) return { error: 'Supabase chưa được cấu hình.' }

    const { data, error } = await mod.supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }

    // Immediately fetch profile and update state (don't rely solely on subscription)
    if (data.user) {
      const profile = await fetchProfile(data.user.id)
      setState({ user: profile, isLoading: false, isAuthenticated: !!profile })
    }

    return { error: null }
  }, [fetchProfile])

  // ─── signOut ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (IS_DEMO_MODE) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return
    }
    const mod = supabaseModule || await supabaseReady
    if (mod) await mod.supabase.auth.signOut()
    setState({ user: null, isLoading: false, isAuthenticated: false })
  }, [])

  // ─── hasPermission ────────────────────────────────────────────────────────
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false
    if (state.user.role === 'admin') return true
    const perms = permissions[state.user.role] ?? []
    return perms.includes(permission)
  }, [state.user, permissions])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, hasPermission, permissions, setPermissions, isDemoMode: IS_DEMO_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
