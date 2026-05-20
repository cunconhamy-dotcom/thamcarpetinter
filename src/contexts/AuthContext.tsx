/**
 * AuthContext — provides authentication state and actions.
 * Supports two modes:
 *   1. Demo mode (default): localStorage-based, no Supabase needed.
 *      Credentials: admin@carpetsinter.vn / admin123
 *   2. Supabase mode: activated automatically when VITE_SUPABASE_URL is set.
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { type UserProfile, type UserRole, type AuthState, ROLE_PERMISSIONS } from '@/types/auth'

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

// ─── Supabase (lazy import to avoid errors when not configured) ───────────────
let supabaseModule: typeof import('@/lib/supabase') | null = null
if (!IS_DEMO_MODE) {
  import('@/lib/supabase').then((m) => { supabaseModule = m }).catch(() => {})
}

// ─── Context types ────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const isDemo = !import.meta.env.VITE_SUPABASE_URL
    if (isDemo) {
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

  // ── Supabase mode init ──
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!supabaseModule) return null
    try {
      const { data, error } = await supabaseModule.supabase
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

  const initSupabase = useCallback(async () => {
    try {
      const module = supabaseModule || await import('@/lib/supabase')
      supabaseModule = module

      const { data: { session } } = await module.supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({ user: profile, isLoading: false, isAuthenticated: !!profile })
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false })
    }
  }, [fetchProfile])

  // ── Init on mount ──
  useEffect(() => {
    if (IS_DEMO_MODE) {
      // Demo session is already initialized synchronously in useState
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    initSupabase()

    // Subscribe to Supabase auth changes
    const setupSubscription = async () => {
      if (!supabaseModule) return
      const { data: { subscription } } = supabaseModule.supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            setState({ user: profile, isLoading: false, isAuthenticated: !!profile })
          } else {
            setState({ user: null, isLoading: false, isAuthenticated: false })
          }
        }
      )
      return subscription
    }

    let unsubscribe: (() => void) | undefined
    setupSubscription().then((sub) => { unsubscribe = sub?.unsubscribe })
    return () => { unsubscribe?.() }
  }, [initSupabase, fetchProfile])

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

    if (!supabaseModule) return { error: 'Supabase chưa được cấu hình.' }
    const { error } = await supabaseModule.supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  // ─── signOut ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (IS_DEMO_MODE) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return
    }
    if (supabaseModule) await supabaseModule.supabase.auth.signOut()
    setState({ user: null, isLoading: false, isAuthenticated: false })
  }, [])

  // ─── hasPermission ────────────────────────────────────────────────────────
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false
    const perms = ROLE_PERMISSIONS[state.user.role] ?? []
    return perms.includes(permission)
  }, [state.user])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, hasPermission, isDemoMode: IS_DEMO_MODE }}>
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
