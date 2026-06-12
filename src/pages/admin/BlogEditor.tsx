/** BlogEditor — Create/Edit blog post with ContentEditable rich editor */
import { useState, useEffect, useRef, type FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  Save, ArrowLeft, Image as ImageIcon, Check, X, UploadCloud,
  Bold, Italic, Underline, Heading2, List, ListOrdered, Link2, Minus,
  ImagePlus, Video,
} from 'lucide-react'

const toSlug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function BlogEditor() {
  const { user, isDemoMode } = useAuth()
  const editorRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('draft')
  const [category, setCategory] = useState('news')
  const [excerpt, setExcerpt] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Determine mode
  const pathParts = window.location.pathname.split('/')
  const postId = pathParts[pathParts.length - 1]
  const isEditMode = postId !== 'new' && postId !== 'blog'

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg })
    setTimeout(() => setNotification(null), 4000)
  }

  const navTo = (href: string) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Load existing post
  useEffect(() => {
    if (!isEditMode || isDemoMode) return
    async function load() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error || !data) {
        showNotification('error', 'Không tìm thấy bài viết')
        setIsLoading(false)
        return
      }

      setTitle(data.title || '')
      setStatus(data.status || 'draft')
      setCategory(data.category || 'news')
      setExcerpt(data.excerpt || '')
      setMetaDescription(data.meta_description || '')
      setThumbnail(data.cover_image || '')
      setThumbnailPreview(data.cover_image || '')

      // Set editor content
      if (editorRef.current) {
        const content = data.content
        if (typeof content === 'string') {
          editorRef.current.innerHTML = content
        } else if (content && typeof content === 'object' && 'html' in content) {
          editorRef.current.innerHTML = (content as { html: string }).html
        }
      }
      setIsLoading(false)
    }
    load()
  }, [isEditMode, postId, isDemoMode])

  // Rich text commands
  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  const insertLink = () => {
    const url = prompt('Nhập URL liên kết:')
    if (url) execCmd('createLink', url)
  }

  // Insert image into content
  const insertImage = () => {
    const url = prompt('Nhập URL hình ảnh (hoặc paste link ảnh):')
    if (url && url.trim()) {
      execCmd('insertHTML', `<div class="blog-img-wrap"><img src="${url.trim()}" alt="Hình minh họa" style="max-width:100%;border-radius:12px;margin:16px 0;" /><br/></div>`)
    }
  }

  // Upload image into content
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File quá lớn (tối đa 5MB)')
      return
    }

    if (isDemoMode) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        execCmd('insertHTML', `<div class="blog-img-wrap"><img src="${dataUrl}" alt="Hình minh họa" style="max-width:100%;border-radius:12px;margin:16px 0;" /><br/></div>`)
      }
      reader.readAsDataURL(file)
      return
    }

    showNotification('success', 'Đang upload ảnh...')
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `blog/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      showNotification('error', `Upload lỗi: ${uploadErr.message}`)
      return
    }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
    execCmd('insertHTML', `<div class="blog-img-wrap"><img src="${urlData.publicUrl}" alt="Hình minh họa" style="max-width:100%;border-radius:12px;margin:16px 0;" /><br/></div>`)
    showNotification('success', 'Đã chèn ảnh vào bài viết')
  }

  // Parse video URL to get embeddable src
  const parseVideoUrl = (url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedSrc: string } | null => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) {
      return { type: 'youtube', embedSrc: `https://www.youtube.com/embed/${ytMatch[1]}` }
    }
    // Vimeo
    const vmMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vmMatch) {
      return { type: 'vimeo', embedSrc: `https://player.vimeo.com/video/${vmMatch[1]}` }
    }
    // Direct video file (.mp4, .webm, .ogg)
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { type: 'direct', embedSrc: url }
    }
    return null
  }

  // Insert video into content
  const insertVideo = () => {
    const url = prompt('Nhập link video (YouTube, Vimeo, hoặc URL file .mp4):')
    if (!url || !url.trim()) return

    const parsed = parseVideoUrl(url.trim())
    if (!parsed) {
      showNotification('error', 'Không nhận dạng được link video. Hỗ trợ: YouTube, Vimeo, .mp4/.webm/.ogg')
      return
    }

    let html = ''
    if (parsed.type === 'direct') {
      html = `<div class="blog-video-wrap"><video src="${parsed.embedSrc}" controls preload="metadata" style="max-width:100%;border-radius:12px;">Trình duyệt không hỗ trợ video.</video><br/></div>`
    } else {
      html = `<div class="blog-video-wrap"><iframe src="${parsed.embedSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:auto;min-height:360px;border-radius:12px;"></iframe><br/></div>`
    }
    execCmd('insertHTML', html)
    showNotification('success', 'Đã chèn video vào bài viết')
  }

  // Thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File quá lớn (tối đa 5MB)')
      return
    }

    if (isDemoMode) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result as string
        setThumbnailPreview(url)
        setThumbnail(url)
      }
      reader.readAsDataURL(file)
      return
    }

    setThumbnailUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `blog/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      showNotification('error', `Upload lỗi: ${uploadErr.message}`)
      setThumbnailUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
    setThumbnailPreview(urlData.publicUrl)
    setThumbnail(urlData.publicUrl)
    setThumbnailUploading(false)
    showNotification('success', 'Upload ảnh thành công')
  }

  // Save
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showNotification('error', 'Tiêu đề bài viết là bắt buộc')
      return
    }

    setIsSubmitting(true)
    const htmlContent = editorRef.current?.innerHTML || ''
    const slug = toSlug(title)

    const record = {
      title,
      slug,
      excerpt: excerpt || htmlContent.replace(/<[^>]*>/g, '').slice(0, 200),
      content: { html: htmlContent },
      cover_image: thumbnail,
      status,
      category,
      meta_description: metaDescription,
      author_id: user?.id || 'demo',
      published_at: status === 'published' ? new Date().toISOString() : null,
    }

    if (isDemoMode) {
      setTimeout(() => {
        showNotification('success', 'Đã lưu bài viết (Demo Mode)')
        setIsSubmitting(false)
        navTo('/admin/blog')
      }, 500)
      return
    }

    try {
      let error
      if (isEditMode) {
        const res = await supabase.from('blog_posts').update(record).eq('id', postId)
        error = res.error
      } else {
        const res = await supabase.from('blog_posts').insert(record)
        error = res.error
      }

      if (error) {
        showNotification('error', `Lỗi: ${error.message}`)
      } else {
        showNotification('success', isEditMode ? 'Cập nhật thành công!' : 'Tạo bài viết thành công!')
        setTimeout(() => navTo('/admin/blog'), 800)
      }
    } catch {
      showNotification('error', 'Lỗi kết nối')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Đang tải..." breadcrumb={['Quản trị', 'Blog']}>
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải bài viết...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title={isEditMode ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
      breadcrumb={['Quản trị', 'Blog', isEditMode ? 'Chỉnh sửa' : 'Viết bài']}
    >
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
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.msg}</div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="admin-action-bar" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navTo('/admin/blog')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Main Content */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '32px 24px', border: '1px solid #f0f0f5' }}>
              <input
                required
                placeholder="Nhập tiêu đề bài viết..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  fontSize: 28, fontWeight: 700, color: '#1a1a2e',
                  marginBottom: 8, fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              {title && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Slug: {toSlug(title)}</div>}

              {/* Rich Text Editor */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{
                  background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb',
                  display: 'flex', gap: 4, flexWrap: 'wrap',
                }}>
                  {[
                    { icon: Bold, cmd: 'bold', tip: 'In đậm' },
                    { icon: Italic, cmd: 'italic', tip: 'In nghiêng' },
                    { icon: Underline, cmd: 'underline', tip: 'Gạch chân' },
                  ].map(({ icon: Icon, cmd, tip }) => (
                    <button key={cmd} type="button" title={tip}
                      onClick={() => execCmd(cmd)}
                      style={{
                        background: 'none', border: '1px solid transparent', borderRadius: 6,
                        padding: '6px 8px', cursor: 'pointer', color: '#4b5563',
                        display: 'flex', alignItems: 'center',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}

                  <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

                  <button type="button" title="Heading" onClick={() => execCmd('formatBlock', 'h2')}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <Heading2 size={16} />
                  </button>

                  <button type="button" title="Danh sách" onClick={() => execCmd('insertUnorderedList')}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <List size={16} />
                  </button>

                  <button type="button" title="Danh sách số" onClick={() => execCmd('insertOrderedList')}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <ListOrdered size={16} />
                  </button>

                  <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

                  <button type="button" title="Chèn liên kết" onClick={insertLink}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <Link2 size={16} />
                  </button>

                  <button type="button" title="Đường kẻ ngang" onClick={() => execCmd('insertHorizontalRule')}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <Minus size={16} />
                  </button>

                  <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px', alignSelf: 'center' }} />

                  {/* Image buttons */}
                  <button type="button" title="Chèn ảnh từ URL" onClick={insertImage}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <ImagePlus size={16} />
                  </button>

                  <label title="Upload ảnh vào bài viết" style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <UploadCloud size={16} />
                    <input type="file" accept="image/*" onChange={handleContentImageUpload} style={{ display: 'none' }} />
                  </label>

                  {/* Video button */}
                  <button type="button" title="Chèn video (YouTube, Vimeo, .mp4)" onClick={insertVideo}
                    style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#e8720c', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff7ed' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    <Video size={16} /> Video
                  </button>
                </div>

                {/* Editable area */}
                <div
                  ref={editorRef}
                  contentEditable
                  data-placeholder="Viết nội dung bài viết tại đây..."
                  style={{
                    minHeight: 500, padding: 24, outline: 'none',
                    fontSize: 16, lineHeight: 1.8, color: '#374151',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Xuất bản</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Trạng thái</label>
                  <select className="admin-input" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Chuyên mục</label>
                  <select className="admin-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="news">Tin tức & Sự kiện</option>
                    <option value="tips">Hướng dẫn & Mẹo</option>
                    <option value="projects">Dự án tiêu biểu</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Tóm tắt (Excerpt)</label>
                  <textarea className="admin-input" rows={3} placeholder="Mô tả ngắn về bài viết..."
                    value={excerpt} onChange={e => setExcerpt(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh & SEO</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Ảnh đại diện (Thumbnail)</label>
                  {thumbnailPreview ? (
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                      <img src={thumbnailPreview} alt="Thumbnail" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                        <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.95)' }}>
                          Đổi
                          <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                        </label>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                          onClick={() => { setThumbnailPreview(''); setThumbnail('') }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb', cursor: 'pointer', display: 'block' }}>
                      {thumbnailUploading ? (
                        <UploadCloud size={32} color="#f29d38" style={{ margin: '0 auto 12px' }} />
                      ) : (
                        <ImageIcon size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                      )}
                      <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>
                        {thumbnailUploading ? 'Đang upload...' : 'Nhấn để tải ảnh lên'}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>1200x630px recommended</div>
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">SEO Meta Description</label>
                  <textarea className="admin-input" rows={4}
                    placeholder="Mô tả ngắn hiển thị trên Google (tối đa 160 ký tự)..."
                    value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
                  <span style={{ fontSize: 11, color: metaDescription.length > 160 ? '#ef4444' : '#9ca3af' }}>
                    {metaDescription.length}/160
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 22px; font-weight: 600; margin: 16px 0 8px; color: #1a1a2e; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 24px; margin: 8px 0; }
        [contenteditable] a { color: #f29d38; text-decoration: underline; }
        [contenteditable] hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
        [contenteditable] .blog-img-wrap { margin: 16px 0; }
        [contenteditable] .blog-img-wrap img { max-width: 100%; height: auto; border-radius: 12px; display: block; }
        [contenteditable] .blog-video-wrap { margin: 16px 0; }
        [contenteditable] .blog-video-wrap iframe { width: 100%; min-height: 360px; border: none; border-radius: 12px; background: #000; display: block; }
        [contenteditable] .blog-video-wrap video { max-width: 100%; border-radius: 12px; display: block; }
        /* Public facing */
        .blog-content .blog-video-wrap iframe { width: 100%; min-height: 360px; border: none; border-radius: 12px; background: #000; display: block; }
        .blog-content .blog-img-wrap img { max-width: 100%; height: auto; border-radius: 12px; }
        .blog-content .blog-video-wrap video { max-width: 100%; border-radius: 12px; }
      `}</style>
    </AdminLayout>
  )
}
