/** MediaManager — Upload and manage images/documents with Supabase Storage */
import { useState, useEffect, useRef, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Search, UploadCloud, Copy, Trash2, File as FileIcon, Check, X, AlertTriangle, Grid, List, Eye } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  url: string
  path: string
  size: string
  type: string
  createdAt: string
}

const DEMO_MEDIA: MediaItem[] = [
  { id: '1', name: 'office-carpet-1.jpg', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80', path: 'demo/1.jpg', size: '1.2 MB', type: 'image/jpeg', createdAt: '2026-05-12T10:00:00Z' },
  { id: '2', name: 'cleaning-guide-hero.jpg', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', path: 'demo/2.jpg', size: '850 KB', type: 'image/jpeg', createdAt: '2026-05-14T14:20:00Z' },
  { id: '3', name: 'hotel-lobby-carpet.webp', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', path: 'demo/3.webp', size: '2.1 MB', type: 'image/webp', createdAt: '2026-05-15T09:10:00Z' },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaManager() {
  const { isDemoMode, user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [dragOver, setDragOver] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const fetchMedia = useCallback(async () => {
    if (isDemoMode) {
      setMediaItems(DEMO_MEDIA)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching media:', error)
    } else if (data) {
      setMediaItems(data.map((m: Record<string, unknown>) => {
        const filePath = (m.file_path as string) || ''
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)
        return {
          id: m.id as string,
          name: (m.file_name as string) || filePath.split('/').pop() || 'file',
          url: urlData.publicUrl,
          path: filePath,
          size: formatFileSize((m.file_size as number) || 0),
          type: (m.file_type as string) || 'image',
          createdAt: (m.created_at as string) || new Date().toISOString(),
        }
      }))
    }
    setIsLoading(false)
  }, [isDemoMode])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  // Upload file
  const uploadFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', `"${file.name}" quá lớn (tối đa 5MB)`)
      return
    }

    if (isDemoMode) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newItem: MediaItem = {
          id: `demo-${Date.now()}`,
          name: file.name,
          url: ev.target?.result as string,
          path: `demo/${file.name}`,
          size: formatFileSize(file.size),
          type: file.type,
          createdAt: new Date().toISOString(),
        }
        setMediaItems(prev => [newItem, ...prev])
        showNotification('success', `Đã upload "${file.name}" (Demo)`)
      }
      reader.readAsDataURL(file)
      return
    }

    setUploading(true)
    setUploadProgress(20)

    const ext = file.name.split('.').pop() || 'jpg'
    const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    setUploadProgress(50)
    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)

    if (uploadErr) {
      showNotification('error', `Upload lỗi: ${uploadErr.message}`)
      setUploading(false)
      setUploadProgress(0)
      return
    }

    setUploadProgress(80)
    // Insert record into media table
    const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document'
    const { error: insertErr } = await supabase.from('media').insert({
      file_name: file.name,
      file_path: path,
      file_type: fileType,
      file_size: file.size,
      alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      uploaded_by: user?.id || 'unknown',
    })

    setUploadProgress(100)
    if (insertErr) {
      showNotification('error', `DB error: ${insertErr.message}`)
    } else {
      showNotification('success', `Đã upload "${file.name}" thành công`)
      await fetchMedia() // Refresh list
    }
    setTimeout(() => { setUploading(false); setUploadProgress(0) }, 500)
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(f => uploadFile(f))
  }

  // Copy URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      showNotification('success', 'Đã copy URL vào clipboard')
    } catch {
      showNotification('error', 'Không thể copy URL')
    }
  }

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    if (isDemoMode) {
      setMediaItems(prev => prev.filter(m => m.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.name}"`)
      setDeleteTarget(null)
      return
    }

    setIsDeleting(true)
    // Delete from Storage
    const { error: storageErr } = await supabase.storage.from('media').remove([deleteTarget.path])
    if (storageErr) console.warn('Storage delete warning:', storageErr)

    // Delete from DB
    const { error: dbErr } = await supabase.from('media').delete().eq('id', deleteTarget.id)
    if (dbErr) {
      showNotification('error', `Lỗi: ${dbErr.message}`)
    } else {
      setMediaItems(prev => prev.filter(m => m.id !== deleteTarget.id))
      showNotification('success', `Đã xóa "${deleteTarget.name}"`)
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  const filtered = mediaItems.filter(m =>
    searchQuery ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const isImage = (type: string) => type.startsWith('image') || type === 'image'

  return (
    <AdminLayout title="Thư viện Media" breadcrumb={['Quản trị', 'Media']}>
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

      {/* Action Bar */}
      <div className="admin-action-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          <div className="admin-search" style={{ maxWidth: 400 }}>
            <Search size={16} className="admin-search-icon" />
            <input placeholder="Tìm kiếm file media..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className={`admin-btn admin-btn-sm ${viewMode === 'grid' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setViewMode('grid')} title="Grid"><Grid size={16} /></button>
          <button type="button" className={`admin-btn admin-btn-sm ${viewMode === 'list' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setViewMode('list')} title="List"><List size={16} /></button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '12px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{mediaItems.length}</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Tổng file</span>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '12px 20px', border: '1px solid #f0f0f5', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#22c55e' }}>{mediaItems.filter(m => isImage(m.type)).length}</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Hình ảnh</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        style={{
          border: `2px dashed ${dragOver ? '#f29d38' : '#d1d5db'}`,
          borderRadius: 16, padding: uploading ? 24 : 48, textAlign: 'center',
          background: dragOver ? '#fef9e7' : 'white', cursor: 'pointer',
          marginBottom: 32, transition: 'all 0.2s ease',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div>
            <UploadCloud size={36} color="#f29d38" style={{ margin: '0 auto 12px', animation: 'pulse 1s infinite' }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f29d38', marginBottom: 12 }}>Đang upload...</div>
            <div style={{ width: '100%', maxWidth: 300, height: 6, borderRadius: 3, background: '#f3f4f6', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #f29d38, #e8832a)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ) : (
          <>
            <UploadCloud size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600, color: '#1a1a2e' }}>Kéo thả file vào đây để tải lên</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Hỗ trợ JPG, PNG, WEBP, PDF (Tối đa 5MB)</p>
            <button type="button" className="admin-btn admin-btn-secondary" style={{ marginTop: 24 }}
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
              Hoặc chọn file từ máy tính
            </button>
          </>
        )}
        <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" multiple
          style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải...
        </div>
      ) : filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {filtered.map((media) => (
              <div key={media.id} style={{
                background: 'white', borderRadius: 16, border: '1px solid #f0f0f5', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#f3f4f6', cursor: 'pointer' }}
                  onClick={() => isImage(media.type) && setPreviewItem(media)}>
                  {isImage(media.type) ? (
                    <img src={media.url} alt={media.name}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileIcon size={32} color="#d1d5db" />
                    </div>
                  )}
                  {isImage(media.type) && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 8, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Eye size={14} color="white" />
                    </div>
                  )}
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }} title={media.name}>
                    {media.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
                    {new Date(media.createdAt).toLocaleDateString('vi-VN')} • {media.size}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-full"
                      onClick={() => handleCopyUrl(media.url)}>
                      <Copy size={14} /> Copy URL
                    </button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => setDeleteTarget(media)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>File</th><th>Kích thước</th><th>Ngày upload</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {filtered.map(media => (
                  <tr key={media.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {isImage(media.type) ? (
                          <img src={media.url} alt={media.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileIcon size={16} color="#d1d5db" />
                          </div>
                        )}
                        <span style={{ fontWeight: 500, color: '#1a1a2e' }}>{media.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#9ca3af' }}>{media.size}</td>
                    <td style={{ fontSize: 13, color: '#9ca3af' }}>{new Date(media.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {isImage(media.type) && (
                          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPreviewItem(media)}><Eye size={15} /></button>
                        )}
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleCopyUrl(media.url)}><Copy size={15} /></button>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(media)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon"><FileIcon size={28} /></div>
          <div className="admin-empty-title">{mediaItems.length === 0 ? 'Thư viện trống' : 'Không tìm thấy file'}</div>
          <div className="admin-empty-desc">{mediaItems.length === 0 ? 'Kéo thả file hoặc nhấn nút upload để bắt đầu' : 'Thử thay đổi từ khóa tìm kiếm'}</div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPreviewItem(null)} />
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', animation: 'admin-fadeIn 0.2s ease' }}>
            <button type="button" onClick={() => setPreviewItem(null)}
              style={{ position: 'absolute', top: -40, right: 0, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </button>
            <img src={previewItem.url} alt={previewItem.name}
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} />
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 }}>
              {previewItem.name} • {previewItem.size}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => !isDeleting && setDeleteTarget(null)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 440, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'admin-fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Xóa file</h3>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>File sẽ bị xóa vĩnh viễn</p>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#4b5563', margin: '0 0 24px', padding: 16, background: '#f9fafb', borderRadius: 12 }}>
              Xóa <strong>"{deleteTarget.name}"</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Hủy</button>
              <button type="button" className="admin-btn" onClick={handleDeleteConfirm} disabled={isDeleting}
                style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                {isDeleting ? 'Đang xóa...' : 'Xóa file'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </AdminLayout>
  )
}
