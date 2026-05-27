/**
 * ImageUploader — drag-and-drop image upload component.
 *
 * Usage:
 *   <ImageUploader
 *     value={form.heroImage}
 *     onChange={(url) => setForm({ ...form, heroImage: url })}
 *     folder="collections"
 *     aspectHint="1200×630px recommended"
 *   />
 */

import React, { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

export interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  maxSize?: number // MB
  aspectHint?: string
}

export function ImageUploader({
  value,
  onChange,
  bucket = 'media',
  folder,
  maxSize = 2,
  aspectHint,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      // Validate type
      if (!file.type.startsWith('image/')) {
        setError('Chỉ chấp nhận tệp hình ảnh (JPG, PNG, WebP…)')
        return
      }

      // Validate size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Kích thước tệp vượt quá ${maxSize}MB`)
        return
      }

      setIsUploading(true)
      setProgress(10)

      try {
        if (IS_DEMO) {
          // Demo mode: convert to data URL
          const reader = new FileReader()
          reader.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90))
          }
          reader.onload = () => {
            setProgress(100)
            onChange(reader.result as string)
            setTimeout(() => {
              setIsUploading(false)
              setProgress(0)
            }, 300)
          }
          reader.onerror = () => {
            setError('Lỗi khi đọc tệp.')
            setIsUploading(false)
            setProgress(0)
          }
          reader.readAsDataURL(file)
          return
        }

        // Production: upload to Supabase Storage
        setProgress(30)
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const storagePath = folder
          ? `${folder}/${timestamp}_${safeName}`
          : `uploads/${timestamp}_${safeName}`

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          setError(uploadError.message)
          setIsUploading(false)
          setProgress(0)
          return
        }

        setProgress(80)

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath)

        setProgress(100)
        onChange(urlData.publicUrl)

        setTimeout(() => {
          setIsUploading(false)
          setProgress(0)
        }, 300)
      } catch {
        setError('Lỗi khi tải lên. Vui lòng thử lại.')
        setIsUploading(false)
        setProgress(0)
      }
    },
    [bucket, folder, maxSize, onChange],
  )

  /* ---- Drag & Drop handlers ---- */
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so re-selecting the same file triggers change
      e.target.value = ''
    },
    [handleFile],
  )

  const handleRemove = useCallback(() => {
    onChange('')
    setError(null)
  }, [onChange])

  /* ---- Render: has image ---- */
  if (value) {
    return (
      <div style={previewContainerStyle}>
        <img
          src={value}
          alt="Preview"
          style={previewImgStyle}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <div style={previewOverlayStyle}>
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            Thay đổi
          </button>
          <button
            className="admin-btn admin-btn-danger admin-btn-sm"
            onClick={handleRemove}
            type="button"
          >
            <X size={14} /> Xóa
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  /* ---- Render: upload zone ---- */
  return (
    <div>
      <div
        style={{
          ...dropZoneStyle,
          borderColor: isDragging ? '#f29d38' : '#d1d5db',
          background: isDragging ? '#fef9f0' : '#fafbfc',
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
      >
        {isUploading ? (
          <div style={uploadingContentStyle}>
            <UploadCloud size={28} color="#f29d38" />
            <span style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              Đang tải lên… {progress}%
            </span>
            <div style={progressBarTrackStyle}>
              <div
                style={{
                  ...progressBarFillStyle,
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div style={uploadingContentStyle}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageIcon size={24} color="#9ca3af" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                Kéo thả hình ảnh hoặc{' '}
                <span style={{ color: '#f29d38', fontWeight: 600 }}>chọn tệp</span>
              </span>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                JPG, PNG, WebP • Tối đa {maxSize}MB
              </div>
              {aspectHint && (
                <div style={{ fontSize: 11, color: '#b0b5bf', marginTop: 2 }}>
                  {aspectHint}
                </div>
              )}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const dropZoneStyle: React.CSSProperties = {
  border: '2px dashed #d1d5db',
  borderRadius: 14,
  padding: '32px 20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 140,
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
}

const uploadingContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

const progressBarTrackStyle: React.CSSProperties = {
  width: 200,
  height: 6,
  borderRadius: 3,
  background: '#e5e7eb',
  overflow: 'hidden',
  marginTop: 4,
}

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: 3,
  background: 'linear-gradient(90deg, #f29d38, #e8832a)',
  transition: 'width 0.3s ease',
}

const previewContainerStyle: React.CSSProperties = {
  position: 'relative',
  borderRadius: 14,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  background: '#f9fafb',
}

const previewImgStyle: React.CSSProperties = {
  width: '100%',
  height: 200,
  objectFit: 'cover',
  display: 'block',
}

const previewOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '10px 12px',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
}

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#ef4444',
  marginTop: 8,
}
