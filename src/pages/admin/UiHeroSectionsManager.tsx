import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { UiHeroSectionRecord } from '@/types/admin'

type UiHeroSectionWithCollection = UiHeroSectionRecord & {
  collections: { name: string } | null
}

export function UiHeroSectionsManager() {
  const [sections, setSections] = useState<UiHeroSectionWithCollection[]>([])
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    collection_id: '',
    image_url: '',
    title: '',
    subtitle: '',
    order_index: 0,
    is_active: true
  })

  const loadData = async () => {
    setIsLoading(true)
    const [sectionsRes, collectionsRes] = await Promise.all([
      supabase.from('ui_hero_sections').select('*, collections(name)').order('order_index'),
      supabase.from('collections').select('id, name').order('name')
    ])
    if (sectionsRes.data) setSections(sectionsRes.data)
    if (collectionsRes.data) setCollections(collectionsRes.data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openModal = (item?: UiHeroSectionWithCollection) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        collection_id: item.collection_id,
        image_url: item.image_url,
        title: item.title || '',
        subtitle: item.subtitle || '',
        order_index: item.order_index,
        is_active: item.is_active
      })
    } else {
      setEditingId(null)
      setFormData({
        collection_id: collections[0]?.id || '',
        image_url: '',
        title: '',
        subtitle: '',
        order_index: 0,
        is_active: true
      })
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

    setIsUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `hero/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      toast.error(`Upload lỗi: ${uploadErr.message}`)
      setIsUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path)
    setFormData({ ...formData, image_url: publicUrlData.publicUrl })
    setIsUploading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.collection_id || !formData.image_url) {
      toast.error('Vui lòng nhập Bộ sưu tập và URL hình ảnh')
      return
    }

    if (editingId) {
      const { error } = await supabase.from('ui_hero_sections').update(formData).eq('id', editingId)
      if (error) toast.error('Lỗi cập nhật: ' + error.message)
      else {
        toast.success('Cập nhật thành công')
        setIsModalOpen(false)
        loadData()
      }
    } else {
      const { error } = await supabase.from('ui_hero_sections').insert([formData])
      if (error) toast.error('Lỗi thêm mới: ' + error.message)
      else {
        toast.success('Thêm thành công')
        setIsModalOpen(false)
        loadData()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa slider này?')) return
    const { error } = await supabase.from('ui_hero_sections').delete().eq('id', id)
    if (error) toast.error('Lỗi khi xóa: ' + error.message)
    else {
      toast.success('Đã xóa thành công')
      loadData()
    }
  }

  return (
    <AdminLayout title="Quản lý Slider Trang Chủ">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Thêm Slider
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : sections.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Chưa có slider nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Hình ảnh</th>
                <th style={{ padding: '12px 16px' }}>Tiêu đề</th>
                <th style={{ padding: '12px 16px' }}>Bộ sưu tập</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Thứ tự</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img src={s.image_url} alt="Slider" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{s.title || '-'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{s.subtitle}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{s.collections?.name || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.order_index}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {s.is_active ? <span style={{ color: '#10b981' }}>Hiển thị</span> : <span style={{ color: '#94a3b8' }}>Ẩn</span>}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openModal(s)}><Edit2 size={16} /></button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{editingId ? 'Sửa Slider' : 'Thêm Slider mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Bộ sưu tập liên kết *</label>
                <select 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.collection_id}
                  onChange={e => setFormData({...formData, collection_id: e.target.value})}
                  required
                >
                  <option value="">-- Chọn bộ sưu tập --</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Hình ảnh Slider *</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="preview" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  )}
                  <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      className="admin-input" 
                      style={{ flex: 1 }}
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                      placeholder="Nhập URL hoặc tải ảnh lên..."
                      required
                    />
                    <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {isUploading ? 'Đang tải...' : 'Tải lên từ máy'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Tiêu đề chính</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Tiêu đề phụ</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ width: '100%' }}
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Thứ tự</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    style={{ width: '100%' }}
                    value={formData.order_index}
                    onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_active}
                      onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    />
                    Kích hoạt hiển thị
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn-primary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
