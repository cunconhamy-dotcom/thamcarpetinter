/**
 * Toast notification system for the admin panel.
 *
 * Usage:
 *   1. Wrap your app with <ToastProvider>
 *   2. const { toast } = useToast()
 *   3. toast({ title: 'Thành công!', variant: 'success' })
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastVariant = 'success' | 'error' | 'warning'

export interface ToastData {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (opts: Omit<ToastData, 'id'>) => void
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (opts: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const newToast: ToastData = { ...opts, id }
      setToasts((prev) => [...prev, newToast])

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — bottom-right */}
      {toasts.length > 0 && (
        <div style={containerStyle}>
          {toasts.map((t) => (
            <ToastItem key={t.id} data={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  Single toast item                                                  */
/* ------------------------------------------------------------------ */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { borderColor: string; iconColor: string; bgTint: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    borderColor: '#22c55e',
    iconColor: '#16a34a',
    bgTint: '#f0fdf4',
    Icon: CheckCircle2,
  },
  error: {
    borderColor: '#ef4444',
    iconColor: '#dc2626',
    bgTint: '#fef2f2',
    Icon: XCircle,
  },
  warning: {
    borderColor: '#f59e0b',
    iconColor: '#d97706',
    bgTint: '#fffbeb',
    Icon: AlertTriangle,
  },
}

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const { borderColor, iconColor, bgTint, Icon } = VARIANT_CONFIG[data.variant]

  return (
    <div
      style={{
        ...toastStyle,
        borderLeftColor: borderColor,
        backgroundColor: bgTint,
        animation: 'toast-slide-in 0.3s ease forwards',
      }}
      role="alert"
    >
      <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={titleStyle}>{data.title}</div>
        {data.description && <div style={descStyle}>{data.description}</div>}
      </div>
      <button onClick={onDismiss} style={closeBtnStyle} aria-label="Đóng">
        <X size={16} />
      </button>

      {/* Inline keyframes — injected once */}
      <style>{keyframes}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Styles (inline to keep the component self-contained)               */
/* ------------------------------------------------------------------ */

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  pointerEvents: 'none',
  maxWidth: 400,
  width: '100%',
}

const toastStyle: React.CSSProperties = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '14px 16px',
  borderRadius: 12,
  borderLeft: '4px solid',
  background: 'white',
  boxShadow: '0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  opacity: 0,
  transform: 'translateX(40px)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1a1a2e',
  lineHeight: 1.4,
}

const descStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
  marginTop: 2,
  lineHeight: 1.5,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  color: '#9ca3af',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'color 0.15s',
}

const keyframes = `
@keyframes toast-slide-in {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
`
