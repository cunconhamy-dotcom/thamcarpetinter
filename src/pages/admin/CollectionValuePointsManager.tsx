import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

/** Matches Supabase `collections` table columns directly */
interface CollectionWithValuePoints {
  id: string
  name: string
  value_points: string[]
}

export function CollectionValuePointsManager() {
  const [collections, setCollections] = useState<CollectionWithValuePoints[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ id: string; name: string; value_points: string[] }>({
    id: '',
    name: '',
    value_points: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('collections').select('id, name, value_points').order('name')
    if (data) setCollections(data as CollectionWithValuePoints[])
    setIsLoading(false)
  }

  const openModal = (item?: CollectionWithValuePoints) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        id: item.id,
        name: item.name,
        value_points: Array.isArray(item.value_points) ? item.value_points : []
      })
      setIsModalOpen(true)
    }
  }

  const handleUpdatePoint = (idx: number, val: string) => {
    const next = [...formData.value_points]
    next[idx] = val
    setFormData({ ...formData, value_points: next })
  }

  const handleAddPoint = () => {
    setFormData({ ...formData, value_points: [...formData.value_points, ''] })
  }

  const handleRemovePoint = (idx: number) => {
    setFormData({ ...formData, value_points: formData.value_points.filter((_, i) => i !== idx) })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter empty strings
    const validPoints = formData.value_points.filter(p => p.trim() !== '')

    const { error } = await supabase
      .from('collections')
      .update({ value_points: validPoints })
      .eq('id', formData.id)
      
    if (error) {
      alert('Lỗi cập nhật: ' + error.message)
    } else {
      setIsModalOpen(false)
      loadData()
    }
  }

  return (
    <AdminLayout title="Quản lý Đặc Điểm Nổi Bật">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
          <p style={{ color: '#64748b', margin: 0 }}>Ghi chú: Dữ liệu này đã được đồng bộ trực tiếp với cột value_points của từng bộ sưu tập.</p>
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
                <th style={{ padding: '12px 16px' }}>Các đặc điểm nổi bật</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {Array.isArray(c.value_points) && c.value_points.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {c.value_points.map((p: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
                      </ul>
                    ) : <span style={{ color: '#94a3b8' }}>Chưa có đặc điểm nào</span>}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openModal(c)}><Edit2 size={16} /> Đồng bộ / Chỉnh sửa</button>
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
              <h3 style={{ margin: 0, fontSize: 18 }}>Chỉnh sửa Đặc Điểm: {formData.name}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Danh sách đặc điểm nổi bật</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {formData.value_points.map((point, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <input 
                        className="admin-input" 
                        style={{ flex: 1 }}
                        value={point}
                        onChange={e => handleUpdatePoint(i, e.target.value)}
                        placeholder="Nhập nội dung đặc điểm..."
                      />
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleRemovePoint(i)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={handleAddPoint}>
                    <Plus size={16} /> Thêm dòng mới
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
