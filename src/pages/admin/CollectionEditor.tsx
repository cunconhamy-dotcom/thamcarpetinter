/** CollectionEditor — Create/Edit collection with real Supabase CRUD */
import { useState, useEffect, type FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Save, Plus, X, Image as ImageIcon, Trash2, ArrowLeft, UploadCloud, Check } from 'lucide-react'

interface ProductItem {
  code: string
  name: string
  image: string
  specs: {
    construction?: string
    pile?: string
    backing?: string
    size?: string
    warranty?: string
    installation?: string
  }
}

interface CollectionFormData {
  name: string
  tagline: string
  summary: string
  detail: string
  status: string
  applications: string
  accent: string
  heroImage: string
  quickFacts: string[]
  valuePoints: string[]
  products: ProductItem[]
}

const EMPTY_FORM: CollectionFormData = {
  name: '', tagline: '', summary: '', detail: '',
  status: 'draft', applications: '', accent: '#f29d38', heroImage: '',
  quickFacts: [''], valuePoints: [''], products: [],
}

const toSlug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function CollectionEditor() {
  const { isDemoMode } = useAuth()
  const [form, setForm] = useState<CollectionFormData>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [editingProductIdx, setEditingProductIdx] = useState<number>(-1)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [heroPreview, setHeroPreview] = useState<string>('')
  const [heroUploading, setHeroUploading] = useState(false)

  // Determine mode: create vs edit
  const pathParts = window.location.pathname.split('/')
  const collectionId = pathParts[pathParts.length - 1]
  const isEditMode = collectionId !== 'new' && collectionId !== 'collections'

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const navTo = (href: string) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Load existing data for edit mode
  useEffect(() => {
    if (!isEditMode) return
    if (isDemoMode) return

    async function loadCollection() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .or(`id.eq.${collectionId},slug.eq.${collectionId}`)
        .single()

      if (error || !data) {
        showNotification('error', 'Không tìm thấy bộ sưu tập')
        setIsLoading(false)
        return
      }

      const meta = (data.metadata || {}) as Record<string, unknown>
      const products = (meta.products || []) as ProductItem[]
      const quickFacts = (meta.quickFacts || meta.quick_facts || []) as string[]
      const valuePoints = (meta.valuePoints || meta.value_points || []) as string[]

      setForm({
        name: data.name || '',
        tagline: data.tagline || '',
        summary: data.summary || '',
        detail: data.detail || '',
        status: data.status || 'draft',
        applications: Array.isArray(meta.applications)
          ? (meta.applications as string[]).join(', ')
          : (meta.applications as string) || '',
        accent: data.accent || '#f29d38',
        heroImage: data.hero_image || '',
        quickFacts: quickFacts.length > 0 ? quickFacts : [''],
        valuePoints: valuePoints.length > 0 ? valuePoints : [''],
        products,
      })
      setHeroPreview(data.hero_image || '')
      setIsLoading(false)
    }

    loadCollection()
  }, [isEditMode, collectionId, isDemoMode])

  // Form field handlers
  const updateField = <K extends keyof CollectionFormData>(key: K, value: CollectionFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleAddQuickFact = () => updateField('quickFacts', [...form.quickFacts, ''])
  const handleUpdateQuickFact = (i: number, val: string) => {
    const next = [...form.quickFacts]; next[i] = val; updateField('quickFacts', next)
  }
  const handleRemoveQuickFact = (i: number) => updateField('quickFacts', form.quickFacts.filter((_, idx) => idx !== i))

  const handleAddValuePoint = () => updateField('valuePoints', [...form.valuePoints, ''])
  const handleUpdateValuePoint = (i: number, val: string) => {
    const next = [...form.valuePoints]; next[i] = val; updateField('valuePoints', next)
  }
  const handleRemoveValuePoint = (i: number) => updateField('valuePoints', form.valuePoints.filter((_, idx) => idx !== i))

  // Hero image upload
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      showNotification('error', 'File quá lớn (tối đa 2MB)')
      return
    }

    if (isDemoMode) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result as string
        setHeroPreview(url)
        updateField('heroImage', url)
      }
      reader.readAsDataURL(file)
      return
    }

    setHeroUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `collections/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      showNotification('error', `Upload lỗi: ${uploadErr.message}`)
      setHeroUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
    setHeroPreview(urlData.publicUrl)
    updateField('heroImage', urlData.publicUrl)
    setHeroUploading(false)
    showNotification('success', 'Upload ảnh thành công')
  }

  // Product CRUD
  const openAddProduct = () => {
    setEditingProduct({ code: '', name: '', image: '', specs: {} })
    setEditingProductIdx(-1)
    setIsProductModalOpen(true)
  }

  const openEditProduct = (idx: number) => {
    setEditingProduct({ ...form.products[idx] })
    setEditingProductIdx(idx)
    setIsProductModalOpen(true)
  }

  const saveProduct = () => {
    if (!editingProduct || !editingProduct.code) {
      showNotification('error', 'Mã sản phẩm là bắt buộc')
      return
    }
    const next = [...form.products]
    if (editingProductIdx >= 0) {
      next[editingProductIdx] = editingProduct
    } else {
      next.push(editingProduct)
    }
    updateField('products', next)
    setIsProductModalOpen(false)
    showNotification('success', editingProductIdx >= 0 ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công')
  }

  const deleteProduct = (idx: number) => {
    updateField('products', form.products.filter((_, i) => i !== idx))
    showNotification('success', 'Đã xóa sản phẩm')
  }

  // Save to Supabase
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      showNotification('error', 'Tên bộ sưu tập là bắt buộc')
      return
    }

    setIsSubmitting(true)
    const slug = toSlug(form.name)

    const dbRecord = {
      name: form.name,
      slug,
      tagline: form.tagline,
      summary: form.summary,
      detail: form.detail,
      status: form.status,
      accent: form.accent,
      hero_image: form.heroImage,
      metadata: {
        quickFacts: form.quickFacts.filter(f => f.trim()),
        valuePoints: form.valuePoints.filter(v => v.trim()),
        applications: form.applications.split(',').map(a => a.trim()).filter(Boolean),
        products: form.products,
      },
    }

    if (isDemoMode) {
      setTimeout(() => {
        showNotification('success', 'Đã lưu thành công (Demo Mode)')
        setIsSubmitting(false)
        navTo('/admin/collections')
      }, 500)
      return
    }

    try {
      let error
      if (isEditMode) {
        const res = await supabase
          .from('collections')
          .update(dbRecord)
          .or(`id.eq.${collectionId},slug.eq.${collectionId}`)
        error = res.error
      } else {
        const res = await supabase.from('collections').insert(dbRecord)
        error = res.error
      }

      if (error) {
        showNotification('error', `Lỗi: ${error.message}`)
      } else {
        showNotification('success', isEditMode ? 'Cập nhật thành công!' : 'Tạo bộ sưu tập thành công!')
        setTimeout(() => navTo('/admin/collections'), 800)
      }
    } catch (err) {
      showNotification('error', 'Lỗi kết nối')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Đang tải..." breadcrumb={['Quản trị', 'Bộ sưu tập']}>
        <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #f29d38', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Đang tải dữ liệu...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title={isEditMode ? 'Chỉnh sửa bộ sưu tập' : 'Tạo bộ sưu tập mới'}
      breadcrumb={['Quản trị', 'Bộ sưu tập', isEditMode ? 'Chỉnh sửa' : 'Tạo mới']}
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
          {notification.type === 'success'
            ? <Check size={18} style={{ color: '#22c55e' }} />
            : <X size={18} style={{ color: '#ef4444' }} />}
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{notification.message}</div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="admin-action-bar" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navTo('/admin/collections')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Main Content Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Thông tin cơ bản</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Tên bộ sưu tập *</label>
                  <input required className="admin-input" placeholder="Ví dụ: EcoSoft Series"
                    value={form.name} onChange={e => updateField('name', e.target.value)} />
                  {form.name && <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Slug: {toSlug(form.name)}</span>}
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Tagline</label>
                  <input className="admin-input" placeholder="Slogan ngắn"
                    value={form.tagline} onChange={e => updateField('tagline', e.target.value)} />
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Mô tả ngắn (Summary)</label>
                  <textarea className="admin-input" rows={3} placeholder="Mô tả tóm tắt..."
                    value={form.summary} onChange={e => updateField('summary', e.target.value)} />
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Mô tả chi tiết (Detail)</label>
                  <textarea className="admin-input" rows={5} placeholder="Nội dung chi tiết..."
                    value={form.detail} onChange={e => updateField('detail', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Dynamic Lists */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Đặc điểm & Giá trị</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Quick Facts */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label className="admin-input-label">Đặc điểm nổi bật (Quick Facts)</label>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddQuickFact}>
                      <Plus size={14} /> Thêm
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.quickFacts.map((fact, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input className="admin-input" value={fact} onChange={e => handleUpdateQuickFact(i, e.target.value)} placeholder="Nhập đặc điểm..." />
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveQuickFact(i)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Value Points */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label className="admin-input-label">Giá trị mang lại (Value Points)</label>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleAddValuePoint}>
                      <Plus size={14} /> Thêm
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.valuePoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input className="admin-input" value={point} onChange={e => handleUpdateValuePoint(i, e.target.value)} placeholder="Nhập giá trị..." />
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleRemoveValuePoint(i)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Management */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Danh sách sản phẩm ({form.products.length} mã)</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={openAddProduct}>
                  <Plus size={14} /> Thêm sản phẩm
                </button>
              </div>

              {form.products.length > 0 ? (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Hình ảnh</th>
                        <th>Mã SP</th>
                        <th>Tên gọi</th>
                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.products.map((p, i) => (
                        <tr key={i}>
                          <td>
                            {p.image ? (
                              <img src={p.image} alt={p.code} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={16} color="#d1d5db" />
                              </div>
                            )}
                          </td>
                          <td style={{ fontWeight: 500 }}>{p.code}</td>
                          <td style={{ color: '#6b7280' }}>{p.name || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEditProduct(i)}>Sửa</button>
                              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteProduct(i)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32, background: '#f9fafb', borderRadius: 12 }}>
                  Chưa có sản phẩm nào — nhấn "Thêm sản phẩm" để bắt đầu
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Trạng thái & Phân loại</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Trạng thái</label>
                  <select className="admin-input" value={form.status} onChange={e => updateField('status', e.target.value)}>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">Ứng dụng (Applications)</label>
                  <input className="admin-input" placeholder="Văn phòng, Khách sạn, ..."
                    value={form.applications} onChange={e => updateField('applications', e.target.value)} />
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Phân cách bằng dấu phẩy</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Hình ảnh & Màu sắc</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Màu chủ đạo (Accent Color)</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input type="color" className="admin-input" style={{ width: 60, height: 40, padding: 4 }}
                      value={form.accent} onChange={e => updateField('accent', e.target.value)} />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{form.accent}</span>
                  </div>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Ảnh đại diện (Hero)</label>
                  {heroPreview ? (
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                      <img src={heroPreview} alt="Hero" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                        <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.95)' }}>
                          Đổi ảnh
                          <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: 'none' }} />
                        </label>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                          onClick={() => { setHeroPreview(''); updateField('heroImage', '') }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', background: '#f9fafb', cursor: 'pointer', display: 'block' }}>
                      {heroUploading ? (
                        <>
                          <UploadCloud size={32} color="#f29d38" style={{ margin: '0 auto 12px', animation: 'pulse 1s infinite' }} />
                          <div style={{ fontSize: 13, color: '#f29d38', fontWeight: 500 }}>Đang upload...</div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                          <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>Nhấn để tải ảnh lên</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PNG, JPG hoặc WEBP (Max 2MB)</div>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Product Modal */}
      {isProductModalOpen && editingProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setIsProductModalOpen(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {editingProductIdx >= 0 ? 'Sửa sản phẩm' : 'Thêm mã sản phẩm'}
              </h2>
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setIsProductModalOpen(false)} style={{ padding: 8 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Mã SP (Code) *</label>
                <input className="admin-input" placeholder="Ví dụ: CI123"
                  value={editingProduct.code} onChange={e => setEditingProduct({ ...editingProduct, code: e.target.value })} />
              </div>
              <div className="admin-input-group">
                <label className="admin-input-label">Tên gọi (Name)</label>
                <input className="admin-input" placeholder="Ví dụ: Ocean Blue"
                  value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                <label className="admin-input-label">URL Hình ảnh</label>
                <input className="admin-input" placeholder="https://..."
                  value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600, color: '#4b5563' }}>Thông số kỹ thuật</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'construction', label: 'Cấu trúc (Construction)', ph: 'Tufted Textured Loop' },
                    { key: 'pile', label: 'Chất liệu sợi (Pile)', ph: '100% Nylon' },
                    { key: 'backing', label: 'Đế thảm (Backing)', ph: 'EcoSoft' },
                    { key: 'size', label: 'Kích thước (Size)', ph: '25x100 cm' },
                    { key: 'warranty', label: 'Bảo hành (Warranty)', ph: '15 years' },
                    { key: 'installation', label: 'Cách lắp đặt', ph: 'Ashlar, Herringbone' },
                  ].map(({ key, label, ph }) => (
                    <div key={key} className="admin-input-group">
                      <label className="admin-input-label">{label}</label>
                      <input className="admin-input" placeholder={ph}
                        value={(editingProduct.specs as Record<string, string>)[key] || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct,
                          specs: { ...editingProduct.specs, [key]: e.target.value }
                        })} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0f0f5' }}>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsProductModalOpen(false)}>Hủy</button>
              <button type="button" className="admin-btn admin-btn-primary" onClick={saveProduct}>
                <Check size={16} /> {editingProductIdx >= 0 ? 'Cập nhật' : 'Thêm sản phẩm'}
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
