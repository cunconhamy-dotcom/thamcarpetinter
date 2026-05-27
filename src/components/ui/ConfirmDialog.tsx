/**
 * ConfirmDialog — reusable confirmation modal.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={showDialog}
 *     title="Xóa bộ sưu tập?"
 *     message="Hành động này không thể hoàn tác."
 *     onConfirm={handleDelete}
 *     onCancel={() => setShowDialog(false)}
 *   />
 */

import React, { useEffect, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xóa',
  cancelLabel = 'Hủy',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel()
    },
    [onCancel, isLoading],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const isDanger = variant === 'danger'
  const iconBg = isDanger ? '#fef2f2' : '#fffbeb'
  const iconColor = isDanger ? '#ef4444' : '#f59e0b'
  const confirmBg = isDanger
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #f59e0b, #d97706)'

  return (
    <>
      {/* Backdrop */}
      <div
        style={backdropStyle}
        onClick={isLoading ? undefined : onCancel}
        aria-hidden
      />

      {/* Dialog */}
      <div style={wrapperStyle} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div style={cardStyle}>
          {/* Icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertTriangle size={26} color={iconColor} />
          </div>

          {/* Title */}
          <h3 id="confirm-title" style={titleStyle}>
            {title}
          </h3>

          {/* Message */}
          <p style={messageStyle}>{message}</p>

          {/* Actions */}
          <div style={actionsStyle}>
            <button
              className="admin-btn admin-btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {cancelLabel}
            </button>
            <button
              className="admin-btn"
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                background: confirmBg,
                color: 'white',
                boxShadow: isDanger
                  ? '0 4px 16px rgba(239,68,68,0.3)'
                  : '0 4px 16px rgba(245,158,11,0.3)',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <span style={spinnerWrapStyle}>
                  <span style={spinnerStyle} />
                  Đang xử lý…
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  zIndex: 9990,
  animation: 'confirm-fade-in 0.2s ease',
}

const wrapperStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9991,
  padding: 20,
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 20,
  padding: '36px 32px 28px',
  maxWidth: 420,
  width: '100%',
  boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  textAlign: 'center',
  animation: 'confirm-scale-in 0.25s ease',
}

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#1a1a2e',
  marginBottom: 8,
  letterSpacing: '-0.01em',
}

const messageStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  lineHeight: 1.6,
  marginBottom: 28,
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
}

const spinnerWrapStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
}

const spinnerStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'confirm-spin 0.6s linear infinite',
}

/* Inject keyframes via a hidden style tag rendered alongside the component */
const styleTag = document.createElement('style')
styleTag.textContent = `
@keyframes confirm-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes confirm-scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes confirm-spin {
  to { transform: rotate(360deg); }
}
`
if (!document.getElementById('confirm-dialog-keyframes')) {
  styleTag.id = 'confirm-dialog-keyframes'
  document.head.appendChild(styleTag)
}
