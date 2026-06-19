import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import type { CollectionRecord } from '@/types/admin'

type CollectionWithGallery = Pick<CollectionRecord, 'id' | 'name'> & { metadata?: any }

export function CollectionGalleriesManager() {
  const [collections, setCollections] = useState<CollectionWithGallery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ id: string; name: string; gallery: string[] }>({
    id: '',
    name: '',
    gallery: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('collections').select('id, name, metadata').order('name')
    if (data) setCollections(data as CollectionWithGallery[])
    setIsLoading(false)
  }

  const openModal = (item?: CollectionWithGallery) => {
    if (item) {
      setEditingId(item.id)
      const meta = item.metadata || {}
      setFormData({
        id: item.id,
        name: item.name,
        gallery: Array.isArray(meta.gallery) ? meta.gallery : []
      })
      setIsModalOpen(true)
    }
  }

  const handleUpdateImage = (idx: number, val: string) => {
    const next = [...formData.gallery]
    next[idx] = val
    setFormData({ ...formData, gallery: next })
  }

  const handleAddImage = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ''] })
  }

  const handleRemoveImage = (idx: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== idx) })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validImages = formData.gallery.filter(g => g.trim() !== '')

    // Get current collection to retain other metadata
    const collection = collections.find(c => c.id === formData.id)
    const existingMeta = collection?.metadata || {}
    const newMeta = { ...existingMeta, gallery: validImages }

    const { error } = await supabase
      .from('collections')
      .update({ metadata: newMeta })
      .eq('id', formData.id)
      
    if (error) {
      alert('Lỗi cập nhật: ' + error.message)
    } else {
      setIsModalOpen(false)
      loadData()
    }
  }

  return (
    <AdminLayout title="Quản lý Thư Viện Ảnh (Galleries)">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
          <p style={{ color: '#64748b', margin: 0 }}>Ghi chú: Dữ liệu này đã được đồng bộ trực tiếp với cột metadata của từng bộ sưu tập.</p>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : collections.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Chưa có dữ liệu nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Bộ sưu tập</th>
                <th style={{ padding: '12px 16px' }}>Thư viện ảnh</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => {
                const meta = c.metadata || {}
                const gallery = Array.isArray(meta.gallery) ? meta.gallery : []
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {gallery.length > 0 ? (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {gallery.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`Gallery ${i}`} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #e2e8f0' }} />
                          ))}
                        </div>
                      ) : <span style={{ color: '#94a3b8' }}>Chưa có ảnh nào</span>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openModal(c)}><Edit2 size={16} /> Đồng bộ / Chỉnh sửa</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Chỉnh sửa Thư viện ảnh: {formData.name}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Danh sách URL hình ảnh</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {formData.gallery.map((url, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {url ? (
                        <img src={url} alt="preview" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <div style={{ width: 36, height: 36, background: '#f1f5f9', borderRadius: 4 }} />
                      )}
                      <input 
                        className="admin-input" 
                        style={{ flex: 1 }}
                        value={url}
                        onChange={e => handleUpdateImage(i, e.target.value)}
                        placeholder="Nhập URL hình ảnh..."
                      />
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleRemoveImage(i)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={handleAddImage}>
                    <Plus size={16} /> Thêm ảnh mới
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="admin-btn admin-btn-primary">Lưu đồng bộ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
