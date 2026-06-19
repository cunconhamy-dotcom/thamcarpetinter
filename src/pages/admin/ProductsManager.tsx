import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit2, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ProductRecord {
  id: string
  collection_id: string
  code: string
  name: string
  image: string
  highlights: string[]
  colors: string[]
  spec: {
    construction?: string
    pile?: string
    backing?: string
    size?: string
    useCase?: string
    installation?: string
    detail?: string
  }
  sort_order?: number
}

interface CollectionBasic {
  id: string
  name: string
  slug: string
}

export function ProductsManager() {
  const { isDemoMode } = useAuth()
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [collections, setCollections] = useState<CollectionBasic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCollection, setFilterCollection] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [highlightsText, setHighlightsText] = useState('')
  const [formData, setFormData] = useState<Partial<ProductRecord>>({
    collection_id: '',
    code: '',
    name: '',
    image: '',
    highlights: [],
    colors: [],
    spec: {
      construction: '',
      pile: '',
      backing: '',
      size: '',
      useCase: '',
      installation: '',
      detail: ''
    },
    sort_order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const { data: cols } = await supabase.from('collections').select('id, name, slug').order('name')
    if (cols) setCollections(cols)

    const { data: prods } = await supabase.from('products').select('*').order('collection_id').order('sort_order', { ascending: true }).order('code')
    if (prods) setProducts(prods)
    
    setIsLoading(false)
  }

  const filteredProducts = products.filter(p => {
    const matchSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCollection = filterCollection === 'all' || p.collection_id === filterCollection
    return matchSearch && matchCollection
  })

  const getCollectionName = (id: string) => collections.find(c => c.id === id)?.name || 'Unknown'

  const handleDelete = async (id: string, name: string) => {
    if (isDemoMode) return toast.error('Demo Mode: Chức năng bị khóa')
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm ${name}?`)) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      toast.success('Xóa sản phẩm thành công')
    } else {
      toast.error('Lỗi: ' + error.message)
    }
  }

  const openModal = (item?: ProductRecord) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        ...item,
        spec: {
          construction: item.spec?.construction || '',
          pile: item.spec?.pile || '',
          backing: item.spec?.backing || '',
          size: item.spec?.size || '',
          useCase: item.spec?.useCase || '',
          installation: item.spec?.installation || '',
          detail: item.spec?.detail || ''
        }
      })
      setHighlightsText(Array.isArray(item.highlights) ? item.highlights.join('\n') : (typeof item.highlights === 'string' ? item.highlights : ''))
    } else {
      setEditingId(null)
      setFormData({
        collection_id: collections[0]?.id || '',
        code: '',
        name: '',
        image: '',
        highlights: [],
        colors: [],
        spec: {
          construction: '',
          pile: '',
          backing: '',
          size: '',
          useCase: '',
          installation: '',
          detail: ''
        },
        sort_order: products.length
      })
      setHighlightsText('')
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File quá lớn (tối đa 2MB)')
      return
    }

    if (isDemoMode) {
      toast.error('Demo Mode: Chức năng bị khóa')
      return
    }

    setIsUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      toast.error(`Upload lỗi: ${uploadErr.message}`)
      setIsUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path)
    setFormData({ ...formData, image: publicUrlData.publicUrl })
    setIsUploading(false)
    toast.success('Upload ảnh thành công')
  }

  const handleSave = async () => {
    if (isDemoMode) return toast.error('Demo Mode: Chức năng bị khóa')

    // Explicit Validation
    if (!formData.name || !formData.code || !formData.collection_id || !formData.image) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc (Bộ sưu tập, Mã SP, Tên SP, Hình ảnh)!')
      return
    }

    // Convert highlightsText back to array
    const cleanHighlights = highlightsText.split('\n').map(s => s.trim()).filter(Boolean)
    
    const payload = {
      collection_id: formData.collection_id,
      code: formData.code,
      name: formData.name,
      image: formData.image,
      highlights: cleanHighlights,
      colors: formData.colors || [],
      spec: {
        construction: formData.spec?.construction || '',
        pile: formData.spec?.pile || '',
        backing: formData.spec?.backing || '',
        size: formData.spec?.size || '',
        useCase: formData.spec?.useCase || '',
        installation: formData.spec?.installation || '',
        detail: formData.spec?.detail || ''
      },
      sort_order: Number(formData.sort_order) || 0
    }
    
    try {
      if (editingId) {
        const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select()
        if (error) {
          toast.error('Lỗi khi cập nhật DB: ' + error.message)
        } else if (!data || data.length === 0) {
          toast.error('Cập nhật thất bại. Không tìm thấy ID sản phẩm hoặc bị chặn bởi quyền RLS.')
        } else {
          toast.success('Lưu thay đổi thành công!')
          setFilterCollection(formData.collection_id || 'all')
          setIsModalOpen(false)
          loadData()
        }
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select()
        if (error) {
          toast.error('Lỗi khi thêm mới DB: ' + error.message)
        } else if (!data || data.length === 0) {
          toast.error('Thêm mới thất bại. Xin vui lòng thử lại.')
        } else {
          toast.success('Thêm sản phẩm mới thành công!')
          setFilterCollection(formData.collection_id || 'all')
          setIsModalOpen(false)
          loadData()
        }
      }
    } catch (err: any) {
      toast.error('Lỗi hệ thống khi lưu: ' + (err?.message || String(err)))
    }
  }

  return (
    <AdminLayout title="Quản lý Sản phẩm">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Tìm mã hoặc tên sản phẩm..." 
                className="admin-input" 
                style={{ paddingLeft: 38, width: '100%' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative', width: 200 }}>
              <Filter size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <select 
                className="admin-input" 
                style={{ paddingLeft: 38, width: '100%', appearance: 'none' }}
                value={filterCollection}
                onChange={e => setFilterCollection(e.target.value)}
              >
                <option value="all">Tất cả bộ sưu tập</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: 12 }}>
            <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: 16 }}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Hình ảnh</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Mã SP</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Tên</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Bộ sưu tập</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, width: 80, textAlign: 'center' }}>Thứ tự</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{p.code}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#475569' }}>
                        {getCollectionName(p.collection_id)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={p.sort_order || 0}
                        onChange={async (e) => {
                          const newOrder = parseInt(e.target.value) || 0;
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, sort_order: newOrder } : prod));
                          if (!isDemoMode) {
                            const { error } = await supabase.from('products').update({ sort_order: newOrder }).eq('id', p.id);
                            if (error) toast.error('Lỗi cập nhật thứ tự: ' + error.message)
                            else toast.success('Đã cập nhật thứ tự')
                          }
                        }}
                        style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa" onClick={() => openModal(p)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} title="Xóa" onClick={() => handleDelete(p.id, p.code)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 650, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600 }}>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="admin-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Bộ sưu tập *</label>
                  <select 
                    className="admin-input" 
                    style={{ width: '100%' }}
                    value={formData.collection_id}
                    onChange={e => setFormData({...formData, collection_id: e.target.value})}
                  >
                    <option value="">-- Chọn BST --</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Mã SP *</label>
                  <input 
                    className="admin-input" 
                    style={{ width: '100%' }}
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div>
                  <label className="admin-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Tên SP *</label>
                  <input 
                    className="admin-input" 
                    style={{ width: '100%' }}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="admin-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Thứ tự hiển thị</label>
                  <input 
                    type="number"
                    className="admin-input" 
                    style={{ width: '100%' }}
                    value={formData.sort_order || 0}
                    onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Hình Ảnh Sản Phẩm</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {formData.image && (
                    <img src={formData.image} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  )}
                  <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                    <input 
                      className="admin-input" 
                      style={{ flex: 1 }}
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="Nhập URL hoặc tải ảnh lên..."
                    />
                    <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {isUploading ? 'Đang tải...' : 'Tải lên từ máy'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Thông số kỹ thuật sản phẩm</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Cấu trúc sợi (Pile)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.pile || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, pile: e.target.value }})}
                      placeholder="Ví dụ: Sợi vòng lặp dệt nổi"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Kết cấu (Construction)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.construction || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, construction: e.target.value }})}
                      placeholder="Ví dụ: Tufted"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Đế thảm (Backing)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.backing || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, backing: e.target.value }})}
                      placeholder="Ví dụ: EcoSquare®"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Kích thước (Size)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.size || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, size: e.target.value }})}
                      placeholder="Ví dụ: 50 x 50 cm"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Phù hợp sử dụng (Use Case)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.useCase || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, useCase: e.target.value }})}
                      placeholder="Ví dụ: Văn phòng điều hành / Sàn yên tĩnh"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Cách lắp đặt (Installation)</label>
                    <input 
                      className="admin-input" 
                      value={formData.spec?.installation || ''} 
                      onChange={e => setFormData({...formData, spec: { ...formData.spec, installation: e.target.value }})}
                      placeholder="Ví dụ: Quarter turn / ashlar / monolithic"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Thông tin chi tiết (Mô tả sản phẩm)</label>
                  <textarea 
                    className="admin-input" 
                    rows={4}
                    value={formData.spec?.detail || ''} 
                    onChange={e => setFormData({...formData, spec: { ...formData.spec, detail: e.target.value }})}
                    placeholder="Nhập thông tin chi tiết về sản phẩm..."
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Đặc điểm nổi bật (Highlights)</h4>
                <label className="admin-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>Mỗi dòng là một đặc điểm</label>
                <textarea 
                  className="admin-input" 
                  rows={3}
                  value={highlightsText}
                  onChange={e => setHighlightsText(e.target.value)}
                  placeholder="Ví dụ:&#10;Tông màu tinh tế&#10;Tạo độ sang trọng tự nhiên"
                />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <button type="button" onClick={() => handleSave()} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Lưu Sản Phẩm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
