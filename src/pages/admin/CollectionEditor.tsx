/** CollectionEditor — Create/Edit collection with real Supabase CRUD */
import { useState, useEffect, type FormEvent } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Save, Plus, X, Image as ImageIcon, Trash2, ArrowLeft, UploadCloud, Check } from 'lucide-react'
import { ImportModal } from '@/components/admin/CollectionEditor/ImportModal'
import { ProductModal } from '@/components/admin/CollectionEditor/ProductModal'
import { BasicInfoForm } from '@/components/admin/CollectionEditor/BasicInfoForm'
import { DynamicListsForm } from '@/components/admin/CollectionEditor/DynamicListsForm'
import { GalleryManager } from '@/components/admin/CollectionEditor/GalleryManager'

interface ProductItem {
  code: string
  name: string
  image: string
  highlights?: string[]
  colors?: string[]
  spec: {
    construction?: string
    pile?: string
    backing?: string
    size?: string
    useCase?: string
    installation?: string
  }
}

interface ResourceItem {
  label: string
  resource_type: string
  file_url: string
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
  resources: ResourceItem[]
  gallery: string[]
}

const EMPTY_FORM: CollectionFormData = {
  name: '', tagline: '', summary: '', detail: '',
  status: 'draft', applications: '', accent: '#f29d38', heroImage: '',
  quickFacts: [''], valuePoints: [''], products: [], resources: [], gallery: [],
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)

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
      // Read quickFacts/valuePoints/applications from DB columns first, then metadata fallback
      const quickFacts = (data.quick_facts?.length ? data.quick_facts : (meta.quickFacts || meta.quick_facts || [])) as string[]
      const valuePoints = (data.value_points?.length ? data.value_points : (meta.valuePoints || meta.value_points || [])) as string[]
      const applicationsArr = (data.applications?.length ? data.applications : (meta.applications || [])) as string[]
      const gallery = (meta.gallery || meta.productImages || []) as string[]

      setForm({
        name: data.name || '',
        tagline: data.tagline || '',
        summary: data.summary || '',
        detail: data.detail || '',
        status: data.status || 'draft',
        applications: applicationsArr.join(', '),
        accent: data.accent || '#f29d38',
        heroImage: data.hero_image || '',
        quickFacts: quickFacts.length > 0 ? quickFacts : [''],
        valuePoints: valuePoints.length > 0 ? valuePoints : [''],
        products,
        resources: (meta.resources || []) as ResourceItem[],
        gallery,
      })
      setHeroPreview(data.hero_image || '')
      setIsLoading(false)
    }

    loadCollection()
  }, [isEditMode, collectionId, isDemoMode])

  // Form field handlers
  const handleImport = async () => {
    if (!importUrl) return
    setIsImporting(true)
    try {
      showNotification('success', 'Đang tải trang web...')
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(importUrl)}`
      const res = await fetch(proxyUrl)
      const data = await res.json()
      const html = data.contents

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      doc.querySelectorAll('script, style, noscript, nav, footer, header').forEach(el => el.remove())
      
      const texts = doc.body.innerText.substring(0, 15000)
      const imgs = Array.from(doc.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src.includes('wp-content') && !src.includes('logo') && !src.includes('icon'))
      const uniqueImgs = [...new Set(imgs)].slice(0, 30)

      const links = Array.from(doc.querySelectorAll('a'))
        .map(a => ({ text: a.innerText.trim(), href: a.href }))
        .filter(l => l.text && l.href && (l.href.endsWith('.pdf') || l.href.toLowerCase().includes('download') || l.text.toLowerCase().includes('download') || l.text.toLowerCase().includes('specification') || l.text.toLowerCase().includes('brochure')))
      const uniqueLinks = [...new Map(links.map(l => [l.href, l])).values()].slice(0, 10).map(l => `${l.text}: ${l.href}`)

      showNotification('success', 'Đang dùng AI trích xuất và dịch dữ liệu...')
      const schema = `{
  "name": "", "tagline_in_vietnamese": "", "summary_in_vietnamese": "", "detail_in_vietnamese": "", "hero_image": "", "gallery": [], "quick_facts_in_vietnamese": [], "value_points_in_vietnamese": [], "applications_in_vietnamese": [],
  "products": [
    {
      "code": "", "name": "", "image": "", "highlights_in_vietnamese": [],
      "spec_in_vietnamese": { "pile_type": "", "construction": "", "backing": "", "size": "", "installation": "" }
    }
  ],
  "resources": [
    { "label_in_vietnamese": "", "resource_type": "brochure|specification|installation", "file_url": "" }
  ]
}`
      const prompt = `You are an expert data extractor and translator. Extract collection information from the Carpet product page URL: ${importUrl}
TEXT:
${texts}
IMAGES FOUND:
${uniqueImgs.join('\n')}
LINKS FOUND:
${uniqueLinks.join('\n')}

INSTRUCTIONS:
1. Extract the collection details matching exactly this JSON schema: ${schema}
2. TRANSLATION: For any field ending in '_in_vietnamese', you MUST translate the extracted English text into natural, professional VIETNAMESE. Do NOT output English in these fields. Leave proper nouns (like collection name) in English if appropriate.
3. PRODUCTS: Extract all distinct product variants/codes found. If an image from IMAGES FOUND belongs to a specific product variant, assign it to that product's 'image' field.
4. GALLERY RULES: The 'gallery' array MUST NOT contain any images that are already used as a product 'image'. Gallery is only for general lifestyle/room scenes.
5. RESOURCES: Map relevant download links from LINKS FOUND to the 'resources' array. Set resource_type to one of: 'brochure', 'specification', 'installation'.
6. Return ONLY valid JSON. If data is not found, use empty strings or empty arrays.`

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      
      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!aiRes.ok) throw new Error('Lỗi từ Gemini API')
      
      const aiData = await aiRes.json();
      let text = aiData.candidates[0].content.parts[0].text;
      if (text.startsWith('```json')) {
         text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      
      const extracted = JSON.parse(text);

      const mappedProducts = (extracted.products || []).map((p: any) => ({
        code: p.code || '',
        name: p.name || '',
        image: p.image || '',
        highlights: p.highlights_in_vietnamese || [],
        colors: [],
        spec: {
          pile: p.spec_in_vietnamese?.pile_type || '',
          construction: p.spec_in_vietnamese?.construction || '',
          backing: p.spec_in_vietnamese?.backing || '',
          size: p.spec_in_vietnamese?.size || '',
          installation: p.spec_in_vietnamese?.installation || ''
        }
      }))

      const mappedResources = (extracted.resources || []).map((r: any) => ({
        label: r.label_in_vietnamese || r.label || '',
        resource_type: r.resource_type || 'brochure',
        file_url: r.file_url || ''
      }))
      
      setForm(prev => ({ 
        ...prev, 
        name: extracted.name || prev.name,
        tagline: extracted.tagline_in_vietnamese || prev.tagline,
        summary: extracted.summary_in_vietnamese || prev.summary,
        detail: extracted.detail_in_vietnamese || prev.detail,
        heroImage: extracted.hero_image || prev.heroImage,
        applications: (extracted.applications_in_vietnamese || []).join(', '),
        quickFacts: extracted.quick_facts_in_vietnamese?.length ? extracted.quick_facts_in_vietnamese : prev.quickFacts,
        valuePoints: extracted.value_points_in_vietnamese?.length ? extracted.value_points_in_vietnamese : prev.valuePoints,
        products: mappedProducts.length ? mappedProducts : prev.products,
        resources: mappedResources.length ? mappedResources : prev.resources,
        gallery: extracted.gallery?.length ? extracted.gallery : prev.gallery
      }))
      if (extracted.hero_image) setHeroPreview(extracted.hero_image)
      
      showNotification('success', 'Đã trích xuất dữ liệu thành công!')
      setIsImportModalOpen(false)
    } catch (e: any) {
      console.error(e)
      showNotification('error', 'Lỗi trích xuất: ' + e.message)
    } finally {
      setIsImporting(false)
    }
  }

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

  const handleAddGalleryImage = () => updateField('gallery', [...form.gallery, ''])
  const handleUpdateGalleryImage = (i: number, val: string) => {
    const next = [...form.gallery]; next[i] = val; updateField('gallery', next)
  }
  const handleRemoveGalleryImage = (i: number) => updateField('gallery', form.gallery.filter((_, idx) => idx !== i))


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
    setEditingProduct({ code: '', name: '', image: '', highlights: [], colors: [], spec: {} })
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

    const applicationsArray = form.applications.split(',').map(a => a.trim()).filter(Boolean)
    const dbRecord = {
      name: form.name,
      slug,
      tagline: form.tagline,
      summary: form.summary,
      detail: form.detail,
      status: form.status,
      accent: form.accent,
      hero_image: form.heroImage,
      // Save to proper DB columns so fetchCollections() can read them
      quick_facts: form.quickFacts.filter(f => f.trim()),
      value_points: form.valuePoints.filter(v => v.trim()),
      applications: applicationsArray,
      metadata: {
        products: form.products,
        gallery: form.gallery.filter(g => g.trim()),
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
      let collectionDbId = ''

      if (isEditMode) {
        const res = await supabase
          .from('collections')
          .update(dbRecord)
          .or(`id.eq.${collectionId},slug.eq.${collectionId}`)
          .select('id')
          .single()
        error = res.error
        collectionDbId = res.data?.id
      } else {
        const res = await supabase.from('collections').insert(dbRecord).select('id').single()
        error = res.error
        collectionDbId = res.data?.id
      }

      if (error) {
        showNotification('error', `Lỗi: ${error.message}`)
      } else if (collectionDbId) {
        try {
          // Sync Value Points
          const validVp = form.valuePoints.filter(v => v.trim())
          if (validVp.length > 0) {
            await supabase.from('collection_value_points').delete().eq('collection_id', collectionDbId)
            await supabase.from('collection_value_points').insert(validVp.map(vp => ({ collection_id: collectionDbId, point_text: vp.trim() })))
          }

          // Sync Galleries
          const validGallery = form.gallery.filter(g => g.trim())
          if (validGallery.length > 0) {
            await supabase.from('collection_galleries').delete().eq('collection_id', collectionDbId)
            await supabase.from('collection_galleries').insert(validGallery.map(g => ({ collection_id: collectionDbId, image_url: g.trim() })))
          }

          // Sync Resources
          if (form.resources && form.resources.length > 0) {
            const validRes = form.resources.filter(r => r.file_url.trim())
            if (validRes.length > 0) {
              await supabase.from('collection_resources').delete().eq('collection_id', collectionDbId)
              await supabase.from('collection_resources').insert(validRes.map(r => ({
                collection_id: collectionDbId,
                label: r.label,
                resource_type: r.resource_type,
                file_url: r.file_url
              })))
            }
          }

          // Sync Products and Specs
          if (form.products && form.products.length > 0) {
            for (const prod of form.products) {
              let productId = ''
              const { data: existingProd } = await supabase.from('products').select('id').eq('collection_id', collectionDbId).eq('code', prod.code).maybeSingle()
              
              const prodData = {
                collection_id: collectionDbId,
                code: prod.code,
                name: prod.name,
                image: prod.image,
                highlights: prod.highlights || [],
                colors: prod.colors || [],
                spec: prod.spec || {}
              }

              if (existingProd) {
                productId = existingProd.id
                await supabase.from('products').update(prodData).eq('id', productId)
              } else {
                const { data: newProd } = await supabase.from('products').insert(prodData).select('id').single()
                productId = newProd?.id
              }

              if (productId && prod.spec) {
                const specData = {
                  product_id: productId,
                  pile_type: prod.spec.pile || '',
                  construction: prod.spec.construction || '',
                  backing: prod.spec.backing || '',
                  size: prod.spec.size || '',
                  installation: prod.spec.installation || ''
                }
                const { data: existingSpec } = await supabase.from('product_specs').select('id').eq('product_id', productId).maybeSingle()
                if (existingSpec) {
                  await supabase.from('product_specs').update(specData).eq('id', existingSpec.id)
                } else {
                  await supabase.from('product_specs').insert(specData)
                }
              }
            }
          }
        } catch (syncErr) {
          console.error("Relational Sync Error:", syncErr)
          // Don't throw, just let it show success for main collection
        }

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
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsImportModalOpen(true)}>
              <UploadCloud size={16} /> Nhập từ URL
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Main Content Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Basic Info */}
            <BasicInfoForm form={form} updateField={updateField} toSlug={toSlug} />

            {/* Dynamic Lists */}
            <DynamicListsForm 
              form={form} 
              handleAddQuickFact={handleAddQuickFact}
              handleUpdateQuickFact={handleUpdateQuickFact}
              handleRemoveQuickFact={handleRemoveQuickFact}
              handleAddValuePoint={handleAddValuePoint}
              handleUpdateValuePoint={handleUpdateValuePoint}
              handleRemoveValuePoint={handleRemoveValuePoint}
            />

            {/* Gallery Management */}
            <GalleryManager
              form={form}
              handleAddGalleryImage={handleAddGalleryImage}
              handleUpdateGalleryImage={handleUpdateGalleryImage}
              handleRemoveGalleryImage={handleRemoveGalleryImage}
            />

            {/* Products Management moved */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f5', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Quản lý Sản phẩm</h3>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
                Tính năng quản lý sản phẩm (thêm, sửa, xóa mã thảm) đã được di chuyển sang một khu vực riêng biệt để dễ kiểm soát hơn.
              </p>
              <a href="/admin/products" className="admin-btn admin-btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                Đi đến Trang quản lý Sản phẩm
              </a>
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

      {/* Import URL Modal */}
      <ImportModal 
        isOpen={isImportModalOpen}
        isImporting={isImporting}
        importUrl={importUrl}
        setImportUrl={setImportUrl}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        editingProduct={editingProduct}
        editingProductIdx={editingProductIdx}
        setEditingProduct={setEditingProduct}
        onClose={() => setIsProductModalOpen(false)}
        onSave={saveProduct}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </AdminLayout>
  )
}
